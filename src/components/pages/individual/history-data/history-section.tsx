import React from "react";
import { BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { IdentityData } from "@/contexts/IdentityContext";

interface HistorySectionProps {
  identity: IdentityData;
  onFieldChange: <K extends keyof IdentityData>(
    field: K,
    value: IdentityData[K],
  ) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  identity,
  onFieldChange,
}) => (
  <div className="bg-muted/50 rounded-xl p-6">
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40">
      <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
      <h3 className="text-sm font-bold uppercase tracking-wider">
        Análise de Monitoramento
      </h3>
    </div>

    <div className="space-y-1.5">
      <Textarea
        value={identity.history || ""}
        onChange={(e) => onFieldChange("history", e.target.value)}
        className="bg-muted/20 border-transparent focus:bg-background min-h-[200px] resize-y"
        placeholder="Escreva sua história aqui..."
        aria-label="História do personagem"
      />
    </div>
  </div>
);
