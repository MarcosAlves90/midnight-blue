"use client";

import { memo } from "react";
import { ActionType, DurationType, Effect, EffectOptions, RangeType } from "../types";
import { FormInput } from "@/components/ui/form-input";
import { ACTION_LABELS, DURATION_LABELS, RANGE_LABELS } from "@/lib/powers";
import EffectSpecificOptions from "../effect-specific-options";
import { Zap, ArrowRight, Settings2 } from "lucide-react";

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

          {/* Novos Selects de Ação, Alcance e Duração por Efeito */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 border-y border-white/5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
                <Zap className="h-3 w-3" /> Ação
              </label>
              <select
                value={options.action || effect.action}
                onChange={(e) =>
                  onUpdate({ ...options, action: e.target.value as ActionType })
                }
                className="w-full bg-black/40 border border-white/10 p-2 text-xs h-10 outline-none focus:border-purple-500/50 transition-colors"
              >
                {Object.entries(ACTION_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
                <ArrowRight className="h-3 w-3" /> Alcance
              </label>
              <select
                value={options.range || effect.range}
                onChange={(e) =>
                  onUpdate({ ...options, range: e.target.value as RangeType })
                }
                className="w-full bg-black/40 border border-white/10 p-2 text-xs h-10 outline-none focus:border-purple-500/50 transition-colors"
              >
                {Object.entries(RANGE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] flex items-center gap-2">
                <Settings2 className="h-3 w-3" /> Duração
              </label>
              <select
                value={options.duration || effect.duration}
                onChange={(e) =>
                  onUpdate({ ...options, duration: e.target.value as DurationType })
                }
                className="w-full bg-black/40 border border-white/10 p-2 text-xs h-10 outline-none focus:border-purple-500/50 transition-colors"
              >
                {Object.entries(DURATION_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
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
