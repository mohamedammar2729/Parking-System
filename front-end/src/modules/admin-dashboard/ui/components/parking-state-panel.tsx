"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParkingState } from "@/lib/api";
import {
  BarChart3,
  MapPin,
  Users,
  Car,
  Shield,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export const ParkingStatePanel: React.FC = () => {
  const { data: parkingState, isLoading, error, refetch } = useParkingState();

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
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='w-5 h-5' />
              Parking State Report
            </CardTitle>
            <CardDescription>
              Real-time overview of all parking zones and occupancy
            </CardDescription>
          </div>
          <button
            onClick={() => refetch()}
            className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
            title='Refresh data'
          >
            <RefreshCw className='w-4 h-4' />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='flex items-center gap-2'>
              <MapPin className='w-5 h-5 text-blue-600' />
              <span className='text-sm font-medium text-blue-700'>
                Total Zones
              </span>
            </div>
            <p className='text-2xl font-bold text-blue-900'>{totalZones}</p>
            <p className='text-xs text-blue-600'>
              {openZones} open, {totalZones - openZones} closed
            </p>
          </div>

          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <div className='flex items-center gap-2'>
              <Car className='w-5 h-5 text-green-600' />
              <span className='text-sm font-medium text-green-700'>
                Occupancy
              </span>
            </div>
            <p className='text-2xl font-bold text-green-900'>
              {totalOccupied}/{totalSlots}
            </p>
            <p className='text-xs text-green-600'>
              {totalSlots > 0
                ? ((totalOccupied / totalSlots) * 100).toFixed(1)
                : 0}
              % occupied
            </p>
          </div>

          <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-purple-600' />
              <span className='text-sm font-medium text-purple-700'>
                Subscribers
              </span>
            </div>
            <p className='text-2xl font-bold text-purple-900'>
              {totalSubscribers}
            </p>
            <p className='text-xs text-purple-600'>Active subscriptions</p>
          </div>

          <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
            <div className='flex items-center gap-2'>
              <Shield className='w-5 h-5 text-orange-600' />
              <span className='text-sm font-medium text-orange-700'>
                Reserved
              </span>
            </div>
            <p className='text-2xl font-bold text-orange-900'>
              {parkingState?.reduce((sum, zone) => sum + zone.reserved, 0) || 0}
            </p>
            <p className='text-xs text-orange-600'>Total reserved slots</p>
          </div>
        </div>

        {/* Zone Details */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Zone Details</h3>

          {parkingState && parkingState.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {parkingState.map((zone) => (
                <Card key={zone.zoneId} className='border-gray-200'>
                  <CardHeader className='pb-3'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle className='text-lg'>{zone.name}</CardTitle>
                        <CardDescription>
                          Zone ID: {zone.zoneId}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={zone.open ? "default" : "destructive"}
                        className={
                          zone.open ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {zone.open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='font-medium text-gray-700'>
                          Total Slots:
                        </span>
                        <p className='text-lg font-bold text-gray-900'>
                          {zone.totalSlots}
                        </p>
                      </div>

                      <div>
                        <span className='font-medium text-gray-700'>
                          Occupied:
                        </span>
                        <p className='text-lg font-bold text-red-600'>
                          {zone.occupied}
                        </p>
                      </div>

                      <div>
                        <span className='font-medium text-gray-700'>Free:</span>
                        <p className='text-lg font-bold text-green-600'>
                          {zone.free}
                        </p>
                      </div>

                      <div>
                        <span className='font-medium text-gray-700'>
                          Reserved:
                        </span>
                        <p className='text-lg font-bold text-orange-600'>
                          {zone.reserved}
                        </p>
                      </div>

                      <div>
                        <span className='font-medium text-gray-700'>
                          Available for Visitors:
                        </span>
                        <p className='text-lg font-bold text-blue-600'>
                          {zone.availableForVisitors}
                        </p>
                      </div>

                      <div>
                        <span className='font-medium text-gray-700'>
                          Available for Subscribers:
                        </span>
                        <p className='text-lg font-bold text-purple-600'>
                          {zone.availableForSubscribers}
                        </p>
                      </div>

                      <div className='col-span-2'>
                        <span className='font-medium text-gray-700'>
                          Subscriber Count:
                        </span>
                        <p className='text-lg font-bold text-indigo-600'>
                          {zone.subscriberCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <BarChart3 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-500'>No parking zones found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
