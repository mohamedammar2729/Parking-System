"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";
import {
  authService,
  gateService,
  subscriptionService,
  ticketService,
  adminService,
} from "@/server/services";
import { useEffect } from "react";
import { setAuthToken } from "@/server/client";
import type { CheckinRequest, CheckoutRequest, Category } from "@/server/types";

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

export const useTicketById = (ticketId: string) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => ticketService.getTicketById(ticketId),
    enabled: !!ticketId,
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

// Admin API hooks
export const useParkingState = () => {
  return useQuery({
    queryKey: ["parking-state"],
    queryFn: adminService.getParkingState,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: adminService.getCategories,
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      adminService.updateCategory(id, data),
  });
};

export const useUpdateZoneStatus = () => {
  return useMutation({
    mutationFn: ({ id, open }: { id: string; open: boolean }) =>
      adminService.updateZoneStatus(id, open),
  });
};

export const useCreateRushHour = () => {
  return useMutation({
    mutationFn: adminService.createRushHour,
  });
};

export const useCreateVacation = () => {
  return useMutation({
    mutationFn: adminService.createVacation,
  });
};

export const useAllSubscriptions = () => {
  return useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: adminService.getSubscriptions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
