"use client"

import * as React from "react"
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
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      url: "#",
      icon: VenetianMask,
      isActive: true,
      items: [
        {
          title: "Individual",
          url: "/dashboard/personagem/individual",
        },
        {
          title: "Características",
          url: "#",
        },
        {
          title: "Status",
          url: "/dashboard/personagem/status",
        },
        {
          title: "Skills",
          url: "#",
        },
        {
          title: "Inventário",
          url: "#",
        },
        {
          title: "Anotações",
          url: "#",
        },
      ],
    },
    {
      title: "Loja",
      url: "#",
      icon: Store,
      items: [
        {
          title: "Deep Web",
          url: "#",
        },
        {
          title: "Taverna Animada",
          url: "#",
        },
        {
          title: "Barco do Musiquinho",
          url: "#",
        },
      ],
    },
    {
      title: "Documentação",
      url: "#",
      icon: BookOpenText,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Wiki",
      url: "#",
      icon: BookMarked,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
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
}

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
  )
}
