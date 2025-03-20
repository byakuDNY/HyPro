"use client";

import { useState } from "react";

import { Fingerprint, Trash } from "lucide-react";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";

const ListPasskeys = () => {
  const { data: passkeys, refetch } = authClient.useListPasskeys();
  const [isOpen, setIsOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleDeletePasskey = async (passkeyId: string) => {
    // Add this passkey ID to deleting array
    setDeletingIds((prev) => [...prev, passkeyId]);

    await authClient.passkey.deletePasskey(
      {
        id: passkeyId,
      },
      {
        onSuccess: () => {
          showToast("success", "Passkey deleted successfully");
          refetch();
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Deleting passkey...");
        },
      },
    );

    // Remove this passkey ID from deleting array when done
    setDeletingIds((prev) => prev.filter((id) => id !== passkeyId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-xs md:text-sm">
          <Fingerprint className="mr-2 h-4 w-4" />
          <span>Passkeys {passkeys?.length ? `[${passkeys.length}]` : ""}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Passkeys</DialogTitle>
          <DialogDescription>
            Manage your passkeys for passwordless authentication
          </DialogDescription>
        </DialogHeader>

        {passkeys?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passkeys.map((passkey) => (
                <TableRow key={passkey.id}>
                  <TableCell className="font-medium">
                    {passkey.name || "My Passkey"}
                  </TableCell>
                  <TableCell className="text-right">
                    <LoadingButton
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePasskey(passkey.id)}
                      isLoading={deletingIds.includes(passkey.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No passkeys found. Add a passkey to enable passwordless login.
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListPasskeys;
