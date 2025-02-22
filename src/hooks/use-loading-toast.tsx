import { Loader2 } from "lucide-react";

import { toast } from "./use-toast";

interface SuccessOptions {
  title?: string;
  description?: string;
}

export const showLoadingToast = (options?: SuccessOptions) => {
  toast({
    title: options?.title ?? "Loading...",
    description:
      options?.description ?? "Please wait while we process your request...",
    className:
      "bg-blue-50 border-blue-200 dark:bg-blue-600/20 dark:border-blue-600/30",
    action: (
      <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
    ),
  });
};
