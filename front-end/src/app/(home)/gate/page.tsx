"use client";

import { useState, useMemo, useEffect } from "react";
import { useGates } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
  Activity,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Link from "@/components/link";
import { GateHeader } from "@/modules/gate/ui/components/gate-header";
import type { Gate } from "@/server/types";

interface FiltersState {
  search: string;
  location: "all" | string;
  sortBy: "name" | "location" | "zones";
  sortOrder: "asc" | "desc";
}

const GateListPage = () => {
  const { data: gates, isLoading, error, refetch } = useGates();

  // Filters and pagination state
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    location: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 gates per page for better layout

  // Get unique locations for filter
  const uniqueLocations = useMemo(() => {
    if (!gates) return [];
    const locations = [...new Set(gates.map((gate) => gate.location))];
    return locations.sort();
  }, [gates]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    if (!gates) return [];

    const filtered = gates.filter((gate) => {
      const matchesSearch =
        gate.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        gate.id.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation =
        filters.location === "all" || gate.location === filters.location;
      return matchesSearch && matchesLocation;
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
        case "location":
          aValue = a.location;
          bValue = b.location;
          break;
        case "zones":
          aValue = a.zoneIds.length;
          bValue = b.zoneIds.length;
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
  }, [gates, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-accent/50'>
        <GateHeader gateId='SELECTION' />
        <div className='max-w-[1600px] mx-auto px-6 py-8'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building className='w-5 h-5' />
                Parking Gates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
                <p className='text-gray-500 mt-2'>Loading gates...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-accent/50'>
        <GateHeader gateId='SELECTION' />
        <div className='max-w-[1600px] mx-auto px-6 py-8'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building className='w-5 h-5' />
                Parking Gates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className='border-red-200 bg-red-50'>
                <AlertTriangle className='h-4 w-4 text-red-600' />
                <AlertDescription className='text-red-700'>
                  Failed to load gates: {(error as Error).message}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalGates = gates?.length || 0;

  return (
    <div className='min-h-screen bg-background'>
      <GateHeader gateId='SELECTION' />

      <div className='max-w-[1600px] mx-auto px-6 py-8'>
        <Card>
          <CardHeader>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle>Parking Gates</CardTitle>
                <CardDescription>
                  Select a gate to manage check-ins ({filteredData.length} of{" "}
                  {totalGates} gates)
                </CardDescription>
              </div>
              <Button variant='outline' onClick={() => refetch()} size='sm'>
                <RefreshCw className='w-4 h-4 mr-2' />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* Summary Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-accent border rounded-lg p-4'>
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    Total Gates
                  </p>
                  <p className='text-2xl font-bold text-accent-foreground'>
                    {totalGates}
                  </p>
                </div>

                <p className='text-xs text-foreground mt-1'>
                  Available access points
                </p>
              </div>

              <div className='bg-accent border rounded-lg p-4'>
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    Locations
                  </p>
                  <p className='text-2xl font-bold text-accent-foreground'>
                    {uniqueLocations.length}
                  </p>
                </div>
                <p className='text-xs text-foreground mt-1'>Unique locations</p>
              </div>

              <div className='bg-accent borderrounded-lg p-4'>
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    Total Zones
                  </p>
                  <p className='text-2xl font-bold text-accent-foreground'>
                    {gates?.reduce(
                      (sum, gate) => sum + gate.zoneIds.length,
                      0
                    ) || 0}
                  </p>
                </div>
                <p className='text-xs text-foreground mt-1'>
                  Managed parking zones
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className='border rounded-lg p-4 bg-background'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <Label htmlFor='search' className='text-sm font-medium'>
                    Search Gates
                  </Label>
                  <div className='relative mt-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/70 w-4 h-4' />
                    <Input
                      id='search'
                      placeholder='Search by gate name or ID...'
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className='pl-9'
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div>
                    <Label className='text-sm font-medium'>Location</Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value: string) =>
                        setFilters((prev) => ({ ...prev, location: value }))
                      }
                    >
                      <SelectTrigger className='w-32 mt-1'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className='text-sm font-medium'>Sort By</Label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value: "name" | "location" | "zones") =>
                        setFilters((prev) => ({ ...prev, sortBy: value }))
                      }
                    >
                      <SelectTrigger className='w-32 mt-1'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='name'>Name</SelectItem>
                        <SelectItem value='location'>Location</SelectItem>
                        <SelectItem value='zones'>Zone Count</SelectItem>
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

            {/* Gate Cards */}
            {paginatedData.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {paginatedData.map((gate) => (
                  <GateCard key={gate.id} gate={gate} />
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <Eye className='w-12 h-12 text-foreground/70 mx-auto mb-4' />
                <p className='text-foreground font-medium'>
                  No gates match your filters
                </p>
                <p className='text-foreground/50 text-sm'>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex items-center justify-between border-t pt-4'>
                <p className='text-sm text-foreground'>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} gates
                </p>

                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
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
      </div>
    </div>
  );
};

// Separate Gate Card Component for better maintainability
interface GateCardProps {
  gate: Gate;
}

const GateCard: React.FC<GateCardProps> = ({ gate }) => {
  return (
    <Card className='hover:shadow-md transition-shadow duration-200'>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start'>
          <CardTitle className='text-lg font-semibold text-accent-foreground'>
            {gate.name}
          </CardTitle>

          <Badge variant='outline' className='bg-accent text-accent-foreground'>
            {gate.location}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-2'>
        {/* Location */}
        <div className='text-sm text-foreground'>
          <span className='font-medium'>Location : </span>
          <span>{gate.location}</span>
        </div>

        {/* Zones */}
        <div className='space-y-2'>
          <div className='text-sm text-foreground'>
            <span className='font-medium'>Zones ({gate.zoneIds.length})</span>
          </div>
          <div className='flex flex-wrap gap-1'>
            {gate.zoneIds.map((zoneId, index) => (
              <Badge key={index} variant='secondary' className='text-xs'>
                {zoneId}
              </Badge>
            ))}
          </div>
        </div>

        {/* Access Button */}
        <Link href={`/gate/${gate.id}`}>
          <Button className='w-full mt-4 bg-primary hover:bg-primary/90'>
            Access Gate
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default GateListPage;
