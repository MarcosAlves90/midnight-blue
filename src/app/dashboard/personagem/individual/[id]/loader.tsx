"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { useCharacter } from "@/contexts/CharacterContext";
import { Individual } from "@/components/individual";

export default function Loader({ id }: { id: string }) {
  const { user } = useAuth();
  const { loadCharacter } = useCharacterPersistence(user?.uid || null);
  const { setSelectedCharacter } = useCharacter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user?.uid || !id) {
        setError("Usuário não autenticado ou id inválido");
        setLoading(false);
        return;
      }

      try {
        const char = await loadCharacter(id);
        if (!cancelled) {
          if (char) {
            // Apenas sincroniza CharacterContext, não IdentityContext
            // Individual vai cuidar de sincronizar para IdentityContext
            setSelectedCharacter(char);
            setError(null);
          } else {
            setSelectedCharacter(null);
            setError("Ficha não encontrada");
          }
        }
      } catch (err) {
        console.error("Falha ao carregar personagem por id:", err);
        if (!cancelled) setError("Erro ao carregar ficha");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, user?.uid, loadCharacter, setSelectedCharacter]);

  if (loading) return <div>Carregando ficha...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return <Individual />;
}
