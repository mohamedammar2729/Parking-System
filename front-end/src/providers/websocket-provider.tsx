"use client";

import { connectWebSocket } from "@/web-sockets/polling-client";
import { useEffect } from "react";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize polling-based connection on app start
    connectWebSocket();

    // Don't disconnect on unmount since we want persistent connection
    // The connection should only be closed when the user closes the browser/tab
  }, []);

  return <>{children}</>;
}
