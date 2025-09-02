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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateRushHour } from "@/lib/api";
import { Clock, Plus, AlertTriangle, CheckCircle } from "lucide-react";

const WEEKDAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const RushHoursPanel: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    weekDay: "",
    from: "",
    to: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const createRushHourMutation = useCreateRushHour();

  const handleCreateRushHour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateError(null);
      setCreateSuccess(false);

      // Validate inputs
      if (!createForm.weekDay || !createForm.from || !createForm.to) {
        setCreateError("All fields are required");
        return;
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(createForm.from) || !timeRegex.test(createForm.to)) {
        setCreateError("Time must be in HH:MM format (24-hour)");
        return;
      }

      // Validate that 'from' time is before 'to' time
      if (createForm.from >= createForm.to) {
        setCreateError("Start time must be before end time");
        return;
      }

      await createRushHourMutation.mutateAsync({
        weekDay: parseInt(createForm.weekDay),
        from: createForm.from,
        to: createForm.to,
      });

      // Reset form and show success
      setCreateForm({ weekDay: "", from: "", to: "" });
      setCreateSuccess(true);

      // Close dialog after a brief delay
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        setCreateSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      setCreateError((err as Error).message || "Failed to create rush hour");
    }
  };

  const resetCreateForm = () => {
    setCreateForm({ weekDay: "", from: "", to: "" });
    setCreateError(null);
    setCreateSuccess(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>Rush Hours Management</CardTitle>
            <CardDescription>
              Add rush hour windows when special rates apply
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
                Add Rush Hour
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Add Rush Hour Window</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateRushHour} className='space-y-4'>
                <div>
                  <Label className='mb-2' htmlFor='weekDay'>
                    Day of Week
                  </Label>
                  <Select
                    value={createForm.weekDay}
                    onValueChange={(value) =>
                      setCreateForm((prev) => ({ ...prev, weekDay: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select day' />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map((day) => (
                        <SelectItem
                          key={day.value}
                          value={day.value.toString()}
                        >
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className='mb-2' htmlFor='from'>
                    Start Time (24-hour format)
                  </Label>
                  <Input
                    id='from'
                    type='time'
                    value={createForm.from}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    placeholder='HH:MM'
                    required
                  />
                  <p className='text-xs text-foreground/80 mt-1'>
                    Format: HH:MM (e.g., 08:00)
                  </p>
                </div>

                <div>
                  <Label className='mb-2' htmlFor='to'>
                    End Time (24-hour format)
                  </Label>
                  <Input
                    id='to'
                    type='time'
                    value={createForm.to}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, to: e.target.value }))
                    }
                    placeholder='HH:MM'
                    required
                  />
                  <p className='text-xs text-foreground/80 mt-1'>
                    Format: HH:MM (e.g., 18:00)
                  </p>
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
                      Rush hour created successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <div className='flex gap-2 pt-4'>
                  <Button
                    type='submit'
                    disabled={createRushHourMutation.isPending || createSuccess}
                    className='flex-1'
                  >
                    {createRushHourMutation.isPending
                      ? "Creating..."
                      : "Create Rush Hour"}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createRushHourMutation.isPending}
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
          <Clock className='w-12 h-12 text-foreground mx-auto mb-4' />
          <p className='text-accent-foreground mb-1'>
            Rush hours will be displayed here after creation
          </p>
          <p className='text-sm text-foreground/70'>
            During rush hours, special rates will be applied to all parking
            categories
          </p>
        </div>

        <div className='mt-6 p-4 bg-background border rounded-lg'>
          <h4 className='font-medium text-accent-foreground mb-2'>
            About Rush Hours
          </h4>
          <ul className='text-sm text-foreground/80 space-y-1'>
            <li>
              • Rush hours apply special (higher) rates during busy periods
            </li>
            <li>• You can set different rush hours for each day of the week</li>
            <li>• Times are in 24-hour format (e.g., 08:00 for 8:00 AM)</li>
            <li>• Multiple rush hour windows can be added for the same day</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
