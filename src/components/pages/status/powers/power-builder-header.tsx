"use client";

import { memo } from "react";
import { X, Sparkles } from "lucide-react";

interface PowerBuilderHeaderProps {
  isEditing: boolean;
  step: number;
  onClose: () => void;
}

export const PowerBuilderHeader = memo(
  ({ isEditing, step, onClose }: PowerBuilderHeaderProps) => {
    return (
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {isEditing ? "Editar Poder" : "Criar Poder"}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={step >= 1 ? "text-purple-400 font-medium" : ""}>
                1. Efeitos
              </span>
              <span>→</span>
              <span className={step >= 2 ? "text-purple-400 font-medium" : ""}>
                2. Parâmetros
              </span>
              <span>→</span>
              <span className={step >= 3 ? "text-purple-400 font-medium" : ""}>
                3. Detalhes
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    );
  },
);

PowerBuilderHeader.displayName = "PowerBuilderHeader";
