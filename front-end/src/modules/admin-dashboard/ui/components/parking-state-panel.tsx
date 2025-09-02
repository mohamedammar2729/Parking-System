"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParkingState } from "@/lib/api";
import {
  BarChart3,
  Users,
  Shield,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParkingStateReport } from "@/server/types";

interface FiltersState {
  search: string;
  status: "all" | "open" | "closed";
  sortBy: "name" | "occupancy" | "totalSlots";
  sortOrder: "asc" | "desc";
}

export const ParkingStatePanel: React.FC = () => {
  const { data: parkingState, isLoading, error, refetch } = useParkingState();

  // Filters and pagination state
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 zones per page for better layout

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    if (!parkingState) return [];

    const filtered = parkingState.filter((zone) => {
      const matchesSearch =
        zone.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        zone.zoneId.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "open" && zone.open) ||
        (filters.status === "closed" && !zone.open);
      return matchesSearch && matchesStatus;
    });

    // Sort the filtered data
    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "occupancy":
          aValue = a.totalSlots > 0 ? a.occupied / a.totalSlots : 0;
          bValue = b.totalSlots > 0 ? b.occupied / b.totalSlots : 0;
          break;
        case "totalSlots":
          aValue = a.totalSlots;
          bValue = b.totalSlots;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (filters.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [parkingState, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='w-5 h-5' />
            Parking State Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
            <p className='text-gray-500 mt-2'>Loading parking state...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='w-5 h-5' />
            Parking State Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className='border-red-200 bg-red-50'>
            <AlertTriangle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-700'>
              Failed to load parking state: {(error as Error).message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const totalZones = parkingState?.length || 0;
  const openZones = parkingState?.filter((zone) => zone.open).length || 0;
  const totalOccupied =
    parkingState?.reduce((sum, zone) => sum + zone.occupied, 0) || 0;
  const totalSlots =
    parkingState?.reduce((sum, zone) => sum + zone.totalSlots, 0) || 0;
  const totalSubscribers =
    parkingState?.reduce((sum, zone) => sum + zone.subscriberCount, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>Parking State Report</CardTitle>
            <CardDescription>
              Real-time overview of all parking zones ({filteredData.length} of{" "}
              {totalZones} zones)
            </CardDescription>
          </div>
          <Button
            variant='outline'
            onClick={() => refetch()}
            className='p-2'
            title='Refresh data'
          >
            <RefreshCw className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Summary Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='bg-accent border rounded-lg p-4'>
            <div>
              <p className='text-sm font-medium text-foreground'>Total Zones</p>
              <p className='text-2xl font-bold text-accent-foreground'>
                {totalZones}
              </p>
            </div>
            <p className='text-xs text-foreground/80 mt-1'>
              {openZones} open, {totalZones - openZones} closed
            </p>
          </div>

          <div className='bg-accent border rounded-lg p-4'>
            <div>
              <p className='text-sm font-medium text-foreground'>Occupancy</p>
              <p className='text-2xl font-bold text-foreground'>
                {totalOccupied} / {totalSlots}
              </p>
            </div>
            <p className='text-xs text-foreground/80 mt-1'>
              {totalSlots > 0
                ? ((totalOccupied / totalSlots) * 100).toFixed(1)
                : 0}
              % occupied
            </p>
          </div>

          <div className='bg-accent border rounded-lg p-4'>
            <div>
              <p className='text-sm font-medium text-foreground'>Subscribers</p>
              <p className='text-2xl font-bold text-accent-foreground'>
                {totalSubscribers}
              </p>
            </div>
            <p className='text-xs text-foreground/80 mt-1'>
              Active subscriptions
            </p>
          </div>

          <div className='bg-accent border rounded-lg p-4'>
            <div>
              <p className='text-sm font-medium text-foreground'>Reserved</p>
              <p className='text-2xl font-bold text-accent-foreground'>
                {parkingState?.reduce((sum, zone) => sum + zone.reserved, 0) ||
                  0}
              </p>
            </div>
            <p className='text-xs text-foreground/80 mt-1'>
              Total reserved slots
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className='border rounded-lg p-4 bg-background'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <Label htmlFor='search' className='text-sm font-medium'>
                Search Zones
              </Label>
              <div className='relative mt-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4' />
                <Input
                  id='search'
                  placeholder='Search by zone name or ID...'
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className='pl-9'
                />
              </div>
            </div>

            <div className='flex gap-4'>
              <div>
                <Label className='text-sm font-medium'>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value: "all" | "open" | "closed") =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className='w-32 mt-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Zones</SelectItem>
                    <SelectItem value='open'>Open Only</SelectItem>
                    <SelectItem value='closed'>Closed Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className='text-sm font-medium'>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: "name" | "occupancy" | "totalSlots") =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger className='w-32 mt-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='name'>Name</SelectItem>
                    <SelectItem value='occupancy'>Occupancy</SelectItem>
                    <SelectItem value='totalSlots'>Total Slots</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className='text-sm font-medium'>Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: "asc" | "desc") =>
                    setFilters((prev) => ({ ...prev, sortOrder: value }))
                  }
                >
                  <SelectTrigger className='w-24 mt-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='asc'>A-Z</SelectItem>
                    <SelectItem value='desc'>Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Cards */}
        {paginatedData.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
            {paginatedData.map((zone) => (
              <ZoneCard key={zone.zoneId} zone={zone} />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <Eye className='w-12 h-12 text-foreground mx-auto mb-4' />
            <p className='text-foreground font-medium'>
              No zones match your filters
            </p>
            <p className='text-foreground/70 text-sm'>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between border-t pt-4'>
            <p className='text-sm text-gray-600'>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} zones
            </p>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className='w-4 h-4' />
                Previous
              </Button>

              <div className='flex items-center gap-1'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size='sm'
                      onClick={() => setCurrentPage(page)}
                      className='w-8 h-8 p-0'
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Separate Zone Card Component for better maintainability
interface ZoneCardProps {
  zone: ParkingStateReport;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone }) => {
  const occupancyPercentage =
    zone.totalSlots > 0 ? (zone.occupied / zone.totalSlots) * 100 : 0;

  return (
    <Card className='hover:shadow-md transition-shadow duration-200'>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <CardTitle className='text-lg font-semibold text-accent-foreground'>
              {zone.name}
            </CardTitle>
          </div>
          <Badge
            variant={zone.open ? "default" : "destructive"}
            className='mt-0.5'
          >
            {zone.open ? "Open" : "Closed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Occupancy Progress Bar */}
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-foreground'>Occupancy</span>
            <span className='font-medium'>
              {zone.occupied}/{zone.totalSlots}
            </span>
          </div>
          <div className='w-full bg-accent rounded-full h-2'>
            <div
              className={`h-2 rounded-full transition-all duration-300 bg-primary `}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            {occupancyPercentage.toFixed(1)}% occupied
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-3 text-sm'>
          <div className='bg-accent border rounded p-2'>
            <span className='text-foreground font-medium'>Free</span>
            <p className='text-lg font-bold text-accent-foreground'>
              {zone.free}
            </p>
          </div>

          <div className='bg-primary/10 border rounded p-2'>
            <span className='text-foreground font-medium'>Reserved</span>
            <p className='text-lg font-bold text-accent-foreground'>
              {zone.reserved}
            </p>
          </div>

          <div className='bg-chart-2/10 border rounded p-2'>
            <span className='text-foreground font-medium'>Visitors</span>
            <p className='text-lg font-bold text-accent-foreground'>
              {zone.availableForVisitors}
            </p>
          </div>

          <div className='bg-input/10 border rounded p-2'>
            <span className='text-foreground font-medium'>Subscribers</span>
            <p className='text-lg font-bold text-accent-foreground'>
              {zone.availableForSubscribers}
            </p>
          </div>
        </div>

        {/* Subscriber Count */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
          <span className='text-sm text-gray-600'>Active Subscribers</span>
          <div className='flex items-center gap-1'>
            <Users className='w-4 h-4 text-gray-400' />
            <span className='font-semibold text-gray-900'>
              {zone.subscriberCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
