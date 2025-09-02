"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useGateNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Navigate back with intelligent fallback
  const navigateBack = useCallback(() => {
    // If we're in a gate page, try to go back
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // Fallback to employee page or home
      if (pathname.includes("/gate")) {
        router.push("/employee");
      } else {
        router.push("/");
      }
    }
  }, [router, pathname]);

  // Navigate to home with user-specific logic
  const navigateHome = useCallback(() => {
    // Determine appropriate home based on current context
    if (pathname.includes("/admin")) {
      router.push("/admin");
    } else if (pathname.includes("/employee")) {
      router.push("/employee");
    } else if (pathname.includes("/gate")) {
      router.push("/employee"); // Gates are typically accessed by employees
    } else {
      router.push("/");
    }
  }, [router, pathname]);

  // Quick access to specific sections
  const navigateToEmployee = useCallback(() => {
    router.push("/employee");
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
    navigateToEmployee,
    navigateToAdmin,
    navigateToGate,
    navigateToCheckpoint,
    isGatePage,
    isAdminPage,
    isCheckpointPage,
    currentPath: pathname,
  };
};
