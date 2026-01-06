"use client";

import { Suspense, lazy, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { GalleryLayout } from "@/components/ui/custom/gallery-layout";
// Consider lazy loading dialogs for better initial bundle size and performance
const NewCharacterDialog = lazy(() => import("./new-character-dialog").then(m => ({ default: m.NewCharacterDialog })));
const NewFolderDialog = lazy(() => import("./new-folder-dialog").then(m => ({ default: m.NewFolderDialog })));
const DeleteFolderDialog = lazy(() => import("./delete-folder-dialog").then(m => ({ default: m.DeleteFolderDialog })));

import { LoadingState, UnauthenticatedState, ErrorState, EmptyState } from "./gallery-states";
import { AdminUserList } from "./admin-user-list";
import { GalleryGrid } from "./gallery-grid";
import { GalleryActions } from "./gallery-actions";
import { useGallery } from "./use-gallery";

import type { Folder } from "@/lib/types/character";
import React from "react";

const CharacterGallery = React.memo(function CharacterGallery() {
  const { user } = useAuth();
  const gallery = useGallery();
  
  const { 
    isAdmin, isAdminMode, targetUserId, targetUserLabel, setIsAdminMode, resetAdmin, ownUserId,
    isLoading, error, searchQuery, setSearchQuery, currentFolderId, setCurrentFolderId,
    folders, characters, users,
    fetchUsers, handleSelectUser, handleSelectCharacter, handleDeleteCharacter, 
    handleCreateFolder, handleUpdateFolder, handleDeleteFolder, handleMoveToFolder,
    setDialogOpen, setFolderDialogOpen, setFolderToDelete, setDeleteFolderDialogOpen, setFolderToEdit,
    dialogOpen, folderDialogOpen, deleteFolderDialogOpen, folderToDelete, folderToEdit, deletingId
  } = gallery;

  // -- Memoized Handlers --
  const onToggleAdminMode = useCallback(() => {
    setIsAdminMode(!isAdminMode);
    resetAdmin();
  }, [isAdminMode, setIsAdminMode, resetAdmin]);

  const onBackToUsers = useCallback(() => resetAdmin(), [resetAdmin]);
  const onNewFolder = useCallback(() => setFolderDialogOpen(true), [setFolderDialogOpen]);
  const onNewCharacter = useCallback(() => setDialogOpen(true), [setDialogOpen]);
  const onResetFilters = useCallback(() => { 
    setSearchQuery(""); 
    setCurrentFolderId(null); 
  }, [setSearchQuery, setCurrentFolderId]);

  // -- Data Loading Initializer --
  useEffect(() => {
    if (isAdminMode && !targetUserId) {
      fetchUsers();
    }
  }, [isAdminMode, targetUserId, fetchUsers]);

  // -- Derived Data --
  const folderPath = useMemo(() => {
    const path: Folder[] = [];
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

  const filteredFolders = useMemo(() => {
    if (isAdminMode && targetUserId) return [];
    const q = searchQuery.toLowerCase();
    return folders.filter(f => 
      f.name.toLowerCase().includes(q) && 
      (f.parentId || null) === currentFolderId
    );
  }, [folders, searchQuery, currentFolderId, isAdminMode, targetUserId]);

  const filteredCharacters = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const isAdminViewingUser = isAdminMode && !!targetUserId;

    return characters.filter(char => 
      (char.identity.name.toLowerCase().includes(q) ||
       char.identity.heroName.toLowerCase().includes(q)) &&
      (isAdminViewingUser ? true : (char.folderId || null) === currentFolderId)
    );
  }, [characters, searchQuery, currentFolderId, isAdminMode, targetUserId]);

  const targetUser = useMemo(() => users.find(u => u.id === targetUserId), [users, targetUserId]);
  
  const galleryTitle = useMemo(() => isAdminMode 
    ? (targetUser ? `Fichas de ${targetUser.displayName || targetUser.email}` : "Visão de Admin")
    : "Minhas Fichas", [isAdminMode, targetUser]);

  if (isLoading) return <LoadingState />;
  if (!user) return <UnauthenticatedState />;

  const isShowingUserList = isAdminMode && !targetUserId;
  const isAdminViewingUser = isAdminMode && !!targetUserId;
  const isGalleryEmpty = isAdminViewingUser 
    ? characters.length === 0 
    : (characters.length === 0 && folders.length === 0);

  return (
    <GalleryLayout
      title={galleryTitle}
      description={isAdminMode ? "Modo de administração ativado" : "Gerencie e organize seus personagens"}
      searchPlaceholder={isShowingUserList ? "Pesquisar usuários..." : "Pesquisar por nome ou codinome..."}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currentFolderId={isAdminViewingUser ? null : currentFolderId}
      folderPath={isAdminViewingUser ? [] : folderPath}
      onFolderClick={setCurrentFolderId}
      actions={
        <GalleryActions 
          isAdmin={isAdmin}
          isAdminMode={isAdminMode}
          onToggleAdminMode={onToggleAdminMode}
          targetUserId={targetUserId}
          targetUserLabel={targetUserLabel}
          onBackToUsers={onBackToUsers}
          onNewFolder={onNewFolder}
          onNewCharacter={onNewCharacter}
        />
      }
    >
      <Suspense fallback={null}>
        <Dialogs 
          dialogOpen={dialogOpen}
          folderDialogOpen={folderDialogOpen}
          deleteFolderDialogOpen={deleteFolderDialogOpen}
          folderToDelete={folderToDelete}
          folderToEdit={folderToEdit}
          currentFolderId={currentFolderId}
          setDialogOpen={setDialogOpen}
          setFolderDialogOpen={setFolderDialogOpen}
          setDeleteFolderDialogOpen={setDeleteFolderDialogOpen}
          setFolderToDelete={setFolderToDelete}
          setFolderToEdit={setFolderToEdit}
          handleCreateFolder={handleCreateFolder}
          handleUpdateFolder={handleUpdateFolder}
          handleDeleteFolder={handleDeleteFolder}
          setCurrentFolderId={setCurrentFolderId}
        />
      </Suspense>

      {error ? (
        <ErrorState error={error} />
      ) : isShowingUserList ? (
        <AdminUserList 
          users={filteredUsers} 
          onUserClick={(userId) => {
            const u = users.find(x => x.id === userId);
            if (u) handleSelectUser(u);
          }} 
        />
      ) : isGalleryEmpty ? (
        <div className={isAdminMode ? "text-center py-12 border-2 border-dashed rounded-xl bg-muted/5" : ""}>
          {isAdminMode ? (
            <p className="text-sm text-muted-foreground">Este usuário ainda não possui fichas ou pastas registradas.</p>
          ) : (
            <EmptyState onCreate={onNewCharacter} />
          )}
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
          deletingId={deletingId}
          isAdminMode={isAdminMode}
          targetUserId={targetUserId}
          ownUserId={ownUserId}
          onResetFilters={onResetFilters}
        />
      )}
    </GalleryLayout>
  );
});

export default CharacterGallery;

// Optimized Dialogs Component
const Dialogs = React.memo(function Dialogs({ 
  dialogOpen,
  folderDialogOpen,
  deleteFolderDialogOpen,
  folderToDelete,
  folderToEdit,
  currentFolderId,
  setDialogOpen,
  setFolderDialogOpen,
  setDeleteFolderDialogOpen,
  setFolderToDelete,
  setFolderToEdit,
  handleCreateFolder,
  handleUpdateFolder,
  handleDeleteFolder,
  setCurrentFolderId
}: { 
  dialogOpen: boolean;
  folderDialogOpen: boolean;
  deleteFolderDialogOpen: boolean;
  folderToDelete: Folder | null;
  folderToEdit: Folder | null;
  currentFolderId: string | null;
  setDialogOpen: (open: boolean) => void;
  setFolderDialogOpen: (open: boolean) => void;
  setDeleteFolderDialogOpen: (open: boolean) => void;
  setFolderToDelete: (folder: Folder | null) => void;
  setFolderToEdit: (folder: Folder | null) => void;
  handleCreateFolder: (name: string, parentId?: string | null) => Promise<void>;
  handleUpdateFolder: (folderId: string, name: string) => Promise<void>;
  handleDeleteFolder: (folderId: string) => Promise<void>;
  setCurrentFolderId: (id: string | null) => void;
}) {
  const onNewCharacterOpenChange = useCallback((open: boolean) => {
    if (!open) setTimeout(() => setDialogOpen(false), 0);
    else setDialogOpen(true);
  }, [setDialogOpen]);

  const onNewFolderOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setFolderDialogOpen(false);
        setFolderToEdit(null);
      }, 0);
    } else setFolderDialogOpen(true);
  }, [setFolderDialogOpen, setFolderToEdit]);

  const onDeleteFolderOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setDeleteFolderDialogOpen(false);
        setFolderToDelete(null);
      }, 0);
    } else setDeleteFolderDialogOpen(true);
  }, [setDeleteFolderDialogOpen, setFolderToDelete]);

  const onConfirmDelete = useCallback(async () => {
    if (folderToDelete) {
      await handleDeleteFolder(folderToDelete.id);
      if (currentFolderId === folderToDelete.id) {
        setCurrentFolderId(folderToDelete.parentId || null);
      }
    }
  }, [folderToDelete, handleDeleteFolder, currentFolderId, setCurrentFolderId]);

  return (
    <>
      <NewCharacterDialog
        open={dialogOpen}
        onOpenChange={onNewCharacterOpenChange}
      />

      <NewFolderDialog
        open={folderDialogOpen}
        onOpenChange={onNewFolderOpenChange}
        onCreate={handleCreateFolder}
        onUpdate={handleUpdateFolder}
        parentId={currentFolderId}
        folderToEdit={folderToEdit}
      />

      <DeleteFolderDialog
        open={deleteFolderDialogOpen}
        folderName={folderToDelete?.name || ""}
        onOpenChange={onDeleteFolderOpenChange}
        onConfirm={onConfirmDelete}
      />
    </>
  );
});
