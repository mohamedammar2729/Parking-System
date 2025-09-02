"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, AlertTriangle } from "lucide-react";

export const EmployeesPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Users className='w-5 h-5' />
          Employee Management
        </CardTitle>
        <CardDescription>
          Manage employee accounts and permissions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Alert className='border-orange-200 bg-orange-50'>
          <AlertTriangle className='h-4 w-4 text-orange-600' />
          <AlertDescription className='text-orange-700'>
            <strong>Feature Not Available:</strong> The backend does not
            currently support employee management endpoints (GET /admin/users,
            POST /admin/users). This feature requires backend implementation of
            user management APIs as specified in the Task.md requirements.
          </AlertDescription>
        </Alert>

        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <h4 className='font-medium text-blue-900 mb-2'>
            Required Backend Endpoints
          </h4>
          <ul className='text-sm text-blue-700 space-y-1'>
            <li>
              • <code>GET /admin/users</code> - List all employee accounts
            </li>
            <li>
              • <code>POST /admin/users</code> - Create new employee accounts
            </li>
          </ul>
          <p className='text-sm text-blue-600 mt-2'>
            Once these endpoints are implemented in the backend, this panel will
            provide full employee management functionality.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
