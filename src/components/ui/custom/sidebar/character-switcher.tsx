"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
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
import { useCharacter } from "@/contexts/CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import type { CharacterDocument } from "@/lib/types/character";

// Componente para item de personagem (DRY: elimina duplicação)
function CharacterDropdownItem({ character, onClick }: { character: CharacterDocument; onClick: () => void }) {
  const civil = character.identity?.name || "";
  const hero = character.identity?.heroName || "";
  const profileImage = character.identity?.profileImage;

  return (
    <DropdownMenuItem key={character.id} onClick={onClick} className="gap-2 p-2">
      <div className="flex size-6 items-center justify-center rounded-md border bg-muted/50 overflow-hidden relative">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={civil || hero}
            fill
            sizes="24px"
            className="object-cover"
          />
        ) : (
          <span className="text-xs font-bold">{(civil || hero || "?").charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium">{civil || hero}</span>
        <span className="text-xs text-muted-foreground">{hero || "Sem título"}</span>
      </div>
    </DropdownMenuItem>
  );
}

// Componente para botão inicial (SRP: separa renderização condicional)
function InitialCharacterButton({ onCreate }: { onCreate: () => void }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" onClick={onCreate}>
          <Plus className="size-4" />
          <span className="text-sm font-medium">Nova Ficha</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function CharacterSwitcher() {
  const { isMobile } = useSidebar();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const characterContext = useCharacter();
  const { selectedCharacter, setSelectedCharacter } = characterContext;
  const { listenToCharacters, selectCharacter } = useCharacterPersistence(
    user?.uid || null,
  );

  const [characters, setCharacters] = React.useState<CharacterDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Escuta mudanças em tempo real na lista de personagens
  React.useEffect(() => {
    if (authLoading) return;

    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = listenToCharacters((chars) => {
        setCharacters(chars);
        setError(null);
        setIsLoading(false);
      });
    } catch (err) {
      console.error("Erro ao escutar mudanças em personagens:", err);
      setError("Erro ao carregar personagens");
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, authLoading, listenToCharacters]);

  const handleSelectCharacter = async (character: CharacterDocument) => {
    setSelectedCharacter(character);
    try {
      await selectCharacter(character.id);
      router.push(`/dashboard/personagem/individual/${character.id}`);
    } catch (err) {
      console.error("Erro ao selecionar personagem:", err);
      setError("Erro ao selecionar personagem");
    }
  };

  const handleCreateNewCharacter = () => {
    // Use o contexto para sinalizar abertura de novo dialog em vez de query param
    characterContext.setOpenNewDialog(true);
    router.push("/dashboard/galeria");
  }; 

  const handleOpenGallery = () => {
    router.push("/dashboard/galeria");
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <AlertCircle className="size-4 text-red-500" />
            <span className="text-sm text-red-500">{error}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!selectedCharacter && characters.length === 0) {
    return <InitialCharacterButton onCreate={handleCreateNewCharacter} />;
  }

  const selectedCharacterName = selectedCharacter?.identity?.name || "Selecionar Ficha";
  const selectedCharacterPlayer = selectedCharacter?.identity?.heroName || "";
  const selectedProfileImage = selectedCharacter?.identity?.profileImage;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden relative">
                  {selectedProfileImage ? (
                    <Image
                      src={selectedProfileImage}
                      alt={selectedCharacterName}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold">
                      {selectedCharacterName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {selectedCharacterName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {selectedCharacterPlayer}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Fichas de Personagem
              </DropdownMenuLabel>
              {characters.map((character: CharacterDocument) => (
                <CharacterDropdownItem
                  key={character.id}
                  character={character}
                  onClick={() => handleSelectCharacter(character)}
                />
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={handleCreateNewCharacter}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium">Nova Ficha</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={handleOpenGallery}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <BookOpen className="size-4" />
                </div>
                <div className="font-medium">Galeria de Fichas</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton size="lg">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden relative">
              <span className="text-xs font-bold">
                {selectedCharacterName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {selectedCharacterName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {selectedCharacterPlayer}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}