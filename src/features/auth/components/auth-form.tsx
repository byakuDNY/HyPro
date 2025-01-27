"use client";

import Link from "next/link";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  const baseSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  });

  return formType === "sign-up"
    ? baseSchema
        .extend({
          name: z
            .string()
            .min(2, { message: "Name must be at least 2 characters long" })
            .max(50, { message: "Name must be less than 50 characters long" }),
          confirmPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." }),
          terms: z.boolean().refine((data) => data === true, {
            message: "You must agree to the terms and conditions.",
          }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
    : baseSchema;
};

const AuthForm = ({ type }: { type: FormType }) => {
  const authContext = (type: FormType) => ({
    onRequest: () => {
      toast({
        title: `Signing ${type === "sign-up" ? "up" : "in"}...`,
        description: "Please wait",
      });
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Success",
        description: `You have successfully signed ${type === "sign-up" ? "up" : "in"}`,
      });
    },
    onError: (ctx: any) => {
      toast({
        title: "Error",
        description: ctx.error.message,
        variant: "destructive",
      });
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "sign-up"
        ? {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }
        : { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error } =
        type === "sign-up"
          ? await authClient.signUp.email(
              {
                name: values.name ?? "",
                email: values.email,
                password: values.password,
                callbackURL: "/dashboard",
              },
              authContext(type),
            )
          : await authClient.signIn.email(
              {
                email: values.email,
                password: values.password,
                callbackURL: "/dashboard",
              },
              authContext(type),
            );
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const signInWithGithub = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "GitHub Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {type === "sign-up" ? "Sign Up" : "Sign In"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === "sign-up" && (
              <>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm your password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal text-muted-foreground">
                          By registering, you agree that you have read,
                          understand, and acknowledge our{" "}
                          <Link
                            href="/privacy"
                            className="text-foreground underline underline-offset-4 hover:text-primary"
                          >
                            Privacy Policy
                          </Link>{" "}
                          and accept our{" "}
                          <Link
                            href="/terms"
                            className="text-foreground underline underline-offset-4 hover:text-primary"
                          >
                            General Terms of Use
                          </Link>
                          .
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : type === "sign-up" ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative mb-2 mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary-foreground"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <section className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full border-secondary-foreground"
            onClick={signInWithGithub}
          >
            <Github className="mr-2 h-4 w-4" />
            {type === "sign-up" ? "Sign Up with Github" : "Sign In with Github"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full border-secondary-foreground"
            onClick={signInWithGoogle}
          >
            <Github className="mr-2 h-4 w-4" />
            {type === "sign-up" ? "Sign Up with Google" : "Sign In with Google"}
          </Button>
        </section>

        <p className="mt-4 text-center text-sm">
          {type === "sign-up"
            ? "Already have an account?"
            : "Don't have an account?"}
          <Link
            href={type === "sign-up" ? "/sign-in" : "/sign-up"}
            className="ml-1 font-medium text-primary hover:underline"
          >
            {type === "sign-up" ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
