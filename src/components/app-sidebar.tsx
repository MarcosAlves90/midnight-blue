"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpenText,
  Store,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  BookMarked,
  VenetianMask,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_AVATAR = "/avatars/shadcn.jpg";

const teams = [
  { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
  { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
  { name: "Evil Corp.", logo: Command, plan: "Free" },
];

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

const projects = [
  { name: "Design Engineering", url: "#", icon: Frame },
  { name: "Sales & Marketing", url: "#", icon: PieChart },
  { name: "Travel", url: "#", icon: Map },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = user
    ? {
        name: user.displayName ?? user.email ?? "Usuário",
        email: user.email ?? "",
        avatar: user.photoURL ?? DEFAULT_AVATAR,
      }
    : { name: "Convidado", email: "", avatar: DEFAULT_AVATAR };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
