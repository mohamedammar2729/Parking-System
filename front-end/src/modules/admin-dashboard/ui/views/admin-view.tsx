"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "../components/admin-header";
import { AdminSidebar } from "../components/admin-sidebar";
import { EmployeesPanel } from "../components/employees-panel";
import { ParkingStatePanel } from "../components/parking-state-panel";
import { ZoneControlPanel } from "../components/zone-control-panel";
import { CategoryRatesPanel } from "../components/category-rates-panel";
import { RushHoursPanel } from "../components/rush-hours-panel";
import { VacationsPanel } from "../components/vacations-panel";
import { AdminAuditLog } from "../components/admin-audit-log";
import { useApiToken } from "@/lib/api";
import {
  subscribeToGate,
  unsubscribeFromGate,
} from "@/web-sockets/polling-client";
import { useAppSelector } from "@/redux/hooks";

const AdminView = () => {
  const [activeTab, setActiveTab] = useState("parking-state");
  const connectionStatus = useAppSelector(
    (state) => state.websocket.connectionStatus
  );

  // Ensure API token is set
  useApiToken();

  // Subscribe to admin updates via WebSocket
  useEffect(() => {
    if (connectionStatus === "connected") {
      // Subscribe to gate_1 to receive admin-update messages
      // Since admin updates are broadcast to all gate subscribers,
      // we just need to subscribe to any gate
      const timer = setTimeout(() => {
        subscribeToGate("gate_1");
      }, 500);

      return () => {
        clearTimeout(timer);
        unsubscribeFromGate("gate_1");
      };
    }
  }, [connectionStatus]);

  const renderContent = () => {
    switch (activeTab) {
      case "employees":
        return <EmployeesPanel />;
      case "parking-state":
        return <ParkingStatePanel />;
      case "zones":
        return <ZoneControlPanel />;
      case "categories":
        return <CategoryRatesPanel />;
      case "rush-hours":
        return <RushHoursPanel />;
      case "vacations":
        return <VacationsPanel />;
      default:
        return <ParkingStatePanel />;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'>
      <AdminHeader />

      <div className='max-w-[1600px] mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-5 gap-8'>
          {/* Sidebar - Takes 1 column on xl screens */}
          <div className='xl:col-span-1'>
            <div className='sticky top-8 space-y-6'>
              <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          {/* Main Content - Takes 3 columns on xl screens */}
          <div className='xl:col-span-3'>
            <div className='space-y-6'>{renderContent()}</div>
          </div>

          {/* Audit Log - Takes 1 column on xl screens, positioned as sidebar on the right */}
          <div className='xl:col-span-1'>
            <div className='sticky top-8'>
              <AdminAuditLog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
