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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Personagem",
      url: "/dashboard/personagem",
      icon: VenetianMask,
      isActive: true,
      items: [
        {
          title: "Individual",
          url: "/dashboard/personagem/individual",
        },
        {
          title: "Status",
          url: "/dashboard/personagem/status",
        },
        {
          title: "Anotações",
          url: "/dashboard/personagem/anotacoes",
        },
      ],
    },
    {
      title: "Loja",
      url: "/dashboard/loja",
      icon: Store,
      items: [
        {
          title: "Deep Web",
          url: "/dashboard/loja/deep-web",
        },
        {
          title: "Taverna Animada",
          url: "/dashboard/loja/taverna-animada",
        },
        {
          title: "Barco do Musiquinho",
          url: "/dashboard/loja/barco-musiquinho",
        },
      ],
    },
    {
      title: "Documentação",
      url: "/dashboard/documentacao",
      icon: BookOpenText,
      items: [
        {
          title: "Introduction",
          url: "/dashboard/documentacao/introduction",
        },
        {
          title: "Get Started",
          url: "/dashboard/documentacao/get-started",
        },
        {
          title: "Tutorials",
          url: "/dashboard/documentacao/tutorials",
        },
        {
          title: "Changelog",
          url: "/dashboard/documentacao/changelog",
        },
      ],
    },
    {
      title: "Wiki",
      url: "/dashboard/wiki",
      icon: BookMarked,
      items: [
        {
          title: "General",
          url: "/dashboard/wiki/general",
        },
        {
          title: "Team",
          url: "/dashboard/wiki/team",
        },
        {
          title: "Billing",
          url: "/dashboard/wiki/billing",
        },
        {
          title: "Limits",
          url: "/dashboard/wiki/limits",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
