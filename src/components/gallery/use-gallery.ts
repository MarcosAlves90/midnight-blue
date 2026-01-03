"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import type { CharacterDocument, Folder } from "@/lib/character-service";

export function useGalleryState() {
  const [characters, setCharacters] = useState<CharacterDocument[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  return {
    characters,
    setCharacters,
    folders,
    setFolders,
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
    searchQuery,
    setSearchQuery,
    currentFolderId,
    setCurrentFolderId,
  };
}

export function useGalleryActions(
  userId: string | null,
  handlers: {
    setCharacters: Dispatch<SetStateAction<CharacterDocument[]>>;
    setFolders: Dispatch<SetStateAction<Folder[]>>;
    setError: Dispatch<SetStateAction<string | null>>;
    setDeletingId: Dispatch<SetStateAction<string | null>>;
    setSelectedCharacter?: (c: CharacterDocument | null) => void;
  },
  push: (url: string) => void
) {
  const { 
    listenToCharacters, 
    selectCharacter, 
    removeCharacter,
    createFolder,
    deleteFolder,
    moveCharacterToFolder,
    listenToFolders
  } = useCharacterPersistence(userId);

  const handleSelectCharacter = async (character: CharacterDocument) => {
    try {
      handlers.setSelectedCharacter?.(character);
      await selectCharacter(character.id);
      push(`/dashboard/personagem/individual/${character.id}`);
    } catch (error) {
      console.error("Erro ao selecionar personagem:", error);
      handlers.setError("Erro ao selecionar personagem");
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    handlers.setDeletingId(characterId);
    try {
      await removeCharacter(characterId);
      handlers.setCharacters((prev) => prev.filter((char) => char.id !== characterId));
      handlers.setError(null);
    } catch (error) {
      console.error("Erro ao deletar personagem:", error);
      handlers.setError("Erro ao deletar ficha");
    } finally {
      handlers.setDeletingId(null);
    }
  };

  const handleCreateFolder = async (name: string, parentId: string | null = null) => {
    try {
      await createFolder(name, parentId);
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
      handlers.setError("Erro ao criar pasta");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder(folderId);
    } catch (error) {
      console.error("Erro ao deletar pasta:", error);
      handlers.setError("Erro ao deletar pasta");
    }
  };

  const handleMoveToFolder = async (characterId: string, folderId: string | null) => {
    try {
      await moveCharacterToFolder(characterId, folderId);
    } catch (error) {
      console.error("Erro ao mover personagem:", error);
      handlers.setError("Erro ao mover personagem");
    }
  };

  return {
    handleSelectCharacter,
    handleDeleteCharacter,
    handleCreateFolder,
    handleDeleteFolder,
    handleMoveToFolder,
    listenToCharacters,
    listenToFolders,
  };
}
