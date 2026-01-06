"use client";

import { useState, useCallback, useMemo } from "react";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import type { CharacterDocument, Folder } from "@/lib/types/character";
import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserService, type UserProfile } from "@/services/user-service";
import { useRouter } from "next/navigation";
import { useCharacter } from "@/contexts/CharacterContext";

/**
 * Hook para gerenciar o estado bruto da galeria.
 * Mantido por compatibilidade com componentes que ainda usam a estrutura antiga.
 */
export function useGalleryState() {
  const [characters, setCharacters] = useState<CharacterDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setCharacters([]);
    setFolders([]);
    setCurrentFolderId(null);
    setSearchQuery("");
  }, []);

  return {
    characters,
    setCharacters,
    folders,
    setFolders,
    users,
    setUsers,
    isLoading,
    setIsLoading,
    error,
    setError,
    deletingId,
    setDeletingId,
    dialogOpen,
    setDialogOpen,
    folderDialogOpen,
    setFolderDialogOpen,
    deleteFolderDialogOpen,
    setDeleteFolderDialogOpen,
    folderToDelete,
    setFolderToDelete,
    folderToEdit,
    setFolderToEdit,
    searchQuery,
    setSearchQuery,
    currentFolderId,
    setCurrentFolderId,
    resetState,
  };
}

/**
 * Hook para gerenciar as ações da galeria.
 * Centraliza a lógica de negócio e interação com serviços de persistência.
 */
export function useGalleryActions(
  userId: string | null,
  handlers: {
    setCharacters: (c: CharacterDocument[]) => void;
    setFolders: (f: Folder[]) => void;
    setUsers?: (u: UserProfile[]) => void;
    setError: (e: string | null) => void;
    setDeletingId: (id: string | null) => void;
    setSelectedCharacter?: (c: CharacterDocument | null) => void;
  },
  push: (url: string) => void
) {
  const { isAdminMode, targetUserId } = useAdmin();
  const effectiveUserId = (isAdminMode && targetUserId) ? targetUserId : userId;

  const { 
    listenToCharacters, 
    selectCharacter, 
    removeCharacter,
    createFolder,
    updateFolder,
    deleteFolder,
    moveCharacterToFolder,
    listenToFolders
  } = useCharacterPersistence(effectiveUserId);

  const fetchUsers = useCallback(async () => {
    try {
      const allUsers = await UserService.listAllUsers();
      handlers.setUsers?.(allUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      handlers.setError("Erro ao carregar lista de usuários");
    }
  }, [handlers]);

  const fetchUser = useCallback(async (uid: string) => {
    try {
      const user = await UserService.getUser(uid);
      if (user) {
        handlers.setUsers?.([user]); // No modo de busca individual simplificado
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  }, [handlers]);

  const handleSelectCharacter = useCallback(async (character: CharacterDocument) => {
    try {
      handlers.setSelectedCharacter?.(character);
      await selectCharacter(character.id);
      push(`/dashboard/personagem/individual/${character.id}`);
    } catch (error) {
      console.error("Erro ao selecionar personagem:", error);
      handlers.setError("Erro ao selecionar personagem");
    }
  }, [handlers, selectCharacter, push]);

  const handleDeleteCharacter = useCallback(async (characterId: string) => {
    handlers.setDeletingId(characterId);
    try {
      await removeCharacter(characterId);
      handlers.setError(null);
    } catch (error) {
      console.error("Erro ao deletar personagem:", error);
      handlers.setError("Erro ao deletar ficha");
    } finally {
      handlers.setDeletingId(null);
    }
  }, [handlers, removeCharacter]);

  const handleCreateFolder = useCallback(async (name: string, parentId: string | null = null) => {
    try {
      await createFolder(name, parentId);
    } catch {
      handlers.setError("Erro ao criar pasta");
    }
  }, [handlers, createFolder]);

  const handleUpdateFolder = useCallback(async (folderId: string, name: string) => {
    try {
      await updateFolder(folderId, name);
    } catch {
      handlers.setError("Erro ao atualizar pasta");
    }
  }, [handlers, updateFolder]);

  const handleDeleteFolder = useCallback(async (folderId: string) => {
    try {
      await deleteFolder(folderId);
    } catch {
      handlers.setError("Erro ao deletar pasta");
    }
  }, [handlers, deleteFolder]);

  const handleMoveToFolder = useCallback(async (characterId: string, folderId: string | null) => {
    try {
      await moveCharacterToFolder(characterId, folderId);
    } catch {
      handlers.setError("Erro ao mover personagem");
    }
  }, [handlers, moveCharacterToFolder]);

  return {
    handleSelectCharacter,
    handleDeleteCharacter,
    handleCreateFolder,
    handleUpdateFolder,
    handleDeleteFolder,
    handleMoveToFolder,
    listenToCharacters,
    listenToFolders,
    fetchUsers,
    fetchUser
  };
}

/**
 * NOVO: Hook unificado (Recomendado)
 * Resolve o acoplamento excessivo e centraliza tudo em uma interface limpa.
 */
export function useGallery() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { setSelectedCharacter } = useCharacter();
  const { isAdminMode, targetUserId, setIsAdminMode, setTargetUserId } = useAdmin();
  
  const state = useGalleryState();
  
  const handlers = useMemo(() => ({
    setCharacters: state.setCharacters,
    setFolders: state.setFolders,
    setUsers: state.setUsers,
    setError: state.setError,
    setDeletingId: state.setDeletingId,
    setSelectedCharacter
  }), [state.setCharacters, state.setFolders, state.setUsers, state.setError, state.setDeletingId, setSelectedCharacter]);

  const actions = useGalleryActions(user?.uid || null, handlers, router.push);

  return {
    ...state,
    ...actions,
    isAdmin,
    isAdminMode,
    targetUserId,
    setIsAdminMode,
    setTargetUserId,
    ownUserId: user?.uid || null
  };
}
