"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
import { updateUserNameAndImageSchema } from "@/features/profile/zod-schema";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";
import { type User } from "@/lib/auth/types";
import { convertImageToBase64 } from "@/lib/utils";

const EditUserDialog = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    user.image ?? undefined,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof updateUserNameAndImageSchema>>({
    resolver: zodResolver(updateUserNameAndImageSchema),
    defaultValues: {
      name: user.name ?? "",
      image: undefined,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size <= 5 * 1024 * 1024) {
      const base64Image = await convertImageToBase64(file);
      setImagePreview(base64Image);
      return;
    }

    if (file) {
      showToast("error", "Image too large (max 5MB)");
    }
  };

  const onSubmit = async (
    values: z.infer<typeof updateUserNameAndImageSchema>,
  ) => {
    await authClient.updateUser(
      {
        name: values.name,
        image: imagePreview,
      },
      {
        onSuccess: () => {
          showToast("success", "Profile updated successfully");
          setIsOpen(false);
          form.reset();
          setImagePreview(user.image ?? undefined);
          router.refresh();
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Updating profile...");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      disabled={form.formState.isSubmitting}
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
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="w-full cursor-pointer text-muted-foreground"
                          disabled={form.formState.isSubmitting}
                        />
                        {imagePreview && (
                          <X
                            className="cursor-pointer"
                            onClick={() => {
                              setImagePreview(undefined);
                              form.resetField("image");

                              // Reset the file input element directly
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
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

            <DialogFooter>
              <LoadingButton
                isLoading={form.formState.isSubmitting}
                className="w-full"
                type="submit"
              >
                Save Changes
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
