"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
import type { CharacterDocument } from "@/lib/character-service";

// Componente para item de personagem (DRY: elimina duplicação)
function CharacterDropdownItem({ character, onClick }: { character: CharacterDocument; onClick: () => void }) {
  return (
    <DropdownMenuItem key={character.id} onClick={onClick} className="gap-2 p-2">
      <div className="flex size-6 items-center justify-center rounded-md border bg-muted/50">
        <span className="text-xs font-bold">{character.heroName.charAt(0).toUpperCase()}</span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium">{character.heroName}</span>
        <span className="text-xs text-muted-foreground">Herói</span>
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
  const { user } = useAuth();
  const router = useRouter();
  const { selectedCharacter, setSelectedCharacter } = useCharacter();
  const { listenToCharacters, selectCharacter } = useCharacterPersistence(
    user?.uid || null,
  );

  const [characters, setCharacters] = React.useState<CharacterDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Escuta mudanças em tempo real na lista de personagens
  React.useEffect(() => {
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
  }, [user?.uid, listenToCharacters]);

  const handleSelectCharacter = async (character: CharacterDocument) => {
    setSelectedCharacter(character);
    try {
      await selectCharacter(character.id);
      router.push(`/dashboard/personagem/individual?id=${character.id}`);
    } catch (err) {
      console.error("Erro ao selecionar personagem:", err);
      setError("Erro ao selecionar personagem");
    }
  };

  const handleCreateNewCharacter = () => {
    router.push("/dashboard/galeria?new=true");
  }; 

  const handleOpenGallery = () => {
    router.push("/dashboard/galeria");
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm">Carregando...</span>
          </SidebarMenuButton>
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

  const selectedCharacterName = selectedCharacter?.heroName || "Selecionar Ficha";
  const selectedCharacterPlayer = "Herói";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <span className="text-xs font-bold">{selectedCharacterName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{selectedCharacterName}</span>
                <span className="truncate text-xs text-muted-foreground">{selectedCharacterPlayer}</span>
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
            <DropdownMenuItem className="gap-2 p-2" onClick={handleCreateNewCharacter}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium">Nova Ficha</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2" onClick={handleOpenGallery}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <BookOpen className="size-4" />
              </div>
              <div className="font-medium">Galeria de Fichas</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}