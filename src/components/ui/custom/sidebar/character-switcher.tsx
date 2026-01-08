"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, BookOpen, AlertCircle, Eye, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CharacterImage } from "@/components/ui/custom/character-image";
import { cn } from "@/lib/utils";

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
import { useAdmin } from "@/contexts/AdminContext";
import { useCharacter } from "@/contexts/CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import type { CharacterDocument } from "@/lib/types/character";

// Componente para item de personagem (DRY: elimina duplicação)
function CharacterDropdownItem({ character, onClick }: { character: CharacterDocument; onClick: () => void }) {
  const civil = character.identity?.name || "";
  const hero = character.identity?.heroName || "";
  const profileImage = character.identity?.profileImage;
  const imagePosition = character.identity?.imagePosition;

  return (
    <DropdownMenuItem key={character.id} onClick={onClick} className="gap-2 p-2">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-muted/50 overflow-hidden relative">
        <CharacterImage
          src={profileImage}
          alt={civil || hero}
          imagePosition={imagePosition}
          fill
          sizes="24px"
          fallback={
            <span className="text-xs font-bold">{(civil || hero || "?").charAt(0).toUpperCase()}</span>
          }
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium truncate">{civil || hero}</span>
        <span className="text-xs text-muted-foreground truncate">{hero || "Sem título"}</span>
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

const CharacterSwitcherComponent = () => {
  const { isMobile } = useSidebar();
  const { user, loading: authLoading } = useAuth();
  const { isAdminMode, targetUserId } = useAdmin();
  const router = useRouter();
  const characterContext = useCharacter();
  const { selectedCharacter, setSelectedCharacter, activeContextId } = characterContext;
  
  const { listenToCharacters, selectCharacter } = useCharacterPersistence(
    activeContextId,
  );

  const [characters, setCharacters] = React.useState<CharacterDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Escuta mudanças em tempo real na lista de personagens
  React.useEffect(() => {
    if (authLoading) return;

    if (!activeContextId) {
      setIsLoading(false);
      setCharacters([]);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    
    // NÃO limpa estado anterior imediatamente para evitar flashes visíveis
    // Apenas se o ID do usuário de fato mudou drasticamente
    setIsLoading(true);

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
  }, [activeContextId, authLoading, listenToCharacters]);

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
    characterContext.setOpenNewDialog(true);
    router.push("/dashboard/galeria");
  }; 

  const handleOpenGallery = () => {
    router.push("/dashboard/galeria");
  };

  // Se estivermos em modo admin e a ficha selecionada (ou o target da galeria) não for a nossa
  const isViewingAdminContext = isAdminMode && (
    (targetUserId && targetUserId !== user?.uid) || 
    (selectedCharacter && selectedCharacter.userId !== user?.uid)
  );

  if (isLoading && characters.length === 0) {
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

  if (!selectedCharacter && characters.length === 0 && !isAdminMode) {
    return <InitialCharacterButton onCreate={handleCreateNewCharacter} />;
  }

  const selectedCharacterName = selectedCharacter 
    ? (selectedCharacter.identity?.name || "Sem Nome")
    : (isAdminMode ? "ESPERANDO SELEÇÃO" : "Selecionar Ficha");

  const selectedCharacterPlayer = selectedCharacter
    ? (selectedCharacter.identity?.heroName || "Alternar Ficha")
    : (isAdminMode ? "Infinity Corp" : "");

  const selectedProfileImage = selectedCharacter?.identity?.profileImage;
  const selectedImagePosition = selectedCharacter?.identity?.imagePosition;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {mounted ? (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                tooltip={selectedCharacterName}
                className={cn(
                  "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200",
                  isViewingAdminContext && "bg-primary/5"
                )}
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg overflow-hidden relative">
                  {isAdminMode && !selectedCharacter ? (
                    <RefreshCw className="size-4 animate-spin text-primary-foreground" />
                  ) : (
                    <CharacterImage
                      src={selectedProfileImage}
                      alt={selectedCharacterName}
                      imagePosition={selectedImagePosition}
                      fill
                      sizes="32px"
                      fallback={
                        <span className="text-xs font-bold">
                          {selectedCharacterName.charAt(0).toUpperCase()}
                        </span>
                      }
                    />
                  )}
                  {isViewingAdminContext && selectedCharacter && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Eye className="size-4 text-primary animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-medium flex items-center gap-1">
                    {selectedCharacterName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {isViewingAdminContext && selectedCharacter 
                      ? "Rastreando..." 
                      : selectedCharacterPlayer}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto shrink-0" />
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
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium">Nova Ficha</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={handleOpenGallery}
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-transparent">
                  <BookOpen className="size-4" />
                </div>
                <div className="font-medium">Galeria de Fichas</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton size="lg" tooltip={selectedCharacterName}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg overflow-hidden relative">
              {isAdminMode && !selectedCharacter ? (
                <RefreshCw className="size-4 animate-spin text-primary-foreground" />
              ) : (
                <CharacterImage
                  src={selectedProfileImage}
                  alt={selectedCharacterName}
                  imagePosition={selectedImagePosition}
                  fill
                  sizes="32px"
                  fallback={
                    <span className="text-xs font-bold">
                      {selectedCharacterName.charAt(0).toUpperCase()}
                    </span>
                  }
                />
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
              <span className="truncate font-medium">
                {selectedCharacterName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {selectedCharacterPlayer}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto shrink-0" />
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export const CharacterSwitcher = React.memo(CharacterSwitcherComponent);