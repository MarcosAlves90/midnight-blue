import React from "react"
import { Shield, Users, MapPin, Zap, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { IdentityData } from "@/contexts/IdentityContext"

interface ConfidentialFileSectionProps {
  identity: IdentityData
  onFieldChange: (field: keyof IdentityData, value: string) => void
}

export const ConfidentialFileSection: React.FC<ConfidentialFileSectionProps> = ({ identity, onFieldChange }) => (
  <div className="bg-card rounded-xl p-6 h-full">
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
      <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Arquivo Confidencial
      </h3>
    </div>

    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
          <Users className="w-3 h-3" aria-hidden="true" />
          <span>Afiliação</span>
        </label>
        <Input
          value={identity.groupAffiliation}
          onChange={(e) => onFieldChange("groupAffiliation", e.target.value)}
          className="bg-muted/20 border-transparent focus:bg-background"
          placeholder="Ex: Liga da Justiça..."
          aria-label="Afiliação ou grupo do personagem"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          <span>Base de Operações</span>
        </label>
        <Input
          value={identity.baseOfOperations}
          onChange={(e) => onFieldChange("baseOfOperations", e.target.value)}
          className="bg-muted/20 border-transparent focus:bg-background"
          placeholder="Ex: Batcaverna..."
          aria-label="Base de operações do personagem"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
          <Zap className="w-3 h-3" aria-hidden="true" />
          <span>Origem dos Poderes</span>
        </label>
        <Input
          value={identity.powerOrigin}
          onChange={(e) => onFieldChange("powerOrigin", e.target.value)}
          className="bg-muted/20 border-transparent focus:bg-background"
          placeholder="Ex: Acidente Químico..."
          aria-label="Origem dos poderes do personagem"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
          <Heart className="w-3 h-3" aria-hidden="true" />
          <span>Motivação</span>
        </label>
        <textarea
          value={identity.motivation}
          onChange={(e) => onFieldChange("motivation", e.target.value)}
          className="flex min-h-[100px] w-full rounded-md border border-transparent bg-muted/20 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus:bg-background transition-colors resize-none"
          placeholder="O que move seu personagem?"
          aria-label="Motivação do personagem"
        />
      </div>
    </div>
  </div>
)
