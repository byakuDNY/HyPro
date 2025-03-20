"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import LoadingButton from "@/components/loading-button";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";

const SignOutClient = ({ unstyled = false }: { unstyled?: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Signing out...");
        },
      },
    });
  };

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={handleSignOut}
      unstyled={unstyled}
    >
      Sign Out
    </LoadingButton>
  );
};

export default SignOutClient;
