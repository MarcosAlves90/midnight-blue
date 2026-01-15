"use client";

import { FC, useMemo } from "react";
import { EffectOptions } from "../types";
import { COMPREENDER_SUBS } from "@/lib/powers/effect-constants";
import { EffectOptionsTemplate } from "./effect-options-template";

interface CompreenderOptionsProps {
  options: EffectOptions;
  rank: number;
  onChange: (opts: EffectOptions) => void;
}

export const CompreenderOptions: FC<CompreenderOptionsProps> = ({
  options,
  rank,
  onChange,
}) => {
  const config = useMemo(
    () => ({
      title: "Distribuição de Compreensão",
      unitLabels: {
        singular: "Graduação",
        plural: "Graduações",
      },
      color: "purple",
      completeLabel: "Totalizado",
    }),
    [],
  );

  return (
    <EffectOptionsTemplate
      options={options}
      rank={rank}
      onChange={onChange}
      subOptions={COMPREENDER_SUBS}
      config={config}
    />
  );
};

