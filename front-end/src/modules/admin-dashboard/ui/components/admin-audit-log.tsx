"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/redux/hooks";
import { useParkingState, useCategories } from "@/lib/api";
import { Activity, Clock, Trash2, AlertCircle, Shield } from "lucide-react";

interface AdminUpdateEvent {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export const AdminAuditLog: React.FC = () => {
  const [adminUpdates, setAdminUpdates] = useState<AdminUpdateEvent[]>([]);
  const lastMessage = useAppSelector((state) => state.websocket.lastMessage);

  // Fetch zones and categories data to get names
  const { data: parkingState } = useParkingState();
  const { data: categories } = useCategories();

  // Create name mappings
  const zoneNameMap = useMemo(() => {
    if (!parkingState) return new Map<string, string>();
    const map = new Map<string, string>();
    parkingState.forEach((zone) => {
      map.set(zone.zoneId, zone.name);
    });
    return map;
  }, [parkingState]);

  const categoryNameMap = useMemo(() => {
    if (!categories) return new Map<string, string>();
    const map = new Map<string, string>();
    categories.forEach((category) => {
      map.set(category.id, category.name);
    });
    return map;
  }, [categories]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === "admin-update") {
      const newUpdate: AdminUpdateEvent = {
        id: Date.now().toString(),
        ...lastMessage.payload,
      };

      setAdminUpdates((prev) => [newUpdate, ...prev.slice(0, 5)]); // Keep last 5 updates
    }
  }, [lastMessage]);

  const clearLog = () => {
    setAdminUpdates([]);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActionConfig = (action: string) => {
    switch (action) {
      case "zone-opened":
        return {
          color: "bg-emerald-50 border-emerald-200 text-emerald-800",
          badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
        };
      case "zone-closed":
        return {
          color: "bg-red-50 border-red-200 text-red-800",
          badgeColor: "bg-red-100 text-red-700 border-red-300",
        };
      case "category-rates-changed":
        return {
          color: "bg-blue-50 border-blue-200 text-blue-800",
          badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
        };
      case "rush-updated":
        return {
          color: "bg-amber-50 border-amber-200 text-amber-800",
          badgeColor: "bg-amber-100 text-amber-700 border-amber-300",
        };
      case "vacation-added":
        return {
          color: "bg-purple-50 border-purple-200 text-purple-800",
          badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
        };
      default:
        return {
          color: "bg-slate-50 border-slate-200 text-slate-800",
          badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
        };
    }
  };

  const formatActionDetails = (update: AdminUpdateEvent) => {
    switch (update.action) {
      case "zone-opened":
      case "zone-closed":
        const zoneName =
          zoneNameMap.get(update.targetId) || `Zone ${update.targetId}`;
        return {
          title: `Zone: ${zoneName}`,
          description: `Status changed to ${
            (update.details as { open: boolean }).open ? "opened" : "closed"
          }`,
          category: "Zone Management",
        };
      case "category-rates-changed":
        const rates = update.details as {
          rateNormal: number;
          rateSpecial: number;
        };
        const categoryName =
          categoryNameMap.get(update.targetId) || `Category ${update.targetId}`;
        return {
          title: `Category: ${categoryName}`,
          description: `Normal: $${rates.rateNormal}/hr • Special: $${rates.rateSpecial}/hr`,
          category: "Pricing",
        };
      case "rush-updated":
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const rushDetails = update.details as {
          weekDay: number;
          from: string;
          to: string;
        };
        const dayName =
          days[rushDetails.weekDay] || `Day ${rushDetails.weekDay}`;
        return {
          title: "Rush Hour Schedule",
          description: `${dayName} from ${rushDetails.from} to ${rushDetails.to}`,
          category: "Schedule",
        };
      case "vacation-added":
        const vacation = update.details as {
          name: string;
          from: string;
          to: string;
        };
        return {
          title: `Vacation Period: ${vacation.name}`,
          description: `${vacation.from} to ${vacation.to}`,
          category: "Holiday Schedule",
        };
      default:
        return {
          title: `${update.action}`,
          description: `Action performed on ${update.targetType} ${update.targetId}`,
          category: "System",
        };
    }
  };

  return (
    <Card className='h-full w-full shadow-sm border-slate-200'>
      <CardHeader className='pb-2 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200'>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle className='flex items-center gap-2 text-base font-semibold text-slate-900'>
              <div className='p-1 bg-blue-100 rounded-md'>
                <Activity className='w-3 h-3 text-blue-600' />
              </div>
              Admin Audit Log
            </CardTitle>
            <CardDescription className='text-xs text-slate-600 mt-0.5'>
              Last {adminUpdates.length} of 50 events
            </CardDescription>
          </div>
          {adminUpdates.length > 0 && (
            <Button
              variant='outline'
              size='sm'
              onClick={clearLog}
              className='gap-1 border-slate-300 hover:bg-slate-50 text-xs h-7 px-2'
            >
              <Trash2 className='w-3 h-3' />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className='p-0 h-[calc(100%-70px)]'>
        <ScrollArea className='h-full'>
          {adminUpdates.length > 0 ? (
            <div className='p-2 space-y-1'>
              {adminUpdates.map((update) => {
                const config = getActionConfig(update.action);
                const details = formatActionDetails(update);

                return (
                  <div
                    key={update.id}
                    className={`p-2 mb-3 rounded-md border transition-all duration-200 hover:shadow-sm ${config.color}`}
                  >
                    <div className='flex items-start gap-2'>
                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        {/* Header */}
                        <div className='flex items-start justify-between gap-1 mb-1'>
                          <div className='flex items-center gap-1 flex-wrap'>
                            <Badge
                              variant='outline'
                              className={`text-xs font-medium px-1 py-1 h-4 leading-tight ${config.badgeColor}`}
                            >
                              {details.category}
                            </Badge>
                          </div>

                          <div className='text-xs text-slate-500 whitespace-nowrap flex items-center gap-0.5'>
                            <Clock className='w-2.5 h-2.5' />
                            {formatTimestamp(update.timestamp)}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className='font-medium text-slate-900 leading-tight text-xs mb-1'>
                          {details.title}
                        </h4>

                        {/* Description */}
                        <p className='text-xs text-slate-700 leading-tight'>
                          {details.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-center p-4 space-y-2'>
              <div className='p-2 bg-slate-100 rounded-full'>
                <AlertCircle className='w-5 h-5 text-slate-400' />
              </div>
              <div className='space-y-1'>
                <h3 className='text-sm font-semibold text-slate-900'>
                  No Activity Yet
                </h3>
                <p className='text-slate-500 text-xs max-w-xs leading-relaxed'>
                  Admin actions will appear here in real-time.
                </p>
              </div>
              <div className='flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded'>
                <Shield className='w-3 h-3' />
                Connected
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
