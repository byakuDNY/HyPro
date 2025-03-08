"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { showSuccessToast } from "@/hooks/use-success-toast";

import { createClient, updateClient } from "../actions";
import { clientInsertSchema } from "../zod-schema";

const ClientFormClient = ({
  id,
  isEditMode = false,
  name,
  description,
  contact,
  email,
  phone,
  country,
}: {
  id?: string;
  isEditMode?: boolean;
  name?: string;
  description?: string;
  contact?: string;
  email?: string;
  phone?: string;
  country?: string;
}) => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<ClientInsertType>({
    resolver: zodResolver(clientInsertSchema),
    defaultValues: isEditMode
      ? {
          id: id,
          name: name,
          description: description,
          contact: contact,
          email: email,
          phone: phone,
          country: country,
        }
      : {
          name: "",
          description: "",
          contact: "",
          email: "",
          phone: "",
          country: "",
        },
  });

  const onSubmit = async (values: ClientInsertType) => {
    console.log(values);

    const { error } = isEditMode
      ? await updateClient(values)
      : await createClient(values);

    if (error) {
      setErrorMessage(error);
      showErrorToast({
        description: error,
      });
      return;
    }

    showSuccessToast({
      description: "Client created successfully",
    });

    form.reset();
    router.push("/clients");
  };

  return (
    <Card className="mx-auto my-10 max-w-2xl space-y-8 bg-white px-6">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>
          {`Please ${isEditMode ? "update" : "fill in"} your client details below.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onChange={() => {
              console.log(form.getValues("id")); // Log form errors
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
      </CardContent>
    </Card>
  );
};

export default ClientFormClient;
