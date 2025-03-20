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
import { showToast } from "@/hooks/use-custom-toast";

import { createClient, updateClient } from "../actions";
import { clientInsertSchema } from "../zod-schema";

const ClientForm = ({
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
    const { error } = isEditMode
      ? await updateClient(values)
      : await createClient(values);

    if (error) {
      setErrorMessage(error);
      showToast("error", error);
      return;
    }

    showToast("success", "Client created successfully");

    form.reset();
    router.push("/clients");
  };

  return (
    <Card className="card-container">
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
              console.log(form.formState.errors);
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div className="space-y-4 md:col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter client name"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter client description"
                        {...field}
                        value={field.value || ""}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client contact name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client contact email"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client contact phone number"
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
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 md:col-span-2">
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
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClientForm;
