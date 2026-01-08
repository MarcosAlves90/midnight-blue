"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { useCharacter } from "@/contexts/CharacterContext";
import Status from "@/components/pages/status/status";
import { StatusSkeleton } from "@/components/pages/status/status-skeleton";

export default function Loader({ id }: { id: string }) {
  const { loading: authLoading } = useAuth();
  const { activeContextId } = useAdmin();
  
  const { loadCharacter } = useCharacterPersistence(activeContextId);
  const { setSelectedCharacter } = useCharacter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    const load = async () => {
      if (!activeContextId || !id) {
        setError("Usuário não autenticado ou id inválido");
        setLoading(false);
        return;
      }

      try {
        const char = await loadCharacter(id);
        if (!cancelled) {
          if (char) {
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
  }, [id, activeContextId, authLoading, loadCharacter, setSelectedCharacter]);

  if (loading) return <StatusSkeleton />;
  if (error) return <div className="text-red-500">{error}</div>;

  return <Status />;
}
