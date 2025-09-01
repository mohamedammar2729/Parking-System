import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  connectWebSocket,
  disconnectWebSocket,
  isWebSocketConnected,
  subscribeToGate,
  unsubscribeFromGate,
} from "@/web-sockets/client";

export const useWebSocket = (gateId?: string) => {
  const isConnected = useAppSelector((state) => state.websocket.isConnected);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (gateId) {
        unsubscribeFromGate(gateId);
      }
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (isConnected && gateId) {
      subscribeToGate(gateId);

      return () => {
        unsubscribeFromGate(gateId);
      };
    }
  }, [isConnected, gateId]);

  return { isConnected: isWebSocketConnected() };
};
