import AppSidebar from "@/components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <main className="flex h-full flex-col">
          <SidebarTrigger />

          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
