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
  Category,
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
  getCategories: () => apiClient.get<Category[]>("/master/categories"),
  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.put<Category>(`/admin/categories/${id}`, data),
  updateZoneStatus: (id: string, open: boolean) =>
    apiClient.put(`/admin/zones/${id}/open`, { open }),
  createRushHour: (data: { weekDay: number; from: string; to: string }) =>
    apiClient.post("/admin/rush-hours", data),
  createVacation: (data: { name: string; from: string; to: string }) =>
    apiClient.post("/admin/vacations", data),
  getSubscriptions: () => apiClient.get<Subscription[]>("/admin/subscriptions"),
};
