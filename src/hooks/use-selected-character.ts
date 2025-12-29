import { useCharacter } from "@/contexts/CharacterContext";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useEffect, useState } from "react";
import type { CharacterDocument } from "@/lib/character-service";

/**
 * Hook que retorna a ficha selecionada do contexto
 * O carregamento é feito pelo Loader component no [id]/page.tsx
 */
export function useSelectedCharacter() {
  const { selectedCharacter } = useCharacter();
  const { setCurrentCharacterId } = useIdentityActions();

  const [character, setCharacter] = useState<CharacterDocument | null>(selectedCharacter);
  const [isLoading, setIsLoading] = useState(!selectedCharacter);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se já temos uma ficha selecionada no contexto, use-a
    if (selectedCharacter) {
      setCharacter(selectedCharacter);
      setCurrentCharacterId?.(selectedCharacter.id);
      setIsLoading(false);
      setError(null);
    } else {
      setIsLoading(false);
      setError("Nenhuma ficha selecionada");
    }
  }, [selectedCharacter, setCurrentCharacterId]);

  return { character, isLoading, error };
}
