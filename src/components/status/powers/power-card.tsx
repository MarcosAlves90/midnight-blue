"use client";

import { useState } from "react";
import { Power } from "./types";
import { ACTION_LABELS, RANGE_LABELS, DURATION_LABELS } from "@/lib/powers";
import { Tip } from "@/components/ui/tip";
import { ChevronDown, ChevronUp, Trash2, Sparkles, Edit3 } from "lucide-react";

interface PowerCardProps {
  power: Power;
  onDelete: (id: string) => void;
  onEdit?: (power: Power) => void;
  isEditMode: boolean;
}

function calculatePowerCost(power: Power): number {
  const baseEffect = power.effects.reduce((acc, e) => {
    const opts = power.effectOptions?.[e.id];
    const ppCost = typeof opts?.ppCost === "number" ? opts.ppCost : e.baseCost;
    return acc + ppCost;
  }, 0);

  const extrasTotal = power.modifiers
    .filter((m) => m.modifier.type === "extra" && !m.modifier.isFlat)
    .reduce(
      (acc, m) =>
        acc + ((m.options?.costPerRank as number) ?? m.modifier.costPerRank),
      0,
    );

  const flawsTotal = power.modifiers
    .filter((m) => m.modifier.type === "falha" && !m.modifier.isFlat)
    .reduce(
      (acc, m) =>
        acc + ((m.options?.costPerRank as number) ?? m.modifier.costPerRank),
      0,
    );

  const flatModifiers = power.modifiers
    .filter((m) => m.modifier.isFlat)
    .reduce(
      (acc, m) =>
        acc + ((m.options?.costPerRank as number) ?? m.modifier.costPerRank),
      0,
    );

  const costPerRank = baseEffect + extrasTotal + flawsTotal;

  // Custo mínimo de 1 PP por 5 graduações
  let totalCost: number;
  if (costPerRank <= 0) {
    const ranksPerPoint = Math.min(5, Math.abs(costPerRank - 1) + 1);
    totalCost = Math.ceil(power.rank / ranksPerPoint);
  } else {
    totalCost = Math.ceil(costPerRank * power.rank);
  }

  return Math.max(1, totalCost + flatModifiers);
}

