// import { headers } from "next/headers";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import auth from "@/lib/auth/better-auth";
import { SIDEBAR_ITEMS } from "@/lib/constants";

import SidebarFooterComponent from "./sidebar-footer-component";
import SidebarHeaderDialog from "./sidebar-header.dialog";

const AppSidebar = async () => {
  // const organization = await auth.api.getFullOrganization({
  //   headers: await headers(),
  // });

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeaderDialog />

      <SidebarContent>
        {SIDEBAR_ITEMS.map(({ header, links }) => (
          <SidebarGroup key={header}>
            <SidebarGroupLabel>{header}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links?.map(({ title, href, icon: Icon }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild>
                      <Link href={href} prefetch>
                        <Icon />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooterComponent />
    </Sidebar>
  );
};

export default AppSidebar;
