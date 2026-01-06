"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { GalleryLayout } from "@/components/ui/custom/gallery-layout";
import { NewCharacterDialog } from "./new-character-dialog";
import { NewFolderDialog } from "./new-folder-dialog";
import { DeleteFolderDialog } from "./delete-folder-dialog";
import { LoadingState, UnauthenticatedState, ErrorState, EmptyState } from "./gallery-states";
import { AdminUserList } from "./admin-user-list";
import { GalleryGrid } from "./gallery-grid";
import { GalleryActions } from "./gallery-actions";
import { useGalleryState, useGallery } from "./use-gallery";

import type { Folder } from "@/lib/types/character";

export default function CharacterGallery() {
  const { user } = useAuth();
  const gallery = useGallery();
  
  const { 
    isAdmin, isAdminMode, targetUserId, setIsAdminMode, setTargetUserId, ownUserId,
    isLoading, error, searchQuery, setSearchQuery, currentFolderId, setCurrentFolderId,
    folders, characters, users, setCharacters, setFolders, setIsLoading, setError,
    fetchUsers, fetchUser, handleSelectCharacter, handleDeleteCharacter, 
    handleCreateFolder, handleUpdateFolder, handleDeleteFolder, handleMoveToFolder,
    listenToCharacters, listenToFolders, setDialogOpen, setFolderDialogOpen, 
    setFolderToDelete, setDeleteFolderDialogOpen, setFolderToEdit
  } = gallery;

  // -- Data Loading & Sync --
  
  // 1. Limpa o estado quando o contexto de visualização muda
  useEffect(() => {
    setCurrentFolderId(null);
    setCharacters([]);
    setFolders([]);
  }, [targetUserId, isAdminMode, setCurrentFolderId, setCharacters, setFolders]);

  // 2. Gerenciamento de Usuários (Modo Admin)
  useEffect(() => {
    if (isAdminMode && !targetUserId) {
      setIsLoading(true);
      fetchUsers().finally(() => setIsLoading(false));
    } else if (isAdminMode && targetUserId) {
      // Busca perfil básico para o header, sincronização de fichas é feita pelo outro efeito
      fetchUser(targetUserId);
    }
  }, [isAdminMode, targetUserId, fetchUsers, fetchUser, setIsLoading]);

  // 3. Sincronização de Personagens e Pastas
  useEffect(() => {
    // Se estivermos na lista de usuários (admin sem target), não sincronizamos fichas ainda
    if (!ownUserId || (isAdminMode && !targetUserId)) {
      if (!ownUserId) setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let unsubChars: (() => void) | undefined;
    let unsubFolders: (() => void) | undefined;

    try {
      unsubChars = listenToCharacters(
        (chars) => {
          setCharacters(chars);
          setError(null);
          setIsLoading(false);
        },
        (err) => {
          console.error("Characters Listener Error:", err);
          setError("Erro ao sincronizar personagens");
          setIsLoading(false);
        }
      );
      
      unsubFolders = listenToFolders(
        setFolders,
        (err) => {
          console.error("Folders Listener Error:", err);
          setError("Erro ao sincronizar pastas");
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error("Gallery Sync Error:", err);
      setError("Erro ao carregar dados da galeria");
      setIsLoading(false);
    }

    return () => {
      unsubChars?.();
      unsubFolders?.();
    };
  }, [ownUserId, targetUserId, isAdminMode, listenToCharacters, listenToFolders, setCharacters, setFolders, setError, setIsLoading]);

  // -- Derived Data --
  const folderPath = useMemo(() => {
    const path = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId || null;
      } else break;
    }
    return path;
  }, [currentFolderId, folders]);

  const filteredUsers = useMemo(() => {
    if (!isAdminMode || targetUserId) return [];
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      !q || 
      (u.displayName || "").toLowerCase().includes(q) || 
      (u.email || "").toLowerCase().includes(q)
    );
  }, [isAdminMode, targetUserId, users, searchQuery]);

  const filteredFolders = useMemo(() => 
    folders.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
      (f.parentId || null) === currentFolderId
    ), [folders, searchQuery, currentFolderId]);

  const filteredCharacters = useMemo(() => 
    characters.filter(char => 
      (char.identity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       char.identity.heroName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (char.folderId || null) === currentFolderId
    ), [characters, searchQuery, currentFolderId]);

  const targetUser = users.find(u => u.id === targetUserId);
  const galleryTitle = isAdminMode 
    ? (targetUser ? `Fichas de ${targetUser.displayName || targetUser.email}` : "Visão de Admin")
    : "Minhas Fichas";

  if (isLoading) return <LoadingState />;
  if (!user) return <UnauthenticatedState />;

  const isShowingUserList = isAdminMode && !targetUserId;
  const isGalleryEmpty = characters.length === 0 && folders.length === 0;

  return (
    <GalleryLayout
      title={galleryTitle}
      description={isAdminMode ? "Modo de administração ativado" : "Gerencie e organize seus personagens"}
      searchPlaceholder={isShowingUserList ? "Pesquisar usuários..." : "Pesquisar por nome ou codinome..."}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currentFolderId={currentFolderId}
      folderPath={folderPath}
      onFolderClick={setCurrentFolderId}
      actions={
        <GalleryActions 
          isAdmin={isAdmin}
          isAdminMode={isAdminMode}
          onToggleAdminMode={() => { setIsAdminMode(!isAdminMode); setTargetUserId(null); }}
          targetUserId={targetUserId}
          onBackToUsers={() => setTargetUserId(null)}
          onNewFolder={() => setFolderDialogOpen(true)}
          onNewCharacter={() => setDialogOpen(true)}
        />
      }
    >
      <Dialogs 
        state={gallery} 
        handlers={{ 
          handleCreateFolder, handleUpdateFolder, handleDeleteFolder, 
          setFolderDialogOpen, setFolderToEdit, setFolderToDelete, setDeleteFolderDialogOpen,
          setCurrentFolderId
        }} 
      />

      {error && <ErrorState error={error} />}

      {isShowingUserList ? (
        <AdminUserList users={filteredUsers} onUserClick={setTargetUserId} />
      ) : isGalleryEmpty ? (
        <div className={isAdminMode ? "text-center py-12 border-2 border-dashed rounded-lg" : ""}>
          <EmptyState onCreate={isAdminMode ? () => {} : () => setDialogOpen(true)} />
          {isAdminMode && <p className="mt-2 text-sm text-muted-foreground">Este usuário ainda não possui fichas.</p>}
        </div>
      ) : (
        <GalleryGrid 
          folders={filteredFolders}
          allFolders={folders}
          characters={filteredCharacters}
          onFolderClick={setCurrentFolderId}
          onFolderDelete={(f) => { setFolderToDelete(f); setDeleteFolderDialogOpen(true); }}
          onFolderEdit={(f) => { setFolderToEdit(f); setFolderDialogOpen(true); }}
          onCharacterSelect={handleSelectCharacter}
          onCharacterDelete={handleDeleteCharacter}
          onMoveToFolder={handleMoveToFolder}
          deletingId={gallery.deletingId}
          isAdminMode={isAdminMode}
          targetUserId={targetUserId}
          ownUserId={ownUserId}
          onResetFilters={() => { setSearchQuery(""); setCurrentFolderId(null); }}
        />
      )}
    </GalleryLayout>
  );
}

