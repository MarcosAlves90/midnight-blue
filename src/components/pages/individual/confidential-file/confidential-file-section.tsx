import React from "react";
import { Shield, Users, MapPin, Zap, Heart } from "lucide-react";
import { IdentityField } from "../identity-field";

function ConfidentialFileInner() {
  return (
    <div className="bg-muted/50 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
        <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Arquivo Confidencial
        </h3>
      </div>

      <div className="space-y-5">
        <IdentityField
          field="groupAffiliation"
          label="Afiliação"
          icon={<Users className="w-3 h-3" />}
          placeholder="Ex: Liga da Justiça..."
          description="O grupo ou organização ao qual o herói pertence (ex: Liga da Justiça, Vingadores)."
        />
        <IdentityField
          field="baseOfOperations"
          label="Base de Operações"
          icon={<MapPin className="w-3 h-3" />}
          placeholder="Ex: Batcaverna..."
          description="O local onde o herói opera ou vive (ex: Batcaverna, Torre dos Titãs, Cidade de Nova York)."
        />
        <IdentityField
          field="powerOrigin"
          label="Origem dos Poderes"
          icon={<Zap className="w-3 h-3" />}
          placeholder="Ex: Acidente Químico..."
          description="A fonte dos poderes do herói (ex: Mutante, Tecnológico, Místico, Treinamento)."
        />
        <IdentityField
          field="motivation"
          label="Motivação"
          icon={<Heart className="w-3 h-3" />}
          placeholder="Ex: Responsabilidade..."
          description="A razão pela qual o personagem age como herói (ex: Responsabilidade, Justiça, Vingança)."
          textarea
        />
      </div>
    </div>
  );
}

export const ConfidentialFileSection = React.memo(ConfidentialFileInner);
