"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import LoadingButton from "@/components/loading-button";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";

const SignOutClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton isLoading={isLoading} onClick={handleSignOut}>
      Sign Out
    </LoadingButton>
  );
};

export default SignOutClient;