export function PowerCard({
  power,
  onDelete,
  onEdit,
  isEditMode,
}: PowerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cost = calculatePowerCost(power);

  const extras = power.modifiers.filter((m) => m.modifier.type === "extra");
  const flaws = power.modifiers.filter((m) => m.modifier.type === "falha");

  const action = power.customAction || power.effects[0]?.action || "padrao";
  const range = power.customRange || power.effects[0]?.range || "perto";
  const duration =
    power.customDuration || power.effects[0]?.duration || "instantaneo";

  return (
    <div className="bg-background/30 border border-purple-500/20 rounded-lg overflow-hidden transition-all">
      {/* Header */}
      <div
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-background/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {power.name}
            </h4>
            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1">
              {power.effects.map((e, i) => (
                <span key={i} className="flex items-center">
                  <Tip
                    content={
                      <div className="max-w-xs text-xs">{e.description}</div>
                    }
                  >
                    <span className="hover:text-purple-400 cursor-help underline decoration-dotted underline-offset-2">
                      {e.name}
                    </span>
                  </Tip>
                  {i < power.effects.length - 1 && <span> + </span>}
                </span>
              ))}
              <span className="ml-1 font-medium">Nível {power.rank}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 rounded">
            <span className="text-xs text-muted-foreground">PP:</span>
            <span className="text-sm font-bold text-purple-400">{cost}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-purple-500/10">
          {/* Effect Description */}
          <div className="pt-3 space-y-1">
            {power.effects.map((effect, idx) => {
              const opts = power.effectOptions?.[effect.id];

              // humanizar subtipo de Ambiente e Característica
              const subLabelMap: Record<string, string> = {
                // Ambiente
                "calor-frio": "Calor ou Frio",
                "impedir-movimento": "Impedir Movimento",
                luz: "Luz",
                visibilidade: "Visibilidade",
                // Habilidades
                FOR: "Força",
                VIG: "Vigor",
                AGI: "Agilidade",
                DES: "Destreza",
                LUT: "Luta",
                INT: "Intelecto",
                PRO: "Prontidão",
                PRE: "Presença",
                // Defesas
                ESQUIVA: "Esquiva",
                APARAR: "Aparar",
                FORTITUDE: "Fortitude",
                VONTADE: "Vontade",
                INICIATIVA: "Iniciativa",
                // Perícias
                ACRO: "Acrobacia",
                ATLETISMO: "Atletismo",
                COMBATE_DISTANCIA: "Combate à Distância",
                COMBATE_CORPO_A_CORPO: "Combate Corpo-a-Corpo",
                ENGANACAO: "Enganação",
                ESPECIALIDADE: "Especialidade",
                FURTIVIDADE: "Furtividade",
                INTIMIDACAO: "Intimidação",
                INTUICAO: "Intuição",
                INVESTIGACAO: "Investigação",
                PERCEPCAO: "Percepção",
                PERSUASAO: "Persuasão",
                PRESTIDIGITACAO: "Prestidigitação",
                TECNOLOGIA: "Tecnologia",
                TRATAMENTO: "Tratamento",
                VEICULOS: "Veículos",
                // Vantagens
                combate: "Vantagens de Combate",
                pericia: "Vantagens de Perícia",
                sorte: "Vantagens de Sorte",
                gerais: "Vantagens Gerais",
              };

              return (
                <div key={idx}>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {effect.name}:
                    </span>{" "}
                    {effect.description}
                  </p>
                  {opts && (
                    <div className="mt-1 text-xs text-muted-foreground flex gap-2 items-center">
                      {opts.sub && (
                        <span className="px-2 py-0.5 text-[10px] bg-purple-500/10 text-purple-300 rounded border border-purple-500/20">
                          {subLabelMap[opts.sub] || opts.sub}
                        </span>
                      )}
                      {opts.ppCost && (
                        <span className="px-2 py-0.5 text-[10px] bg-background/30 rounded">
                          {opts.ppCost} PP/grad
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-background/40 p-2 rounded">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Ação
              </span>
              <p className="text-xs font-medium text-foreground">
                {ACTION_LABELS[action]}
              </p>
            </div>
            <div className="bg-background/40 p-2 rounded">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Alcance
              </span>
              <p className="text-xs font-medium text-foreground">
                {RANGE_LABELS[range]}
              </p>
            </div>
            <div className="bg-background/40 p-2 rounded">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Duração
              </span>
              <p className="text-xs font-medium text-foreground">
                {DURATION_LABELS[duration]}
              </p>
            </div>
          </div>

          {/* Descriptors */}
          {power.descriptors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {power.descriptors.map((descriptor, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/10 text-purple-300 rounded-full"
                >
                  {descriptor}
                </span>
              ))}
            </div>
          )}

          {/* Modifiers */}
          {(extras.length > 0 || flaws.length > 0) && (
            <div className="space-y-2">
              {extras.length > 0 && (
                <div>
                  <span className="text-[10px] text-green-400 uppercase tracking-wider font-medium">
                    Extras
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extras.map((instance) => (
                      <Tip
                        key={instance.id}
                        content={
                          <div className="max-w-xs text-xs">
                            {instance.customDescription ||
                              instance.modifier.description}
                          </div>
                        }
                      >
                        <span className="px-2 py-0.5 text-[10px] bg-green-500/10 text-green-300 rounded cursor-help">
                          {instance.modifier.name} (+
                          {(instance.options?.costPerRank as number) ??
                            instance.modifier.costPerRank}
                          )
                        </span>
                      </Tip>
                    ))}
                  </div>
                </div>
              )}
              {flaws.length > 0 && (
                <div>
                  <span className="text-[10px] text-red-400 uppercase tracking-wider font-medium">
                    Falhas
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {flaws.map((instance) => (
                      <Tip
                        key={instance.id}
                        content={
                          <div className="max-w-xs text-xs">
                            {instance.customDescription ||
                              instance.modifier.description}
                          </div>
                        }
                      >
                        <span className="px-2 py-0.5 text-[10px] bg-red-500/10 text-red-300 rounded cursor-help">
                          {instance.modifier.name}
                          {instance.modifierId === "tipo" &&
                            instance.options?.subType && (
                              <span className="opacity-70 ml-1">
                                (
                                {instance.options.subType === "amplo"
                                  ? "Amplo"
                                  : "Limitado"}
                                )
                              </span>
                            )}{" "}
                          (
                          {(instance.options?.costPerRank as number) ??
                            instance.modifier.costPerRank}
                          )
                        </span>
                      </Tip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {power.notes && (
            <p className="text-xs text-muted-foreground italic border-l-2 border-purple-500/30 pl-2">
              {power.notes}
            </p>
          )}

          {/* Action Buttons */}
          {isEditMode && (
            <div className="flex gap-2 mt-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(power);
                  }}
                  className="flex-1 p-2 flex items-center justify-center gap-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                  Editar
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(power.id);
                }}
                className="flex-1 p-2 flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Remover
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
