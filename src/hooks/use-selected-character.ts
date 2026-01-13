import { useCharacter } from "@/contexts/CharacterContext";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useEffect } from "react";

/**
 * Hook que retorna a ficha selecionada do contexto.
 * Simples e direto, evitando duplicação de estado.
 */
export function useSelectedCharacter() {
  const { selectedCharacter, isLoading: contextLoading } = useCharacter();
  const { setCurrentCharacterId } = useIdentityActions();

  useEffect(() => {
    if (selectedCharacter?.id) {
      setCurrentCharacterId?.(selectedCharacter.id);
    }
  }, [selectedCharacter?.id, setCurrentCharacterId]);

  return {
    character: selectedCharacter,
    isLoading: contextLoading,
    error:
      !selectedCharacter && !contextLoading
        ? "Nenhuma ficha selecionada"
        : null,
  };
}
