"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ChevronsUpDown, Loader2 } from "lucide-react";

import { showErrorToast } from "@/hooks/use-error-toast";
import { showLoadingToast } from "@/hooks/use-loading-toast";
import { showSuccessToast } from "@/hooks/use-success-toast";
import { authClient } from "@/lib/auth/auth-client";
import { ActiveOrganization, Organization } from "@/lib/auth/types";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

const SidebarHeaderDialog = ({
  activeOrganization,
}: {
  activeOrganization: ActiveOrganization | null;
}) => {
  const [optimisticOrg, setOptimisticOrg] = useState<ActiveOrganization | null>(
    activeOrganization,
  );
  const { data: organizations, isPending } = authClient.useListOrganizations();

  if (isPending) {
    return (
      <SidebarMenuButton
        variant="outline"
        className="flex items-center justify-center"
      >
        <Loader2 className="animate-spin" />
      </SidebarMenuButton>
    );
  }

  const handleSetOrganization = async (org: Organization) => {
    if (org.id === optimisticOrg?.id) {
      return;
    }

    setOptimisticOrg({
      members: [],
      invitations: [],
      ...org,
    });

    await authClient.organization.setActive(
      {
        organizationId: org.id,
      },
      {
        onSuccess: (ctx: any) => {
          showSuccessToast({
            description: `${ctx.data.name} is now set as the active organization.`,
          });
        },
        onRequest: () => {
          showLoadingToast({
            description: "Setting active organization...",
          });
        },
        onError: (ctx: any) => {
          showErrorToast({
            description: ctx.error.message,
          });
        },
      },
    );
  };

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="space-y-4">
          <Link
            href="/"
            className="flex w-fit items-center space-x-2 transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <Image
              src="/favicon-light.svg"
              alt="HyPro Logo"
              width={40}
              height={40}
              className="dark:hidden"
            />
            <Image
              src="/favicon-dark.svg"
              alt="HyPro Logo"
              width={40}
              height={40}
              className="hidden dark:block"
            />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="ring-primary" variant="outline">
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src={optimisticOrg?.logo || ""}
                    alt="Active Organization Logo"
                  />
                  <AvatarFallback>
                    {optimisticOrg?.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <span>{optimisticOrg?.name || "Personal"}</span>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem
                onClick={async () => {
                  authClient.organization.setActive({
                    organizationId: null,
                  });
                  setOptimisticOrg(null);
                }}
              >
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <span>Personal</span>
              </DropdownMenuItem>

              {organizations?.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSetOrganization(org)}
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={org?.logo || ""}
                      alt="Organization Logo"
                    />
                    <AvatarFallback>
                      {org?.name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{org.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default SidebarHeaderDialog;
