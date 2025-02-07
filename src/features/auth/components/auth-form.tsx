"use client";

import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Github, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import LoadingButton from "@/components/loading-button";
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
import { authFormSchema } from "@/features/auth/zod-schema";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";

export type FormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    void authClient.signIn.passkey({ autoFill: true });
  }, []);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<ReturnType<typeof authFormSchema>>>({
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

    type === "sign-up"
      ? await authClient.signUp.email(
          {
            name: "name" in values ? (values.name ?? "") : "",
            email: values.email,
            password: values.password,
          },
          {
            onSuccess: () => {
              form.reset();
              toast({
                title: "Account created",
                description:
                  "Check your email for a confirmation link. If you don't receive an email, please check your spam folder.",
              });
            },
            onError: (ctx: any) => {
              toast({
                title: "Error",
                description: ctx.error.message,
                variant: "destructive",
              });
            },
          },
        )
      : await authClient.signIn.email(
          {
            email: values.email,
            password: values.password,
            callbackURL: "/dashboard",
          },
          {
            onError: (ctx: any) => {
              toast({
                title: "Error",
                description: ctx.error.message,
                variant: "destructive",
              });
            },
          },
        );

    setIsLoading(false);
  }

  const signInWithGithub = async () => {
    setIsLoading(true);
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx: any) => {
          toast({
            title: "GitHub Sign-In Failed",
            description: ctx.error.message,
            variant: "destructive",
          });
        },
      },
    );
    setIsLoading(false);
  };

  const signInWithPasskey = async () => {
    setIsLoading(true);
    // await authClient.signIn.passkey({
    //   onSuccess: () => {
    //     router.push("/dashboard");
    //   },
    //   onError: (ctx: any) => {
    //     toast({
    //       title: "Passkey Sign-In Failed",
    //       description: ctx.error.message,
    //       variant: "destructive",
    //     });
    //   },
    // });
    await authClient.signIn.passkey({
      fetchOptions: {
        onSuccess() {
          router.push("/dashboard");
        },
        onError(ctx) {
          toast({
            title: "Passkey Sign-In Failed",
            description: ctx.error.message,
            variant: "destructive",
          });
        },
      },
    });
    setIsLoading(false);
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
          <form
            onChange={() => {
              console.log(form.formState.errors);
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        type="text"
                      />
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
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                    />
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
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        placeholder="Enter your password"
                        autoComplete={"webauthn"}
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

            {type == "sign-in" && (
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    onClick={() => {
                      // setRememberMe(!rememberMe);
                    }}
                  />

                  <FormLabel htmlFor="remember">Remember me</FormLabel>
                </div>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            {type === "sign-up" && (
              <>
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
                            placeholder="Confirm your password"
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
                              <EyeOffIcon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
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
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
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

            <LoadingButton isLoading={isLoading} className="w-full">
              {type === "sign-up" ? "Create Account" : "Sign In"}
            </LoadingButton>
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
          <LoadingButton
            isLoading={isLoading}
            onClick={signInWithGithub}
            className="w-full border-secondary-foreground"
            type="button"
            variant="outline"
          >
            <Github className="mr-2 h-4 w-4" />
            {type === "sign-up" ? "Sign Up with Github" : "Sign In with Github"}
          </LoadingButton>

          <LoadingButton
            isLoading={isLoading}
            className="w-full border-secondary-foreground"
            onClick={signInWithPasskey}
            type="button"
            variant="outline"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {type === "sign-up"
              ? "Sign Up with Passkey"
              : "Sign In with Passkey"}
          </LoadingButton>
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
