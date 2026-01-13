"use client";

import { memo } from "react";
import { 
  Sliders, 
  Zap, 
  ArrowRight, 
  Settings2, 
  Tag, 
  BookOpen 
} from "lucide-react";
import { HubCollapsibleSection } from "./hub-collapsible-section";
import { ActionType, DurationType, RangeType } from "../types";
import { ACTION_LABELS, DURATION_LABELS, RANGE_LABELS } from "@/lib/powers";

interface HubGlobalConfigProps {
  expanded: boolean;
  onToggle: () => void;
  selectedDescriptors: string[];
  onToggleDescriptor: (d: string) => void;
  notes: string;
  onNotesChange: (n: string) => void;
  customAction: ActionType | null;
  onActionChange: (a: ActionType | null) => void;
  customRange: RangeType | null;
  onRangeChange: (r: RangeType | null) => void;
  customDuration: DurationType | null;
  onDurationChange: (d: DurationType | null) => void;
  defaultAction: ActionType;
  defaultRange: RangeType;
  defaultDuration: DurationType;
  customDescriptors: string[];
}

export const HubGlobalConfig = memo(({
  expanded,
  onToggle,
  selectedDescriptors,
  onToggleDescriptor,
  notes,
  onNotesChange,
  customAction,
  onActionChange,
  customRange,
  onRangeChange,
  customDuration,
  onDurationChange,
  defaultAction,
  defaultRange,
  defaultDuration,
  customDescriptors
}: HubGlobalConfigProps) => {
  return (
    <HubCollapsibleSection
      id="global-config"
      isOpen={expanded}
      onToggle={onToggle}
      icon={<Sliders className="h-4 w-4" />}
      variant="blue"
      title="Configurações Base"
      subtitle={
        <div className="flex gap-2 mt-1">
          {selectedDescriptors.map((d) => (
            <span
              key={d}
              className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded-full text-zinc-400 font-bold"
            >
              {d}
            </span>
          ))}
        </div>
      }
    >
      <div className="p-4 pt-0 border-t border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-3 w-3" /> Ação
            </label>
            <select
              value={customAction || "default"}
              onChange={(e) =>
                onActionChange(
                  e.target.value === "default"
                    ? null
                    : (e.target.value as ActionType),
                )
              }
              className="w-full bg-black/40 border border-white/10 p-2 text-xs"
            >
              <option value="default">
                Padrão ({ACTION_LABELS[defaultAction]})
              </option>
              {Object.entries(ACTION_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <ArrowRight className="h-3 w-3" /> Alcance
            </label>
            <select
              value={customRange || "default"}
              onChange={(e) =>
                onRangeChange(
                  e.target.value === "default"
                    ? null
                    : (e.target.value as RangeType),
                )
              }
              className="w-full bg-black/40 border border-white/10 p-2 text-xs"
            >
              <option value="default">
                Padrão ({RANGE_LABELS[defaultRange]})
              </option>
              {Object.entries(RANGE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Settings2 className="h-3 w-3" /> Duração
            </label>
            <select
              value={customDuration || "default"}
              onChange={(e) =>
                onDurationChange(
                  e.target.value === "default"
                    ? null
                    : (e.target.value as DurationType),
                )
              }
              className="w-full bg-black/40 border border-white/10 p-2 text-xs"
            >
              <option value="default">
                Padrão ({DURATION_LABELS[defaultDuration]})
              </option>
              {Object.entries(DURATION_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Tag className="h-3 w-3" /> Descritores Narrativos
          </label>
          <div className="flex flex-wrap gap-2">
            {customDescriptors.map((d) => (
              <button
                key={d}
                onClick={() => onToggleDescriptor(d)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                  selectedDescriptors.includes(d)
                    ? "bg-blue-500/20 border-blue-500 text-blue-300"
                    : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="h-3 w-3" /> Notas de Execução
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Instruções adicionais ou flavor text..."
            className="w-full bg-black/40 border border-white/10 p-3 text-xs min-h-[80px] resize-none"
          />
        </div>
      </div>
    </HubCollapsibleSection>
  );
});

HubGlobalConfig.displayName = "HubGlobalConfig";
