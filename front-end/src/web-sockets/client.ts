import { store } from "@/redux/store";
import {
  setConnected,
  setConnecting,
  setLastMessage,
  setConnectionStatus,
} from "@/redux/web-sockets/websocket-slice";
import { toast } from "sonner";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/api/v1/ws";

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const baseReconnectDelay = 2000;
const maxReconnectDelay = 30000; // 30 seconds max delay
let isConnecting = false;
let mockMode = false;
let reconnectTimeout: NodeJS.Timeout | null = null;
let intentionalDisconnect = false;
let lastConnectionState = "disconnected"; // Track last connection state for toast logic

export const connectWebSocket = () => {
  if (isConnecting || (ws && ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  if (typeof WebSocket === "undefined") {
    console.warn("WebSocket not supported in this environment");
    enableMockMode();
    return;
  }

  try {
    isConnecting = true;
    intentionalDisconnect = false;
    store.dispatch(setConnecting(true));
    store.dispatch(setConnectionStatus("connecting"));
    console.log("Attempting WebSocket connection to:", WS_URL);
    ws = new WebSocket(WS_URL);

    const connectionTimeout = setTimeout(() => {
      if (ws && ws.readyState === WebSocket.CONNECTING) {
        console.warn("WebSocket connection timeout");
        ws.close();
        handleConnectionFailure();
      }
    }, 10000); // 10 second connection timeout

    ws.onopen = () => {
      clearTimeout(connectionTimeout);
      console.log("WebSocket connected successfully");
      reconnectAttempts = 0;
      isConnecting = false;
      mockMode = false;
      store.dispatch(setConnected(true));
      store.dispatch(setConnecting(false));
      store.dispatch(setConnectionStatus("connected"));

      // Show toast only when transitioning from disconnected to connected
      if (
        lastConnectionState === "disconnected" ||
        lastConnectionState === "error"
      ) {
        toast.success("Connected to server");
      }
      lastConnectionState = "connected";
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);
        store.dispatch(setLastMessage(message));

        // Show toast for important admin messages only
        if (message.type === "admin-update") {
          const { action, targetType, targetId } = message.payload;
          toast.info(`Admin update: ${action} on ${targetType} ${targetId}`);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = (event) => {
      clearTimeout(connectionTimeout);
      console.log("WebSocket disconnected", {
        code: event.code,
        reason: event.reason,
      });

      isConnecting = false;
      store.dispatch(setConnected(false));
      store.dispatch(setConnecting(false));

      if (intentionalDisconnect) {
        store.dispatch(setConnectionStatus("disconnected"));
        console.log("WebSocket disconnected intentionally");
        // Show toast only when intentionally disconnecting from a connected state
        if (lastConnectionState === "connected") {
          toast.info("Disconnected from server");
        }
        lastConnectionState = "disconnected";
        return;
      }

      store.dispatch(setConnectionStatus("connecting"));

      // Show toast only when transitioning from connected to disconnected
      if (lastConnectionState === "connected") {
        toast.warning("Connection lost. Reconnecting...");
      }
      lastConnectionState = "connecting";

      // Always attempt to reconnect with exponential backoff
      attemptReconnect();
    };

    ws.onerror = (error) => {
      clearTimeout(connectionTimeout);
      console.warn("WebSocket connection error:", error);
      // Don't set error status, just let the onclose handle reconnection
    };
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error);
    isConnecting = false;
    store.dispatch(setConnecting(false));
    handleConnectionFailure();
  }
};

const handleConnectionFailure = () => {
  // Don't set error status, just keep trying to reconnect
  store.dispatch(setConnectionStatus("connecting"));
  isConnecting = false;
  store.dispatch(setConnecting(false));

  // Show toast only when transitioning from connected to error state
  if (lastConnectionState === "connected") {
    toast.warning("Connection lost. Reconnecting...");
  }
  lastConnectionState = "connecting";

  attemptReconnect();
};

const enableMockMode = () => {
  mockMode = true;
  isConnecting = false;
  console.log("WebSocket mock mode enabled - simulating connection for demo");

  // Simulate successful connection
  store.dispatch(setConnected(true));
  store.dispatch(setConnectionStatus("connected"));

  // Show toast only when transitioning to connected state
  if (
    lastConnectionState === "disconnected" ||
    lastConnectionState === "error"
  ) {
    toast.info("Demo mode activated - using simulated data");
  }
  lastConnectionState = "connected";

  // Simulate periodic updates
  startMockUpdates();
};

const startMockUpdates = () => {
  if (!mockMode) return;

  setInterval(() => {
    if (mockMode) {
      const mockMessage = {
        type: "zone-update",
        payload: {
          zoneId: "zone-1",
          availableSpots: Math.floor(Math.random() * 50) + 10,
          timestamp: new Date().toISOString(),
        },
      };
      store.dispatch(setLastMessage(mockMessage));
    }
  }, 10000);
};

const attemptReconnect = () => {
  if (isConnecting || intentionalDisconnect || mockMode) {
    return;
  }

  // Exponential backoff with jitter
  const delay =
    Math.min(
      baseReconnectDelay * Math.pow(1.5, reconnectAttempts),
      maxReconnectDelay
    ) +
    Math.random() * 1000; // Add jitter to avoid thundering herd

  reconnectAttempts++;

  console.log(
    `Attempting to reconnect WebSocket in ${Math.round(
      delay / 1000
    )}s (attempt ${reconnectAttempts})`
  );

  reconnectTimeout = setTimeout(() => {
    connectWebSocket();
  }, delay);
};

export const subscribeToGate = (gateId: string) => {
  if (mockMode) {
    console.log("Mock: Subscribed to gate:", gateId);
    return;
  }

  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = {
      type: "subscribe",
      payload: { gateId },
    };
    ws.send(JSON.stringify(message));
    console.log("Subscribed to gate:", gateId);
  } else {
    console.warn("Cannot subscribe - WebSocket not connected");
  }
};

export const unsubscribeFromGate = (gateId: string) => {
  if (mockMode) {
    console.log("Mock: Unsubscribed from gate:", gateId);
    return;
  }

  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = {
      type: "unsubscribe",
      payload: { gateId },
    };
    ws.send(JSON.stringify(message));
    console.log("Unsubscribed from gate:", gateId);
  } else {
    console.warn("Cannot unsubscribe - WebSocket not connected");
  }
};

export const disconnectWebSocket = () => {
  intentionalDisconnect = true;

  if (ws) {
    ws.close(1000, "Client disconnect");
    ws = null;
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  isConnecting = false;
  reconnectAttempts = 0;
  mockMode = false;
  store.dispatch(setConnected(false));
  store.dispatch(setConnectionStatus("disconnected"));
  console.log("WebSocket disconnected by client");
};

export const isWebSocketConnected = (): boolean => {
  return mockMode || (ws !== null && ws.readyState === WebSocket.OPEN);
};

// Export the WebSocket instance for external access if needed
export const getWebSocketInstance = (): WebSocket | null => {
  return ws;
};
