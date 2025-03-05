"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { updateUserNameAndImageSchema } from "@/features/profile/zod-schema";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { type Session } from "@/lib/auth/types";
import { convertImageToBase64 } from "@/lib/utils";

const EditUserDialog = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const user = session?.user;

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.image || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateUserNameAndImageSchema>>({
    resolver: zodResolver(updateUserNameAndImageSchema),
    defaultValues: {
      name: user?.name,
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setImage(file);
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (
    values: z.infer<typeof updateUserNameAndImageSchema>,
  ) => {
    setIsLoading(true);
    const base64Image = image ? await convertImageToBase64(image) : undefined;

    await authClient.updateUser(
      {
        name: values.name,
        image: base64Image,
      },
      {
        onSuccess: () => {
          toast({
            title: "Info successfully updated",
          });
        },
        onError: (ctx: any) => {
          toast({
            title: "Error",
            description: ctx.error.message,
            variant: "destructive",
          });
        },
      },
    );
    router.refresh();
    setImage(null);
    setImagePreview(null);
    form.reset();
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit />
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit user information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onChange={() => {
              console.log(form.formState.errors);
            }}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <div className="flex items-end gap-4">
                      {imagePreview && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                          <Image
                            src={imagePreview}
                            alt="Profile image preview"
                            className="object-cover"
                            fill
                          />
                        </div>
                      )}
                      <div className="flex w-full items-center gap-2">
                        <Input
                          type="file"
                          {...field}
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full text-muted-foreground"
                        />
                        {imagePreview && (
                          <X
                            className="cursor-pointer"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                              form.reset({
                                image: undefined,
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default EditUserDialog;
