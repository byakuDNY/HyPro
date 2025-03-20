"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { forgotPasswordSchema } from "@/features/auth/zod-schema";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    await authClient.forgetPassword(
      {
        email: values.email,
        redirectTo: "/reset-password",
      },
      {
        onSuccess: () => {
          showToast(
            "success",
            "If an account exists with this email, you will receive a password reset link.",
          );
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className="card-container">
      <CardHeader className="card-header">
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription className="card-description">
          Enter your email address and we will send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      autoComplete="email"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              isLoading={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              Send Reset Link
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
