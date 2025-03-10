"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { createOrganizationSchema } from "@/features/organizations/zod-schema";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { convertImageToBase64 } from "@/lib/utils";

function CreateOrganizationDialog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: undefined,
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setLogo(file);
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof createOrganizationSchema>) => {
    setLoading(true);

    let base64Logo = undefined;
    if (logo) {
      base64Logo = await convertImageToBase64(logo);
    }

    try {
      await authClient.organization.create(
        { ...values, logo: base64Logo || undefined }, // Spread form values and add logo
        {
          onResponse: () => setLoading(false),
          onSuccess: () => {
            toast({
              title: "Organization created successfully",
            });
            setOpen(false);
            form.reset(); // Reset the form after successful creation
            setLogo(null);
            setLogoPreview(null);
            router.refresh(); // Refresh the organization list or wherever you need it
          },
          onError: (error) => {
            toast({
              title: "Error creating organization",
              description: error.error.message,
              variant: "destructive",
            });
            console.error(error.error.message);
            setLoading(false);
          },
        },
      );
    } catch (error) {
      console.error("Error creating organization:", error);
      setLoading(false);
      toast({
        title: "Error creating organization",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full gap-2" variant="default">
          <PlusCircle />
          <span>New Organization</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
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
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
                  <FormLabel>Organization Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Slug" {...field} />
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
                  <FormLabel>Profile Logo</FormLabel>
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
                          accept="logo/*"
                          onChange={handleLogoChange}
                          className="w-full text-muted-foreground"
                        />
                        {logoPreview && (
                          <X
                            className="cursor-pointer"
                            onClick={() => {
                              setLogo(null);
                              setLogoPreview(null);
                              form.reset({
                                logo: undefined,
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

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrganizationDialog;
