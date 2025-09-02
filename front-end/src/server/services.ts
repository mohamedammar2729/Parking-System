import { apiClient } from "./client";
import type {
  LoginResponse,
  Gate,
  Zone,
  Subscription,
  Ticket,
  CheckinRequest,
  CheckinResponse,
  CheckoutRequest,
  CheckoutResponse,
  ParkingStateReport,
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
  getTicketById: (id: string) => apiClient.get<Ticket>(`/tickets/${id}`),
};

export const adminService = {
  getParkingState: () =>
    apiClient.get<ParkingStateReport[]>("/admin/reports/parking-state"),
};
