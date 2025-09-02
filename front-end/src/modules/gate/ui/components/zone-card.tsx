"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Loader from "@/components/ui/loader";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useCheckin, useSubscription } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import type { Zone, Ticket } from "@/server/types";
import type { TabType } from "../views/gate-view";

interface ZoneCardProps {
  zone: Zone;
  activeTab: TabType;
  gateId: string;
  onTicketCreated: (ticket: Ticket, updatedZone: Zone) => void;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({
  zone,
  activeTab,
  gateId,
  onTicketCreated,
}) => {
  const [subscriptionId, setSubscriptionId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [isVerified, setIsVerified] = useState(false);

  const queryClient = useQueryClient();
  const checkinMutation = useCheckin();

  // Get subscription data when verifying
  const { data: subscription, refetch: verifySubscription } =
    useSubscription(subscriptionId);

  const isZoneOpen = zone.open;
  const hasVisitorAvailability = zone.availableForVisitors > 0;
  const hasSubscriberAvailability = zone.availableForSubscribers > 0;

  // Determine if zone is selectable based on current tab
  const isSelectable =
    isZoneOpen &&
    (activeTab === "visitor"
      ? hasVisitorAvailability
      : hasSubscriberAvailability);

  const isSpecialRate = zone.rateSpecial !== zone.rateNormal;

  const handleVisitorCheckin = async () => {
    try {
      const result = await checkinMutation.mutateAsync({
        gateId,
        zoneId: zone.id,
        type: "visitor",
      });

      onTicketCreated(result.ticket, result.zoneState);

      // Invalidate and refetch zones
      queryClient.invalidateQueries({ queryKey: ["zones", gateId] });
    } catch (error) {
      console.error("Checkin failed:", error);
    }
  };

  const handleSubscriberVerification = async () => {
    if (!subscriptionId.trim()) {
      setVerificationError("Please enter a subscription ID");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const result = await verifySubscription();
      const sub = result.data;

      if (!sub) {
        setVerificationError("Subscription not found");
        setIsVerified(false);
        return;
      }

      if (!sub.active) {
        setVerificationError("Subscription is not active");
        setIsVerified(false);
        return;
      }

      // Check if subscription category matches zone category
      if (sub.category !== zone.categoryId) {
        setVerificationError(
          `Subscription category (${sub.category}) does not match zone category (${zone.categoryId})`
        );
        setIsVerified(false);
        return;
      }

      setIsVerified(true);
      setVerificationError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to verify subscription";
      setVerificationError(errorMessage);
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubscriberCheckin = async () => {
    if (!isVerified || !subscriptionId) return;

    try {
      const result = await checkinMutation.mutateAsync({
        gateId,
        zoneId: zone.id,
        type: "subscriber",
        subscriptionId,
      });

      onTicketCreated(result.ticket, result.zoneState);

      // Reset form
      setSubscriptionId("");
      setIsVerified(false);
      setVerificationError(null);

      // Invalidate and refetch zones
      queryClient.invalidateQueries({ queryKey: ["zones", gateId] });
    } catch (error) {
      console.error("Subscriber checkin failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Check-in failed";
      setVerificationError(errorMessage);
    }
  };

  const resetSubscriberForm = () => {
    setSubscriptionId("");
    setIsVerified(false);
    setVerificationError(null);
  };

  return (
    <Card
      className={`h-full transition-all duration-200 ${
        !isSelectable ? "opacity-60 grayscale" : "hover:shadow-lg"
      }`}
    >
      <CardHeader className=''>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-xl font-bold text-gray-900 mb-1'>
              {zone.name}
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-xs font-medium'>
                Category: {zone.categoryId.replace("cat_", "").toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className='flex flex-col items-end gap-1'>
            {isZoneOpen ? (
              <Badge variant='default' className='text-xs bg-green-600'>
                <CheckCircle className='h-3 w-3 mr-1' />
                OPEN
              </Badge>
            ) : (
              <Badge variant='destructive' className='text-xs'>
                <XCircle className='h-3 w-3 mr-1' />
                CLOSED
              </Badge>
            )}
            {isSpecialRate && (
              <Badge
                variant='secondary'
                className='text-xs bg-orange-100 text-orange-800'
              >
                <Clock className='h-3 w-3 mr-1' />
                Special Rate Active
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        {/* Parking Occupancy Overview */}
        <div className='bg-accent/50 rounded-lg p-4'>
          <h4 className='text-sm font-semibold text-accent-foreground mb-3 flex items-center'>
            <Users className='h-4 w-4 mr-2' />
            Parking Overview
          </h4>

          <div className='grid grid-cols-3 gap-3 mb-3'>
            <div className='text-center'>
              <div className='text-lg font-bold text-primary'>
                {zone.occupied}
              </div>
              <div className='text-xs text-accent-foreground'>Occupied</div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-bold text-foreground'>
                {zone.free}
              </div>
              <div className='text-xs text-accent-foreground'>Free</div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-bold text-primary'>
                {zone.reserved}
              </div>
              <div className='text-xs text-accent-foreground'>Reserved</div>
            </div>
          </div>

          {/* Occupancy Bar */}
          <div className='w-full bg-input rounded-full h-2 mb-2'>
            <div
              className='bg-primary h-2 rounded-full relative'
              style={{ width: `${(zone.occupied / zone.totalSlots) * 100}%` }}
            >
              <div
                className='bg-popover h-2 rounded-full absolute right-0'
                style={{ width: `${(zone.reserved / zone.occupied) * 100}%` }}
              />
            </div>
          </div>

          <div className='text-center text-xs text-foreground'>
            Total Capacity:{" "}
            <span className='font-semibold'>{zone.totalSlots}</span> slots
          </div>
        </div>

        {/* Availability Section - Tab-specific */}
        <div className='rounded-lg p-4'>
          {activeTab === "visitor" ? (
            <div className='text-center p-4 bg-background rounded-lg border'>
              <div className='text-3xl font-bold text-primary mb-2'>
                {zone.availableForVisitors}
              </div>
              <div className='text-sm text-foreground font-medium mb-1'>
                Available Slots for Visitors
              </div>
            </div>
          ) : (
            <div className='text-center p-4 bg-background rounded-lg border'>
              <div className='text-3xl font-bold text-primary mb-2'>
                {zone.availableForSubscribers}
              </div>
              <div className='text-sm text-accent-foreground font-medium mb-1'>
                Available Slots for Subscribers
              </div>
            </div>
          )}
        </div>

        {/* Pricing Information - Tab-specific */}
        {activeTab === "visitor" && (
          <div className='rounded-lg px-8'>
            <h4 className='text-sm font-semibold text-foreground mb-3 flex items-center'>
              Visitor Hourly Rates
            </h4>

            <div className='grid grid-cols-2 gap-3'>
              <div className='text-center p-2 bg-background rounded border'>
                <div className='text-lg font-bold text-foreground'>
                  ${zone.rateNormal}
                </div>
                <div className='text-xs text-muted-foreground'>Normal Rate</div>
              </div>
              <div
                className={`text-center p-2 rounded border ${
                  isSpecialRate
                    ? "bg-chart-3/25 border-chart-3"
                    : "bg-background"
                }`}
              >
                <div
                  className={`text-lg font-bold ${
                    isSpecialRate ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  ${zone.rateSpecial}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {isSpecialRate ? "Current Rate" : "Special Rate"}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Action Section */}
        <div className='pt-2'>
          {activeTab === "visitor" && (
            <div className='space-y-3'>
              {!isZoneOpen ? (
                <Alert className='border-destructive/30 bg-destructive/10'>
                  <XCircle className='h-4 w-4 text-destructive/90' />
                  <AlertDescription className='text-destructive'>
                    This zone is currently closed for new entries
                  </AlertDescription>
                </Alert>
              ) : !hasVisitorAvailability ? (
                <Alert className='border-chart-4/50 bg-chart-4/20'>
                  <AlertTriangle className='h-4 w-4 text-destructive/90' />
                  <AlertDescription className='text-destructive'>
                    No parking slots available for visitors at this time
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handleVisitorCheckin}
                  disabled={checkinMutation.isPending}
                  className='w-full h-12 text-base font-semibold bg-primary hover:bg-primary/80'
                  size='lg'
                >
                  {checkinMutation.isPending ? (
                    <>
                      <Loader className='mr-2 h-5 w-5' />
                      Processing Check-in...
                    </>
                  ) : (
                    <>
                      <CheckCircle className='mr-2 h-5 w-5' />
                      Check In as Visitor
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {activeTab === "subscriber" && (
            <div className='space-y-4'>
              {!isVerified ? (
                <div className='space-y-4'>
                  <div className='space-y-3'>
                    <div>
                      <Label
                        className='mb-2 text-sm font-medium text-gray-700'
                        htmlFor={`subscription-${zone.id}`}
                      >
                        Subscription ID *
                      </Label>
                      <Input
                        id={`subscription-${zone.id}`}
                        value={subscriptionId}
                        onChange={(e) => setSubscriptionId(e.target.value)}
                        placeholder='Enter your subscription ID'
                        disabled={isVerifying}
                        className='border-2 h-11'
                      />
                    </div>

                    {verificationError && (
                      <Alert
                        variant='destructive'
                        className='border-red-200 bg-red-50'
                      >
                        <AlertTriangle className='h-4 w-4 text-red-600' />
                        <AlertDescription className='text-red-700'>
                          {verificationError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleSubscriberVerification}
                      disabled={isVerifying || !subscriptionId.trim()}
                      className='w-full h-11 font-semibold'
                      variant='outline'
                    >
                      {isVerifying ? (
                        <>
                          <Loader className='mr-2 h-4 w-4' />
                          Verifying Subscription...
                        </>
                      ) : (
                        <>
                          <CheckCircle className='mr-2 h-4 w-4' />
                          Verify Subscription
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  <Alert className='border-green-200 bg-green-50'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <AlertDescription className='text-green-700'>
                      <div className='font-medium'>✓ Subscription Verified</div>
                      <div className='text-sm mt-1'>
                        Welcome,{" "}
                        <span className='font-semibold'>
                          {subscription?.userName}
                        </span>
                        ! Your subscription is valid for this zone.
                      </div>
                    </AlertDescription>
                  </Alert>

                  {!isZoneOpen ? (
                    <Alert className='border-destructive/30 bg-destructive/10'>
                      <XCircle className='h-4 w-4 text-destructive/90' />
                      <AlertDescription className='text-destructive'>
                        This zone is currently closed for new entries
                      </AlertDescription>
                    </Alert>
                  ) : !hasSubscriberAvailability ? (
                    <Alert className='border-chart-4/50 bg-chart-4/20'>
                      <AlertTriangle className='h-4 w-4 text-destructive/90' />
                      <AlertDescription className='text-destructive'>
                        No parking slots available for subscribers at this time
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className='space-y-3'>
                      <Button
                        onClick={handleSubscriberCheckin}
                        disabled={checkinMutation.isPending}
                        className='w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/80'
                        size='lg'
                      >
                        {checkinMutation.isPending ? (
                          <>
                            <Loader className='mr-2 h-5 w-5' />
                            Processing Check-in...
                          </>
                        ) : (
                          <>
                            <CheckCircle className='mr-2 h-5 w-5' />
                            Complete Check-in
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={resetSubscriberForm}
                        variant='outline'
                        className='w-full'
                      >
                        Verify Different Subscription
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Global Error Display */}
          {checkinMutation.error && (
            <Alert
              variant='destructive'
              className='mt-4 border-red-200 bg-red-50'
            >
              <AlertTriangle className='h-4 w-4 text-red-600' />
              <AlertDescription className='text-red-700'>
                <div className='font-medium'>Check-in Failed</div>
                <div className='text-sm mt-1'>
                  {checkinMutation.error instanceof Error
                    ? checkinMutation.error.message
                    : "An unexpected error occurred. Please try again."}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
