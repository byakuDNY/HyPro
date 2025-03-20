"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";

import { passkeySchema } from "../zod-schema";

const AddPasskey = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof passkeySchema>>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passkeySchema>) => {
    await authClient.passkey.addPasskey(
      { name: values.name },
      {
        onSuccess: () => {
          showToast(
            "success",
            "Passkey added successfully. You can now use it to login.",
          );
          setIsOpen(false);
          form.reset();
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Creating passkey...");
        },
      },
    );
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passkey Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Passkey"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <LoadingButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                className="w-full"
              >
                <Fingerprint className="size-4" />
                Create Passkey
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPasskey;
