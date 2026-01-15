"use client";

import { FC, useMemo } from "react";
import { EffectOptions } from "../types";
import { SENTIDOS_SUBS } from "@/lib/powers/effect-constants";
import { EffectOptionsTemplate } from "./effect-options-template";

interface SentidosOptionsProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
}

export const SentidosOptions: FC<SentidosOptionsProps> = ({
  options,
  rank,
  onChange,
}) => {
  const config = useMemo(
    () => ({
      title: "Distribuição Sensorial",
      unitLabels: {
        singular: "Ponto",
        plural: "Pontos",
      },
      color: "blue",
      completeLabel: "Calibrado",
    }),
    [],
  );

  return (
    <EffectOptionsTemplate
      options={options}
      rank={rank}
      onChange={onChange}
      subOptions={SENTIDOS_SUBS}
      config={config}
    />
  );
};

