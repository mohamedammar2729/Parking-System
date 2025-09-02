"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { Login } from "@/components/Login";
import AdminView from "@/modules/admin-dashboard/ui/views/admin-view";

const AdminDashboardPage = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Show login if not authenticated or not an admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Login />;
  }

  return <AdminView />;
};

export default AdminDashboardPage;
