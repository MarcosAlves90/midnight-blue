"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { useCharacter } from "@/contexts/CharacterContext";

export const NavMain = React.memo(function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { selectedCharacter } = useCharacter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Manter estado de abertura dos itens para evitar reset na navegação
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      items.forEach((item) => {
        if (item.isActive) {
          initial[item.title] = true;
        }
      });
      return initial;
    },
  );

  const handleOpenChange = React.useCallback(
    (title: string, isOpen: boolean) => {
      setOpenItems((prev) => ({ ...prev, [title]: isOpen }));
    },
    [],
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Ficha</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, idx) => {
          const slug = item.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
          const contentId = `nav-${slug}-${idx}`;

          if (!mounted) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              open={openItems[item.title] ?? false}
              onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    aria-controls={contentId}
                    aria-expanded={openItems[item.title] ?? false}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent id={contentId}>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isIndividual =
                        subItem.url === "/dashboard/personagem/individual";
                      const isStatus =
                        subItem.url === "/dashboard/personagem/status";
                      const href =
                        (isIndividual || isStatus) && selectedCharacter
                          ? `${subItem.url}/${selectedCharacter.id}`
                          : subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={href}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
});
