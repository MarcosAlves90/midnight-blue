import { Sidebar } from "@/components/ui/custom/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Midnight Blue",
    default: "Dashboard",
  },
  description: "Painel de controle do Midnight Blue",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

import RequireAuth from "@/components/config/auth/require-auth";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <RequireAuth>
            {children}
          </RequireAuth>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
