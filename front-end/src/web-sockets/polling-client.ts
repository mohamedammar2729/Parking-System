/**
 * Polling-based real-time client for Parking System (Vercel-compatible)
 *
 * Features:
 * - Polling-based updates instead of WebSockets
 * - Auto-polling for subscribed gates
 * - Simulates real-time updates via HTTP polling
 * - Compatible with Vercel serverless architecture
 *
 * Fallback from WebSocket to polling for serverless deployment
 */
import { store } from "@/redux/store";
import {
  setConnected,
  setConnectionStatus,
  setLastMessage,
} from "@/redux/web-sockets/websocket-slice";
import { toast } from "sonner";
import { apiClient } from "@/server/client";
import type { Zone } from "@/server/types";

// Use polling interval (3 seconds for responsive updates)
const POLLING_INTERVAL = 3000;
const MAX_RETRY_ATTEMPTS = 3;

let pollingTimeout: NodeJS.Timeout | null = null;
let isPolling = false;
let intentionalDisconnect = false;
let retryAttempts = 0;
const subscribedGates = new Set<string>();
const lastZoneStates = new Map<string, Zone>();

export const connectWebSocket = () => {
  // For polling-based approach, this just starts the polling mechanism
  if (isPolling) {
    console.log("Polling already active");
    return;
  }

  if (typeof window === "undefined") {
    console.warn("Polling not supported in SSR environment");
    return;
  }

  try {
    intentionalDisconnect = false;
    store.dispatch(setConnectionStatus("connecting"));

    // Simulate connection success
    setTimeout(() => {
      isPolling = true;
      retryAttempts = 0;
      store.dispatch(setConnected(true));
      store.dispatch(setConnectionStatus("connected"));
      console.log("Polling-based connection established");

      // Start polling if we have subscribed gates
      if (subscribedGates.size > 0) {
        startPolling();
      }
    }, 500);
  } catch (error) {
    console.error("Failed to start polling:", error);
    store.dispatch(setConnectionStatus("error"));
  }
};

const startPolling = async () => {
  if (!isPolling || intentionalDisconnect || subscribedGates.size === 0) {
    return;
  }

  try {
    // Poll each subscribed gate for updates
    for (const gateId of subscribedGates) {
      await pollGateUpdates(gateId);
    }

    retryAttempts = 0; // Reset on successful poll

    // Schedule next poll
    pollingTimeout = setTimeout(startPolling, POLLING_INTERVAL);
  } catch (error) {
    console.error("Polling error:", error);

    if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
      store.dispatch(setConnectionStatus("error"));
      console.log("Max retry attempts reached. Polling stopped.");
      toast.error("Connection lost. Please refresh the page.");
      return;
    }

    retryAttempts++;
    store.dispatch(setConnectionStatus("connecting"));

    // Retry after delay
    pollingTimeout = setTimeout(startPolling, POLLING_INTERVAL * 2);
  }
};

const pollGateUpdates = async (gateId: string) => {
  try {
    // Fetch current zone states for this gate
    const zones = await apiClient.get<Zone[]>(`/master/zones?gateId=${gateId}`);

    // Check for changes and dispatch updates
    zones.forEach((zone) => {
      const zoneKey = `${gateId}-${zone.id}`;
      const lastState = lastZoneStates.get(zoneKey);

      if (!lastState || hasZoneChanged(lastState, zone)) {
        // Zone has changed, dispatch update
        store.dispatch(
          setLastMessage({
            type: "zone-update",
            payload: zone,
          })
        );

        lastZoneStates.set(zoneKey, { ...zone });
        console.log(`Zone update detected for ${zone.id}:`, zone);
      }
    });
  } catch (error) {
    // Re-throw to be handled by main polling loop
    throw error;
  }
};

const hasZoneChanged = (oldState: Zone, newState: Zone): boolean => {
  // Check key fields that would indicate a change
  return (
    oldState.occupied !== newState.occupied ||
    oldState.free !== newState.free ||
    oldState.availableForVisitors !== newState.availableForVisitors ||
    oldState.availableForSubscribers !== newState.availableForSubscribers ||
    oldState.open !== newState.open ||
    oldState.reserved !== newState.reserved
  );
};

