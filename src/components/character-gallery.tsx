"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Shield, Calendar } from "lucide-react";
import { NewCharacterDialog } from "@/components/new-character-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCharacter } from "@/contexts/CharacterContext";
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
      // Atualiza contexto de seleção imediatamente para UX responsiva
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
  const heroName = character.identity?.heroName || character.identity?.name || "Sem Nome";
  const civilName = character.identity?.name;
  const powerLevel = (character.status as { powerLevel?: number }).powerLevel ?? 0;
  const updatedAt = new Date(character.updatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="group relative rounded-xl border border-muted/20 bg-card/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      {/* Imagem do personagem - Altura reduzida para compacidade */}
      <div className="h-32 w-full bg-muted overflow-hidden relative">
        {character.identity.profileImage ? (
          <>
            <Image
              src={character.identity.profileImage}
              alt={heroName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              style={{
                objectPosition: `center ${character.identity.imagePosition || 50}%`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
            <span className="text-3xl font-bold text-muted-foreground opacity-30">
              {heroName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Badge de Nível sobre a imagem */}
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-white">NP {powerLevel}</span>
        </div>
      </div>

      {/* Conteúdo Compacto */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-bold text-sm leading-tight truncate group-hover:text-primary transition-colors">
            {heroName}
          </h3>
          {civilName && civilName !== heroName && (
            <p className="text-[10px] text-muted-foreground truncate">
              {civilName}
            </p>
          )}
        </div>

          <div className="flex items-center justify-between mt-auto relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px]">{updatedAt}</span>
              </div>
            </div>

            <div className="flex gap-1.5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    disabled={isDeleting}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition-all duration-200 disabled:opacity-50"
                    title="Deletar Ficha"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Personagem?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente a ficha de{" "}
                      <span className="font-bold text-foreground">{heroName}</span> e todos os dados associados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
      </div>
      
      {/* Link invisível para o card todo ser clicável */}
      <a 
        href={`/dashboard/personagem/individual/${character.id}`}
        onClick={(e) => { e.preventDefault(); onSelect(); }}
        className="absolute inset-0 z-0"
        aria-label={`Abrir ficha de ${heroName}`}
      />
    </div>
  );
}

// Componente principal da galeria
export function CharacterGallery() {
  const router = useRouter();
  const { user } = useAuth();
  const { openNewDialog, setOpenNewDialog } = useCharacter();

  const state = useGalleryState();
  const { setCharacters, setIsLoading, setError, setDialogOpen, setDeletingId } = state;

  const { setSelectedCharacter } = useCharacter();

  const { handleSelectCharacter, handleDeleteCharacter, listenToCharacters } =
    useGalleryActions(user?.uid || null, { setCharacters, setError, setDeletingId, setSelectedCharacter }, router.push);

  // Abre o dialog quando o contexto sinaliza abertura de nova ficha
  useEffect(() => {
    if (openNewDialog) {
      setDialogOpen(true);
      // Limpa o sinal no contexto para evitar reaberturas
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
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, listenToCharacters, setCharacters, setError, setIsLoading]);

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
