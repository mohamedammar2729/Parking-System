"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParkingState, useUpdateZoneStatus } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

export const ZoneControlPanel: React.FC = () => {
  const [updatingZones, setUpdatingZones] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: parkingState, isLoading, error, refetch } = useParkingState();
  const updateZoneStatusMutation = useUpdateZoneStatus();

  const handleZoneToggle = async (zoneId: string, currentOpen: boolean) => {
    try {
      setUpdatingZones((prev) => new Set([...prev, zoneId]));
      setErrorMessage(null);
      setSuccessMessage(null);

      await updateZoneStatusMutation.mutateAsync({
        id: zoneId,
        open: !currentOpen,
      });

      // Refresh the parking state
      queryClient.invalidateQueries({ queryKey: ["parking-state"] });

      setSuccessMessage(
        `Zone ${zoneId} ${!currentOpen ? "opened" : "closed"} successfully`
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "Failed to update zone status");
    } finally {
      setUpdatingZones((prev) => {
        const newSet = new Set(prev);
        newSet.delete(zoneId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='w-5 h-5' />
            Zone Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
            <p className='text-secondary-foreground mt-2'>Loading zones...</p>
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
            <MapPin className='w-5 h-5' />
            Zone Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className='border-ring/30 bg-ring'>
            <AlertTriangle className='h-4 w-4 text-foreground' />
            <AlertDescription className='text-secondary-foreground'>
              Failed to load zones: {(error as Error).message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-background'>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className='flex items-center'>Zone Control</CardTitle>
            <CardDescription>Open and close parking zones</CardDescription>
          </div>
          <Button
            onClick={() => refetch()}
            variant='outline'
            title='Refresh data'
          >
            <RefreshCw className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {successMessage && (
          <Alert className='mb-4 border-green-200 bg-green-50'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-700'>
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className='mb-4 border-red-200 bg-red-50'>
            <AlertTriangle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-700'>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {parkingState && parkingState.length > 0 ? (
          <div className='space-y-4'>
            {parkingState.map((zone) => {
              const isUpdating = updatingZones.has(zone.zoneId);

              return (
                <div
                  key={zone.zoneId}
                  className='flex justify-between items-center p-4 border rounded-lg bg-background'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h3 className='font-medium text-accent-foreground'>
                        {zone.name}
                      </h3>
                      <Badge
                        variant={zone.open ? "default" : "destructive"}
                        className={
                          zone.open ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {zone.open ? "Open" : "Closed"}
                      </Badge>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-foreground'>
                      <div>
                        <span className='font-medium'>Total:</span>{" "}
                        {zone.totalSlots}
                      </div>
                      <div>
                        <span className='font-medium'>Occupied:</span>{" "}
                        {zone.occupied}
                      </div>
                      <div>
                        <span className='font-medium'>Free:</span> {zone.free}
                      </div>
                      <div>
                        <span className='font-medium'>Available:</span>{" "}
                        {zone.availableForVisitors}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <Button
                      variant={zone.open ? "destructive" : "default"}
                      size='sm'
                      onClick={() => handleZoneToggle(zone.zoneId, zone.open)}
                      disabled={isUpdating}
                      className='gap-2 min-w-[100px]'
                    >
                      {isUpdating ? (
                        <RefreshCw className='w-4 h-4 animate-spin' />
                      ) : zone.open ? (
                        <ToggleRight className='w-4 h-4' />
                      ) : (
                        <ToggleLeft className='w-4 h-4' />
                      )}
                      {isUpdating
                        ? "Updating..."
                        : zone.open
                        ? "Close"
                        : "Open"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-8'>
            <MapPin className='w-12 h-12 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground mx-auto mb-4' />
            <p className='text-foreground'>No zones found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
