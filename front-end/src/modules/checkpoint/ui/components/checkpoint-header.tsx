"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useGateNavigation } from "@/hooks/use-gate-navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/auth/auth-slice";
import { Home, LogOut, Clock } from "lucide-react";
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
    <header className='bg-primary text-popover'>
      <div className='flex justify-between items-center max-w-[1600px] mx-auto px-6 py-2'>
        {/* Left Section - Logo & Navigation */}
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-3'>
            <div>
              <h1 className='text-xl font-bold text-popover'>
                Checkpoint Dashboard
              </h1>
              <p className='text-xs text-popover'>Parking Management System</p>
            </div>
          </div>

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

        {/* Right Section - User Info & Controls */}
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

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant='destructive'
            size='sm'
            className='bg-chart-1'
          >
            <LogOut className='w-4 h-4 mr-2' />
            Logout
          </Button>

          {/* User Info */}
          <div className='text-right'>
            <p className='font-semibold text-popover'>
              {`Welcome ${user?.username || "Employee"}`}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
