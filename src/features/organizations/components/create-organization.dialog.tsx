"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
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
import { createOrganizationSchema } from "@/features/organizations/zod-schema";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";
import { ActiveOrganization } from "@/lib/auth/types";
import { convertImageToBase64 } from "@/lib/utils";

const CreateOrganizationDialog = ({
  setActiveOrg,
}: {
  setActiveOrg: React.Dispatch<React.SetStateAction<ActiveOrganization | null>>;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: undefined,
    },
  });

  // Watch the name field for changes
  const { watch, setValue } = form;
  const name = watch("name");

  // Automatically generate the slug based on the organization name if the slug has not been manually edited
  useEffect(() => {
    if (!isSlugEdited) {
      const generatedSlug = name.trim().toLowerCase().replace(/\s+/g, "-");
      setValue("slug", generatedSlug);
    }
  }, [name, isSlugEdited, setValue]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size <= 5 * 1024 * 1024) {
      const base64Logo = await convertImageToBase64(file);
      setLogoPreview(base64Logo);
      return;
    }
    if (file) {
      showToast("error", "Image too large (max 5MB)");
    }
  };

  // const MAX_ORGANIZATIONS = 5;

  const onSubmit = async (values: z.infer<typeof createOrganizationSchema>) => {
    // if (organizations && organizations.length >= MAX_ORGANIZATIONS) {
    //   showToast("error", `Organization limit reached (${MAX_ORGANIZATIONS})`);
    //   return;
    // }

    await authClient.organization.create(
      { name: values.name, slug: values.slug, logo: logoPreview },
      {
        onSuccess: (ctx) => {
          showToast("success", "Organization created successfully");
          setIsOpen(false);
          form.reset();
          setLogoPreview(undefined);
          router.refresh();

          authClient.organization.setActive(
            { organizationId: ctx.data.id },
            {
              onSuccess: (activeOrgCtx) => {
                // Update the active organization directly
                setActiveOrg(activeOrgCtx.data);
              },
              onError: (ctx) => {
                showToast("error", ctx.error.message);
              },
            },
          );
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle />
          New Organization
        </Button>
      </DialogTrigger>

      <DialogContent className="w-11/12 md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            onChange={() => {
              console.log(form.formState.errors);
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Organization slug"
                      {...field}
                      type="text"
                      onChange={(e) => {
                        field.onChange(e);
                        setIsSlugEdited(true);
                      }}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <div className="flex items-end gap-4">
                      {logoPreview && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                          <Image
                            src={logoPreview}
                            alt="Organization logo preview"
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
                          onChange={handleLogoChange}
                          className="w-full cursor-pointer text-muted-foreground"
                          disabled={form.formState.isSubmitting}
                        />
                        {logoPreview && (
                          <X
                            className="cursor-pointer"
                            onClick={() => {
                              setLogoPreview(undefined);
                              form.resetField("logo");

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
                Create
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
