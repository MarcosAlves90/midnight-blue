"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ActionType, DurationType, Power, RangeType } from "./types";
import { calculatePowerCost } from "@/lib/powers/utils";
import { Tip } from "@/components/ui/tip";
import { 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Sparkles, 
  Edit3, 
  Zap, 
  Shield, 
  Info, 
  Layers,
  Activity,
  Plus
} from "lucide-react";
import { ParameterGrid } from "./components/parameter-grid";
import { cn } from "@/lib/utils";

interface PowerCardProps {
  power: Power;
  onDelete: (id: string) => void;
  onEdit?: (power: Power) => void;
  isEditMode: boolean;
}

const SUB_LABEL_MAP: Record<string, string> = {
  "calor-frio": "Calor/Frio",
  "impedir-movimento": "Impedir Mov",
  luz: "Luz",
  visibilidade: "Visib.",
  FOR: "Força",
  VIG: "Vigor",
  AGI: "Agi",
  DES: "Des",
  LUT: "Luta",
  INT: "Int",
  PRO: "Pront.",
  PRE: "Pres.",
  ESQUIVA: "Esq",
  APARAR: "Apa",
  FORTITUDE: "Fort",
  VONTADE: "Vont",
  INICIATIVA: "Ini",
  ACRO: "Acro",
  ATLETISMO: "Atle",
  COMBATE_DISTANCIA: "Dist.",
  COMBATE_CORPO_A_CORPO: "C.a.C",
  ENGANACAO: "Engano",
  ESPECIALIDADE: "Espec.",
  FURTIVIDADE: "Furt.",
  INTIMIDACAO: "Intim.",
  INTUICAO: "Intu.",
  INVESTIGACAO: "Inves.",
  PERCEPCAO: "Perc.",
  PERSUASAO: "Pers.",
  PRESTIDIGITACAO: "M.Leves",
  TECNOLOGIA: "Tecno",
  TRATAMENTO: "Trat.",
  VEICULOS: "Veíc.",
  combate: "Comb.",
  pericia: "Períc.",
  sorte: "Sorte",
  gerais: "Ger.",
  adaptacao: "Adapt.",
  "andar-agua": "Água",
  balancar: "Balanço",
  deslizar: "Desl.",
  escalar: "Escal.",
  estabilidade: "Estab.",
  dimensional: "Dimens.",
  permear: "Perm.",
  "queda-segura": "Queda",
  "sem-rastros": "S.Rastros",
  espacial: "Espaço",
  temporal: "Tempo",
};

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

  return (
    <div className={cn(
      "group/card relative bg-zinc-900/40 border border-white/5 overflow-hidden transition-all duration-300",
      isExpanded ? "ring-1 ring-blue-500/30" : "hover:border-blue-500/20"
    )}>
      {/* Accent Line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/40" />

      {/* Imagem de Capa */}
      {power.image && (
        <div className="relative h-20 sm:h-24 overflow-hidden border-b border-white/5">
          <Image 
            src={power.image.url} 
            alt={power.name}
            fill
            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div
        className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="h-3.5 w-3.5 text-blue-500/50 shrink-0" />
          
          <div className="space-y-0.5">
            <h4 className="text-xs font-black tracking-tight text-white uppercase group-hover/card:text-blue-400 transition-colors flex items-center gap-2">
              {power.name}
              <span className="text-[9px] text-blue-500/50 font-mono font-medium lowercase">
                R{power.rank}
              </span>
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 opacity-60">
              {power.effects.slice(0, 2).map((e, i) => (
                <span key={i} className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">
                  {power.effectOptions?.[e.id]?.customName || e.name}
                  {i < Math.min(power.effects.length, 2) - 1 && " /"}
                </span>
              ))}
              {power.effects.length > 2 && (
                <span className="text-[9px] text-zinc-600">+{power.effects.length - 2}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-blue-400 tabular-nums">{cost}</span>
            <span className="text-[8px] text-blue-500/40 font-black uppercase tracking-widest">PP</span>
          </div>
          <div className={cn(
            "p-0.5 transition-transform duration-300",
            isExpanded ? "text-blue-400 rotate-180" : "text-zinc-700"
          )}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="h-px bg-white/5" />

          {/* Effect Description */}
          <div className="space-y-2">
            {power.effects.map((effect, idx) => {
              const opts = power.effectOptions?.[effect.id];

              const selections = (opts?.selections as Record<string, number>) || {};
              const effectModifiers = power.modifiers.filter(
                (m) => m.appliesTo && m.appliesTo.includes(effect.id),
              );

              const eAction = opts?.action || effect.action;
              const eRange = opts?.range || effect.range;
              const eDuration = opts?.duration || effect.duration;

              return (
                <div key={idx} className="p-2 bg-white/[0.01] border border-white/5 rounded-sm space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-400/80 shrink-0">
                      {opts?.customName || effect.name}
                    </h5>
                    <p className="text-[10px] text-zinc-500 leading-tight font-medium text-right line-clamp-2">
                      {opts?.description || effect.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center">
                    <ParameterGrid 
                      action={eAction as ActionType} 
                      range={eRange as RangeType} 
                      duration={eDuration as DurationType} 
                    />
                    
                    <div className="flex flex-wrap gap-1 justify-end">
                      <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300 font-black text-[8px] border border-blue-500/20 uppercase tracking-tighter shrink-0">
                        GR {opts?.rank ?? power.rank}
                      </span>
                      {Object.entries(selections).slice(0, 3).map(([key, val]) => (
                        <span
                          key={key}
                          className="px-1.5 py-0.5 text-[8px] font-bold bg-zinc-800 text-zinc-500 border border-white/5 uppercase shrink-0"
                        >
                          {SUB_LABEL_MAP[key] || key}:{val}
                        </span>
                      ))}
                    </div>
                  </div>

                  {effectModifiers.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {effectModifiers.map((m) => (
                        <Tip key={m.id} content={m.customDescription || m.modifier.description}>
                          <span className={cn(
                            "px-1 py-0.5 text-[8px] font-black border uppercase tracking-tighter",
                            m.modifier.type === "extra"
                              ? "bg-emerald-500/5 text-emerald-500/60 border-emerald-500/10"
                              : "bg-rose-500/5 text-rose-500/60 border-rose-500/10"
                          )}>
                            {m.modifier.name}
                          </span>
                        </Tip>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
            <div className="flex flex-wrap gap-1">
              {power.descriptors.map((descriptor, idx) => (
                <span key={idx} className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.2em]">
                  #{descriptor}
                </span>
              ))}
            </div>
            
            {(globalExtras.length > 0 || globalFlaws.length > 0) && (
              <div className="flex gap-2">
                {globalExtras.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-emerald-500/50 font-black">EXTRAS:</span>
                    <span className="text-[8px] text-emerald-500/80 font-bold">{globalExtras.length}</span>
                  </div>
                )}
                {globalFlaws.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-rose-500/50 font-black">FALHAS:</span>
                    <span className="text-[8px] text-rose-500/80 font-bold">{globalFlaws.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Alternative Effects (Arranjos) */}
          {power.alternatives && power.alternatives.length > 0 && (
            <div className="space-y-1.5 border-t border-white/5 pt-2">
              <span className="text-[8px] text-indigo-400 font-black uppercase tracking-[0.2em]">
                Arranjos (+{power.alternatives.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {power.alternatives.map((alt) => (
                  <span key={alt.id} className="px-1.5 py-0.5 bg-indigo-500/5 text-indigo-400/70 border border-indigo-500/10 text-[8px] font-bold uppercase truncate max-w-[100px]">
                    {alt.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {power.notes && (
            <p className="text-[9px] text-zinc-600 italic border-l border-blue-500/20 pl-2 line-clamp-2">
              {power.notes}
            </p>
          )}

          {isEditMode && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(power); }}
                className="py-1.5 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-all"
              >
                <Edit3 className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(power.id); }}
                className="py-1.5 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest bg-rose-900/10 hover:bg-rose-900/20 text-rose-500/70 transition-all"
              >
                <Trash2 className="h-3 w-3" />
                Del
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
