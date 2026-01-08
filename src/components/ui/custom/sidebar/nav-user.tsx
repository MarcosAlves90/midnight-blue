"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Infinity,
} from "lucide-react";

import { useAdmin } from "@/contexts/AdminContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuth } from "@/contexts/AuthContext";
import { authInfo, authError } from "@/lib/toast";

export function NavUser({
  user,
  isLoading,
}: {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  isLoading?: boolean;
}) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { signOut, isAdmin } = useAuth();
  const adminMode = useAdmin();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  const isAdminMode = adminMode?.isAdminMode;
  const setIsAdminMode = adminMode?.setIsAdminMode;
  const resetAdmin = adminMode?.resetAdmin;

  const toggleAdminMode = () => {
    if (setIsAdminMode && resetAdmin) {
      const newMode = !isAdminMode;
      setIsAdminMode(newMode);
      resetAdmin();
      
      // Se entrar no modo admin, redireciona automaticamente para a galeria
      if (newMode) {
        router.push("/dashboard/galeria");
      }
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "black") {
      setTheme("dark");
    } else {
      setTheme("black");
    }
  };

  async function handleSignOut() {
    try {
      await signOut();
      authInfo("Desconectado");
      router.push("/");
    } catch (err) {
      console.error(err);
      authError("Erro ao desconectar");
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isLoading ? (
          <div className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-full">
                    {(user?.name || "")
                      .split(" ")
                      .map((n) => n?.[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || "Convidado"}
                  </span>
                  <span className="truncate text-xs">{user?.email || ""}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-full">
                      {(user?.name || "")
                        .split(" ")
                        .map((n) => n?.[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.name || "Convidado"}
                    </span>
                    <span className="truncate text-xs">{user?.email || ""}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === "black" ? <Monitor /> : <Moon />}
                  Trocar tema
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={toggleAdminMode}
                    className={isAdminMode ? "text-primary" : ""}
                  >
                    <Infinity className={isAdminMode ? "text-primary anim-pulse" : ""} />
                    Infinity Corp
                    {isAdminMode && <span className="ml-auto text-[10px] bg-primary/10 px-1 rounded uppercase font-bold">ON</span>}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/conta")}
                >
                  <BadgeCheck />
                  Conta
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton size="lg" className="cursor-pointer">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarFallback className="rounded-full">
                {(user?.name || "")
                  .split(" ")
                  .map((n) => n?.[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user?.name || "Convidado"}
              </span>
              <span className="truncate text-xs">{user?.email || ""}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
