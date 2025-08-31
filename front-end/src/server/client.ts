/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api/v1";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage) as any;
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json")
    ? response.json()
    : response.text();
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    return await handleResponse(response);
  } catch (error: any) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      toast.error("Network error. Please check your connection.");
      throw new Error("Network error. Please check your connection.");
    }

    if (!error.status || error.status >= 500) {
      toast.error("An unexpected error occurred. Please try again.");
    }

    throw error;
  }
};

export const apiClient = {
  get: <T>(endpoint: string): Promise<T> => request(endpoint),
  post: <T>(endpoint: string, data?: any): Promise<T> =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data?: any): Promise<T> =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string): Promise<T> =>
    request(endpoint, { method: "DELETE" }),
};
