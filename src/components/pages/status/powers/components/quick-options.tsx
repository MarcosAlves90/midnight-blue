"use client";

import { memo } from "react";
import { Effect, EffectOptions } from "../types";
import { FormInput } from "@/components/ui/form-input";
import EffectSpecificOptions from "../effect-specific-options";

interface QuickEffectOptionsProps {
  effect: Effect;
  options: EffectOptions;
  rank: number;
  onUpdate: (opts: EffectOptions) => void;
}

export const QuickEffectOptions = memo(
  ({ effect, options, rank, onUpdate }: QuickEffectOptionsProps) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Nome e Graduação na mesma linha */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                Nome do Efeito Individual
              </label>
              <FormInput
                placeholder={`Ex: Rajada de Gelo (Padrão: ${effect.name})`}
                value={options.customName || ""}
                onChange={(e) =>
                  onUpdate({ ...options, customName: e.target.value })
                }
                className="h-10 bg-black/40 border-white/5 text-sm focus:ring-1 focus:ring-purple-500/50 rounded-none transition-all placeholder:text-white/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                Ranks
              </label>
              <FormInput
                type="number"
                min={0}
                value={options.rank === 0 ? "" : (options.rank ?? rank)}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : parseInt(e.target.value);
                  onUpdate({ ...options, rank: val });
                }}
                className="h-10 bg-black/40 border-white/5 text-sm rounded-none text-center focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Descrição Narrativa abaixo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">
              Descrição Narrativa
            </label>
            <textarea
              placeholder="Descreva como o efeito se manifesta visualmente..."
              value={(options.description as string) || ""}
              onChange={(e) =>
                onUpdate({ ...options, description: e.target.value })
              }
              className="w-full bg-black/40 border border-white/5 p-2.5 text-xs focus:ring-1 focus:ring-purple-500/50 min-h-[80px] resize-none transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        <EffectSpecificOptions
          effectId={effect.id}
          options={options}
          rank={options.rank ?? rank}
          onChange={onUpdate}
        />
      </div>
    );
  },
);

QuickEffectOptions.displayName = "QuickEffectOptions";
