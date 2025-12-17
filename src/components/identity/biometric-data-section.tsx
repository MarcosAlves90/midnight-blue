import React from "react";
import {
  Activity,
  User,
  Calendar,
  Ruler,
  Weight,
  Eye,
  Scissors,
} from "lucide-react";
import { IdentityData } from "@/contexts/IdentityContext";
import { StatField } from "./stat-field";

interface BiometricDataSectionProps {
  identity: IdentityData;
  onFieldChange: (field: keyof IdentityData, value: string) => void;
}

export const BiometricDataSection: React.FC<BiometricDataSectionProps> = ({
  identity,
  onFieldChange,
}) => (
  <div className="bg-card rounded-xl p-6">
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
      <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Dados Biométricos
      </h3>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatField
        icon={<User className="w-3 h-3" aria-hidden="true" />}
        label="Gênero"
        value={identity.gender}
        onChange={(v) => onFieldChange("gender", v)}
        placeholder="Ex: Masculino"
        description="O gênero do personagem (Masculino, Feminino, Não-binário, etc)."
      />
      <StatField
        icon={<Calendar className="w-3 h-3" aria-hidden="true" />}
        label="Idade"
        value={identity.age}
        onChange={(v) => onFieldChange("age", v)}
        placeholder="Ex: 25"
        description="A idade cronológica ou aparente do personagem."
      />
      <StatField
        icon={<Ruler className="w-3 h-3" aria-hidden="true" />}
        label="Altura"
        value={identity.height}
        onChange={(v) => onFieldChange("height", v)}
        placeholder="Ex: 1.80m"
        description="A altura do personagem em metros ou pés."
      />
      <StatField
        icon={<Weight className="w-3 h-3" aria-hidden="true" />}
        label="Peso"
        value={identity.weight}
        onChange={(v) => onFieldChange("weight", v)}
        placeholder="Ex: 75kg"
        description="O peso do personagem em quilogramas ou libras."
      />
      <StatField
        icon={<Eye className="w-3 h-3" aria-hidden="true" />}
        label="Olhos"
        value={identity.eyes}
        onChange={(v) => onFieldChange("eyes", v)}
        placeholder="Ex: Castanhos"
        description="A cor dos olhos do personagem."
      />
      <StatField
        icon={<Scissors className="w-3 h-3" aria-hidden="true" />}
        label="Cabelo"
        value={identity.hair}
        onChange={(v) => onFieldChange("hair", v)}
        placeholder="Ex: Preto"
        description="A cor e estilo do cabelo do personagem."
      />
    </div>
  </div>
);
