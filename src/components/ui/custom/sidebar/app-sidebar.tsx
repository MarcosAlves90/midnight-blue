"use client";

import * as React from "react";
import {
  BookOpenText,
  Store,
  BookMarked,
  VenetianMask,
} from "lucide-react";
import { NavMain, NavUser, CharacterSwitcher } from ".";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const navMain = [
  {
    title: "Personagem",
    url: "/dashboard/personagem",
    icon: VenetianMask,
    isActive: true,
    items: [
      { title: "Individual", url: "/dashboard/personagem/individual" },
      { title: "Status", url: "/dashboard/personagem/status" },
      { title: "Anotações", url: "/dashboard/personagem/anotacoes" },
    ],
  },
  {
    title: "Loja",
    url: "/dashboard/loja",
    icon: Store,
    items: [
      { title: "Deep Web", url: "/dashboard/loja/deep-web" },
      { title: "Taverna Animada", url: "/dashboard/loja/taverna-animada" },
      { title: "Barco do Musiquinho", url: "/dashboard/loja/barco-musiquinho" },
    ],
  },
  {
    title: "Documentação",
    url: "/dashboard/documentacao",
    icon: BookOpenText,
    items: [
      { title: "Introduction", url: "/dashboard/documentacao/introduction" },
      { title: "Get Started", url: "/dashboard/documentacao/get-started" },
      { title: "Tutorials", url: "/dashboard/documentacao/tutorials" },
      { title: "Changelog", url: "/dashboard/documentacao/changelog" },
    ],
  },
  {
    title: "Wiki",
    url: "/dashboard/wiki",
    icon: BookMarked,
    items: [
      { title: "General", url: "/dashboard/wiki/general" },
      { title: "Team", url: "/dashboard/wiki/team" },
      { title: "Billing", url: "/dashboard/wiki/billing" },
      { title: "Limits", url: "/dashboard/wiki/limits" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useAuth();

  const userData = user
    ? {
        name: user.displayName ?? user.email ?? "Usuário",
        email: user.email ?? "",
        avatar: user.photoURL ?? undefined,
      }
    : { name: "Convidado", email: "", avatar: undefined };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CharacterSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} isLoading={loading} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} isLoading={loading} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
