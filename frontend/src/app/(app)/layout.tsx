import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppRealtimeProvider } from "@/components/layout/AppRealtimeProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppRealtimeProvider />

      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <main className="flex-1 p-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
