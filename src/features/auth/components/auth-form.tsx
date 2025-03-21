"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, KeyRound } from "lucide-react";
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
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";

export type FormType = "SIGN_IN" | "SIGN_UP";

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignUp = type === "SIGN_UP";

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    authClient.oneTap(
      {
        onPromptNotification(notification) {
          console.warn(
            "Prompt was dismissed or skipped. Consider displaying an alternative sign-in option.",
            notification,
          );
        },
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  }, [router]);

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
    defaultValues: isSignUp
      ? {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        }
      : { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSignUp) {
      await authClient.signUp.email(
        {
          name: "name" in values ? (values.name ?? "") : "",
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            form.reset();
            showToast(
              "success",
              "Check your email for a confirmation link. If you don't receive an email, please check your spam folder.",
            );
          },
          onError: (ctx) => {
            console.error(ctx.error);
            showToast("error", ctx.error.message);
          },
        },
      );
    } else {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/dashboard",
          rememberMe,
        },
        {
          onError: (ctx) => {
            console.error(ctx.error);
            showToast("error", ctx.error.message);
          },
        },
      );
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "github" | "passkey",
  ) => {
    try {
      if (provider === "passkey") {
        await authClient.signIn.passkey({
          fetchOptions: {
            onSuccess() {
              router.push("/dashboard");
            },
            onError(ctx) {
              console.error(ctx.error);
              showToast("error", ctx.error.message);
            },
          },
        });
      } else {
        await authClient.signIn.social(
          {
            provider,
            callbackURL: "/dashboard",
          },
          {
            onError: (ctx) => {
              console.error(ctx.error);
              showToast("error", ctx.error.message);
            },
          },
        );
      }
    } finally {
    }
  };

  return (
    <Card className="card-container">
      <CardHeader className="card-header">
        <CardTitle>
          {isSignUp ? "Create an Account" : "Welcome Back!"}
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
            {isSignUp && (
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
                        autoComplete="name webauthn"
                        disabled={form.formState.isSubmitting}
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
                      autoComplete="email"
                      disabled={form.formState.isSubmitting}
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
                        autoComplete={
                          isSignUp
                            ? "new-password webauthn"
                            : "current-password webauthn"
                        }
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
                          <EyeIcon className="size-4" aria-hidden="true" />
                        ) : (
                          <EyeOffIcon className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSignUp && (
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    onClick={() => {
                      setRememberMe(!rememberMe);
                    }}
                    checked={rememberMe}
                  />

                  <FormLabel htmlFor="remember">Remember me</FormLabel>
                </div>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            {isSignUp && (
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
                              <EyeIcon className="size-4" aria-hidden="true" />
                            ) : (
                              <EyeOffIcon
                                className="size-4"
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

            <LoadingButton
              isLoading={form.formState.isSubmitting}
              className="w-full"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </LoadingButton>
          </form>
        </Form>

        <div className="relative mb-2 mt-2 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        {/* Socials */}
        <section className="space-y-2">
          <Button
            onClick={() => handleSocialSignIn("google")}
            className="w-full border-secondary-foreground"
            type="button"
            variant="outline"
          >
            <Image
              src="google-logo.svg"
              alt="Google Logo"
              className="mr-2"
              width={16}
              height={16}
            />
            {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
          </Button>

          <Button
            onClick={() => handleSocialSignIn("github")}
            className="w-full border-secondary-foreground"
            type="button"
            variant="outline"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            {isSignUp ? "Sign Up with Github" : "Sign In with Github"}
          </Button>

          <Button
            className="w-full border-secondary-foreground"
            onClick={() => handleSocialSignIn("passkey")}
            type="button"
            variant="outline"
          >
            <KeyRound className="mr-2 size-4" />
            {isSignUp ? "Sign Up with Passkey" : "Sign In with Passkey"}
          </Button>
        </section>

        <p className="mt-4 text-center text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="ml-1 font-medium text-primary hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
