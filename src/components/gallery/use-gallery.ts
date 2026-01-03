"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import type { CharacterDocument } from "@/lib/character-service";

export function useGalleryState() {
  const [characters, setCharacters] = useState<CharacterDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return {
    characters,
    setCharacters,
    isLoading,
    setIsLoading,
    error,
    setError,
    deletingId,
    setDeletingId,
    dialogOpen,
    setDialogOpen,
  };
}

export function useGalleryActions(
  userId: string | null,
  handlers: {
    setCharacters: Dispatch<SetStateAction<CharacterDocument[]>>;
    setError: Dispatch<SetStateAction<string | null>>;
    setDeletingId: Dispatch<SetStateAction<string | null>>;
    setSelectedCharacter?: (c: CharacterDocument | null) => void;
  },
  push: (url: string) => void
) {
  const { listenToCharacters, selectCharacter, removeCharacter } =
    useCharacterPersistence(userId);

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

  return {
    handleSelectCharacter,
    handleDeleteCharacter,
    listenToCharacters,
  };
}
