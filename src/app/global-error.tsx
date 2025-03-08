"use client";

import Link from "next/link";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 px-4 py-8 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
        Uh oh! Something went wrong.
      </h1>
      <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
        An unexpected error occurred. Please try again later.
      </h2>
      <span className="text-lg md:text-xl">
        {process.env.NODE_ENV === "development" && (
          <details className="whitespace-pre-wrap">
            <summary>Error Details</summary>
            {error.message}
            <br />
            {error.stack}
          </details>
        )}
      </span>
      <Button onClick={() => reset()}>Try again</Button>
      <p className="text-lg md:text-xl">
        Go back to the{" "}
        <Link href="/" className="text-primary hover:underline">
          homepage
        </Link>{" "}
        or{" "}
        <Link href="/dashboard" className="text-primary hover:underline">
          Dashboard
        </Link>
      </p>
      <AlertTriangle className="h-16 w-16 text-primary md:h-32 md:w-32" />
    </div>
  );
};

export default GlobalError;
