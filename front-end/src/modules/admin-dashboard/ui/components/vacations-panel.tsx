"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateVacation } from "@/lib/api";
import { Calendar, Plus, AlertTriangle, CheckCircle } from "lucide-react";

export const VacationsPanel: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    from: "",
    to: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const createVacationMutation = useCreateVacation();

  const handleCreateVacation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateError(null);
      setCreateSuccess(false);

      // Validate inputs
      if (!createForm.name.trim() || !createForm.from || !createForm.to) {
        setCreateError("All fields are required");
        return;
      }

      // Validate that 'from' date is before or equal to 'to' date
      if (createForm.from > createForm.to) {
        setCreateError("Start date must be before or equal to end date");
        return;
      }

      await createVacationMutation.mutateAsync({
        name: createForm.name.trim(),
        from: createForm.from,
        to: createForm.to,
      });

      // Reset form and show success
      setCreateForm({ name: "", from: "", to: "" });
      setCreateSuccess(true);

      // Close dialog after a brief delay
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        setCreateSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      setCreateError(
        (err as Error).message || "Failed to create vacation period"
      );
    }
  };

  const resetCreateForm = () => {
    setCreateForm({ name: "", from: "", to: "" });
    setCreateError(null);
    setCreateSuccess(false);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='w-5 h-5' />
              Vacation Periods Management
            </CardTitle>
            <CardDescription>
              Add vacation periods when special rates apply
            </CardDescription>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) resetCreateForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <Plus className='w-4 h-4' />
                Add Vacation Period
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  <Calendar className='w-5 h-5' />
                  Add Vacation Period
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateVacation} className='space-y-4'>
                <div>
                  <Label htmlFor='name'>Vacation Name</Label>
                  <Input
                    id='name'
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder='e.g., Christmas Holiday, Summer Break'
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='from'>Start Date</Label>
                  <Input
                    id='from'
                    type='date'
                    value={createForm.from}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    min={today}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='to'>End Date</Label>
                  <Input
                    id='to'
                    type='date'
                    value={createForm.to}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, to: e.target.value }))
                    }
                    min={createForm.from || today}
                    required
                  />
                </div>

                {createError && (
                  <Alert className='border-red-200 bg-red-50'>
                    <AlertTriangle className='h-4 w-4 text-red-600' />
                    <AlertDescription className='text-red-700'>
                      {createError}
                    </AlertDescription>
                  </Alert>
                )}

                {createSuccess && (
                  <Alert className='border-green-200 bg-green-50'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <AlertDescription className='text-green-700'>
                      Vacation period created successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <div className='flex gap-2 pt-4'>
                  <Button
                    type='submit'
                    disabled={createVacationMutation.isPending || createSuccess}
                    className='flex-1'
                  >
                    {createVacationMutation.isPending
                      ? "Creating..."
                      : "Create Vacation"}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createVacationMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className='text-center py-8'>
          <Calendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-500 mb-4'>
            Vacation periods will be displayed here after creation
          </p>
          <p className='text-sm text-gray-400'>
            During vacation periods, special rates will be applied to all
            parking categories
          </p>
        </div>

        <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
          <h4 className='font-medium text-green-900 mb-2'>
            About Vacation Periods
          </h4>
          <ul className='text-sm text-green-700 space-y-1'>
            <li>
              • Vacation periods apply special (higher) rates during holidays
            </li>
            <li>• These rates override normal and rush hour rates</li>
            <li>• Vacation periods can span multiple days or weeks</li>
            <li>• Common examples: Christmas, New Year, Summer holidays</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
