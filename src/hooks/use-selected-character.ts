import { useSearchParams } from "next/navigation";
import { useCharacter } from "@/contexts/CharacterContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import type { CharacterDocument } from "@/lib/character-service";

/**
 * Hook que carrega a ficha selecionada usando o contexto ou query param
 * Prioridade:
 * 1. CharacterContext (se já selecionada)
 * 2. Query param ?id=characterId
 * 3. Caracter não encontrado
 */
export function useSelectedCharacter() {
  const { selectedCharacter } = useCharacter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { loadCharacter } = useCharacterPersistence(user?.uid || null);

  const [character, setCharacter] = useState<CharacterDocument | null>(selectedCharacter);
  const [isLoading, setIsLoading] = useState(!selectedCharacter);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se já temos uma ficha selecionada no contexto, use-a
    if (selectedCharacter) {
      setCharacter(selectedCharacter);
      setIsLoading(false);
      return;
    }

    // Caso contrário, tente carregar da query param
    const characterId = searchParams.get("id");

    if (!characterId || !user?.uid) {
      setError("Nenhuma ficha selecionada");
      setIsLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      try {
        const char = await loadCharacter(characterId);
        if (char) {
          setCharacter(char);
          setError(null);
        } else {
          setError("Ficha não encontrada");
        }
      } catch (err) {
        setError("Erro ao carregar ficha");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [selectedCharacter, searchParams, user?.uid, loadCharacter]);

  return { character, isLoading, error };
}
