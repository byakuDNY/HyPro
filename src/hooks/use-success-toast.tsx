import { Check } from "lucide-react";

import { toast } from "./use-toast";

interface SuccessOptions {
  title?: string;
  description?: string;
}

export const showSuccessToast = (options?: SuccessOptions) => {
  toast({
    title: options?.title ?? "Changes Saved",
    description:
      options?.description ?? "Your changes have been saved successfully.",
    className:
      "bg-green-50 border-green-200 dark:bg-green-600/20 dark:border-green-600/30",
    action: <Check className="h-6 w-6 text-green-600 dark:text-green-400" />,
  });
};
