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
import { StatField } from "./stat-field";

function BiometricDataInner() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[dev-biometric-data] render");
    }
  });

  return (
    <div className="bg-muted/50 rounded-xl p-6">
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
          fieldKey="gender"
          placeholder="Ex: Masculino"
          description="O gênero do personagem (Masculino, Feminino, Não-binário, etc)."
        />
        <StatField
          icon={<Calendar className="w-3 h-3" aria-hidden="true" />}
          label="Idade"
          fieldKey="age"
          placeholder="Ex: 25"
          description="A idade cronológica ou aparente do personagem."
        />
        <StatField
          icon={<Ruler className="w-3 h-3" aria-hidden="true" />}
          label="Altura"
          fieldKey="height"
          placeholder="Ex: 1.80m"
          description="A altura do personagem em metros ou pés."
        />
        <StatField
          icon={<Weight className="w-3 h-3" aria-hidden="true" />}
          label="Peso"
          fieldKey="weight"
          placeholder="Ex: 75kg"
          description="O peso do personagem em quilogramas ou libras."
        />
        <StatField
          icon={<Eye className="w-3 h-3" aria-hidden="true" />}
          label="Olhos"
          fieldKey="eyes"
          placeholder="Ex: Castanhos"
          description="A cor dos olhos do personagem."
        />
        <StatField
          icon={<Scissors className="w-3 h-3" aria-hidden="true" />}
          label="Cabelo"
          fieldKey="hair"
          placeholder="Ex: Preto"
          description="A cor e estilo do cabelo do personagem."
        />
      </div>
    </div>
  );
}

export const BiometricData = React.memo(BiometricDataInner);
