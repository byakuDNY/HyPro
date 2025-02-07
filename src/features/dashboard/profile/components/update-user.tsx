"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import LoadingButton from "@/components/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserNameAndImageSchema } from "@/features/dashboard/profile/zod-schema";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { Session } from "@/lib/auth/better-auth";

const UpdateUser = ({ session }: { session: Session }) => {
  const { user } = session;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof updateUserNameAndImageSchema>>({
    resolver: zodResolver(updateUserNameAndImageSchema),
    defaultValues: {
      name: user?.name,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof updateUserNameAndImageSchema>,
  ) => {
    setIsLoading(true);
    await authClient.updateUser(
      {
        name: values.name,
      },
      {
        onSuccess: () => {
          toast({
            title: "Info successfully updated",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*<FormField*/}
        {/*  control={form.control}*/}
        {/*  name="image"*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem>*/}
        {/*      <FormLabel>Profile</FormLabel>*/}
        {/*      <FormControl>*/}
        {/*        <Input placeholder="https://...." {...field} />*/}
        {/*      </FormControl>*/}
        {/*      <FormMessage />*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}

        <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
      </form>
    </Form>
  );
};
export default UpdateUser;