export const subscribeToGate = (gateId: string) => {
  if (!gateId) {
    console.warn("subscribeToGate: No gateId provided");
    return;
  }

  // Don't subscribe if already subscribed
  if (subscribedGates.has(gateId)) {
    console.log(`Already subscribed to gate: ${gateId}`);
    return;
  }

  subscribedGates.add(gateId);
  console.log(`Subscribed to gate: ${gateId}`);

  // If polling is active and this is the first subscription, start polling
  if (isPolling && subscribedGates.size === 1) {
    startPolling();
  }

  // Immediately fetch initial state
  pollGateUpdates(gateId).catch((error) => {
    console.error(`Failed to fetch initial state for gate ${gateId}:`, error);
  });
};

export const unsubscribeFromGate = (gateId: string) => {
  if (!gateId) {
    console.warn("unsubscribeFromGate: No gateId provided");
    return;
  }

  const wasSubscribed = subscribedGates.has(gateId);
  subscribedGates.delete(gateId);

  // Clear cached states for this gate
  for (const [key] of lastZoneStates) {
    if (key.startsWith(`${gateId}-`)) {
      lastZoneStates.delete(key);
    }
  }

  if (wasSubscribed) {
    console.log(`Unsubscribed from gate: ${gateId}`);
  }

  // If no more subscriptions, stop polling
  if (subscribedGates.size === 0 && pollingTimeout) {
    clearTimeout(pollingTimeout);
    pollingTimeout = null;
  }
};

export const disconnectWebSocket = () => {
  intentionalDisconnect = true;
  retryAttempts = 0;
  isPolling = false;

  if (pollingTimeout) {
    clearTimeout(pollingTimeout);
    pollingTimeout = null;
  }

  // Clear subscribed gates and cached states
  subscribedGates.clear();
  lastZoneStates.clear();

  store.dispatch(setConnected(false));
  store.dispatch(setConnectionStatus("disconnected"));
  console.log("Polling disconnected intentionally");
};

export const isWebSocketConnected = (): boolean => {
  return isPolling && !intentionalDisconnect;
};

export const isWebSocketReadyForSubscriptions = (): boolean => {
  return isPolling && !intentionalDisconnect;
};

export const getWebSocketInstance = (): WebSocket | null => {
  // Return null since we're using polling instead of WebSocket
  return null;
};

export const getWebSocketState = () => {
  return {
    isConnected: isWebSocketConnected(),
    readyState: isPolling ? 1 : 0, // 1 = OPEN, 0 = CONNECTING
    subscribedGates: Array.from(subscribedGates),
    isConnecting: !isPolling && !intentionalDisconnect,
    retryAttempts,
    pollingActive: isPolling,
  };
};

export const retryConnection = () => {
  retryAttempts = 0;
  intentionalDisconnect = false;
  connectWebSocket();
};

// Admin updates simulation - poll admin state changes
interface ParkingStateReport {
  zones: Zone[];
  totalOccupied: number;
  totalCapacity: number;
}

let lastAdminState: ParkingStateReport | null = null;

export const pollAdminUpdates = async () => {
  if (!isPolling) return;

  try {
    // Poll admin parking state for changes
    const adminState = await apiClient.get<ParkingStateReport>(
      "/admin/reports/parking-state"
    );

    if (lastAdminState && hasAdminStateChanged(lastAdminState, adminState)) {
      // Simulate admin-update message
      store.dispatch(
        setLastMessage({
          type: "admin-update",
          payload: {
            adminId: "system",
            action: "state-changed",
            targetType: "system",
            targetId: "parking-state",
            details: adminState,
            timestamp: new Date().toISOString(),
          },
        })
      );
    }

    lastAdminState = adminState;
  } catch (error) {
    // Silently handle admin polling errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.log("Admin state polling failed (non-critical):", errorMessage);
  }
};

const hasAdminStateChanged = (
  oldState: ParkingStateReport,
  newState: ParkingStateReport
): boolean => {
  // Simple comparison - in real implementation you'd do deeper comparison
  return JSON.stringify(oldState) !== JSON.stringify(newState);
};

// Start admin polling when connected
const originalConnect = connectWebSocket;
export const connectWebSocketWithAdmin = () => {
  originalConnect();

  // Start admin polling after connection
  setTimeout(() => {
    if (isPolling) {
      const adminPollInterval = setInterval(() => {
        if (isPolling && !intentionalDisconnect) {
          pollAdminUpdates();
        } else {
          clearInterval(adminPollInterval);
        }
      }, POLLING_INTERVAL * 2); // Poll admin changes less frequently
    }
  }, 1000);
};
