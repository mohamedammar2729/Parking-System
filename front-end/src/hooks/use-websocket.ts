import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  connectWebSocket,
  isWebSocketConnected,
  isWebSocketReadyForSubscriptions,
  subscribeToGate,
  unsubscribeFromGate,
} from "@/web-sockets/polling-client";

export const useWebSocket = (gateId?: string) => {
  const connectionStatus = useAppSelector(
    (state) => state.websocket.connectionStatus
  );
  const currentGateId = useRef<string | undefined>(undefined);
  const hasInitialized = useRef(false);

  // Initialize WebSocket connection only once when component mounts
  useEffect(() => {
    if (!hasInitialized.current) {
      connectWebSocket();
      hasInitialized.current = true;
    }
  }, []);

  // Memoized subscription function to prevent unnecessary re-renders
  const subscribeToCurrentGate = useCallback(() => {
    if (!gateId || !isWebSocketReadyForSubscriptions()) {
      return;
    }

    // Don't resubscribe to the same gate
    if (currentGateId.current === gateId) {
      return;
    }

    // Unsubscribe from previous gate if different
    if (currentGateId.current && currentGateId.current !== gateId) {
      unsubscribeFromGate(currentGateId.current);
    }

    // Subscribe to new gate
    subscribeToGate(gateId);
    currentGateId.current = gateId;
  }, [gateId]);

  // Handle gate subscription when connection is established
  useEffect(() => {
    // Only subscribe when we're actually connected and have a gateId
    if (
      connectionStatus === "connected" &&
      gateId &&
      isWebSocketReadyForSubscriptions()
    ) {
      // Small delay to ensure the connection is fully ready
      const timer = setTimeout(() => {
        subscribeToCurrentGate();
      }, 200); // Increased delay slightly

      return () => clearTimeout(timer);
    }
  }, [connectionStatus, gateId, subscribeToCurrentGate]);

  // Cleanup subscription when component unmounts or gateId changes
  useEffect(() => {
    return () => {
      if (currentGateId.current && isWebSocketConnected()) {
        unsubscribeFromGate(currentGateId.current);
        currentGateId.current = undefined;
      }
    };
  }, []);

  return {
    isConnected: isWebSocketConnected(),
    connectionStatus,
    currentGateId: currentGateId.current,
  };
};
