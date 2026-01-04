"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewCharacterDialog } from "@/components/pages/gallery/new-character-dialog";
import { NewFolderDialog } from "@/components/pages/gallery/new-folder-dialog";
import { DeleteFolderDialog } from "@/components/pages/gallery/delete-folder-dialog";
import { useCharacter } from "@/contexts/CharacterContext";
import { CharacterCard } from "./character-card";
import { FolderCard } from "@/components/ui/custom/folder-card";
import { useGalleryState, useGalleryActions } from "./use-gallery";
import { 
  LoadingState, 
  UnauthenticatedState, 
  ErrorState, 
  EmptyState 
} from "./gallery-states";
import { 
  Search, 
  FolderPlus, 
  Folder as FolderIcon, 
  ChevronRight,
  Move,
  Home
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { GalleryLayout } from "@/components/ui/custom/gallery-layout";

export default function CharacterGallery() {
  const router = useRouter();
  const { user } = useAuth();
  const { openNewDialog, setOpenNewDialog, setSelectedCharacter } = useCharacter();

  const state = useGalleryState();
  const { 
    setCharacters, 
    setFolders,
    setIsLoading, 
    setError, 
    setDialogOpen, 
    setDeletingId,
    searchQuery,
    setSearchQuery,
    currentFolderId,
    setCurrentFolderId,
    setFolderDialogOpen,
    deleteFolderDialogOpen,
    setDeleteFolderDialogOpen,
    folderToDelete,
    setFolderToDelete
  } = state;

  const { 
    handleSelectCharacter, 
    handleDeleteCharacter, 
    handleCreateFolder,
    handleDeleteFolder,
    handleMoveToFolder,
    listenToCharacters,
    listenToFolders
  } = useGalleryActions(
    user?.uid || null, 
    { setCharacters, setFolders, setError, setDeletingId, setSelectedCharacter }, 
    router.push
  );

  // Abre o dialog quando o contexto sinaliza abertura de nova ficha
  useEffect(() => {
    if (openNewDialog) {
      setDialogOpen(true);
      setOpenNewDialog(false);
    }
  }, [openNewDialog, setOpenNewDialog, setDialogOpen]);

  // Escuta mudanças em tempo real na lista de personagens
  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    let unsubscribeChars: (() => void) | undefined;
    let unsubscribeFolders: (() => void) | undefined;

    try {
      unsubscribeChars = listenToCharacters((chars) => {
        setCharacters(chars);
        setError(null);
        setIsLoading(false);
      });

      unsubscribeFolders = listenToFolders((folders) => {
        setFolders(folders);
      });
    } catch (err) {
      console.error("Erro ao escutar mudanças:", err);
      setError("Erro ao carregar dados da galeria");
      setIsLoading(false);
    }

    return () => {
      if (unsubscribeChars) unsubscribeChars();
      if (unsubscribeFolders) unsubscribeFolders();
    };
  }, [user?.uid, listenToCharacters, listenToFolders, setCharacters, setFolders, setError, setIsLoading]);

  // Force unlock body when all dialogs are closed
  useEffect(() => {
    if (!state.dialogOpen && !state.folderDialogOpen && !deleteFolderDialogOpen) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
        document.body.style.overflow = "";
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.dialogOpen, state.folderDialogOpen, deleteFolderDialogOpen]);

  // Breadcrumb logic
  const getFolderPath = (folderId: string | null) => {
    const path = [];
    let currentId = folderId;
    while (currentId) {
      const folder = state.folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId || null;
      } else {
        break;
      }
    }
    return path;
  };

  const folderPath = getFolderPath(currentFolderId);

  const filteredFolders = state.folders.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesParent = (f.parentId || null) === currentFolderId;
    return matchesSearch && matchesParent;
  });

  const filteredCharacters = state.characters.filter((char) => {
    const matchesSearch = 
      char.identity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.identity.heroName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder = (char.folderId || null) === currentFolderId;
    
    return matchesSearch && matchesFolder;
  });

  const hasResults = filteredFolders.length > 0 || filteredCharacters.length > 0;

  if (state.isLoading) return <LoadingState />;
  if (!user) return <UnauthenticatedState />;

  return (
    <GalleryLayout
      title="Minhas Fichas"
      description="Gerencie e organize seus personagens"
      searchPlaceholder="Pesquisar por nome ou codinome..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currentFolderId={currentFolderId}
      folderPath={folderPath}
      onFolderClick={setCurrentFolderId}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setFolderDialogOpen(true)} className="h-9">
            <FolderPlus className="w-4 h-4 mr-2" />
            Nova Pasta
          </Button>
          <Button size="sm" onClick={() => state.setDialogOpen(true)} className="h-9">
            + Nova Ficha
          </Button>
        </>
      }
    >
      <NewCharacterDialog
        open={state.dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => state.setDialogOpen(false), 0);
          } else {
            state.setDialogOpen(true);
          }
        }}
      />

      <NewFolderDialog
        open={state.folderDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => setFolderDialogOpen(false), 0);
          } else {
            setFolderDialogOpen(true);
          }
        }}
        onCreate={handleCreateFolder}
        parentId={currentFolderId}
      />

      <DeleteFolderDialog
        open={deleteFolderDialogOpen}
        folderName={folderToDelete?.name || ""}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              setDeleteFolderDialogOpen(false);
              setFolderToDelete(null);
            }, 0);
          } else {
            setDeleteFolderDialogOpen(true);
          }
        }}
        onConfirm={async () => {
          if (folderToDelete) {
            await handleDeleteFolder(folderToDelete.id);
            if (currentFolderId === folderToDelete.id) {
              setCurrentFolderId(folderToDelete.parentId || null);
            }
          }
        }}
      />

      {state.error && <ErrorState error={state.error} />}

      {state.characters.length === 0 && state.folders.length === 0 ? (
        <EmptyState onCreate={() => state.setDialogOpen(true)} />
      ) : !hasResults ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Search className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium">Nenhum item encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar sua pesquisa ou filtro.</p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setCurrentFolderId(null); }}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {/* Render Folders */}
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => setCurrentFolderId(folder.id)}
              onDelete={() => {
                setFolderToDelete(folder);
                setDeleteFolderDialogOpen(true);
              }}
            />
          ))}

          {/* Render Characters */}
          {filteredCharacters.map((character) => (
            <div key={character.id} className="relative group">
              <CharacterCard
                character={character}
                onSelect={() => handleSelectCharacter(character)}
                onDelete={() => handleDeleteCharacter(character.id)}
                isDeleting={state.deletingId === character.id}
              />
              
              {/* Move to Folder Action */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 has-[[data-state=open]]:opacity-100 transition-opacity">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md bg-background/80 backdrop-blur-sm border border-border">
                      <Move className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Mover para...
                    </div>
                    <DropdownMenuItem onClick={() => handleMoveToFolder(character.id, null)}>
                      <ChevronRight className={cn("w-4 h-4 mr-2", !character.folderId && "text-primary")} />
                      Sem Pasta
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {state.folders.map((f) => (
                      <DropdownMenuItem key={f.id} onClick={() => handleMoveToFolder(character.id, f.id)}>
                        <FolderIcon className={cn("w-4 h-4 mr-2", character.folderId === f.id && "text-primary")} />
                        {f.name}
                      </DropdownMenuItem>
                    ))}
                    {state.folders.length === 0 && (
                      <div className="px-2 py-4 text-center text-xs text-muted-foreground italic">
                        Nenhuma pasta criada
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </GalleryLayout>
  );
}
