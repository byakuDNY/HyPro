import { XCircle } from "lucide-react";

import { toast } from "./use-toast";

interface SuccessOptions {
  title?: string;
  description?: string;
}

export const showErrorToast = (options?: SuccessOptions) => {
  toast({
    title: options?.title ?? "Error Occurred",
    description:
      options?.description ??
      "There was a problem processing your request. Please try again.",
    variant: "destructive",
    action: <XCircle className="h-6 w-6" />,
  });
};
