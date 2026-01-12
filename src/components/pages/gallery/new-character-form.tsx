"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/AdminContext";
import { useCharacterPersistence } from "@/hooks/use-character-persistence";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User, Fingerprint, AlertCircle } from "lucide-react";
import type { CharacterData } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { INITIAL_ATTRIBUTES } from "@/components/pages/status/attributes-grid/constants";
import { INITIAL_SKILLS } from "@/components/pages/status/skills/constants";

const INITIAL_CHARACTER_NAME = "";

interface NewCharacterFormProps {
  onSuccess?: (characterId: string) => void;
  onCancel?: () => void;
}

export function NewCharacterForm({ onSuccess, onCancel }: NewCharacterFormProps) {
  const router = useRouter();
  const { activeContextId } = useAdmin();
  
  // Usamos activeContextId para garantir que a ficha seja criada no contexto correto (Admin ou Próprio)
  const { createCharacter, selectCharacter } = useCharacterPersistence(
    activeContextId,
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

    if (!activeContextId) {
      setError("Contexto de usuário não identificado");
      return;
    }

    if (!formData.name.trim()) {
      setError("Nome do indivíduo é obrigatório");
      return;
    }

    if (!formData.heroName.trim()) {
      setError("Codinome é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      // Criar dados iniciais do personagem (Single Responsibility Principle)
      const newCharacterData: CharacterData = {
        userId: activeContextId,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        identity: {
          name: formData.name.trim(),
          heroName: formData.heroName.trim(),
          alternateIdentity: "",
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
        attributes: INITIAL_ATTRIBUTES.map((attr) => ({ ...attr, value: attr.value })),
        skills: INITIAL_SKILLS.map((skill) => ({ ...skill, value: skill.value ?? 0, others: skill.others ?? 0 })),
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
        customDescriptors: [],
      };

      // Criar personagem no Firebase (Inversion of Control via Repository pattern no hook)
      const characterId = await createCharacter(newCharacterData);

      // Sincronizar com o perfil do usuário alvo
      await selectCharacter(characterId);

      onSuccess?.(characterId);
      
      // Se não houver callback, redireciona para a visão individual
      if (!onSuccess) {
        router.push(`/dashboard/personagem/individual/${characterId}`);
      }
    } catch (err) {
      console.error("[NewCharacterForm] Erro ao criar:", err);
      setError(err instanceof Error ? err.message : "Erro ao criar dossier");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mugshot Placeholder */}
      <div className="relative w-full h-48 bg-muted/30 rounded border-2 border-dashed border-primary/20 overflow-hidden flex items-center justify-center group">
        {/* Height Scale Visual Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col justify-between py-2 px-1 font-mono">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full border-t border-foreground/50 flex justify-end">
              <span className="text-[6px] leading-none pr-0.5">{180 - i * 10}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="w-8 h-8 opacity-20" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest">Aguardando Imagem</span>
        </div>

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/30" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/30" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/30" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/30" />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary/70 flex items-center gap-1.5">
              <Fingerprint className="w-3 h-3" />
              Nome Civil do Indivíduo
            </label>
            <Input
              placeholder="EX: JOHN DOE"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn(
                "bg-muted/20 border-primary/10 font-mono uppercase placeholder:opacity-30 focus-visible:ring-primary/30",
                error && !formData.name && "border-destructive/50"
              )}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary/70 flex items-center gap-1.5">
              <User className="w-3 h-3" />
              Codinome / Identidade Secreta
            </label>
            <Input
              placeholder="EX: SENTINELA"
              value={formData.heroName}
              onChange={(e) => handleInputChange("heroName", e.target.value)}
              className={cn(
                "bg-muted/20 border-primary/10 font-mono uppercase placeholder:opacity-30 focus-visible:ring-primary/30",
                error && !formData.heroName && "border-destructive/50"
              )}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono uppercase">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 font-mono text-[10px] uppercase tracking-widest border-primary/10 hover:bg-primary/5"
          >
            Abortar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 font-mono text-[10px] uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Processando...
              </>
            ) : (
              "Registrar"
            )}
          </Button>
        </div>
      </div>

      {/* Decorative footer */}
      <div className="pt-4 border-t border-primary/5 flex justify-between items-center opacity-30">
        <span className="text-[8px] font-mono uppercase tracking-tighter">Status: Pendente de Aprovação</span>
        <span className="text-[8px] font-mono uppercase tracking-tighter">Ref: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
      </div>
    </form>
  );
}