// Sub-component for Dialogs to keep the main component cleaner
function Dialogs({ 
  state, 
  handlers 
}: { 
  state: ReturnType<typeof useGalleryState>, 
  handlers: {
    handleCreateFolder: (name: string, parentId?: string | null) => Promise<void>;
    handleUpdateFolder: (folderId: string, name: string) => Promise<void>;
    handleDeleteFolder: (folderId: string) => Promise<void>;
    setFolderDialogOpen: (open: boolean) => void;
    setFolderToEdit: (folder: Folder | null) => void;
    setFolderToDelete: (folder: Folder | null) => void;
    setDeleteFolderDialogOpen: (open: boolean) => void;
    setCurrentFolderId: (id: string | null) => void;
  }
}) {
  return (
    <>
      <NewCharacterDialog
        open={state.dialogOpen}
        onOpenChange={(open) => {
          if (!open) setTimeout(() => state.setDialogOpen(false), 0);
          else state.setDialogOpen(true);
        }}
      />

      <NewFolderDialog
        open={state.folderDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              handlers.setFolderDialogOpen(false);
              handlers.setFolderToEdit(null);
            }, 0);
          } else handlers.setFolderDialogOpen(true);
        }}
        onCreate={handlers.handleCreateFolder}
        onUpdate={handlers.handleUpdateFolder}
        parentId={state.currentFolderId}
        folderToEdit={state.folderToEdit}
      />

      <DeleteFolderDialog
        open={state.deleteFolderDialogOpen}
        folderName={state.folderToDelete?.name || ""}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              handlers.setDeleteFolderDialogOpen(false);
              handlers.setFolderToDelete(null);
            }, 0);
          } else handlers.setDeleteFolderDialogOpen(true);
        }}
        onConfirm={async () => {
          if (state.folderToDelete) {
            await handlers.handleDeleteFolder(state.folderToDelete.id);
            if (state.currentFolderId === state.folderToDelete.id) {
              handlers.setCurrentFolderId(state.folderToDelete.parentId || null);
            }
          }
        }}
      />
    </>
  );
}
