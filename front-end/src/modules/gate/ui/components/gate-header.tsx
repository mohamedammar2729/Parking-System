"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGateNavigation } from "@/hooks/use-gate-navigation";
import { ArrowLeft, Home, MapPin } from "lucide-react";
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
    <header className='bg-primary text-white py-2 shadow-lg'>
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        {/* Navigation Buttons */}
        <div className='flex items-center gap-3'>
          <Button
            onClick={navigateBack}
            variant='outline'
            size='lg'
            className='bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-white transition-all duration-200 backdrop-blur-sm'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back
          </Button>

          <Button
            onClick={navigateHome}
            variant='outline'
            size='lg'
            className='bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-white transition-all duration-200 backdrop-blur-sm'
          >
            <Home className='w-5 h-5 mr-2' />
            Home
          </Button>
        </div>

        {/* Gate Information */}
        <div className='flex items-center gap-4'>
          {/* <div className='flex items-center gap-2'>
            <Car className='w-6 h-6 text-blue-200' />
            <div className='text-right'>
              <h1 className='text-xl font-bold'>Parking Gate</h1>
              
            </div>
          </div>

          <div className='h-8 w-px bg-white/30'></div> */}

          <div className='flex items-center gap-2'>
            <MapPin className='w-5 h-5 text-blue-200' />
            <Badge
              variant='secondary'
              className={`text-lg px-3 py-1 font-semibold ${
                isSelectionPage
                  ? "bg-green-500/20 text-green-200 border-green-300/30"
                  : "bg-white/20 text-white border-white/30"
              }`}
            >
              {displayGateId}
            </Badge>
          </div>

          <div className='h-8 w-px bg-white/30'></div>

          <div className='text-right'>
            <p className='text-blue-200 text-sm'>Current Time</p>
            <p className='text-xl font-mono font-bold'>{currentTime}</p>
          </div>
          <WebSocketStatus />
        </div>
      </div>
    </header>
  );
};
