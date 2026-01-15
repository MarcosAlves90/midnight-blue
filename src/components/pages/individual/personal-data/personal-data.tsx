import React from "react";
import { FileText, MapPin, Briefcase } from "lucide-react";
import { useIdentityActions } from "@/contexts/IdentityContext";
import { useIdentityField } from "@/hooks/use-identity-field";
import { ColorPickerDropdown } from "./color-picker-dropdown";
import { IdentityField } from "../identity-field";

function PersonalDataInner() {
  const { updateIdentity } = useIdentityActions();

  return (
    <div className="bg-muted/50 rounded-none p-6 border border-white/5">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
        <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Dados Pessoais
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IdentityField
          field="placeOfBirth"
          label="Local de Nascimento"
          icon={<MapPin className="w-3 h-3" />}
          placeholder="Ex: São Paulo"
          description="O local onde o personagem nasceu (cidade, país, planeta, etc)."
        />
        <IdentityField
          field="occupation"
          label="Ocupação"
          icon={<Briefcase className="w-3 h-3" />}
          placeholder="Ex: Professor"
          description="A profissão ou ocupação principal do personagem quando não está atuando como herói."
        />
        <div className="md:col-span-2">
          <ColorPickerDropdown
            favoriteColor={useIdentityField("favoriteColor") || "#1e3a8a"}
            onColorChange={(color) => updateIdentity("favoriteColor", color)}
          />
        </div>
      </div>
    </div>
  );
}

export const PersonalData = React.memo(PersonalDataInner);
