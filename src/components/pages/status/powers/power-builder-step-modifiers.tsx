"use client";

import { memo, useState } from "react";
import { Modifier, ModifierInstance } from "./types";
import { Tip } from "@/components/ui/tip";
import { FormInput } from "@/components/ui/form-input";
import { Plus, Minus, Trash2, Search } from "lucide-react";
import { EFFECTS } from "@/lib/powers";

const TipContent = memo(({ content }: { content: string }) => (
  <div className="max-w-xs text-xs">{content}</div>
));
TipContent.displayName = "TipContent";

const SelectedModifierInstance = memo(
  ({
    instance,
    onDescriptionChange,
    onUpdateOptions,
    onRemove,
  }: {
    instance: ModifierInstance;
    onDescriptionChange: (description: string) => void;
    onUpdateOptions: (options: Record<string, unknown>) => void;
    onRemove: () => void;
  }) => {
    const [expanded, setExpanded] = useState(false);
    const isTipo = instance.modifierId === "tipo";
    const currentCost =
      (instance.options?.costPerRank as number) ??
      instance.modifier.costPerRank;

    return (
      <div className="p-2 bg-muted/20 border border-border/40 rounded-md">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="truncate text-sm font-medium text-foreground">
                {instance.modifier.name}
                {isTipo && typeof instance.options?.subType === "string" && (
                  <span className="ml-2 text-[10px] text-purple-400 uppercase tracking-wider">
                    (
                    {instance.options.subType === "amplo"
                      ? "Amplo"
                      : "Limitado"}
                    )
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground font-mono">
                  {instance.modifier.type === "extra" ? "+" : ""}
                  {currentCost} PP
                </div>
                {instance.modifier.isFlat && (
                  <div className="text-xs text-purple-400">fixo</div>
                )}
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="p-1 hover:bg-muted/40 rounded text-muted-foreground"
                  title={expanded ? "Fechar" : "Editar detalhes"}
                >
                  {/* simple chevron */}
                  <svg
                    className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 8.5L10 13.5L15 8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={onRemove}
                  className="p-1 hover:bg-red-500/10 rounded text-red-400"
                  title="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expanded && (
              <div className="mt-2 space-y-2">
                {isTipo && (
                  <div className="flex flex-col gap-1.5 p-2 bg-background/40 rounded border border-border/30">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Nível da Falha:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <Tip
                        content={
                          <div className="max-w-xs text-[10px]">
                            Um tipo amplo de alvo (ex: elfos, caninos, aves ou
                            criaturas marinhas).
                          </div>
                        }
                      >
                        <button
                          onClick={() =>
                            onUpdateOptions({
                              ...instance.options,
                              subType: "amplo",
                              costPerRank: -1,
                            })
                          }
                          className={`w-full px-2 py-1 text-[10px] rounded border transition-colors ${
                            instance.options?.subType === "amplo" ||
                            !instance.options?.subType
                              ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                              : "bg-muted/20 border-transparent text-muted-foreground hover:bg-muted/40"
                          }`}
                        >
                          Amplo (-1)
                        </button>
                      </Tip>
                      <Tip
                        content={
                          <div className="max-w-xs text-[10px]">
                            Um tipo limitado de alvo (ex: cães, falcões ou
                            golfinhos).
                          </div>
                        }
                      >
                        <button
                          onClick={() =>
                            onUpdateOptions({
                              ...instance.options,
                              subType: "limitado",
                              costPerRank: -2,
                            })
                          }
                          className={`w-full px-2 py-1 text-[10px] rounded border transition-colors ${
                            instance.options?.subType === "limitado"
                              ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                              : "bg-muted/20 border-transparent text-muted-foreground hover:bg-muted/40"
                          }`}
                        >
                          Limitado (-2)
                        </button>
                      </Tip>
                    </div>
                  </div>
                )}
                <textarea
                  id={`modifier-${instance.id}-description`}
                  name={`modifier-${instance.id}-description`}
                  value={instance.customDescription || ""}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder={
                    isTipo
                      ? "Especifique o alvo (ex: Caninos, Cães)..."
                      : "Descrição personalizada (opcional)..."
                  }
                  className="w-full h-12 px-2 py-1 text-xs bg-background/50 border border-border rounded resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
SelectedModifierInstance.displayName = "SelectedModifierInstance";

interface PowerBuilderStepModifiersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedModifierInstances: ModifierInstance[];
  onUpdateDescription: (instanceId: string, description: string) => void;
  onUpdateOptions: (
    instanceId: string,
    options: Record<string, unknown>,
  ) => void;
  onRemoveInstance: (instanceId: string) => void;
  filteredExtras: Modifier[];
  filteredFlaws: Modifier[];
  onAddModifier: (modifier: Modifier) => void;
}

export const PowerBuilderStepModifiers = memo(
  ({
    searchTerm,
    onSearchChange,
    selectedModifierInstances,
    onUpdateDescription,
    onUpdateOptions,
    onRemoveInstance,
    filteredExtras,
    filteredFlaws,
    onAddModifier,
  }: PowerBuilderStepModifiersProps) => {
    // Separe em específicos (aplicam-se a efeitos) e comuns (aplicáveis a qualquer efeito)
    const specificExtras = filteredExtras.filter(
      (m) => m.appliesTo && m.appliesTo.length > 0,
    );
    const commonExtras = filteredExtras.filter(
      (m) => !m.appliesTo || m.appliesTo.length === 0,
    );
    const specificFlaws = filteredFlaws.filter(
      (m) => m.appliesTo && m.appliesTo.length > 0,
    );
    const commonFlaws = filteredFlaws.filter(
      (m) => !m.appliesTo || m.appliesTo.length === 0,
    );

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Modificadores Selecionados
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedModifierInstances.length} modificador(es) adicionado(s)
          </p>
        </div>

        {selectedModifierInstances.length > 0 && (
          <div className="space-y-3 p-4 bg-muted/10 rounded-lg border border-border/50">
            {selectedModifierInstances.map((instance) => (
              <SelectedModifierInstance
                key={instance.id}
                instance={instance}
                onDescriptionChange={(desc) =>
                  onUpdateDescription(instance.id, desc)
                }
                onUpdateOptions={(opts) => onUpdateOptions(instance.id, opts)}
                onRemove={() => onRemoveInstance(instance.id)}
              />
            ))}
          </div>
        )}

        <div className="space-y-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              Adicionar Novo Modificador
            </h4>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <FormInput                id="modifier-search"
                name="modifier-search"                placeholder="Buscar modificadores..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 bg-background/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extras */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Extras (Aumentam Custo)
              </h4>
              <div className="space-y-2">
                {specificExtras.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Específicos (requer efeito selecionado):
                    </p>
                    <div className="space-y-1">
                      {specificExtras.map((modifier) => (
                        <button
                          key={modifier.id}
                          onClick={() => onAddModifier(modifier)}
                          className="w-full p-2 text-left text-sm rounded-md border transition-all flex items-center justify-between bg-muted/10 border-yellow-700/5 hover:bg-yellow-700/5 hover:border-yellow-700/10 text-muted-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Tip
                              content={
                                <TipContent content={modifier.description} />
                              }
                              side="right"
                            >
                              <span className="cursor-help underline decoration-dotted underline-offset-2">
                                {modifier.name}
                              </span>
                            </Tip>
                            <span className="text-[10px] text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded ml-1">
                              {modifier.appliesTo
                                ?.map(
                                  (a) => EFFECTS.find((e) => e.id === a)?.name,
                                )
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                          <span className="text-xs opacity-70">
                            +{modifier.costPerRank}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {commonExtras.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Comuns:</p>
                    <div className="space-y-1">
                      {commonExtras.map((modifier) => (
                        <button
                          key={modifier.id}
                          onClick={() => onAddModifier(modifier)}
                          className="w-full p-2 text-left text-sm rounded-md border transition-all flex items-center justify-between bg-muted/10 border-transparent hover:bg-green-500/10 hover:border-green-500/50 text-muted-foreground hover:text-green-300"
                        >
                          <div className="flex items-center gap-2">
                            <Tip
                              content={
                                <TipContent content={modifier.description} />
                              }
                              side="right"
                            >
                              <span className="cursor-help underline decoration-dotted underline-offset-2">
                                {modifier.name}
                              </span>
                            </Tip>
                          </div>
                          <span className="text-xs opacity-70">
                            +{modifier.costPerRank}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Flaws */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
                <Minus className="h-4 w-4" /> Falhas (Reduzem Custo)
              </h4>
              <div className="space-y-2">
                {specificFlaws.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Específicas (requer efeito selecionado):
                    </p>
                    <div className="space-y-1">
                      {specificFlaws.map((modifier) => (
                        <button
                          key={modifier.id}
                          onClick={() => onAddModifier(modifier)}
                          className="w-full p-2 text-left text-sm rounded-md border transition-all flex items-center justify-between bg-muted/10 border-yellow-700/5 hover:bg-yellow-700/5 hover:border-yellow-700/10 text-muted-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Tip
                              content={
                                <TipContent content={modifier.description} />
                              }
                              side="right"
                            >
                              <span className="cursor-help underline decoration-dotted underline-offset-2">
                                {modifier.name}
                              </span>
                            </Tip>
                            <span className="text-[10px] text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded ml-1">
                              {modifier.appliesTo
                                ?.map(
                                  (a) => EFFECTS.find((e) => e.id === a)?.name,
                                )
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                          <span className="text-xs opacity-70">
                            {modifier.costPerRank}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {commonFlaws.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Comuns:</p>
                    <div className="space-y-1">
                      {commonFlaws.map((modifier) => (
                        <button
                          key={modifier.id}
                          onClick={() => onAddModifier(modifier)}
                          className="w-full p-2 text-left text-sm rounded-md border transition-all flex items-center justify-between bg-muted/10 border-transparent hover:bg-red-500/10 hover:border-red-500/50 text-muted-foreground hover:text-red-300"
                        >
                          <Tip
                            content={
                              <TipContent content={modifier.description} />
                            }
                            side="right"
                          >
                            <span className="cursor-help underline decoration-dotted underline-offset-2">
                              {modifier.name}
                            </span>
                          </Tip>
                          <span className="text-xs opacity-70">
                            {modifier.costPerRank}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PowerBuilderStepModifiers.displayName = "PowerBuilderStepModifiers";
