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
    <Card className='shadow-sm bg-card'>
      <CardContent className='px-4'>
        <div className='space-y-6'>
          {/* Header */}
          <div>
            <h2 className='text-xl font-bold text-foreground'>Admin Panel</h2>
            <p className='text-sm text-foreground/90'>
              Manage system settings
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
                    w-full justify-start text-left h-auto p-4 rounded-xl font-medium transition-all duration-200 bg-transparent border-0
                    ${
                      isActive
                        ? "bg-ring text-foreground shadow-md hover:chart-1"
                        : "hover:bg-primary text-foreground"
                    }
                    ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed hover:bg-ring "
                        : "hover:bg-primary"
                    }
                  `}
                  onClick={() => !isDisabled && onTabChange(item.id)}
                  disabled={isDisabled}
                >
                  <div className='flex items-start gap-3 w-full'>
                    <div
                      className={`
                      p-2 rounded-lg transition-colors
                      ${isActive ? "bg-secondary " : "bg-foreground"}
                    `}
                    >
                      <IconComponent
                        className={`
                        w-5 h-5 transition-colors
                        ${isActive ? "text-foreground" : "text-card"}
                      `}
                      />
                    </div>
                    <div className='flex-1 text-left'>
                      <div
                        className={`
                        font-semibold text-sm
                        ${isActive ? "text-popover" : "text-foreground"}
                      `}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`
                        text-xs mt-0.5 leading-tight
                        ${isActive ? "text-popover" : "text-foreground"}
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
          
        </div>
      </CardContent>
    </Card>
  );
};
