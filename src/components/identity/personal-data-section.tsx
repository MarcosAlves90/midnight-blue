import React from "react"
import { FileText, MapPin, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { IdentityData } from "@/contexts/IdentityContext"
import { ColorPickerDropdown } from "./color-picker-dropdown"

interface PersonalDataSectionProps {
  identity: IdentityData
  onFieldChange: (field: keyof IdentityData, value: string) => void
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ identity, onFieldChange }) => (
  <div className="bg-card rounded-xl p-6">
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
      <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Dados Pessoais
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          <span>Local de Nascimento</span>
        </label>
        <Input
          value={identity.placeOfBirth}
          onChange={(e) => onFieldChange("placeOfBirth", e.target.value)}
          className="bg-muted/20 border-transparent focus:bg-background"
          placeholder="Ex: São Paulo"
          aria-label="Local de nascimento do personagem"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
          <Briefcase className="w-3 h-3" aria-hidden="true" />
          <span>Ocupação</span>
        </label>
        <Input
          value={identity.occupation}
          onChange={(e) => onFieldChange("occupation", e.target.value)}
          className="bg-muted/20 border-transparent focus:bg-background"
          placeholder="Ex: Professor"
          aria-label="Ocupação do personagem"
        />
      </div>
      <div className="md:col-span-2">
        <ColorPickerDropdown
          favoriteColor={identity.favoriteColor}
          onColorChange={(color) => onFieldChange("favoriteColor", color)}
        />
      </div>
    </div>
  </div>
)
