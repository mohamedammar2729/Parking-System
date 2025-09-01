"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";
import {
  authService,
  gateService,
  subscriptionService,
  ticketService,
} from "@/server/services";
import { useEffect } from "react";
import { setAuthToken } from "@/server/client";
import type { CheckinRequest, CheckoutRequest } from "@/server/types";

export const useApiToken = () => {
  const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    setAuthToken(token);
  }, [token]);
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      authService.login(credentials.username, credentials.password),
  });
};

// Gate API hooks
export const useGates = () => {
  return useQuery({
    queryKey: ["gates"],
    queryFn: gateService.getGates,
  });
};

export const useZonesByGate = (gateId: string) => {
  return useQuery({
    queryKey: ["zones", gateId],
    queryFn: () => gateService.getZonesByGate(gateId),
    enabled: !!gateId,
  });
};

export const useSubscription = (subscriptionId: string) => {
  return useQuery({
    queryKey: ["subscription", subscriptionId],
    queryFn: () => subscriptionService.getSubscription(subscriptionId),
    enabled: !!subscriptionId,
    retry: false,
  });
};

export const useCheckin = () => {
  return useMutation({
    mutationFn: (data: CheckinRequest) => ticketService.checkin(data),
  });
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: (data: CheckoutRequest) => ticketService.checkout(data),
  });
};
