import { headers } from "next/headers";
import Link from "next/link";

import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SignOutClient from "@/features/auth/components/sign-out-client";
import auth from "@/lib/auth/better-auth";
import { Session } from "@/lib/auth/types";
import { getInitials } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SidebarFooterComponent = async () => {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null;

  const { name = "", email, image } = session?.user || {};
  const imageSrc = image ?? undefined;

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                  <AvatarImage src={imageSrc} alt={name} />
                  <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate font-medium">{name}</span>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="end"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarImage src={imageSrc} alt={name} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link className="block w-full" href="/profile">
                    <Settings className="mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2" />
                <SignOutClient unstyled />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default SidebarFooterComponent;
