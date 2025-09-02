"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useGateNavigation } from "@/hooks/use-gate-navigation";
import { ArrowLeft, Home, Clock } from "lucide-react";
import { WebSocketStatus } from "@/components/connection-status";

interface GateHeaderProps {
  gateId: string;
}

export const GateHeader: React.FC<GateHeaderProps> = ({ gateId }) => {
  const { navigateBack, navigateHome } = useGateNavigation();
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check if this is the gate selection page
  const isSelectionPage = gateId === "SELECTION";
  const displayGateId = isSelectionPage
    ? "Gate Selection"
    : `Gate ${gateId.replace("gate_", "")}`;

  return (
    <header className='bg-primary text-popover'>
      <div className='flex justify-between items-center max-w-[1600px] mx-auto px-6 py-2'>
        {/* Left Section - Logo & Navigation */}
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-3'>
            <div>
              <h1 className='text-xl font-bold text-popover'>
                {displayGateId}
              </h1>
              <p className='text-xs text-popover'>Parking Management System</p>
            </div>
          </div>

          <Button
            onClick={navigateBack}
            variant='secondary'
            size='sm'
            className='transition-all duration-200'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          <Button
            onClick={navigateHome}
            variant='secondary'
            size='sm'
            className='transition-all duration-200'
          >
            <Home className='w-4 h-4 mr-2' />
            Home
          </Button>
        </div>

        {/* Right Section - Time & Controls */}
        <div className='flex items-center gap-6'>
          {/* Time Display */}
          <div className='text-right'>
            <div className='flex items-center gap-2 text-popover text-xs'>
              <Clock className='w-3 h-3' />
              <span>Current Time</span>
            </div>
            <p className='text-lg font-mono font-bold text-popover'>
              {currentTime}
            </p>
          </div>

          {/* Connection Status */}
          <WebSocketStatus />
        </div>
      </div>
    </header>
  );
};
