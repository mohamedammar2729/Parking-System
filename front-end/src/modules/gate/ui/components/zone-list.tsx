"use client";

import React from "react";

import type { Zone, Ticket } from "@/server/types";
import type { TabType } from "../views/gate-view";
import { ZoneCard } from "./zone-card";

interface ZoneListProps {
  zones: Zone[];
  activeTab: TabType;
  gateId: string;
  onTicketCreated: (ticket: Ticket, updatedZone: Zone) => void;
}

export const ZoneList: React.FC<ZoneListProps> = ({
  zones,
  activeTab,
  gateId,
  onTicketCreated,
}) => {
  if (!zones || zones.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-primary text-lg'>
          No zones available for this gate.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      {zones.map((zone) => (
        <ZoneCard
          key={zone.id}
          zone={zone}
          activeTab={activeTab}
          gateId={gateId}
          onTicketCreated={onTicketCreated}
        />
      ))}
    </div>
  );
};
