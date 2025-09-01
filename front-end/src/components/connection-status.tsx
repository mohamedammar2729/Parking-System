"use client";

import { useAppSelector } from "@/redux/hooks";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";

export const WebSocketStatus = () => {
  const { connectionStatus } = useAppSelector(
    (state) => state.websocket
  );

  const statusConfig = {
    connected: {
      label: "Connected",
      icon: <Wifi className='h-3 w-3' />,
      variant: "default" as const,
    },
    connecting: {
      label: "Connecting",
      icon: <RefreshCw className='h-3 w-3 animate-spin' />,
      variant: "secondary" as const,
    },
    disconnected: {
      label: "Disconnected",
      icon: <WifiOff className='h-3 w-3' />,
      variant: "outline" as const,
    },
    error: {
      label: "Connection Error",
      icon: <AlertCircle className='h-3 w-3' />,
      variant: "destructive" as const,
    },
  };

  const currentStatus = statusConfig[connectionStatus];

  return (
    <Badge variant={currentStatus.variant} className='flex items-center gap-1'>
      {currentStatus.icon}
      {currentStatus.label}
    </Badge>
  );
};
