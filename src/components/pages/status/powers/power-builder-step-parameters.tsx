"use client";

import { memo } from "react";
import { ActionType, RangeType, DurationType, EffectOptions } from "./types";
import {
  ACTION_LABELS,
  RANGE_LABELS,
  DURATION_LABELS,
  ACTION_DESCRIPTIONS,
  RANGE_DESCRIPTIONS,
  DURATION_DESCRIPTIONS,
  POWER_TIPS,
} from "@/lib/powers";
import { Tip } from "@/components/ui/tip";
import { Plus, Minus } from "lucide-react";

const TipContent = memo(({ content }: { content: string }) => (
  <div className="max-w-xs text-xs">{content}</div>
));
TipContent.displayName = "TipContent";

const ParameterButton = memo(
  ({
    label,
    isSelected,
    onClick,
    description,
  }: {
    label: string;
    isSelected: boolean;
    onClick: () => void;
    description: string;
  }) => (
    <Tip content={<TipContent content={description} />}>
      <button
        onClick={onClick}
        className={`px-4 py-2 text-sm rounded-md border transition-all ${
          isSelected
            ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_-3px_rgba(168,85,247,0.4)]"
            : "bg-muted/20 text-muted-foreground border-transparent hover:bg-muted/40"
        }`}
      >
        <span className="cursor-help underline decoration-dotted underline-offset-2">
          {label}
        </span>
      </button>
    </Tip>
  ),
);
ParameterButton.displayName = "ParameterButton";

interface PowerBuilderStepParametersProps {
  rank: number;
  onRankChange: (rank: number) => void;
  customAction: ActionType | null;
  onActionChange: (action: ActionType | null) => void;
  customRange: RangeType | null;
  onRangeChange: (range: RangeType | null) => void;
  customDuration: DurationType | null;
  onDurationChange: (duration: DurationType | null) => void;
  defaultAction: ActionType;
  defaultRange: RangeType;
  defaultDuration: DurationType;
  effectOptions?: Record<string, EffectOptions>;
}

export const PowerBuilderStepParameters = memo(
  ({
    rank,
    onRankChange,
    customAction,
    onActionChange,
    customRange,
    onRangeChange,
    customDuration,
    onDurationChange,
    defaultAction,
    defaultRange,
    defaultDuration,
    effectOptions,
  }: PowerBuilderStepParametersProps) => {
    // Calcula a graduação mínima baseada na soma de todos os seletores de graduação
    const minRank =
      Object.values(effectOptions || {}).reduce(
        (sum, opt) => sum + ((opt.rank as number) || 0),
        0,
      ) || 1;

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Configurar Parâmetros
          </h3>
          <p className="text-sm text-muted-foreground">
            Ajuste a graduação e as propriedades básicas.
          </p>
        </div>

        {/* Rank - Removido conforme solicitação: graduas são agora por efeito */}
        <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
          <p className="text-xs text-center text-purple-300/80 italic">
            A graduação agora é configurada individualmente para cada efeito na etapa anterior.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Action */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tip content={<TipContent content={POWER_TIPS.action} />}>
                <span className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">
                  Ação
                </span>
              </Tip>
              <span className="text-xs text-muted-foreground">
                Padrão: {ACTION_LABELS[defaultAction]}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ACTION_LABELS) as ActionType[]).map((action) => (
                <ParameterButton
                  key={action}
                  label={ACTION_LABELS[action]}
                  isSelected={(customAction || defaultAction) === action}
                  onClick={() =>
                    onActionChange(action === defaultAction ? null : action)
                  }
                  description={ACTION_DESCRIPTIONS[action]}
                />
              ))}
            </div>
          </div>

          {/* Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tip content={<TipContent content={POWER_TIPS.range} />}>
                <span className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">
                  Alcance
                </span>
              </Tip>
              <span className="text-xs text-muted-foreground">
                Padrão: {RANGE_LABELS[defaultRange]}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(RANGE_LABELS) as RangeType[]).map((range) => (
                <ParameterButton
                  key={range}
                  label={RANGE_LABELS[range]}
                  isSelected={(customRange || defaultRange) === range}
                  onClick={() =>
                    onRangeChange(range === defaultRange ? null : range)
                  }
                  description={RANGE_DESCRIPTIONS[range]}
                />
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tip content={<TipContent content={POWER_TIPS.duration} />}>
                <span className="text-sm font-medium text-foreground cursor-help underline decoration-dotted underline-offset-2">
                  Duração
                </span>
              </Tip>
              <span className="text-xs text-muted-foreground">
                Padrão: {DURATION_LABELS[defaultDuration]}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DURATION_LABELS) as DurationType[]).map(
                (duration) => (
                  <ParameterButton
                    key={duration}
                    label={DURATION_LABELS[duration]}
                    isSelected={
                      (customDuration || defaultDuration) === duration
                    }
                    onClick={() =>
                      onDurationChange(
                        duration === defaultDuration ? null : duration,
                      )
                    }
                    description={DURATION_DESCRIPTIONS[duration]}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PowerBuilderStepParameters.displayName = "PowerBuilderStepParameters";
