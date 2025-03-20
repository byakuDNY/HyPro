"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import LoadingButton from "@/components/loading-button";
// Component with useSearchParams hook
import LoadingUi from "@/components/loading-ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/features/auth/zod-schema";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";

// Main wrapper component with Suspense
const ResetPassword = () => {
  return (
    <Suspense fallback={<LoadingUi />}>
      <ResetPasswordForm />
    </Suspense>
  );
};

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Validating the token and error search parameters
  const error = searchParams.get("error");
  const token = searchParams.get("token");

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    await authClient.resetPassword(
      {
        newPassword: values.password,
        token: token!,
      },
      {
        onSuccess: () => {
          router.push("/sign-in");
          showToast("success", "Password Reset Successfully");
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
      },
    );
  };

  if (error === "INVALID_TOKEN" || !token) {
    return (
      <Card className="card-container">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive">
              Invalid Reset Link
            </CardTitle>
          </div>
          <CardDescription>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Please check your email for a reset link or try again.
          </p>
        </CardContent>

        <CardFooter>
          <Link href="/sign-up" className="w-full" prefetch>
            <Button variant="outline" className="w-full">
              Go to sign up
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="card-container">
      <CardHeader className="card-header">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription className="card-description">
          Enter new password and confirm it to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Your form fields remain the same */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        disabled={form.formState.isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        disabled={form.formState.isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              isLoading={form.formState.isSubmitting}
              className="w-full"
            >
              Reset Password
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
