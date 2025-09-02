"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { Login } from "@/components/Login";
import { CheckoutView } from "@/modules/checkpoint/ui/views/checkout-view";
import { CheckpointHeader } from "@/modules/checkpoint/ui/components/checkpoint-header";

const CheckpointPage = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Show login if not authenticated or not an employee
  if (!isAuthenticated || user?.role !== "employee") {
    return <Login />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <CheckpointHeader />

      {/* Main Content */}
      <main>
        <CheckoutView />
      </main>
    </div>
  );
};

export default CheckpointPage;
