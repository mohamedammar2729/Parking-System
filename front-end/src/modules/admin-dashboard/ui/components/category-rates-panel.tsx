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
import { useCategories, useUpdateCategory } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  DollarSign,
  Edit,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

export const CategoryRatesPanel: React.FC = () => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    rateNormal: "",
    rateSpecial: "",
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const queryClient = useQueryClient();
  const { data: categories, isLoading, error, refetch } = useCategories();
  const updateCategoryMutation = useUpdateCategory();

  const handleEdit = (
    categoryId: string,
    currentNormal: number,
    currentSpecial: number
  ) => {
    setEditingCategory(categoryId);
    setEditForm({
      rateNormal: currentNormal.toString(),
      rateSpecial: currentSpecial.toString(),
    });
    setEditError(null);
    setEditSuccess(false);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      setEditError(null);
      setEditSuccess(false);

      const normalRate = parseFloat(editForm.rateNormal);
      const specialRate = parseFloat(editForm.rateSpecial);

      if (isNaN(normalRate) || isNaN(specialRate)) {
        setEditError("Please enter valid numbers for both rates");
        return;
      }

      if (normalRate < 0 || specialRate < 0) {
        setEditError("Rates cannot be negative");
        return;
      }

      await updateCategoryMutation.mutateAsync({
        id: editingCategory,
        data: {
          rateNormal: normalRate,
          rateSpecial: specialRate,
        },
      });

      // Refresh the categories list
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      setEditSuccess(true);

      // Close dialog after a brief delay
      setTimeout(() => {
        setEditingCategory(null);
        setEditSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      setEditError((err as Error).message || "Failed to update category rates");
    }
  };

  const resetEditForm = () => {
    setEditingCategory(null);
    setEditForm({ rateNormal: "", rateSpecial: "" });
    setEditError(null);
    setEditSuccess(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='w-5 h-5' />
            Category Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
            <p className='text-gray-500 mt-2'>Loading categories...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='w-5 h-5' />
            Category Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className='border-red-200 bg-red-50'>
            <AlertTriangle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-700'>
              Failed to load categories: {(error as Error).message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='shadow-sm border-slate-200 bg-white/80 backdrop-blur-sm'>
      <CardHeader className='bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200'>
        <div className='flex justify-between items-start'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-3 text-xl font-semibold text-slate-900'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Settings className='w-5 h-5 text-blue-600' />
              </div>
              Category Rates Management
            </CardTitle>
            <CardDescription className='text-slate-600'>
              Configure parking rates for different vehicle categories
            </CardDescription>
          </div>
          <Button
            onClick={() => refetch()}
            variant='outline'
            size='sm'
            className='gap-2 border-slate-300 hover:bg-slate-50'
          >
            <RefreshCw className='w-4 h-4' />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className='p-6'>
        {categories && categories.length > 0 ? (
          <div className='grid gap-6'>
            {categories.map((category) => (
              <div
                key={category.id}
                className='group relative p-6 border border-slate-200 rounded-xl bg-gradient-to-r from-white to-slate-50/50 hover:shadow-md transition-all duration-200'
              >
                {/* Category Header */}
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-slate-900 mb-1'>
                      {category.name}
                    </h3>
                    <p className='text-sm text-slate-500'>
                      Category ID: {category.id}
                    </p>
                  </div>

                  <Dialog
                    open={editingCategory === category.id}
                    onOpenChange={(open) => {
                      if (!open) resetEditForm();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          handleEdit(
                            category.id,
                            category.rateNormal,
                            category.rateSpecial
                          )
                        }
                        className='gap-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700'
                      >
                        <Edit className='w-4 h-4' />
                        Edit Rates
                      </Button>
                    </DialogTrigger>

                    <DialogContent className='sm:max-w-lg'>
                      <DialogHeader className='pb-4'>
                        <DialogTitle className='flex items-center gap-3 text-xl'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <Settings className='w-5 h-5 text-blue-600' />
                          </div>
                          Update Rates - {category.name}
                        </DialogTitle>
                      </DialogHeader>

                      <form
                        onSubmit={handleUpdateCategory}
                        className='space-y-6'
                      >
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label
                              htmlFor='rateNormal'
                              className='text-sm font-medium text-slate-700'
                            >
                              Normal Rate ($/hour)
                            </Label>
                            <div className='relative'>
                              <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
                              <Input
                                id='rateNormal'
                                type='number'
                                step='0.01'
                                min='0'
                                value={editForm.rateNormal}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    rateNormal: e.target.value,
                                  }))
                                }
                                placeholder='0.00'
                                className='pl-9'
                                required
                              />
                            </div>
                          </div>

                          <div className='space-y-2'>
                            <Label
                              htmlFor='rateSpecial'
                              className='text-sm font-medium text-slate-700'
                            >
                              Special Rate ($/hour)
                            </Label>
                            <div className='relative'>
                              <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
                              <Input
                                id='rateSpecial'
                                type='number'
                                step='0.01'
                                min='0'
                                value={editForm.rateSpecial}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    rateSpecial: e.target.value,
                                  }))
                                }
                                placeholder='0.00'
                                className='pl-9'
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {editError && (
                          <Alert className='border-red-200 bg-red-50'>
                            <AlertTriangle className='h-4 w-4 text-red-600' />
                            <AlertDescription className='text-red-700'>
                              {editError}
                            </AlertDescription>
                          </Alert>
                        )}

                        {editSuccess && (
                          <Alert className='border-green-200 bg-green-50'>
                            <CheckCircle className='h-4 w-4 text-green-600' />
                            <AlertDescription className='text-green-700'>
                              Rates updated successfully!
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className='flex gap-3 pt-4 border-t border-slate-200'>
                          <Button
                            type='submit'
                            disabled={
                              updateCategoryMutation.isPending || editSuccess
                            }
                            className='flex-1 bg-blue-600 hover:bg-blue-700'
                          >
                            {updateCategoryMutation.isPending
                              ? "Updating..."
                              : "Update Rates"}
                          </Button>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={resetEditForm}
                            disabled={updateCategoryMutation.isPending}
                            className='border-slate-300 hover:bg-slate-50'
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Rates Display */}
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-slate-600'>
                      <div className='p-1.5 bg-emerald-100 rounded-md'>
                        <DollarSign className='w-3 h-3 text-emerald-600' />
                      </div>
                      Normal Rate
                    </div>
                    <div className='text-2xl font-bold text-emerald-600'>
                      ${category.rateNormal.toFixed(2)}
                      <span className='text-sm font-normal text-slate-500 ml-1'>
                        /hour
                      </span>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-slate-600'>
                      <div className='p-1.5 bg-amber-100 rounded-md'>
                        <DollarSign className='w-3 h-3 text-amber-600' />
                      </div>
                      Special Rate
                    </div>
                    <div className='text-2xl font-bold text-amber-600'>
                      ${category.rateSpecial.toFixed(2)}
                      <span className='text-sm font-normal text-slate-500 ml-1'>
                        /hour
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rate Difference Indicator */}
                <div className='mt-4 pt-4 border-t border-slate-200'>
                  <div className='flex items-center justify-between text-xs text-slate-500'>
                    <span>Rate Difference:</span>
                    <span className='font-medium'>
                      $
                      {Math.abs(
                        category.rateSpecial - category.rateNormal
                      ).toFixed(2)}
                      {category.rateSpecial > category.rateNormal
                        ? " premium"
                        : " discount"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='p-4 bg-slate-100 rounded-full mb-4'>
              <Settings className='w-8 h-8 text-slate-400' />
            </div>
            <h3 className='text-lg font-semibold text-slate-900 mb-2'>
              No Categories Found
            </h3>
            <p className='text-slate-500 max-w-sm'>
              No parking categories are currently configured in the system.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
