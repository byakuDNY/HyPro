"use client";

import React, { useState } from "react";

import LoadingButton from "@/components/loading-button";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";

const DeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteUser = async () => {
    setIsLoading(true);

    await authClient.deleteUser(
      {
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast({
            title: "In Progress",
            description:
              "Check your email for a confirmation link. If you don't receive an email, please check your spam folder.",
          });
        },
        onError: (ctx) => {
          toast({
            title: "Error",
            description: ctx.error.message,
            variant: "destructive",
          });
        },
      },
    );

    setIsLoading(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Delete User</h1>
      <LoadingButton
        isLoading={isLoading}
        variant="destructive"
        onClick={handleDeleteUser}
        className="w-full"
      >
        Delete User
      </LoadingButton>
    </>
  );
};
export default DeleteUser;
