"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit3 } from "lucide-react";
import { NewCharacterDialog } from "@/components/new-character-dialog";
import type { CharacterDocument } from "@/lib/character-service";

// Hook para gerenciar estado da galeria
function useGalleryState() {
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

// Hook para gerenciar ações da galeria
function useGalleryActions(
  userId: string | null,
  state: ReturnType<typeof useGalleryState>,
  router: ReturnType<typeof useRouter>
) {
  const { loadCharactersList, selectCharacter, removeCharacter } =
    useCharacterPersistence(userId);

  const handleSelectCharacter = async (character: CharacterDocument) => {
    try {
      await selectCharacter(character.id);
      router.push(`/dashboard/personagem/individual?id=${character.id}`);
    } catch (error) {
      console.error("Erro ao selecionar personagem:", error);
      state.setError("Erro ao selecionar personagem");
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (!confirm("Tem certeza que deseja deletar esta ficha?")) {
      return;
    }

    state.setDeletingId(characterId);
    try {
      await removeCharacter(characterId);
      state.setCharacters((prev) => prev.filter((char) => char.id !== characterId));
      state.setError(null);
    } catch (error) {
      console.error("Erro ao deletar personagem:", error);
      state.setError("Erro ao deletar ficha");
    } finally {
      state.setDeletingId(null);
    }
  };

  return {
    handleSelectCharacter,
    handleDeleteCharacter,
    loadCharactersList,
  };
}

// Componente para exibir loading
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Carregando fichas...</p>
      </div>
    </div>
  );
}

// Componente para exibir erro de autenticação
function UnauthenticatedState() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          Você precisa estar autenticado
        </p>
        <Link href="/login" className="text-primary hover:underline">
          Fazer login →
        </Link>
      </div>
    </div>
  );
}

// Componente para exibir erro
function ErrorState({ error }: { error: string }) {
  return (
    <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
      {error}
    </div>
  );
}

// Componente para exibir estado vazio
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <p className="text-muted-foreground mb-4">
        Nenhuma ficha criada ainda
      </p>
      <Button onClick={onCreate}>Criar Primeira Ficha</Button>
    </div>
  );
}

// Componente para exibir um card de personagem
function CharacterCard({
  character,
  onSelect,
  onDelete,
  isDeleting,
}: {
  character: CharacterDocument;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="rounded-lg border border-muted/20 bg-background/50 overflow-hidden hover:border-muted/50 transition-colors">
      {/* Imagem do personagem */}
      {character.identity.profileImage ? (
        <div className="h-40 bg-muted overflow-hidden relative">
          <Image
            src={character.identity.profileImage}
            alt={character.name}
            fill
            className="object-cover"
            style={{
              objectPosition: `center ${character.identity.imagePosition || 50}%`,
            }}
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
          <span className="text-4xl font-bold text-muted-foreground opacity-50">
            {character.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base">{character.name}</h3>
          <p className="text-xs text-muted-foreground">
            Herói: {character.heroName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Nível</span>
            <p className="font-semibold">
              {character.status.powerLevel}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Modificado</span>
            <p className="font-semibold">
              {new Date(character.updatedAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onSelect}
            className="flex-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente principal da galeria
export function CharacterGallery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const state = useGalleryState();
  const { handleSelectCharacter, handleDeleteCharacter, loadCharactersList } =
    useGalleryActions(user?.uid || null, state, router);

  // Verifica se deve abrir o dialog
  useEffect(() => {
    const newParam = searchParams.get("new");
    if (newParam === "true") {
      state.setDialogOpen(true);
      router.replace("/dashboard/galeria");
    }
  }, [searchParams, router, state]);

  // Carrega lista de personagens
  useEffect(() => {
    if (!user?.uid) {
      state.setIsLoading(false);
      return;
    }

    const loadCharacters = async () => {
      try {
        const loadedCharacters = await loadCharactersList();
        state.setCharacters(loadedCharacters);
        state.setError(null);
      } catch (error) {
        console.error("Erro ao carregar personagens:", error);
        state.setError("Erro ao carregar fichas de personagem");
      } finally {
        state.setIsLoading(false);
      }
    };

    loadCharacters();
  }, [user?.uid, loadCharactersList, state]);

  if (state.isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <UnauthenticatedState />;
  }

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
