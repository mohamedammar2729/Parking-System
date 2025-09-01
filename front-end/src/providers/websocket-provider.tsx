"use client";

import { connectWebSocket, disconnectWebSocket } from "@/web-sockets/client";
import { useEffect } from "react";


export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize WebSocket connection on app start
    connectWebSocket();

    return () => {
      // Clean up on app unmount
      disconnectWebSocket();
    };
  }, []);

  return <>{children}</>;
}
