"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  BarChart3,
  Settings,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const menuItems = [
    {
      id: "parking-state",
      label: "Parking State",
      icon: BarChart3,
      description: "View real-time parking data",
    },
    {
      id: "zones",
      label: "Zone Control",
      icon: MapPin,
      description: "Open/Close zones",
    },
    {
      id: "categories",
      label: "Category Rates",
      icon: Settings,
      description: "Update parking rates",
    },
    {
      id: "rush-hours",
      label: "Rush Hours",
      icon: Clock,
      description: "Manage rush hour windows",
    },
    {
      id: "vacations",
      label: "Vacations",
      icon: Calendar,
      description: "Add vacation periods",
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      description: "User management (N/A)",
      disabled: true,
    },
  ] as Array<{
    id: string;
    label: string;
    icon: typeof Users;
    description: string;
    disabled?: boolean;
  }>;

  return (
    <Card className='shadow-sm border-slate-200 bg-white/80 backdrop-blur-sm'>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='space-y-2'>
            <h2 className='text-xl font-bold text-slate-900'>Admin Panel</h2>
            <p className='text-sm text-slate-600'>
              Manage parking system settings
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className='space-y-2'>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              const isDisabled = item.disabled;

              return (
                <Button
                  key={item.id}
                  variant='ghost'
                  className={`
                    w-full justify-start text-left h-auto p-4 rounded-xl font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700"
                        : "hover:bg-slate-100/80 text-slate-700 hover:text-slate-900"
                    }
                    ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                        : ""
                    }
                  `}
                  onClick={() => !isDisabled && onTabChange(item.id)}
                  disabled={isDisabled}
                >
                  <div className='flex items-start gap-3 w-full'>
                    <div
                      className={`
                      p-2 rounded-lg transition-colors
                      ${
                        isActive
                          ? "bg-white/20"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }
                    `}
                    >
                      <IconComponent
                        className={`
                        w-5 h-5 transition-colors
                        ${isActive ? "text-white" : "text-slate-600"}
                      `}
                      />
                    </div>
                    <div className='flex-1 text-left'>
                      <div
                        className={`
                        font-semibold text-sm
                        ${isActive ? "text-white" : "text-slate-900"}
                      `}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`
                        text-xs mt-0.5 leading-tight
                        ${isActive ? "text-blue-100" : "text-slate-500"}
                      `}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className='pt-4 border-t border-slate-200'>
            <div className='flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              System Online
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
