import React from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const LoadingButton = ({
  children,
  isLoading,
  onClick,
  className,
  type,
  variant,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?:
    | "secondary"
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
}) => {
  return (
    <Button
      className={className}
      type={type}
      variant={variant}
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        children
      )}
    </Button>
  );
};
export default LoadingButton;
