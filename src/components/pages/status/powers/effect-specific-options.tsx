"use client";

import { FC, memo } from "react";
import { Tip } from "@/components/ui/tip";
import { EffectOptions } from "./types";
import { EFFECT_OPTIONS_REGISTRY } from "./effect-options/registry";

interface EffectSpecificOptionsProps {
  effectId: string;
  options?: EffectOptions;
  rank?: number;
  onChange: (opts: EffectOptions) => void;
}

const EffectSpecificOptions: FC<EffectSpecificOptionsProps> = memo(
  ({ effectId, options = {}, rank = 1, onChange }) => {
    const config = EFFECT_OPTIONS_REGISTRY[effectId];

    if (!config) {
      return null;
    }

    const { component: OptionsComponent, title, description, infoTip } = config;

    return (
      <div className="mt-2 p-3 bg-background/20 border border-border/30 rounded">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h5 className="text-sm font-semibold">{title}</h5>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <Tip
            content={<div className="max-w-xs text-xs">{infoTip}</div>}
            side="left"
          >
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 cursor-help">
              Info
            </span>
          </Tip>
        </div>

        <OptionsComponent options={options} rank={rank} onChange={onChange} />
      </div>
    );
  },
);

EffectSpecificOptions.displayName = "EffectSpecificOptions";

export default EffectSpecificOptions;
