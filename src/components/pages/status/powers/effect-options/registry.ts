import { FC } from "react";
import { EffectOptions } from "../types";
import { AmbienteOptions } from "./ambiente-options";
import { CompreenderOptions } from "./compreender-options";
import { CaracteristicaOptions } from "./caracteristica-options";
import { MovimentoOptions } from "./movimento-options";
import { SentidosOptions } from "./sentidos-options";

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
  movimento: {
    component: MovimentoOptions,
    title: "Opções de Movimento",
    description:
      "Cada graduação permite escolher uma opção ou aumentar seu nível.",
    infoTip:
      "Algumas opções possuem múltiplos níveis (como Viagem Temporal). Cada nível consome uma graduação do efeito Movimento.",
  },
  ambiente: {
    component: AmbienteOptions,
    title: "Opções de Ambiente",
    description:
      "Distribua as graduações entre os diferentes tipos de alteração ambiental.",
    infoTip:
      "Cada graduação permite ativar um novo tipo de efeito ambiental ou aumentar a intensidade de um já existente.",
  },
  compreender: {
    component: CompreenderOptions,
    title: "Opções de Compreender",
    description: "Distribua as graduações entre as categorias de compreensão.",
    infoTip:
      "Cada graduação permite entender ou falar com diferentes tipos de seres/objetos.",
  },
  "caracteristica-aumentada": {
    component: CaracteristicaOptions,
    title: "Característica Aumentada",
    description: "Selecione a característica que deseja aprimorar.",
    infoTip:
      "Transforma uma característica natural em um efeito de poder, permitindo modificadores e façanhas.",
  },
  sentidos: {
    component: SentidosOptions,
    title: "Configuração Sensorial",
    description: "Distribua os pontos de graduação entre as opções sensoriais.",
    infoTip:
      "Cada graduação no efeito Sentidos concede 1 ponto para comprar as opções desta lista. Algumas opções custam mais de 1 ponto (ex: Visão no Escuro custa 2).",
  },
};
