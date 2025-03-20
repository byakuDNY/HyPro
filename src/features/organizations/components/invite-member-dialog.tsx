"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailPlus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";
import { ActiveOrganization } from "@/lib/auth/types";

import { inviteMemberSchema } from "../zod-schema";

// Create a more comprehensive form schema

const InviteMemberDialog = ({
  setActiveOrg,
  activeOrg,
}: {
  setActiveOrg: (org: ActiveOrganization | null) => void;
  activeOrg: ActiveOrganization | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (values: z.infer<typeof inviteMemberSchema>) => {
    await authClient.organization.inviteMember(
      {
        email: values.email,
        role: values.role,
      },
      {
        onSuccess: (ctx) => {
          if (activeOrg) {
            setActiveOrg({
              ...activeOrg,
              invitations: [...(activeOrg?.invitations || []), ctx.data],
            });
          }
          showToast("success", `Invitation sent to ${values.email}`);
          setIsOpen(false);
          form.reset();
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Sending invitation...");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <MailPlus size={16} />
          <span>Invite Member</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a member to your organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <LoadingButton
                className="w-full"
                type="submit"
                isLoading={form.formState.isSubmitting}
              >
                Invite
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
