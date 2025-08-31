import { apiClient } from "./client";
import type { LoginResponse } from "./types";

export const authService = {
  login: (username: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { username, password }),
};
