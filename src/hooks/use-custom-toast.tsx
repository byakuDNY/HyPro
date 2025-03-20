import { Check, Loader2, XCircle } from "lucide-react";

import { toast } from "./use-toast";

type ToastType = "success" | "error" | "loading";

export const showToast = (type: ToastType, description?: string) => {
  let config;

  switch (type) {
    case "success":
      config = {
        description:
          description ?? "Your changes have been saved successfully.",
        className:
          "bg-green-50 border-green-200 dark:bg-green-600/20 dark:border-green-600/30",
        action: (
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        ),
      };
      break;
    case "error":
      config = {
        description:
          description ??
          "There was a problem processing your request. Please try again.",
        variant: "destructive" as const,
        action: <XCircle className="h-6 w-6" />,
      };
      break;
    case "loading":
      config = {
        description:
          description ?? "Please wait while we process your request...",
        className:
          "bg-blue-50 border-blue-200 dark:bg-blue-600/20 dark:border-blue-600/30",
        action: (
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
        ),
      };
      break;
    default:
      throw new Error("Invalid toast type");
  }

  toast(config);
};
