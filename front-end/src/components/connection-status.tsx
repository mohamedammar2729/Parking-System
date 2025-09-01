"use client";

import { useAppSelector } from "@/redux/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { retryConnection } from "@/web-sockets/client";

export const WebSocketStatus = () => {
  const { connectionStatus } = useAppSelector((state) => state.websocket);

  const statusConfig = {
    connected: {
      label: "Connected",
      icon: <Wifi className='h-4 w-4' />,
      variant: "default" as const,
    },
    connecting: {
      label: "Connecting",
      icon: <RefreshCw className='h-4 w-4 animate-spin' />,
      variant: "secondary" as const,
    },
    disconnected: {
      label: "Disconnected",
      icon: <WifiOff className='h-4 w-4' />,
      variant: "outline" as const,
    },
    error: {
      label: "Connection Error",
      icon: <AlertCircle className='h-4 w-4' />,
      variant: "destructive" as const,
    },
  };

  const currentStatus = statusConfig[connectionStatus];

  const handleRetry = () => {
    retryConnection();
  };

  if (connectionStatus === "error") {
    return (
      <div className='flex items-center gap-2'>
        <Badge
          variant={currentStatus.variant}
          className='flex items-center gap-1'
        >
          {currentStatus.icon}
          {currentStatus.label}
        </Badge>
        <Button
          size='sm'
          variant='outline'
          onClick={handleRetry}
          className='h-6 px-2 text-xs'
        >
          <RefreshCw className='h-4 w-4 mr-1' />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Badge variant={currentStatus.variant} className='flex text-md items-center gap-1'>
      {currentStatus.icon}
      {currentStatus.label}
    </Badge>
  );
};
