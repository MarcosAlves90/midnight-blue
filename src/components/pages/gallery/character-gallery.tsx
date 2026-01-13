"use client";

import { Suspense, lazy, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { GalleryLayout } from "@/components/ui/custom/gallery-layout";
// Consider lazy loading dialogs for better initial bundle size and performance
const NewCharacterDialog = lazy(() =>
  import("./new-character-dialog").then((m) => ({
    default: m.NewCharacterDialog,
  })),
);
const NewFolderDialog = lazy(() =>
  import("./new-folder-dialog").then((m) => ({ default: m.NewFolderDialog })),
);
const DeleteFolderDialog = lazy(() =>
  import("./delete-folder-dialog").then((m) => ({
    default: m.DeleteFolderDialog,
  })),
);

import {
  LoadingState,
  UnauthenticatedState,
  ErrorState,
  EmptyState,
} from "./gallery-states";
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
    isAdminMode,
    targetUserId,
    targetUserLabel,
    resetAdmin,
    ownUserId,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    currentFolderId,
    setCurrentFolderId,
    folders,
    characters,
    users,
    handleSelectUser,
    handleSelectCharacter,
    handleDeleteCharacter,
    handleCreateFolder,
    handleUpdateFolder,
    handleDeleteFolder,
    handleMoveToFolder,
    setDialogOpen,
    setFolderDialogOpen,
    setFolderToDelete,
    setDeleteFolderDialogOpen,
    setFolderToEdit,
    dialogOpen,
    folderDialogOpen,
    deleteFolderDialogOpen,
    folderToDelete,
    folderToEdit,
    deletingId,
  } = gallery;

  // -- Memoized Handlers --
  const onNewFolder = useCallback(
    () => setFolderDialogOpen(true),
    [setFolderDialogOpen],
  );
  const onNewCharacter = useCallback(
    () => setDialogOpen(true),
    [setDialogOpen],
  );
  const onResetFilters = useCallback(() => {
    setSearchQuery("");
    setCurrentFolderId(null);
  }, [setSearchQuery, setCurrentFolderId]);

  const handleFolderClick = useCallback(
    (id: string | null) => {
      if (isAdminMode && id === null) {
        // Clicou em "CONTAS" - Volta para a listagem de usuários
        resetAdmin();
        setCurrentFolderId(null);
      } else if (id === "admin-root") {
        // Clicou no nome do usuário no Breadcrumb - Volta para a raiz deste usuário
        setCurrentFolderId(null);
      } else {
        // Comportamento normal para pastas
        setCurrentFolderId(id);
      }
    },
    [isAdminMode, resetAdmin, setCurrentFolderId],
  );

  // -- Derived Data --
  const folderPath = useMemo(() => {
    const path: Folder[] = [];

    // Se estiver em modo admin e visualizando um usuário, injetamos ele na trilha
    if (isAdminMode && targetUserId) {
      path.push({
        id: "admin-root",
        name: targetUserLabel || "CONTA",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    let currentId = currentFolderId;
    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (folder) {
        path.push(folder); // Adicionando ao final e depois corrigindo se necessário
      }
      currentId = folders.find((f) => f.id === currentId)?.parentId || null;
    }

    // Lógica correta de path:
    const finalPath: Folder[] = [];
    if (isAdminMode && targetUserId) {
      finalPath.push({
        id: "admin-root",
        name: targetUserLabel || "CONTA",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const subPath: Folder[] = [];
    let cid = currentFolderId;
    while (cid) {
      const f = folders.find((x) => x.id === cid);
      if (f) {
        subPath.unshift(f);
        cid = f.parentId || null;
      } else break;
    }

    return [...finalPath, ...subPath];
  }, [currentFolderId, folders, isAdminMode, targetUserId, targetUserLabel]);

  const filteredUsers = useMemo(() => {
    if (!isAdminMode) return [];
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        !q ||
        (u.displayName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q),
    );
  }, [isAdminMode, users, searchQuery]);

  const filteredFolders = useMemo(() => {
    if (isAdminMode && !targetUserId) return [];
    const q = searchQuery.toLowerCase();
    return folders.filter(
      (f) =>
        f.name.toLowerCase().includes(q) &&
        (f.parentId || null) === currentFolderId,
    );
  }, [folders, searchQuery, currentFolderId, isAdminMode, targetUserId]);

  const filteredCharacters = useMemo(() => {
    if (isAdminMode && !targetUserId) return [];
    const q = searchQuery.toLowerCase();
    return characters.filter(
      (char) =>
        (char.identity.name.toLowerCase().includes(q) ||
          char.identity.heroName.toLowerCase().includes(q)) &&
        (char.folderId || null) === currentFolderId,
    );
  }, [characters, searchQuery, currentFolderId, isAdminMode, targetUserId]);

  const handleUserClick = useCallback(
    (userId: string) => {
      const u = users.find((x) => x.id === userId);
      if (u) handleSelectUser(u);
    },
    [users, handleSelectUser],
  );

  if (!user && !isLoading) return <UnauthenticatedState />;

  const isShowingUserList = isAdminMode && !targetUserId;
  const isGalleryEmpty = characters.length === 0 && folders.length === 0;

  return (
    <GalleryLayout
      title="Minhas Fichas"
      description="Gerencie e organize seus personagens"
      searchPlaceholder="Pesquisar por nome ou codinome..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currentFolderId={currentFolderId}
      folderPath={folderPath}
      onFolderClick={handleFolderClick}
      rootLabel={isAdminMode ? "CONTAS" : "RAIZ"}
      actions={
        <GalleryActions
          isAdminMode={isAdminMode}
          targetUserId={targetUserId}
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

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : isShowingUserList ? (
        <AdminUserList
          users={filteredUsers}
          onUserClick={handleUserClick}
          selectedUserId={targetUserId}
        />
      ) : isGalleryEmpty ? (
        <div
          className={
            isAdminMode
              ? "text-center py-20 border-2 border-dashed rounded-2xl bg-muted/5"
              : ""
          }
        >
          {isAdminMode ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-bold uppercase">Galeria Vazia</p>
              <p className="text-sm text-muted-foreground">
                Este usuário não possui fichas nesta pasta.
              </p>
            </div>
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
          onFolderDelete={(f) => {
            setFolderToDelete(f);
            setDeleteFolderDialogOpen(true);
          }}
          onFolderEdit={(f) => {
            setFolderToEdit(f);
            setFolderDialogOpen(true);
          }}
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
  setCurrentFolderId,
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
  const onNewCharacterOpenChange = useCallback(
    (open: boolean) => {
      if (!open) setTimeout(() => setDialogOpen(false), 0);
      else setDialogOpen(true);
    },
    [setDialogOpen],
  );

  const onNewFolderOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setTimeout(() => {
          setFolderDialogOpen(false);
          setFolderToEdit(null);
        }, 0);
      } else setFolderDialogOpen(true);
    },
    [setFolderDialogOpen, setFolderToEdit],
  );

  const onDeleteFolderOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setTimeout(() => {
          setDeleteFolderDialogOpen(false);
          setFolderToDelete(null);
        }, 0);
      } else setDeleteFolderDialogOpen(true);
    },
    [setDeleteFolderDialogOpen, setFolderToDelete],
  );

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
