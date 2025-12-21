"use client";

import { FC } from "react";
import { Tip } from "@/components/ui/tip";
import { EffectOptions } from "./types";
import { AmbienteOptions } from "./effect-options/ambiente-options";
import { CompreenderOptions } from "./effect-options/compreender-options";
import { CaracteristicaOptions } from "./effect-options/caracteristica-options";

interface EffectSpecificOptionsProps {
  effectId: string;
  options?: EffectOptions;
  rank?: number;
  onChange: (opts: EffectOptions) => void;
  onRankChange?: (rank: number) => void;
}

export const EffectSpecificOptions: FC<EffectSpecificOptionsProps> = ({
  effectId,
  options = {},
  rank = 1,
  onChange,
  onRankChange,
}) => {
  const isAmbiente = effectId === "ambiente";
  const isCompreender = effectId === "compreender";
  const isCaracteristica = effectId === "caracteristica-aumentada";

  if (!isAmbiente && !isCompreender && !isCaracteristica) {
    return null;
  }

  const getTitle = () => {
    if (isAmbiente) return "Opções de Ambiente";
    if (isCompreender) return "Opções de Compreender";
    return "Característica Aumentada";
  };

  const getDescription = () => {
    if (isAmbiente)
      return "Escolha um subtipo (apenas um) e o custo em PP por graduação.";
    if (isCompreender) return "Escolha a categoria e a graduação desejada.";
    return "Selecione a característica que deseja aprimorar.";
  };

  const getInfoTip = () => {
    if (isAmbiente)
      return "Algumas aplicações de Ambiente não têm modificadores separados; selecione o tipo de ambiente e o custo aqui.";
    if (isCompreender)
      return "Cada graduação em Compreender permite um nível diferente de interação com a categoria escolhida.";
    return "Transforma uma característica natural em um efeito de poder, permitindo modificadores e façanhas.";
  };

  return (
    <div className="mt-2 p-3 bg-background/20 border border-border/30 rounded">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h5 className="text-sm font-semibold">{getTitle()}</h5>
          <p className="text-xs text-muted-foreground">{getDescription()}</p>
        </div>
        <Tip
          content={<div className="max-w-xs text-xs">{getInfoTip()}</div>}
          side="left"
        >
          <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 cursor-help">
            Info
          </span>
        </Tip>
      </div>

      {isAmbiente && (
        <AmbienteOptions options={options} rank={rank} onChange={onChange} />
      )}

      {isCompreender && (
        <CompreenderOptions
          options={options}
          rank={rank}
          onChange={onChange}
          onRankChange={onRankChange}
        />
      )}

      {isCaracteristica && (
        <CaracteristicaOptions
          options={options}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default EffectSpecificOptions;
