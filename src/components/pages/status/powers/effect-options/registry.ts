import { FC } from "react";
import { EffectOptions } from "../types";
import { AmbienteOptions } from "./ambiente-options";
import { CompreenderOptions } from "./compreender-options";
import { CaracteristicaOptions } from "./caracteristica-options";

interface EffectOptionConfig {
  component: FC<{
    options: EffectOptions;
    rank: number;
    onChange: (opts: EffectOptions) => void;
  }>;
  title: string;
  description: string;
  infoTip: string;
}

export const EFFECT_OPTIONS_REGISTRY: Record<string, EffectOptionConfig> = {
  ambiente: {
    component: AmbienteOptions,
    title: "Opções de Ambiente",
    description:
      "Escolha um subtipo (apenas um) e o custo em PP por graduação.",
    infoTip:
      "Algumas aplicações de Ambiente não têm modificadores separados; selecione o tipo de ambiente e o custo aqui.",
  },
  compreender: {
    component: CompreenderOptions,
    title: "Opções de Compreender",
    description: "Escolha a categoria e a graduação desejada.",
    infoTip:
      "Cada graduação em Compreender permite um nível diferente de interação com a categoria escolhida.",
  },
  "caracteristica-aumentada": {
    component: CaracteristicaOptions,
    title: "Característica Aumentada",
    description: "Selecione a característica que deseja aprimorar.",
    infoTip:
      "Transforma uma característica natural em um efeito de poder, permitindo modificadores e façanhas.",
  },
};
