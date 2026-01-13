"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import type { CharacterDocument, Folder } from "@/lib/types/character";
import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";
import { type UserProfile } from "@/services/user-service";
import { useRouter } from "next/navigation";
import { useCharacter } from "@/contexts/CharacterContext";

/**
 * Interface unificada para o estado da galeria
 */
export interface GalleryState {
  characters: CharacterDocument[];
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
  dialogOpen: boolean;
  folderDialogOpen: boolean;
  deleteFolderDialogOpen: boolean;
  folderToDelete: Folder | null;
  folderToEdit: Folder | null;
  searchQuery: string;
  currentFolderId: string | null;
}

export function useGallery() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { setSelectedCharacter, openNewDialog, setOpenNewDialog } =
    useCharacter();
  const {
    isAdminMode,
    targetUserId,
    targetUserLabel,
    isAdminRestored,
    activeContextId,
    users,
    fetchUsers,
    setIsAdminMode,
    setTargetUserId,
    setTargetUserLabel,
    resetAdmin,
  } = useAdmin();

  const [state, setState] = useState<GalleryState>({
    characters: [],
    folders: [],
    isLoading: true,
    error: null,
    deletingId: null,
    dialogOpen: false,
    folderDialogOpen: false,
    deleteFolderDialogOpen: false,
    folderToDelete: null,
    folderToEdit: null,
    searchQuery: "",
    currentFolderId: null,
  });

  // Auxiliar para atualizar estado parcial
  const patchState = useCallback((patch: Partial<GalleryState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // Sincroniza abertura de dialog via contexto global (ex: atalho do sidebar)
  useEffect(() => {
    if (openNewDialog) {
      patchState({ dialogOpen: true });
      setOpenNewDialog(false);
    }
  }, [openNewDialog, setOpenNewDialog, patchState]);

  const {
    listenToCharacters,
    selectCharacter,
    removeCharacter,
    createFolder,
    updateFolder,
    deleteFolder,
    moveCharacterToFolder,
    listenToFolders,
  } = useCharacterPersistence(activeContextId);

  const handleSelectUser = useCallback(
    (targetUser: UserProfile) => {
      setTargetUserId(targetUser.id);
      setTargetUserLabel(
        targetUser.displayName || targetUser.email || "Usuário",
      );
      patchState({ searchQuery: "", currentFolderId: null });
    },
    [setTargetUserId, setTargetUserLabel, patchState],
  );

  // -- Sincronização de Dados --
  useEffect(() => {
    if (!isAdminRestored) return;

    // Reset ao trocar de usuário ou modo - IMPORTANT: Limpar currentFolderId ao mudar de contexto
    patchState({
      characters: [],
      folders: [],
      isLoading: !!activeContextId,
      currentFolderId: null,
    });

    if (!activeContextId || (isAdminMode && !targetUserId)) {
      if (!activeContextId) patchState({ isLoading: false });
      return;
    }

    const unsubChars = listenToCharacters(
      (chars) =>
        patchState({ characters: chars, isLoading: false, error: null }),
      () =>
        patchState({
          error: "Erro ao sincronizar personagens",
          isLoading: false,
        }),
    );

    const unsubFolders = listenToFolders(
      (f) => patchState({ folders: f }),
      () => console.error("Erro ao sincronizar pastas"),
    );

    return () => {
      unsubChars();
      unsubFolders();
    };
  }, [
    activeContextId,
    isAdminMode,
    targetUserId,
    listenToCharacters,
    listenToFolders,
    patchState,
    isAdminRestored,
  ]);

  // -- Handlers de Negócio --
  const handleSelectCharacter = useCallback(
    async (character: CharacterDocument) => {
      try {
        setSelectedCharacter(character);
        await selectCharacter(character.id);
        router.push(`/dashboard/personagem/individual/${character.id}`);
      } catch {
        patchState({ error: "Erro ao abrir personagem" });
      }
    },
    [setSelectedCharacter, selectCharacter, router, patchState],
  );

  const handleDeleteCharacter = useCallback(
    async (id: string) => {
      patchState({ deletingId: id });
      try {
        await removeCharacter(id);
      } catch {
        patchState({ error: "Erro ao deletar personagem" });
      } finally {
        patchState({ deletingId: null });
      }
    },
    [removeCharacter, patchState],
  );

  // ... rest of the handlers wrapped in useCallback ...
  const handleCreateFolder = useCallback(
    async (name: string, parentId: string | null = null) => {
      try {
        await createFolder(name, parentId);
      } catch {
        patchState({ error: "Erro ao criar pasta" });
      }
    },
    [createFolder, patchState],
  );

  const handleUpdateFolder = useCallback(
    async (id: string, name: string) => {
      try {
        await updateFolder(id, name);
      } catch {
        patchState({ error: "Erro ao atualizar pasta" });
      }
    },
    [updateFolder, patchState],
  );

  const handleDeleteFolder = useCallback(
    async (id: string) => {
      try {
        await deleteFolder(id);
      } catch {
        patchState({ error: "Erro ao deletar pasta" });
      }
    },
    [deleteFolder, patchState],
  );

  const handleMoveToFolder = useCallback(
    async (charId: string, folderId: string | null) => {
      try {
        await moveCharacterToFolder(charId, folderId);
      } catch {
        patchState({ error: "Erro ao mover" });
      }
    },
    [moveCharacterToFolder, patchState],
  );

  return useMemo(
    () => ({
      ...state,
      users,
      isAdmin,
      isAdminMode,
      targetUserId,
      targetUserLabel,
      isAdminRestored,
      ownUserId: user?.uid || null,
      setIsAdminMode,
      setTargetUserId,
      setTargetUserLabel,
      resetAdmin,
      fetchUsers,
      handleSelectUser,
      handleSelectCharacter,
      handleDeleteCharacter,
      handleCreateFolder,
      handleUpdateFolder,
      handleDeleteFolder,
      handleMoveToFolder,
      setSearchQuery: (q: string) => patchState({ searchQuery: q }),
      setCurrentFolderId: (id: string | null) =>
        patchState({ currentFolderId: id }),
      setDialogOpen: (open: boolean) => patchState({ dialogOpen: open }),
      setFolderDialogOpen: (open: boolean) =>
        patchState({ folderDialogOpen: open }),
      setDeleteFolderDialogOpen: (open: boolean) =>
        patchState({ deleteFolderDialogOpen: open }),
      setFolderToDelete: (f: Folder | null) =>
        patchState({ folderToDelete: f }),
      setFolderToEdit: (f: Folder | null) => patchState({ folderToEdit: f }),
      setError: (e: string | null) => patchState({ error: e }),
      setIsLoading: (l: boolean) => patchState({ isLoading: l }),
    }),
    [
      state,
      users,
      isAdmin,
      isAdminMode,
      targetUserId,
      targetUserLabel,
      isAdminRestored,
      user?.uid,
      setIsAdminMode,
      setTargetUserId,
      setTargetUserLabel,
      resetAdmin,
      fetchUsers,
      handleSelectUser,
      handleSelectCharacter,
      handleDeleteCharacter,
      handleCreateFolder,
      handleUpdateFolder,
      handleDeleteFolder,
      handleMoveToFolder,
      patchState,
    ],
  );
}
