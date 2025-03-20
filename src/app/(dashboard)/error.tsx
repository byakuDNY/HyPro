"use client";

import { useEffect } from "react";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service e.g. Sentry
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 py-8 text-center">
      <AlertTriangle className="h-16 w-16 text-primary md:h-32 md:w-32" />

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
    </div>
  );
};

export default Error;
