"use client";

import { useState, useMemo } from "react";
import { Power } from "./types";
import { calculatePowerCost } from "@/lib/powers/utils";
import { Tip } from "@/components/ui/tip";
import { ChevronDown, ChevronUp, Trash2, Sparkles, Edit3 } from "lucide-react";
import { ParameterGrid } from "./components/parameter-grid";

interface PowerCardProps {
  power: Power;
  onDelete: (id: string) => void;
  onEdit?: (power: Power) => void;
  isEditMode: boolean;
}

export function PowerCard({
  power,
  onDelete,
  onEdit,
  isEditMode,
}: PowerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cost = useMemo(() => {
    const primaryCost = calculatePowerCost(
      power.effects,
      power.modifiers,
      power.effectOptions || {},
      power.rank,
    );
    return primaryCost + (power.alternatives?.length || 0);
  }, [power]);

  const globalExtras = power.modifiers.filter(
    (m) =>
      m.modifier.type === "extra" && (!m.appliesTo || m.appliesTo.length === 0),
  );
  const globalFlaws = power.modifiers.filter(
    (m) =>
      m.modifier.type === "falha" && (!m.appliesTo || m.appliesTo.length === 0),
  );

  const action = power.customAction || power.effects[0]?.action || "padrao";
  const range = power.customRange || power.effects[0]?.range || "perto";
  const duration =
    power.customDuration || power.effects[0]?.duration || "instantaneo";

  return (
    <div className="bg-background/30 border border-blue-500/20 overflow-hidden transition-all">
      {/* Header */}
      <div
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-background/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {power.name}
            </h4>
            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1">
              {power.effects.map((e, i) => {
                const eRank = power.effectOptions?.[e.id]?.rank ?? power.rank;
                return (
                  <span key={i} className="flex items-center">
                    <Tip
                      content={
                        <div className="max-w-xs text-xs">{e.description}</div>
                      }
                    >
                      <span className="hover:text-blue-400 cursor-help underline decoration-dotted underline-offset-2">
                        {e.name} {eRank > 0 && `(${eRank})`}
                      </span>
                    </Tip>
                    {i < power.effects.length - 1 && (
                      <span className="mx-1 text-blue-500/50">+</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10">
            <span className="text-xs text-muted-foreground">PP:</span>
            <span className="text-sm font-bold text-blue-400">{cost}</span>
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
        <div className="px-3 pb-3 space-y-3 border-t border-blue-500/10">
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
                // Movimento
                adaptacao: "Adaptação ao Ambiente",
                "andar-agua": "Andar na Água",
                balancar: "Balançar-se",
                deslizar: "Deslizar",
                escalar: "Escalar Paredes",
                estabilidade: "Estabilidade",
                dimensional: "Movimento Dimensional",
                permear: "Permear",
                "queda-segura": "Queda Segura",
                "sem-rastros": "Sem Rastros",
                espacial: "Viagem Espacial",
                temporal: "Viagem Temporal",
              };

              const selections =
                (opts?.selections as Record<string, number>) || {};
              const effectModifiers = power.modifiers.filter(
                (m) => m.appliesTo && m.appliesTo.includes(effect.id),
              );

              return (
                <div key={idx} className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {effect.name}:
                    </span>{" "}
                    {effect.description}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5 items-center">
                    {opts && (
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2 items-center">
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                          Graduação {opts.rank ?? power.rank}
                        </span>
                        {Object.entries(selections).map(([key, val]) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          >
                            {subLabelMap[key] || key} ({val})
                          </span>
                        ))}
                        {opts.sub && (
                          <span className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {subLabelMap[opts.sub] || opts.sub}
                          </span>
                        )}
                        {opts.ppCost && (
                          <span className="px-2 py-0.5 text-[10px] bg-background/30">
                            {opts.ppCost} PP/grad
                          </span>
                        )}
                      </div>
                    )}

                    {effectModifiers.map((m) => (
                      <Tip
                        key={m.id}
                        content={
                          <div className="max-w-xs text-xs">
                            {m.customDescription || m.modifier.description}
                          </div>
                        }
                      >
                        <span
                          className={`px-1.5 py-0.5 text-[10px] border ${
                            m.modifier.type === "extra"
                              ? "bg-green-500/5 text-green-300 border-green-500/20"
                              : "bg-red-500/5 text-red-300 border-red-500/20"
                          }`}
                        >
                          {m.modifier.name}{" "}
                          {m.modifier.isFlat
                            ? ""
                            : `(${m.modifier.costPerRank > 0 ? "+" : ""}${m.modifier.costPerRank})`}
                        </span>
                      </Tip>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Parameters Grid */}
          <ParameterGrid 
            action={action} 
            range={range} 
            duration={duration}
            className="grid grid-cols-1 gap-1.5" 
          />

          {/* Descriptors */}
          {power.descriptors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {power.descriptors.map((descriptor, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-300"
                >
                  {descriptor}
                </span>
              ))}
            </div>
          )}

          {/* Modifiers */}
          {(globalExtras.length > 0 || globalFlaws.length > 0) && (
            <div className="space-y-2">
              {globalExtras.length > 0 && (
                <div>
                  <span className="text-[10px] text-green-400 uppercase tracking-wider font-medium">
                    Extras Gerais
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {globalExtras.map((instance) => (
                      <Tip
                        key={instance.id}
                        content={
                          <div className="max-w-xs text-xs">
                            {instance.customDescription ||
                              instance.modifier.description}
                          </div>
                        }
                      >
                        <span className="px-2 py-0.5 text-[10px] bg-green-500/10 text-green-300 cursor-help">
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
              {globalFlaws.length > 0 && (
                <div>
                  <span className="text-[10px] text-red-400 uppercase tracking-wider font-medium">
                    Falhas Gerais
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {globalFlaws.map((instance) => (
                      <Tip
                        key={instance.id}
                        content={
                          <div className="max-w-xs text-xs">
                            {instance.customDescription ||
                              instance.modifier.description}
                          </div>
                        }
                      >
                        <span className="px-2 py-0.5 text-[10px] bg-red-500/10 text-red-300 cursor-help">
                          {instance.modifier.name}
                          {instance.modifierId === "tipo" &&
                            typeof instance.options?.subType === "string" && (
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

          {/* Alternative Effects (Arranjos) */}
          {power.alternatives && power.alternatives.length > 0 && (
            <div className="space-y-2 border-t border-blue-500/20 pt-2">
              <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">
                Poderes Alternativos (Arranjo)
              </span>
              <div className="space-y-1.5">
                {power.alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-2 bg-indigo-500/5 border border-indigo-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300">
                        {alt.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        +1 PP
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {alt.effects.map((e) => (
                        <span
                          key={e.id}
                          className="text-[9px] text-muted-foreground whitespace-nowrap"
                        >
                          {e.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {power.notes && (
            <p className="text-xs text-muted-foreground italic border-l-2 border-blue-500/30 pl-2">
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
                  className="flex-1 p-2 flex items-center justify-center gap-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
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
                className="flex-1 p-2 flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
