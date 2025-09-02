"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTicketById, useCheckout, useSubscription } from "@/lib/api";
import {
  QrCode,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Car,
  User,
  CreditCard,
  RefreshCw,
  Scan,
  MapPin,
} from "lucide-react";
import type { CheckoutResponse } from "@/server/types";

export const CheckoutView: React.FC = () => {
  const [ticketId, setTicketId] = useState("");
  const [searchedTicketId, setSearchedTicketId] = useState("");
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(
    null
  );
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ticket data when searching
  const {
    data: ticket,
    isLoading: isLoadingTicket,
    error: ticketError,
  } = useTicketById(searchedTicketId);

  // For subscriber tickets, we need to manually enter subscription ID for verification
  const [subscriptionId, setSubscriptionId] = useState("");
  const { data: subscription } = useSubscription(subscriptionId);

  // Checkout mutation
  const checkoutMutation = useCheckout();

  const handleSearch = () => {
    if (!ticketId.trim()) {
      setError("Please enter a ticket ID");
      return;
    }
    setSearchedTicketId(ticketId.trim());
    setCheckoutResult(null);
    setError(null);
    setSubscriptionId(""); // Reset subscription ID when searching new ticket
  };

  const handleCheckout = async (forceConvertToVisitor = false) => {
    try {
      setError(null);
      setIsConverting(forceConvertToVisitor);
      const result = await checkoutMutation.mutateAsync({
        ticketId: searchedTicketId,
        forceConvertToVisitor,
      });
      setCheckoutResult(result);
      // Clear the search form for next ticket
      setTicketId("");
      setSearchedTicketId("");
      setSubscriptionId("");
    } catch (err: unknown) {
      setError((err as Error).message || "Checkout failed");
    } finally {
      setIsConverting(false);
    }
  };

  const handleNewTicket = () => {
    setTicketId("");
    setSearchedTicketId("");
    setCheckoutResult(null);
    setSubscriptionId("");
    setError(null);
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const renderSubscriptionInfo = () => {
    if (ticket?.type !== "subscriber") return null;

    return (
      <Card className='mt-4 border-blue-200 bg-blue-50'>
        <CardHeader>
          <CardTitle className='text-blue-700 flex items-center gap-2'>
            <User className='w-5 h-5' />
            Subscription Verification Required
          </CardTitle>
          <CardDescription>
            Enter the subscription ID to verify license plates for comparison
            with the vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <Label
                htmlFor='subscription-id'
                className='text-sm font-medium mb-2'
              >
                Subscription ID
              </Label>
              <Input
                id='subscription-id'
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
                placeholder='Enter subscription ID to verify vehicle'
                className='font-mono'
              />
            </div>

            {subscription && (
              <div className='mt-4 p-4 bg-white rounded-lg border border-blue-200'>
                <h4 className='font-semibold text-gray-900 mb-3'>
                  Subscription Details
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='font-medium text-gray-700 mb-1'>
                      Subscription ID:
                    </p>
                    <p className='font-mono text-gray-900'>{subscription.id}</p>
                  </div>
                  <div>
                    <p className='font-medium text-gray-700 mb-1'>Status:</p>
                    <Badge
                      variant={subscription.active ? "default" : "destructive"}
                    >
                      {subscription.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <p className='font-medium text-gray-700 mb-1'>Category:</p>
                    <p className='text-gray-900'>{subscription.category}</p>
                  </div>
                  <div>
                    <p className='font-medium text-gray-700 mb-1'>
                      Registered License Plates:
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {subscription.cars?.length > 0 ? (
                        subscription.cars.map((car, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='font-mono text-gray-900 bg-white'
                          >
                            {car.plate}
                          </Badge>
                        ))
                      ) : (
                        <span className='text-gray-500 text-sm'>
                          No plates registered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Alert className='border-orange-200 bg-orange-50'>
              <AlertTriangle className='h-4 w-4 text-orange-600' />
              <AlertDescription className='text-orange-700'>
                <strong>Manual Verification Required:</strong> Please physically
                check that the vehicle&apos;s license plate matches one of the
                plates listed above. If there&apos;s a mismatch or you cannot
                verify the plate, you can convert this checkout to visitor
                billing instead.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCheckoutResult = () => {
    if (!checkoutResult) return null;

    return (
      <div className='mt-6 space-y-4'>
        <Card className='border-green-200 bg-green-50'>
          <CardHeader>
            <CardTitle className='text-green-700 flex items-center gap-2'>
              <CheckCircle className='w-5 h-5' />
              Checkout Completed Successfully
            </CardTitle>
            <CardDescription>
              Ticket {checkoutResult.ticketId} has been processed and payment is
              due
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Timing Information */}
              <div>
                <h4 className='font-semibold mb-3 flex items-center gap-2 text-gray-900'>
                  <Clock className='w-4 h-4' />
                  Parking Duration
                </h4>
                <div className='space-y-3 text-sm'>
                  <div className='p-3 bg-white rounded border'>
                    <span className='font-medium text-gray-700'>
                      Check-in Time:
                    </span>
                    <p className='text-gray-900'>
                      {formatDateTime(checkoutResult.checkinAt)}
                    </p>
                  </div>
                  <div className='p-3 bg-white rounded border'>
                    <span className='font-medium text-gray-700'>
                      Check-out Time:
                    </span>
                    <p className='text-gray-900'>
                      {formatDateTime(checkoutResult.checkoutAt)}
                    </p>
                  </div>
                  <div className='p-3 bg-white rounded border'>
                    <span className='font-medium text-gray-700'>
                      Total Duration:
                    </span>
                    <p className='text-xl font-bold text-gray-900'>
                      {checkoutResult.durationHours.toFixed(2)} hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className='font-semibold mb-3 flex items-center gap-2 text-gray-900'>
                  <DollarSign className='w-4 h-4' />
                  Payment Breakdown
                </h4>
                <div className='space-y-3'>
                  {checkoutResult.breakdown.map((segment, index) => (
                    <div key={index} className='p-3 bg-white rounded border'>
                      <div className='flex justify-between items-center mb-2'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium text-gray-900'>
                            {segment.hours.toFixed(2)} hours
                          </span>
                          <Badge
                            variant={
                              segment.rateMode === "special"
                                ? "destructive"
                                : "outline"
                            }
                            className='text-xs'
                          >
                            {segment.rateMode} rate
                          </Badge>
                        </div>
                        <span className='font-bold text-gray-900'>
                          {formatCurrency(segment.amount)}
                        </span>
                      </div>
                      <div className='text-xs text-gray-600'>
                        ${segment.rate}/hour
                      </div>
                    </div>
                  ))}
                  <Separator className='my-3' />
                  <div className='p-4 bg-white rounded border-2 border-green-200'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-bold text-gray-900'>
                        Total Amount Due:
                      </span>
                      <span className='text-2xl font-bold text-green-600'>
                        {formatCurrency(checkoutResult.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-6 pt-4 border-t'>
              <Button onClick={handleNewTicket} className='gap-2' size='lg'>
                <Scan className='w-4 h-4' />
                Process Next Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Parking Checkout Station
        </h1>
      </div>

      {/* Show checkout result first if available */}
      {renderCheckoutResult()}

      {/* Only show the search form if no checkout result is displayed */}
      {!checkoutResult && (
        <>
          {/* Ticket Search */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <QrCode className='w-5 h-5' />
                Scan or Enter Parking Ticket
              </CardTitle>
              <CardDescription>
                Scan the QR code from the parking ticket or manually enter the
                ticket ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex gap-3'>
                <div className='flex-1'>
                  <Label
                    htmlFor='ticket-id'
                    className='text-sm font-medium mb-2'
                  >
                    Ticket ID
                  </Label>
                  <Input
                    id='ticket-id'
                    value={ticketId}
                    onChange={(e) => {
                      setTicketId(e.target.value);
                      // Clear previous search when user starts typing
                      if (searchedTicketId) {
                        setSearchedTicketId("");
                      }
                    }}
                    placeholder='Enter ticket ID or scan QR code'
                    className='font-mono text-lg py-3'
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    autoFocus
                  />
                  {/* Show invalid ticket ID error */}
                  {searchedTicketId &&
                    !isLoadingTicket &&
                    !ticket &&
                    ticketError && (
                      <p className='text-red-600 text-sm mt-1'>
                        Invalid ticket ID
                      </p>
                    )}
                </div>
                <div className='self-end'>
                  <Button
                    onClick={handleSearch}
                    disabled={isLoadingTicket || !ticketId.trim()}
                    size='lg'
                    className='gap-2 px-6'
                  >
                    {isLoadingTicket ? (
                      <RefreshCw className='w-4 h-4 animate-spin' />
                    ) : (
                      <Scan className='w-4 h-4' />
                    )}
                    {isLoadingTicket ? "Searching..." : "Lookup Ticket"}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className='mt-4 border-red-200 bg-red-50'>
                  <AlertTriangle className='h-4 w-4 text-red-600' />
                  <AlertDescription className='text-red-700'>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Ticket Information */}
          {ticket && (
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Car className='w-5 h-5' />
                  Ticket Information
                </CardTitle>
                <CardDescription>
                  Review ticket details before processing checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h4 className='font-semibold mb-3 text-gray-900'>
                      Ticket Details
                    </h4>
                    <div className='space-y-3'>
                      <div className='p-3 bg-gray-50 rounded'>
                        <span className='font-medium text-gray-700 text-sm'>
                          Ticket ID:
                        </span>
                        <p className='font-mono text-lg text-gray-900'>
                          {ticket.id}
                        </p>
                      </div>
                      <div className='p-3 bg-gray-50 rounded'>
                        <span className='font-medium text-gray-700 text-sm'>
                          Ticket Type:
                        </span>
                        <div className='mt-1'>
                          <Badge
                            variant={
                              ticket.type === "visitor"
                                ? "default"
                                : "secondary"
                            }
                            className='text-sm px-3 py-1'
                          >
                            {ticket.type === "visitor"
                              ? "Visitor Parking"
                              : "Subscriber Parking"}
                          </Badge>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='p-3 bg-gray-50 rounded'>
                          <span className='font-medium text-gray-700 text-sm flex items-center gap-1'>
                            <MapPin className='w-3 h-3' />
                            Zone:
                          </span>
                          <p className='text-gray-900'>{ticket.zoneId}</p>
                        </div>
                        <div className='p-3 bg-gray-50 rounded'>
                          <span className='font-medium text-gray-700 text-sm'>
                            Gate:
                          </span>
                          <p className='text-gray-900'>{ticket.gateId}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className='font-semibold mb-3 text-gray-900'>
                      Parking Status
                    </h4>
                    <div className='space-y-3'>
                      <div className='p-3 bg-gray-50 rounded'>
                        <span className='font-medium text-gray-700 text-sm'>
                          Check-in Time:
                        </span>
                        <p className='text-gray-900'>
                          {formatDateTime(ticket.checkinAt)}
                        </p>
                      </div>
                      <div className='p-3 bg-gray-50 rounded'>
                        <span className='font-medium text-gray-700 text-sm'>
                          Current Status:
                        </span>
                        <div className='mt-1'>
                          <Badge
                            variant={
                              ticket.checkoutAt ? "destructive" : "default"
                            }
                            className='text-sm px-3 py-1'
                          >
                            {ticket.checkoutAt
                              ? "Already Checked Out"
                              : "Currently Parked"}
                          </Badge>
                        </div>
                      </div>
                      {ticket.checkoutAt && (
                        <div className='p-3 bg-red-50 rounded border-red-200'>
                          <span className='font-medium text-red-700 text-sm'>
                            Previous Check-out:
                          </span>
                          <p className='text-red-900'>
                            {formatDateTime(ticket.checkoutAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!ticket.checkoutAt && (
                  <div className='mt-6 pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg'>
                    <div className='flex flex-wrap gap-3'>
                      <Button
                        onClick={() => handleCheckout(false)}
                        disabled={checkoutMutation.isPending}
                        size='lg'
                        className='gap-2 flex-1 min-w-fit'
                      >
                        <CreditCard className='w-4 h-4' />
                        {checkoutMutation.isPending && !isConverting
                          ? "Processing Checkout..."
                          : "Process Checkout"}
                      </Button>

                      {ticket.type === "subscriber" && (
                        <Button
                          variant='outline'
                          onClick={() => handleCheckout(true)}
                          disabled={checkoutMutation.isPending}
                          size='lg'
                          className='gap-2 border-orange-300 text-orange-700 hover:bg-orange-50'
                        >
                          <AlertTriangle className='w-4 h-4' />
                          {isConverting
                            ? "Converting to Visitor..."
                            : "Convert to Visitor"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {ticket.checkoutAt && (
                  <div className='mt-6 pt-4 border-t'>
                    <Alert className='border-red-200 bg-red-50'>
                      <AlertTriangle className='h-4 w-4 text-red-600' />
                      <AlertDescription className='text-red-700'>
                        <strong>Warning:</strong> This ticket has already been
                        checked out. Please verify with the customer or scan a
                        different ticket.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Subscription Information (if applicable) */}
          {renderSubscriptionInfo()}
        </>
      )}
    </div>
  );
};
