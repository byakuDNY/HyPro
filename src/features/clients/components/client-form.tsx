"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { type ClientInsertType } from "@/features/clients/types";
import { showErrorToast } from "@/hooks/use-error-toast";

import { createClient, updateClient } from "../actions";
import { clientInsertSchema } from "../zod-schema";

const ClientForm = ({
  userId,
  organizationId,
  clientId,
}: {
  userId: string;
  organizationId: string | null | undefined;
  clientId?: string;
}) => {
  const isEditMode = clientId !== undefined;
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ClientInsertType>({
    resolver: zodResolver(clientInsertSchema),
    defaultValues: {
      name: "",
      description: "",
      contact: "",
      email: "",
      phone: "",
      country: "",
      userId: userId,
      organizationId: organizationId,
    },
  });

  const onSubmit = async (values: ClientInsertType) => {
    const result = isEditMode
      ? await updateClient(values)
      : await createClient(values);

    if ("error" in result) {
      setErrorMessage(result.error);
      showErrorToast({
        description: result.error,
      });
      return;
    }

    form.reset();
    router.refresh();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button aria-label={isEditMode ? "Update" : "Create"}>
          {isEditMode ? "Update" : "Create"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Client Information</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please fill in your client details below.
        </DialogDescription>
        <Form {...form}>
          <form
            onChange={() => {
              console.log(form.formState.errors);
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter client description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client contact name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client contact email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client contact phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client country"
                      {...field}
                      type="text"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>

            {errorMessage && (
              <p className="text-center text-red-500">*{errorMessage}</p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;
