"use client";

import { useState } from "react";

import { Fingerprint, Loader2, Plus, Trash } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SignOutClient from "@/features/auth/components/sign-out-client";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { type Session } from "@/lib/auth/types";
import { getInitials } from "@/lib/utils";

import ChangePassword from "./change-password";
import EditUserDialog from "./edit-user.dialog";

const UserCard = ({
  session,
  provider,
}: {
  session: Session | null;
  provider: string;
}) => {
  const { name = "", email, image } = session?.user || {};
  const imageSrc = image ?? undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
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
              <span className="text-sm font-medium leading-none">{name}</span>
              <span className="text-sm">{email}</span>
            </div>
          </div>
          {provider === "credentials" || <EditUserDialog session={session} />}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-y py-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Passkeys</span>
            <div className="flex flex-wrap gap-2">
              <AddPasskey />
              <ListPasskeys />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="items-center justify-between gap-2">
        <ChangePassword />
        <SignOutClient />
      </CardFooter>
    </Card>
  );
};

function AddPasskey() {
  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPasskey = async () => {
    if (!passkeyName) {
      toast({
        title: "Passkey name is required",
      });
      return;
    }
    setIsLoading(true);
    const res = await authClient.passkey.addPasskey({
      name: passkeyName,
    });
    if (res?.error) {
      toast({
        title: res?.error.message,
        variant: "destructive",
      });
    } else {
      setIsOpen(false);
      toast({
        title: "Passkey added successfully. You can now use it to login.",
      });
    }
    setIsLoading(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-xs md:text-sm">
          <Plus size={15} />
          Add New Passkey
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Passkey</DialogTitle>
          <DialogDescription>
            Create a new passkey to securely access your account without a
            password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="passkey-name">Passkey Name</Label>
          <Input
            id="passkey-name"
            value={passkeyName}
            onChange={(e) => setPasskeyName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            type="submit"
            onClick={handleAddPasskey}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <Fingerprint className="mr-2 h-4 w-4" />
                Create Passkey
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ListPasskeys() {
  const { data } = authClient.useListPasskeys();
  const [isOpen, setIsOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");

  const handleAddPasskey = async () => {
    if (!passkeyName) {
      toast({
        title: "Error",
        description: "Passkey name is required",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const res = await authClient.passkey.addPasskey({
      name: passkeyName,
    });
    setIsLoading(false);
    if (res?.error) {
      console.error(res?.error.message);
    } else {
      console.log("Passkey added successfully. You can now use it to login.");
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletePasskey, setIsDeletePasskey] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xs md:text-sm">
          <Fingerprint className="mr-2 h-4 w-4" />
          <span>Passkeys {data?.length ? `[${data?.length}]` : ""}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Passkeys</DialogTitle>
          <DialogDescription>List of passkeys</DialogDescription>
        </DialogHeader>
        {data?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((passkey) => (
                <TableRow
                  key={passkey.id}
                  className="flex items-center justify-between"
                >
                  <TableCell>{passkey.name || "My Passkey"}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={async () => {
                        const res = await authClient.passkey.deletePasskey({
                          id: passkey.id,
                          fetchOptions: {
                            onRequest: () => {
                              setIsDeletePasskey(true);
                            },
                            onSuccess: () => {
                              console.log("Passkey deleted successfully");
                              setIsDeletePasskey(false);
                            },
                            onError: (error: any) => {
                              console.error(error.error.message);
                              setIsDeletePasskey(false);
                            },
                          },
                        });
                      }}
                    >
                      {isDeletePasskey ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash
                          size={15}
                          className="cursor-pointer text-red-600"
                        />
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="text-sm text-muted-foreground">
            No passkeys found
          </span>
        )}
        {!data?.length && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="passkey-name" className="text-sm">
                New Passkey
              </Label>
              <Input
                id="passkey-name"
                value={passkeyName}
                onChange={(e) => setPasskeyName(e.target.value)}
                placeholder="My Passkey"
              />
            </div>
            <Button type="submit" onClick={handleAddPasskey} className="w-full">
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Create Passkey
                </>
              )}
            </Button>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserCard;
