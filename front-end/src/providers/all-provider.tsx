"use client";

import type React from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/redux/store";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { WebSocketProvider } from "./websocket-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          {children}
          <Toaster />
        </WebSocketProvider>
      </QueryClientProvider>
    </Provider>
  );
}
