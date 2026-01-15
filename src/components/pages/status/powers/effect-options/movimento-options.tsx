"use client";

import { FC, useMemo } from "react";
import { EffectOptions } from "../types";
import { MOVIMENTO_SUBS } from "@/lib/powers/effect-constants";
import { EffectOptionsTemplate } from "./effect-options-template";

interface MovimentoOptionsProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
}

export const MovimentoOptions: FC<MovimentoOptionsProps> = ({
  options,
  rank,
  onChange,
}) => {
  const config = useMemo(
    () => ({
      title: "Distribuição",
      unitLabels: {
        singular: "Graduação",
        plural: "Graduações",
      },
      color: "purple",
      completeLabel: "Completo",
    }),
    [],
  );

  return (
    <EffectOptionsTemplate
      options={options}
      rank={rank}
      onChange={onChange}
      subOptions={MOVIMENTO_SUBS}
      config={config}
    />
  );
};

