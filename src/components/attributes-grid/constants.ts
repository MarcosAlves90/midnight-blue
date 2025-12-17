import { Attribute } from "./types";

export const INITIAL_ATTRIBUTES: Attribute[] = [
  {
    id: "FOR",
    name: "Força",
    abbreviation: "FOR",
    color: "red",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      "Mede o poder muscular e a capacidade de aplicá-lo. Suas graduações são usadas para o dano causado por ataques desarmados ou baseados em Força, e para determinar o peso que o personagem pode erguer, carregar e arremessar. Também se aplica a testes da perícia Atletismo.",
  },
  {
    id: "VIG",
    name: "Vigor",
    abbreviation: "VIG",
    color: "green",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      "Mede a saúde e a resiliência física geral. É crucial, pois afeta a capacidade de resistir à maioria das formas de dano. Suas graduações se aplicam às defesas Resistência (para resistir a dano) e Fortitude (para resistir a efeitos que visam a saúde, como venenos).",
  },
  {
    id: "AGI",
    name: "Agilidade",
    abbreviation: "AGI",
    color: "amber",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      "Mede o equilíbrio e a velocidade física, incluindo tempo de reação e coordenação geral. Suas graduações se aplicam à defesa Esquiva (para evitar ataques à distância) e ao bônus de Iniciativa. Também se aplica a testes das perícias Acrobacia e Furtividade.",
  },
  {
    id: "DES",
    name: "Destreza",
    abbreviation: "DES",
    color: "yellow",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      "Mede a coordenação, precisão e destreza manual. Suas graduações se aplicam a testes de ataque à distância e a testes das perícias Prestidigitação e Veículos.",
  },
  {
    id: "LUT",
    name: "Luta",
    abbreviation: "LUT",
    color: "maroon",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      "Mede a habilidade em combate corpo-a-corpo, incluindo acertar o alvo, esquivar-se e contra-atacar. Suas graduações se aplicam a testes de ataque corpo-a-corpo e à defesa Aparar (para evitar ataques corpo-a-corpo).",
  },
  {
    id: "INT",
    name: "Intelecto",
    abbreviation: "INT",
    color: "blue",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      "Cobre as capacidades de raciocínio e aprendizagem. Personagens com Intelecto alto tendem a ter muitos conhecimentos. Suas graduações se aplicam a testes das perícias Especialidade, Investigação, Tecnologia e Tratamento.",
  },
  {
    id: "PRO",
    name: "Prontidão",
    abbreviation: "PRO",
    color: "indigo",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      'Descreve o bom senso e a intuição (o que alguns chamam de "sabedoria"). É usada para o senso do que está acontecendo ao redor do personagem. Suas graduações se aplicam à defesa Vontade (para resistir a ataques mentais) e a testes das perícias Intuição e Percepção.',
  },
  {
    id: "PRE",
    name: "Presença",
    abbreviation: "PRE",
    color: "purple",
    value: 0,
    bonus: 0,
    type: "attribute",
    description:
      "Representa a força de personalidade e o magnetismo pessoal. É útil para heróis que desejam ser líderes ou intimidar criminosos. Suas graduações se aplicam a testes das perícias Enganação, Intimidação e Persuasão.",
  },
] as const;

export const DEFAULT_INPUT_LIMITS = {
  MIN_VALUE: 0,
  MAX_VALUE: 9999,
} as const;

export function getInputLimits(customLimits?: {
  MIN_VALUE?: number;
  MAX_VALUE?: number;
}) {
  return {
    MIN_VALUE: customLimits?.MIN_VALUE ?? DEFAULT_INPUT_LIMITS.MIN_VALUE,
    MAX_VALUE: customLimits?.MAX_VALUE ?? DEFAULT_INPUT_LIMITS.MAX_VALUE,
  };
}
