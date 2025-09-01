import { apiClient } from "./client";
import type {
  LoginResponse,
  Gate,
  Zone,
  Subscription,
  CheckinRequest,
  CheckinResponse,
  CheckoutRequest,
  CheckoutResponse,
} from "./types";

export const authService = {
  login: (username: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { username, password }),
};

export const gateService = {
  getGates: () => apiClient.get<Gate[]>("/master/gates"),
  getZonesByGate: (gateId: string) =>
    apiClient.get<Zone[]>(`/master/zones?gateId=${gateId}`),
};

export const subscriptionService = {
  getSubscription: (id: string) =>
    apiClient.get<Subscription>(`/subscriptions/${id}`),
};

export const ticketService = {
  checkin: (data: CheckinRequest) =>
    apiClient.post<CheckinResponse>("/tickets/checkin", data),
  checkout: (data: CheckoutRequest) =>
    apiClient.post<CheckoutResponse>("/tickets/checkout", data),
};
