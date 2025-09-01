"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck } from "lucide-react";
import type { TabType } from "../views/gate-view";

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className='mb-8'>
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as TabType)}
      >
        <TabsList className='grid w-full max-w-lg mx-auto grid-cols-2 h-14 p-1 bg-gray-100'>
          <TabsTrigger
            value='visitor'
            className='flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white'
          >
            <Users className='h-5 w-5' />
            <div className='text-left'>Visitor</div>
          </TabsTrigger>
          <TabsTrigger
            value='subscriber'
            className='flex items-center gap-3 h-12 text-base font-medium data-[state=active]:bg-secondary data-[state=active]:text-white'
          >
            <UserCheck className='h-5 w-5' />
            <div className='text-left'>Subscriber</div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className='text-center mt-4'>
        <p className='text-semibold text-foreground'>Choose your parking category</p>
      </div>
    </div>
  );
};
