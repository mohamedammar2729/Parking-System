"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGateNavigation } from "@/hooks/use-gate-navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/auth/auth-slice";
import { Home, LogOut, User, Clock } from "lucide-react";
import { WebSocketStatus } from "@/components/connection-status";

export const CheckpointHeader: React.FC = () => {
  const { navigateHome } = useGateNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className='bg-primary text-white py-3 shadow-lg'>
      <div className='flex justify-between items-center max-w-7xl mx-auto px-4'>
        {/* Navigation Buttons */}
        <div className='flex items-center gap-3'>
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

        {/* Checkpoint Information */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <User className='w-5 h-5 text-blue-200' />
            <Badge
              variant='secondary'
              className='text-lg px-3 py-1 font-semibold bg-green-500/20 text-green-200 border-green-300/30'
            >
              Checkpoint Station
            </Badge>
          </div>

          <div className='h-8 w-px bg-white/30'></div>

          <div className='text-center'>
            <p className='text-blue-200 text-sm'>Employee</p>
            <p className='text-lg font-semibold'>
              {user?.username || "Unknown"}
            </p>
          </div>

          <div className='h-8 w-px bg-white/30'></div>

          <div className='text-right'>
            <div className='flex items-center gap-2 text-blue-200 text-sm'>
              <Clock className='w-4 h-4' />
              <span>Current Time</span>
            </div>
            <p className='text-xl font-mono font-bold'>{currentTime}</p>
          </div>

          <div className='h-8 w-px bg-white/30'></div>

          <WebSocketStatus />
        </div>

        {/* Logout Button */}
        <div>
          <Button
            onClick={handleLogout}
            variant='outline'
            size='lg'
            className='bg-red-500/10 hover:bg-red-500/20 border-red-300/30 text-red-200 hover:text-red-100 transition-all duration-200 backdrop-blur-sm'
          >
            <LogOut className='w-5 h-5 mr-2' />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
