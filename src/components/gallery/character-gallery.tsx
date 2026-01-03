"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NewCharacterDialog } from "@/components/new-character-dialog";
import { useCharacter } from "@/contexts/CharacterContext";
import { CharacterCard } from "./character-card";
import { useGalleryState, useGalleryActions } from "./use-gallery";
import { 
  LoadingState, 
  UnauthenticatedState, 
  ErrorState, 
  EmptyState 
} from "./gallery-states";

export default function CharacterGallery() {
  const router = useRouter();
  const { user } = useAuth();
  const { openNewDialog, setOpenNewDialog, setSelectedCharacter } = useCharacter();

  const state = useGalleryState();
  const { 
    setCharacters, 
    setIsLoading, 
    setError, 
    setDialogOpen, 
    setDeletingId 
  } = state;

  const { 
    handleSelectCharacter, 
    handleDeleteCharacter, 
    listenToCharacters 
  } = useGalleryActions(
    user?.uid || null, 
    { setCharacters, setError, setDeletingId, setSelectedCharacter }, 
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

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = listenToCharacters((chars) => {
        setCharacters(chars);
        setError(null);
        setIsLoading(false);
      });
    } catch (err) {
      console.error("Erro ao escutar mudanças em personagens:", err);
      setError("Erro ao carregar fichas de personagem");
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid, listenToCharacters, setCharacters, setError, setIsLoading]);

  if (state.isLoading) return <LoadingState />;
  if (!user) return <UnauthenticatedState />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Fichas</h1>
          <p className="text-muted-foreground">
            Gerencie suas fichas de personagem
          </p>
        </div>
        <Button onClick={() => state.setDialogOpen(true)}>+ Nova Ficha</Button>
      </div>

      <NewCharacterDialog
        open={state.dialogOpen}
        onOpenChange={state.setDialogOpen}
      />

      {state.error && <ErrorState error={state.error} />}

      {state.characters.length === 0 ? (
        <EmptyState onCreate={() => state.setDialogOpen(true)} />
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {state.characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={() => handleSelectCharacter(character)}
              onDelete={() => handleDeleteCharacter(character.id)}
              isDeleting={state.deletingId === character.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
