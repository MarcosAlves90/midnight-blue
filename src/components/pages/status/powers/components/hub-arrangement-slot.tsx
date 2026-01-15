"use client";

import { memo, useMemo } from "react";
import { 
  Trash2, 
  AlertTriangle,
  Plus,
  LucideIcon
} from "lucide-react";
import { HubCollapsibleSection } from "./hub-collapsible-section";
import { Button } from "@/components/ui/button";
import { Effect, EffectOptions, Modifier, ModifierInstance } from "../types";
import { HubEffectItem } from "./hub-effect-item";
import { calculatePowerCost } from "@/lib/powers/utils";

interface HubArrangementSlotProps {
  id: string;
  name: string;
  onNameChange: (val: string) => void;
  effects: Effect[];
  modifiers: ModifierInstance[];
  effectOptions: Record<string, EffectOptions>;
  rank: number;
  
  // Customization
  variant: "blue" | "emerald";
  icon: LucideIcon;
  isExpanded: boolean;
  onToggle: () => void;
  
  // Handlers
  onAddEffect: () => void;
  onRemoveEffect: (effect: Effect) => void;
  onUpdateEffectOptions: (id: string, opts: EffectOptions) => void;
  onAddModifier: (m: Modifier, effectId: string) => void;
  onRemoveModifier: (id: string) => void;
  onUpdateModifierOptions: (id: string, opts: Record<string, unknown>) => void;
  
  // Optional
  onDelete?: () => void;
  basePowerLimit?: number;
  
  // State for nested items
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
}

export const HubArrangementSlot = memo(({
  id,
  name,
  onNameChange,
  effects,
  modifiers,
  effectOptions,
  rank,
  variant,
  icon: Icon,
  isExpanded,
  onToggle,
  onAddEffect,
  onRemoveEffect,
  onUpdateEffectOptions,
  onAddModifier,
  onRemoveModifier,
  onUpdateModifierOptions,
  onDelete,
  basePowerLimit,
  expandedIds,
  onToggleExpand,
}: HubArrangementSlotProps) => {

  const internalCost = useMemo(() => calculatePowerCost(
    effects,
    modifiers,
    effectOptions,
    rank
  ), [effects, modifiers, effectOptions, rank]);

  const isOverLimit = basePowerLimit !== undefined && internalCost > basePowerLimit;

  return (
    <HubCollapsibleSection
      id={id}
      isOpen={isExpanded}
      onToggle={onToggle}
      variant={variant}
      icon={<Icon className="h-4 w-4" />}
      title={
        <div className="flex items-center gap-3 group/title">
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            // Evita abrir/fechar o colapsável ao clicar no input
            onClick={(e) => e.stopPropagation()}
            placeholder="Nome do Arranjo..."
            className="bg-transparent border-none outline-none focus:ring-0 p-0 m-0 w-full placeholder:text-white/20 hover:text-white transition-colors cursor-text font-black uppercase tracking-tight"
          />
        </div>
      }
      subtitle={
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] ${variant === 'emerald' ? 'text-emerald-400/60' : 'text-blue-400/60'} font-medium`}>
              {effects.length} efeito(s)
            </span>
            {basePowerLimit !== undefined && (
              <span className="text-[9px] text-zinc-500">• Limite: {basePowerLimit} PP</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-bold uppercase tracking-tighter ${isOverLimit ? "text-rose-400" : (variant === 'emerald' ? 'text-emerald-400' : 'text-blue-400')}`}>
              Custo Interno: {internalCost} PP
            </span>
            {isOverLimit && (
              <span className="flex items-center gap-1 text-[8px] text-rose-400 font-bold uppercase animate-pulse">
                <AlertTriangle className="h-2.5 w-2.5" /> Excede Limite
              </span>
            )}
          </div>
        </div>
      }
      actions={
        onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-zinc-600 hover:text-rose-400 transition-colors"
            title="Remover Arranjo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )
      }
    >
      <div className="p-4 pt-0 border-t border-white/5 space-y-4 bg-black/20">
        <div className="mt-4 space-y-3">
          {effects.length === 0 ? (
            <div 
                onClick={onAddEffect}
                className="py-8 border border-dashed border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 cursor-pointer transition-all"
            >
                <Plus className="h-4 w-4 text-zinc-600" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Adicionar Efeito</span>
            </div>
          ) : (
            effects.map((eff) => (
              <HubEffectItem
                key={eff.id}
                effect={eff}
                isExpanded={expandedIds.includes(`${id}-${eff.id}`)}
                onToggle={() => onToggleExpand(`${id}-${eff.id}`)}
                overrideHandlers={{
                  rank: rank,
                  effectOptions: effectOptions,
                  selectedModifierInstances: modifiers,
                  onToggleEffect: (e) => onRemoveEffect(e),
                  onUpdateEffectOptions: onUpdateEffectOptions,
                  onAddModifier: onAddModifier,
                  onRemoveModifier: onRemoveModifier,
                  onUpdateModifierOptions: onUpdateModifierOptions,
                }}
              />
            ))
          )}
          
          {effects.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddEffect}
              className={`w-full h-8 border border-dashed border-white/10 ${variant === 'emerald' ? 'hover:bg-emerald-500/5 hover:text-emerald-400' : 'hover:bg-blue-500/5 hover:text-blue-400'} text-zinc-500 text-[9px] font-bold uppercase tracking-widest rounded-none gap-2`}
            >
              <Plus className="h-3 w-3" /> Inserir Novo Efeito
            </Button>
          )}
        </div>
      </div>
    </HubCollapsibleSection>
  );
});

HubArrangementSlot.displayName = "HubArrangementSlot";
