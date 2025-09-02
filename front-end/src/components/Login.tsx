/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "@/components/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/redux/auth/auth-slice";
import { useLogin } from "@/lib/api";
import { Alert, AlertDescription } from "./ui/alert";
import { usePathname, useRouter } from "next/navigation";

export const Login = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginMutation.mutateAsync(loginForm);
      dispatch(login(result));
      setError(null);

      // Navigate based on user role and current path
      if (result.user.role === "admin") {
        // If user is admin, go to admin dashboard
        router.push("/admin/dashboard");
      } else if (result.user.role === "employee") {
        // If user is employee, check current path
        if (pathname.startsWith("/checkpoint")) {
          // Stay on checkpoint if they're logging in from checkpoint
          router.push("/checkpoint");
        } else {
          // Otherwise go to employee page (or home)
          router.push("/employee");
        }
      } else {
        // Fallback to home
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <div className='flex items-center justify-center mb-2'></div>
          <CardTitle className='flex items-center justify-center gap-2 text-2xl'>
            {pathname.startsWith("/admin") ? "Admin" : "Employee"} Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Username</label>
              <Input
                className='border border-primary'
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder='Enter username'
                required
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Password</label>
              <Input
                className='border border-primary'
                type='password'
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder='Enter password'
                required
              />
            </div>
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type='submit'
              className='w-full'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            <div className='flex flex-col gap-2'>
              <Button
                asChild
                variant='outline'
                size='sm'
                className='w-full bg-transparent'
              >
                <Link href='/' className='flex items-center gap-2'>
                  <ArrowLeft className='h-4 w-4' />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
