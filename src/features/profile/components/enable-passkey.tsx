"use client";

import { useState } from "react";

import LoadingButton from "@/components/loading-button";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";

const EnablePasskey = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnablePasskey = async () => {
    setIsLoading(true);

    const res = await authClient.passkey.addPasskey();

    if (res?.error) {
      toast({
        title: "Error",
        description: res?.error.message,
      });
    } else {
      toast({
        title: "Passkey added successfully",
        description: "You can now use it to login.",
      });
    }

    setIsLoading(false);
  };
  return (
    <>
      <h1 className="text-2xl font-bold">Enable Passkey</h1>

      <LoadingButton isLoading={isLoading} onClick={handleEnablePasskey}>
        Enable Passkey
      </LoadingButton>
    </>
  );
};
export default EnablePasskey;
