"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ArrowLeft, Trash } from "lucide-react";

import LoadingButton from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignOutClient from "@/features/auth/components/sign-out-client";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";
import { type User } from "@/lib/auth/types";
import { getInitials } from "@/lib/utils";

import AddPasskey from "./add-passkey";
import ChangeEmail from "./change-email";
import ChangePassword from "./change-password";
import EditUserDialog from "./edit-user-dialog";
import ListPasskeys from "./list-passkeys";

const UserCard = ({ user, provider }: { user: User; provider: string }) => {
  const { name, email, image } = user;
  const imageSrc = image ?? undefined;

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteUser = async () => {
    setIsLoading(true);

    await authClient.deleteUser(
      {
        callbackURL: "/",
      },
      {
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },

        onRequest: () => {
          showToast("loading", "Deleting user...");
        },
      },
    );

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
          <CardTitle>User</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src={imageSrc}
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-sm">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {provider !== "credentials" && <EditUserDialog user={user} />}
            <SignOutClient />
          </div>
        </div>

        {/* Passkeys */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t py-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Passkeys</span>
            <div className="flex flex-wrap gap-2">
              <AddPasskey />
              <ListPasskeys />
            </div>
          </div>
        </div>

        {/* Change Email */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t py-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Email</span>
            <div className="flex flex-wrap gap-2">
              <ChangeEmail user={user} />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t py-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Password</span>
            <div className="flex flex-wrap gap-2">
              <ChangePassword />
            </div>
          </div>
        </div>

        {/* Danger Zone - Delete User */}
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-4">
          <div className="mb-3 flex items-center">
            <span className="text-sm font-semibold text-destructive">
              DANGER ZONE
            </span>
          </div>

          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-medium">Delete Your Account</h4>
            <p className="text-xs text-muted-foreground">
              Once you delete your account, there is no going back. This action
              is permanent and will remove all your data from our systems.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <LoadingButton
              isLoading={isLoading}
              variant="destructive"
              onClick={handleDeleteUser}
              className="w-full"
            >
              <Trash className="mr-2 h-4 w-4" />
              Permanently Delete Account
            </LoadingButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
