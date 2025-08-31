"use client";

import { useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";
import { authService } from "@/server/services";
import { useEffect } from "react";
import { setAuthToken } from "@/server/client";

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
