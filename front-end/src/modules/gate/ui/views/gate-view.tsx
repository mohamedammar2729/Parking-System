"use client";

import React, { useState, useEffect } from "react";
import { useZonesByGate } from "@/lib/api";
import { useWebSocket } from "@/hooks/use-websocket";
import { useAppSelector } from "@/redux/hooks";
import { Users } from "lucide-react";

import type { Zone, Ticket } from "@/server/types";
import { GateHeader } from "../components/gate-header";
import { TabSelector } from "../components/tab-selector";
import { ZoneList } from "../components/zone-list";
import { TicketModal } from "../components/ticket-modal";


interface GateViewProps {
  gateId: string;
}

export type TabType = "visitor" | "subscriber";

export const GateView: React.FC<GateViewProps> = ({ gateId }) => {
  const [activeTab, setActiveTab] = useState<TabType>("visitor");
  const [zones, setZones] = useState<Zone[]>([]);
  const [ticketData, setTicketData] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // WebSocket connection
  useWebSocket(gateId);
  const lastMessage = useAppSelector((state) => state.websocket.lastMessage);

  // Fetch initial zones data
  const { data: initialZones, isLoading, error } = useZonesByGate(gateId);

  // Initialize zones when data arrives
  useEffect(() => {
    if (initialZones) {
      setZones(initialZones);
    }
  }, [initialZones]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === "zone-update") {
      const updatedZone = lastMessage.payload as Zone;
      setZones((prevZones) =>
        prevZones.map((zone) =>
          zone.id === updatedZone.id ? updatedZone : zone
        )
      );
    } else if (lastMessage?.type === "admin-update") {
      // Refetch zones on admin updates that might affect availability
      // For now, we could refetch or handle specific updates
      console.log("Admin update received:", lastMessage.payload);
    }
  }, [lastMessage]);

  const handleTicketCreated = (ticket: Ticket, updatedZone: Zone) => {
    setTicketData(ticket);
    setShowTicketModal(true);

    // Update the zone state
    setZones((prevZones) =>
      prevZones.map((zone) => (zone.id === updatedZone.id ? updatedZone : zone))
    );
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setTicketData(null);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Loading gate information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg text-red-600'>
          Error loading gate information. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      <GateHeader gateId={gateId} />

      <div className='container mx-auto px-4 py-8'>
        {/* Information Banner - Tab-specific */}
        <div className='p-4 mb-8'>
          <div className='flex items-start gap-3'>
            <div
              className={`rounded-full p-2 ${
                activeTab === "visitor" ? "bg-primary" : "bg-secondary"
              }`}
            >
              <Users className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-primary mb-1'>
                Welcome to {gateId.replace("gate_", "Gate ")} -{" "}
                {activeTab === "visitor" ? "Visitor" : "Subscriber"} Check-in
              </h3>
              {activeTab === "visitor" ? (
                <p className='text-primary/80 text-sm'>
                  <strong>Visitor Parking:</strong> Pay-per-use parking with
                  hourly rates. Select an available zone below to begin your
                  parking session. Normal and special rates apply based on
                  current time periods.
                </p>
              ) : (
                <p className='text-secondary text-sm'>
                  <strong>Subscriber Access:</strong> Access zones matching your
                  subscription category. Enter your subscription ID to verify
                  eligibility and access your designated zones. Subscription
                  benefits include reserved slot allocation.
                </p>
              )}
            </div>
          </div>
        </div>

        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        <ZoneList
          zones={zones}
          activeTab={activeTab}
          gateId={gateId}
          onTicketCreated={handleTicketCreated}
        />

        {/* Footer Information - Tab-specific */}
        {zones.length > 0 && (
          <div className='mt-12 mb-8 text-center text-sm text-gray-600'>
            <p>
              Showing {zones.length} zone{zones.length !== 1 ? "s" : ""}{" "}
              available for{" "}
              {activeTab === "visitor" ? "visitor parking" : "subscribers"} at
              this gate.
              {activeTab === "visitor"
                ? " Hourly rates and availability are updated in real-time."
                : " Subscription verification required for zone access."}
            </p>
          </div>
        )}
      </div>


      {showTicketModal && ticketData && (
        <TicketModal
          ticket={ticketData}
          gateId={gateId}
          onClose={handleCloseTicketModal}
        />
      )}
    </div>
  );
};
