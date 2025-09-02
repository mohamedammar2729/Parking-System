"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useGateNavigation } from "@/hooks/use-gate-navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/auth/auth-slice";
import { Home, LogOut, Clock, Shield } from "lucide-react";
import { WebSocketStatus } from "@/components/connection-status";

export const AdminHeader: React.FC = () => {
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
    <header className='bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-xl border-b border-blue-800/30'>
      <div className='flex justify-between items-center max-w-[1600px] mx-auto px-6 py-4'>
        {/* Left Section - Logo & Navigation */}
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-white/10 rounded-xl backdrop-blur-sm'>
              <Shield className='w-6 h-6 text-blue-300' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-white'>Admin Dashboard</h1>
              <p className='text-xs text-blue-200'>Parking Management System</p>
            </div>
          </div>

          <Button
            onClick={navigateHome}
            variant='ghost'
            size='sm'
            className='bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white transition-all duration-200 backdrop-blur-sm'
          >
            <Home className='w-4 h-4 mr-2' />
            Home
          </Button>
        </div>

        {/* Right Section - User Info & Controls */}
        <div className='flex items-center gap-6'>
          {/* Time Display */}
          <div className='text-right'>
            <div className='flex items-center gap-2 text-blue-200 text-xs'>
              <Clock className='w-3 h-3' />
              <span>Current Time</span>
            </div>
            <p className='text-lg font-mono font-bold text-white'>
              {currentTime}
            </p>
          </div>

          {/* Connection Status */}
          <div className='bg-white/10 rounded-lg p-2 backdrop-blur-sm'>
            <WebSocketStatus />
          </div>

          {/* User Info */}
          <div className='flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm'>
            <div className='p-2 bg-blue-500/30 rounded-lg'>
              <Shield className='w-4 h-4 text-blue-200' />
            </div>
            <div className='text-right'>
              <p className='text-xs text-blue-200'>Administrator</p>
              <p className='font-semibold text-white'>
                {user?.username || "Admin"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant='ghost'
            size='sm'
            className='bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 hover:text-red-100 transition-all duration-200 backdrop-blur-sm'
          >
            <LogOut className='w-4 h-4 mr-2' />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
