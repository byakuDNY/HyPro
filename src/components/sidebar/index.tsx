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
import { SIDEBAR_ITEMS } from "@/lib/constants";

import SidebarFooterComponent from "./sidebar-footer-component";
import SidebarHeaderDialog from "./sidebar-header.dialog";

const AppSidebar = () => {
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
