"use client";

import { Power, ModifierInstance, Effect } from "./types";
import { PowerCard } from "./power-card";
import { Sparkles } from "lucide-react";

interface PowerBuilderPreviewProps {
  power: Power;
  calculateCost: () => number;
  selectedModifierInstances: ModifierInstance[];
  selectedEffects: Effect[];
}

export function PowerBuilderPreview({
  power,
  calculateCost,
  selectedModifierInstances,
  selectedEffects,
}: PowerBuilderPreviewProps) {
  return (
    <div className="hidden lg:flex flex-col bg-muted/5 p-6 border-l border-border/50">
      <div className="sticky top-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Pré-visualização
          </h3>
          <PowerCard
            power={power}
            isEditMode={false}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        </div>

        <div className="p-4 bg-background/50 rounded-xl border border-border/50 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Custo Total
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Base ({selectedEffects.length} efeitos)</span>
              <span>
                {selectedEffects.reduce(
                  (acc: number, e: Effect) => acc + e.baseCost,
                  0,
                )}{" "}
                PP/grad
              </span>
            </div>

            {selectedModifierInstances.length > 0 && (
              <>
                <div className="flex justify-between text-green-400">
                  <span>Extras</span>
                  <span>
                    +
                    {selectedModifierInstances
                      .filter(
                        (m) =>
                          m.modifier.type === "extra" && !m.modifier.isFlat,
                      )
                      .reduce((acc, m) => acc + m.modifier.costPerRank, 0)}{" "}
                    /grad
                  </span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Falhas</span>
                  <span>
                    {selectedModifierInstances
                      .filter(
                        (m) =>
                          m.modifier.type === "falha" && !m.modifier.isFlat,
                      )
                      .reduce((acc, m) => acc + m.modifier.costPerRank, 0)}{" "}
                    /grad
                  </span>
                </div>
                <div className="flex justify-between text-purple-400 border-t border-border/50 pt-1 mt-1">
                  <span>Modificadores Fixos</span>
                  <span>
                    {selectedModifierInstances
                      .filter((m) => m.modifier.isFlat)
                      .reduce((acc, m) => acc + m.modifier.costPerRank, 0)}{" "}
                    PP
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total Final
            </span>
            <span className="text-2xl font-bold text-purple-400">
              {calculateCost()} PP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
