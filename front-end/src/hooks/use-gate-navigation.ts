"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useGateNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Navigate back with intelligent fallback
  const navigateBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  // Navigate to home with user-specific logic
  const navigateHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const navigateToAdmin = useCallback(() => {
    router.push("/admin");
  }, [router]);

  const navigateToGate = useCallback(
    (gateId?: string) => {
      if (gateId) {
        router.push(`/gate?id=${gateId}`);
      } else {
        router.push("/gate");
      }
    },
    [router]
  );

  const navigateToCheckpoint = useCallback(() => {
    router.push("/checkpoint");
  }, [router]);

  // Check current page context
  const isGatePage = pathname.includes("/gate");
  const isAdminPage = pathname.includes("/admin");
  const isCheckpointPage = pathname.includes("/checkpoint");

  return {
    navigateBack,
    navigateHome,
    navigateToAdmin,
    navigateToGate,
    navigateToCheckpoint,
    isGatePage,
    isAdminPage,
    isCheckpointPage,
    currentPath: pathname,
  };
};
