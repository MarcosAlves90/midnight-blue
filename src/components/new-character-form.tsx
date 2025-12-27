"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { CharacterData } from "@/lib/character-service";
import {
  INITIAL_ATTRIBUTES,
} from "@/components/status/attributes-grid/constants";
import {
  INITIAL_SKILLS,
} from "@/components/status/skills/constants";

const INITIAL_CHARACTER_NAME = "Novo Personagem";

interface NewCharacterFormProps {
  onSuccess?: (characterId: string) => void;
  onCancel?: () => void;
}

export function NewCharacterForm({ onSuccess, onCancel }: NewCharacterFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createCharacter, selectCharacter } = useCharacterPersistence(
    user?.uid || null,
  );

  const [formData, setFormData] = useState({
    name: INITIAL_CHARACTER_NAME,
    heroName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: "name" | "heroName", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      setError("Você precisa estar autenticado");
      return;
    }

    if (!formData.name.trim()) {
      setError("Nome do indivíduo é obrigatório");
      return;
    }

    if (!formData.heroName.trim()) {
      setError("Nome do herói é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      // Criar dados iniciais do personagem
      const newCharacterData: CharacterData = {
        userId: user.uid,
        name: formData.name.trim(),
        heroName: formData.heroName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        identity: {
          name: formData.name.trim(),
          player: user.displayName || "", // Usar nome do usuário autenticado
          alternateIdentity: "",
          identityStatus: "Secret",
          gender: "",
          age: "",
          height: "",
          weight: "",
          eyes: "",
          hair: "",
          groupAffiliation: "",
          baseOfOperations: "",
          powerOrigin: "",
          motivation: "",
          placeOfBirth: "",
          occupation: "",
          favoriteColor: "#1e3a8a",
          profileImage: "",
          imagePosition: 50,
          history: "",
          complications: [],
        },
        attributes: INITIAL_ATTRIBUTES.map((attr) => ({
          id: attr.id,
          value: attr.value,
        })),
        skills: INITIAL_SKILLS.map((skill) => ({
          id: skill.id,
          value: skill.value ?? 0,
          others: skill.others ?? 0,
        })),
        powers: [],
        status: {
          powerLevel: 10,
          extraPoints: 0,
          defenses: {
            apararPoints: 0,
            esquivaPoints: 0,
            fortitudePoints: 0,
            resistenciaPoints: 0,
            vontadePoints: 0,
            deslocamento: 8,
          },
        },
      };

      // Criar personagem no Firebase
      const characterId = await createCharacter(newCharacterData);

      // Marcar como selecionado
      await selectCharacter(characterId);

      // Callback ou redirecionamento
      if (onSuccess) {
        onSuccess(characterId);
      } else {
        router.push(`/dashboard/personagem/individual?id=${characterId}`);
      }
    } catch (err) {
      console.error("Erro ao criar personagem:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao criar personagem",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome do Indivíduo</label>
        <FormInput
          type="text"
          placeholder="Ex: John Doe"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          disabled={isLoading}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nome do Herói</label>
        <FormInput
          type="text"
          placeholder="Ex: Nightshift"
          value={formData.heroName}
          onChange={(e) => handleInputChange("heroName", e.target.value)}
          disabled={isLoading}
          className="bg-background"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Criando..." : "Criar Ficha"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
