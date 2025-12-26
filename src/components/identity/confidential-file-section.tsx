import React from "react";
import { Shield, Users, MapPin, Zap, Heart } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Textarea } from "@/components/ui/textarea";
import { Tip } from "@/components/ui/tip";
import { IdentityData } from "@/contexts/IdentityContext";

interface ConfidentialFileSectionProps {
  identity: IdentityData;
  onFieldChange: (field: keyof IdentityData, value: string) => void;
}

export const ConfidentialFileSection: React.FC<
  ConfidentialFileSectionProps
> = ({ identity, onFieldChange }) => (
  <div className="bg-card rounded-xl p-6 h-full">
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
      <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Arquivo Confidencial
      </h3>
    </div>

    <div className="space-y-5">
      <div className="space-y-1.5">
        <Tip
          content={
            <div className="max-w-xs text-xs">
              O grupo ou organização ao qual o herói pertence (ex: Liga da
              Justiça, Vingadores).
            </div>
          }
          side="top"
          align="start"
        >
          <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
            <Users className="w-3 h-3" aria-hidden="true" />
            <span className="decoration-dotted underline underline-offset-2">
              Afiliação
            </span>
          </label>
        </Tip>
        <FormInput
          value={identity.groupAffiliation}
          onChange={(e) => onFieldChange("groupAffiliation", e.target.value)}
          placeholder="Ex: Liga da Justiça..."
          aria-label="Afiliação ou grupo do personagem"
        />
      </div>

      <div className="space-y-1.5">
        <Tip
          content={
            <div className="max-w-xs text-xs">
              O local onde o herói opera ou vive (ex: Batcaverna, Torre dos
              Titãs, Cidade de Nova York).
            </div>
          }
          side="top"
          align="start"
        >
          <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
            <MapPin className="w-3 h-3" aria-hidden="true" />
            <span className="decoration-dotted underline underline-offset-2">
              Base de Operações
            </span>
          </label>
        </Tip>
        <FormInput
          value={identity.baseOfOperations}
          onChange={(e) => onFieldChange("baseOfOperations", e.target.value)}
          placeholder="Ex: Batcaverna..."
          aria-label="Base de operações do personagem"
        />
      </div>

      <div className="space-y-1.5">
        <Tip
          content={
            <div className="max-w-xs text-xs">
              A fonte dos poderes do herói (ex: Mutante, Tecnológico, Místico,
              Treinamento).
            </div>
          }
          side="top"
          align="start"
        >
          <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
            <Zap className="w-3 h-3" aria-hidden="true" />
            <span className="decoration-dotted underline underline-offset-2">
              Origem dos Poderes
            </span>
          </label>
        </Tip>
        <FormInput
          value={identity.powerOrigin}
          onChange={(e) => onFieldChange("powerOrigin", e.target.value)}
          placeholder="Ex: Acidente Químico..."
          aria-label="Origem dos poderes do personagem"
        />
      </div>

      <div className="space-y-1.5">
        <Tip
          content={
            <div className="max-w-xs text-xs">
              A razão pela qual o personagem age como herói (ex:
              Responsabilidade, Justiça, Vingança).
            </div>
          }
          side="top"
          align="start"
        >
          <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1 cursor-help w-fit">
            <Heart className="w-3 h-3" aria-hidden="true" />
            <span className="decoration-dotted underline underline-offset-2">
              Motivação
            </span>
          </label>
        </Tip>
        <Textarea
          value={identity.motivation}
          onChange={(e) => onFieldChange("motivation", e.target.value)}
          className="bg-muted/20 border-transparent focus:bg-background min-h-[100px] resize-none"
          placeholder="O que move seu personagem?"
          aria-label="Motivação do personagem"
        />
      </div>
    </div>
  </div>
);
