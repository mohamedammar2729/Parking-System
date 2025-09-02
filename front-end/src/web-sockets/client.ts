/**
 * Simple WebSocket client for Parking System
 *
 * Features:
 * - Auto-connects on app start
 * - Auto-reconnects on connection loss (3 attempts max)
 * - Subscribes/unsubscribes to gate updates
 * - Handles zone-update and admin-update messages
 * - Shows connection status notifications
 *
 * Backend WebSocket Messages:
 * - Send: {"type": "subscribe", "payload": {"gateId": "gate_1"}}
 * - Send: {"type": "unsubscribe", "payload": {"gateId": "gate_1"}}
 * - Receive: {"type": "zone-update", "payload": {...zoneData}}
 * - Receive: {"type": "admin-update", "payload": {...adminAction}}
 */
import { store } from "@/redux/store";
import {
  setConnected,
  setConnectionStatus,
  setLastMessage,
} from "@/redux/web-sockets/websocket-slice";
import { toast } from "sonner";

// Use Next.js environment variables with fallback for development
const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/api/v1/ws";
const MAX_RETRY_ATTEMPTS = 3;

let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
let isConnecting = false;
let intentionalDisconnect = false;
let retryAttempts = 0;
const subscribedGates = new Set<string>(); // Track subscribed gates

export const connectWebSocket = () => {
  // Prevent multiple connection attempts
  if (isConnecting || (ws && ws.readyState === WebSocket.CONNECTING)) {
    console.log("WebSocket connection already in progress");
    return;
  }

  // If already connected, don't reconnect
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("WebSocket already connected");
    return;
  }

  // Check if WebSocket is supported
  if (typeof WebSocket === "undefined") {
    console.warn("WebSocket not supported in this environment");
    return;
  }

  try {
    isConnecting = true;
    intentionalDisconnect = false;
    store.dispatch(setConnectionStatus("connecting"));

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      isConnecting = false;
      retryAttempts = 0; // Reset retry attempts on successful connection

      // Dispatch Redux state updates
      store.dispatch(setConnected(true));
      store.dispatch(setConnectionStatus("connected"));

      console.log("WebSocket connected successfully");

      // Resubscribe to all gates that were previously subscribed
      // Add a small delay to ensure the connection is fully established
      setTimeout(() => {
        const gatesToResubscribe = Array.from(subscribedGates);
        subscribedGates.clear(); // Clear to avoid duplicate subscriptions

        gatesToResubscribe.forEach((gateId) => {
          console.log(`Resubscribing to gate: ${gateId}`);
          subscribeToGate(gateId);
        });
      }, 100);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Dispatch to Redux store so components can react
        store.dispatch(setLastMessage(message));

        // Handle specific message types
        if (message.type === "zone-update") {
          console.log("Zone update received:", message.payload);
        } else if (message.type === "admin-update") {
          console.log("Admin update received:", message.payload);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      isConnecting = false;
      store.dispatch(setConnected(false));

      if (intentionalDisconnect) {
        store.dispatch(setConnectionStatus("disconnected"));
        console.log("WebSocket disconnected intentionally");
        return;
      }

      // Check if we've exceeded max retry attempts
      if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
        store.dispatch(setConnectionStatus("error"));
        console.log("Max retry attempts reached. Connection failed.");
        toast.error("Refresh page to update/check the server connection");
        return;
      }

      store.dispatch(setConnectionStatus("connecting"));
      retryAttempts++;
      console.log(
        `WebSocket disconnected, attempting to reconnect... (${retryAttempts}/${MAX_RETRY_ATTEMPTS})`
      );

      // Auto-reconnect after 3 seconds
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      isConnecting = false;
      store.dispatch(setConnectionStatus("error"));
      // No toast for errors - user will see connection status
    };
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
    isConnecting = false;
    store.dispatch(setConnectionStatus("error"));
    // No toast for errors - user will see connection status
  }
};

export const subscribeToGate = (gateId: string) => {
  if (!gateId) {
    console.warn("subscribeToGate: No gateId provided");
    return;
  }

  // Check if WebSocket exists and is in the correct state
  if (!ws) {
    console.warn("subscribeToGate: WebSocket instance not found");
    return;
  }

  if (ws.readyState !== WebSocket.OPEN) {
    console.warn(
      `subscribeToGate: WebSocket not ready (state: ${ws.readyState})`
    );
    return;
  }

  // Don't subscribe if already subscribed
  if (subscribedGates.has(gateId)) {
    console.log(`Already subscribed to gate: ${gateId}`);
    return;
  }

  try {
    const message = {
      type: "subscribe",
      payload: { gateId },
    };
    ws.send(JSON.stringify(message));
    subscribedGates.add(gateId);
    console.log(`Successfully subscribed to gate: ${gateId}`);
  } catch (error) {
    console.error("Failed to subscribe to gate:", error);
  }
};

export const unsubscribeFromGate = (gateId: string) => {
  if (!gateId) {
    console.warn("unsubscribeFromGate: No gateId provided");
    return;
  }

  // Always remove from tracking, even if WebSocket is not connected
  const wasSubscribed = subscribedGates.has(gateId);
  subscribedGates.delete(gateId);

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    if (wasSubscribed) {
      console.log(
        `Removed gate ${gateId} from tracking (WebSocket not connected)`
      );
    }
    return;
  }

  if (!wasSubscribed) {
    console.log(`Not subscribed to gate: ${gateId}`);
    return;
  }

  try {
    const message = {
      type: "unsubscribe",
      payload: { gateId },
    };
    ws.send(JSON.stringify(message));
    console.log(`Successfully unsubscribed from gate: ${gateId}`);
  } catch (error) {
    console.error("Failed to unsubscribe from gate:", error);
  }
};

export const disconnectWebSocket = () => {
  intentionalDisconnect = true;
  retryAttempts = 0; // Reset retry attempts on intentional disconnect

  if (ws) {
    ws.close();
    ws = null;
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  // Clear subscribed gates on intentional disconnect
  subscribedGates.clear();

  isConnecting = false;
  store.dispatch(setConnected(false));
  store.dispatch(setConnectionStatus("disconnected"));
  console.log("WebSocket disconnected intentionally");
};

export const isWebSocketConnected = (): boolean => {
  return ws !== null && ws.readyState === WebSocket.OPEN;
};

export const isWebSocketReadyForSubscriptions = (): boolean => {
  return ws !== null && ws.readyState === WebSocket.OPEN && !isConnecting;
};

export const getWebSocketInstance = (): WebSocket | null => {
  return ws;
};

export const getWebSocketState = () => {
  return {
    isConnected: isWebSocketConnected(),
    readyState: ws?.readyState,
    subscribedGates: Array.from(subscribedGates),
    isConnecting,
    retryAttempts,
  };
};

export const retryConnection = () => {
  retryAttempts = 0; // Reset retry attempts
  intentionalDisconnect = false;
  connectWebSocket();
};
