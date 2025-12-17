"use client";

import { FC } from "react";
import { Tip } from "@/components/ui/tip";
import { EffectOptions } from "./types";

interface EffectSpecificOptionsProps {
  effectId: string;
  options?: EffectOptions;
  rank?: number;
  onChange: (opts: EffectOptions) => void;
}

const AMBIENTE_SUBS = [
  { id: "calor-frio", label: "Calor ou Frio" },
  { id: "impedir-movimento", label: "Impedir Movimento" },
  { id: "luz", label: "Luz" },
  { id: "visibilidade", label: "Visibilidade" },
];

export const EffectSpecificOptions: FC<EffectSpecificOptionsProps> = ({
  effectId,
  options = {},
  rank,
  onChange,
}) => {
  if (effectId !== "ambiente") return null;

  const selectedSub = options.sub || "";
  const ppCost = options.ppCost ?? 1;

  const getTipContentFor = (subId: string) => {
    const r = rank ?? 1;
    const pp = ppCost;
    if (subId === "calor-frio") {
      return (
        <div>
          Com graduação <strong>{r}</strong> e <strong>{pp} PP/grad</strong>, o efeito gera <strong>{pp === 1 ? "calor/frio moderado" : "calor/frio intenso"}</strong>, aumentando intensidade e área com mais graduações.
        </div>
      );
    }

    if (subId === "impedir-movimento") {
      return (
        <div>
          Com graduação <strong>{r}</strong> e <strong>{pp} PP/grad</strong>, a velocidade na área é reduzida em aproximadamente <strong>{r * pp}</strong> graduação(ões) de movimento.
        </div>
      );
    }

    if (subId === "luz") {
      return (
        <div>
          Com graduação <strong>{r}</strong> e <strong>{pp} PP/grad</strong>, gera <strong>{pp === 1 ? "luz suficiente para reduzir camuflagem parcial" : "luz intensa que pode eliminar camuflagem"}</strong> na área.
        </div>
      );
    }

    if (subId === "visibilidade") {
      const perGrad = pp === 1 ? -2 : -5;
      return (
        <div>
          Com graduação <strong>{r}</strong> e <strong>{pp} PP/grad</strong>, impõe uma penalidade de <strong>{perGrad} por graduação</strong> em testes de Percepção (total: <strong>{perGrad * r}</strong>).
        </div>
      );
    }

    return <div>Escolha um subtipo para ver detalhes dependentes da graduação.</div>;
  };

  return (
    <div className="mt-2 p-3 bg-background/20 border border-border/30 rounded">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h5 className="text-sm font-semibold">Opções de Ambiente</h5>
          <p className="text-xs text-muted-foreground">Escolha um subtipo (apenas um) e o custo em PP por graduação.</p>
        </div>
        <Tip content={<div className="max-w-xs text-xs">Algumas aplicações de Ambiente não têm modificadores separados; selecione o tipo de ambiente e o custo aqui.</div>} side="left">
          <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 cursor-help">Info</span>
        </Tip>
      </div>

      {/* Subtype selector */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {AMBIENTE_SUBS.map((s) => (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation();
              onChange({ ...options, sub: s.id });
            }}
            className={`group p-2 text-left rounded border transition-colors cursor-help ${
              selectedSub === s.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-border/40 hover:border-purple-400/30 hover:bg-muted/10"
            }`}
          >
            <Tip side="right" content={<div className="max-w-xs text-xs">{getTipContentFor(s.id)}</div>}>
              <div className="text-sm font-medium underline decoration-dotted underline-offset-2">{s.label}</div>
            </Tip>
          </button>
        ))}
      </div>

      {/* PP cost selector (1 to 2) - Range Slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground mr-2">Custo:</span>
        <input
          type="range"
          min="1"
          max="2"
          step="1"
          value={ppCost}
          onChange={(e) => {
            e.stopPropagation();
            onChange({ ...options, ppCost: parseInt(e.target.value, 10) });
          }}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <span className="text-sm font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded whitespace-nowrap">
          {ppCost} PP/grad
        </span>
      </div>
    </div>
  );
};

export default EffectSpecificOptions;
