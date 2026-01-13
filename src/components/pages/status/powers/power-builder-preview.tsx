"use client";

import { memo } from "react";
import { Power, ModifierInstance, Effect } from "./types";
import { PowerCard } from "./power-card";
import { Sparkles } from "lucide-react";

interface PowerBuilderPreviewProps {
  power: Power;
  calculateCost: () => number;
  selectedModifierInstances: ModifierInstance[];
  selectedEffects: Effect[];
}

export const PowerBuilderPreview = memo(
  ({
    power,
    calculateCost,
    selectedModifierInstances,
    selectedEffects,
  }: PowerBuilderPreviewProps) => {
    return (
      <div className="hidden lg:flex flex-col bg-muted/5 border-border/50">
        <div className="sticky top-6 space-y-5">
          <div>
            <PowerCard
              power={power}
              isEditMode={false}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </div>

          <div className="p-4 bg-background/50 border border-border/50 space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Custo Total
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Base ({selectedEffects.length} efeitos)</span>
                <span>
                  {selectedEffects.reduce((acc: number, e: Effect) => {
                    const opts = power.effectOptions?.[e.id];
                    const r = opts?.rank ?? 1;
                    const b = opts?.ppCost ?? e.baseCost;
                    return acc + r * b;
                  }, 0)}{" "}
                  PP
                </span>
              </div>

              {selectedModifierInstances.length > 0 && (
                <>
                  <div className="flex justify-between text-green-400">
                    <span>Extras (Graduação)</span>
                    <span>
                      +
                      {selectedModifierInstances
                        .filter(
                          (m) =>
                            m.modifier.type === "extra" && !m.modifier.isFlat,
                        )
                        .reduce((acc, m) => {
                          const costPerRank =
                            (m.options?.costPerRank as number) ??
                            m.modifier.costPerRank;
                          const affectedEffects = selectedEffects.filter(
                            (e) =>
                              !m.appliesTo ||
                              m.appliesTo.length === 0 ||
                              m.appliesTo.includes(e.id),
                          );
                          const totalRanks = affectedEffects.reduce(
                            (sum, e) =>
                              sum + (power.effectOptions?.[e.id]?.rank ?? 1),
                            0,
                          );
                          return acc + costPerRank * totalRanks;
                        }, 0)}{" "}
                      PP
                    </span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>Falhas (Graduação)</span>
                    <span>
                      {selectedModifierInstances
                        .filter(
                          (m) =>
                            m.modifier.type === "falha" && !m.modifier.isFlat,
                        )
                        .reduce((acc, m) => {
                          const costPerRank =
                            (m.options?.costPerRank as number) ??
                            m.modifier.costPerRank;
                          const affectedEffects = selectedEffects.filter(
                            (e) =>
                              !m.appliesTo ||
                              m.appliesTo.length === 0 ||
                              m.appliesTo.includes(e.id),
                          );
                          const totalRanks = affectedEffects.reduce(
                            (sum, e) =>
                              sum + (power.effectOptions?.[e.id]?.rank ?? 1),
                            0,
                          );
                          return acc + costPerRank * totalRanks;
                        }, 0)}{" "}
                      PP
                    </span>
                  </div>
                  <div className="flex justify-between text-blue-400 border-t border-border/50 pt-1 mt-1">
                    <span>Modificadores Fixos</span>
                    <span>
                      {selectedModifierInstances
                        .filter((m) => m.modifier.isFlat)
                        .reduce(
                          (acc, m) =>
                            acc +
                            ((m.options?.costPerRank as number) ??
                              m.modifier.costPerRank),
                          0,
                        )}{" "}
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
              <span className="text-2xl font-bold text-blue-400">
                {calculateCost()} PP
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PowerBuilderPreview.displayName = "PowerBuilderPreview";
