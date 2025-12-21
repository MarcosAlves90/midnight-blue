export const AMBIENTE_SUBS = [
  {
    id: "calor-frio",
    label: "Calor ou Frio",
    tip: "Com graduação {r} e {pp} PP/grad, o efeito gera {pp_text}, aumentando intensidade e área com mais graduações.",
  },
  {
    id: "impedir-movimento",
    label: "Impedir Movimento",
    tip: "Com graduação {r} e {pp} PP/grad, a velocidade na área é reduzida em aproximadamente {val} graduação(ões) de movimento.",
  },
  {
    id: "luz",
    label: "Luz",
    tip: "Com graduação {r} e {pp} PP/grad, gera {pp_text} na área.",
  },
  {
    id: "visibilidade",
    label: "Visibilidade",
    tip: "Com graduação {r} e {pp} PP/grad, impõe uma penalidade de {perGrad} por graduação em testes de Percepção (total: {total}).",
  },
];

export const COMPREENDER_SUBS = [
  {
    id: "animais",
    label: "Animais",
    tip: "1 Graduação: Você pode entender animais.\n2 Graduações: Você pode entender e falar com animais.",
  },
  {
    id: "espiritos",
    label: "Espíritos",
    tip: "1 Graduação: Você pode entender espíritos.\n2 Graduações: Você pode entender e falar com espíritos.",
  },
  {
    id: "idiomas",
    label: "Idiomas",
    tip: "1 Graduação: Entende um idioma.\n2 Graduações: Fala um idioma.\n3 Graduações: Lê um idioma.\n4 Graduações: Entende todos, fala todos, lê todos.",
  },
  {
    id: "maquinas",
    label: "Máquinas",
    tip: "1 Graduação: Você pode entender máquinas.\n2 Graduações: Você pode entender e falar com máquinas.",
  },
  {
    id: "objetos",
    label: "Objetos",
    tip: "1 Graduação: Você pode entender objetos.\n2 Graduações: Você pode entender e falar com objetos.",
  },
  {
    id: "plantas",
    label: "Plantas",
    tip: "1 Graduação: Você pode entender plantas.\n2 Graduações: Você pode entender e falar com plantas.",
  },
];

export const CARACTERISTICA_CATEGORIES = [
  {
    id: "habilidades",
    label: "Habilidades",
    cost: 2,
    items: [
      { id: "FOR", label: "Força" },
      { id: "VIG", label: "Vigor" },
      { id: "AGI", label: "Agilidade" },
      { id: "DES", label: "Destreza" },
      { id: "LUT", label: "Luta" },
      { id: "INT", label: "Intelecto" },
      { id: "PRO", label: "Prontidão" },
      { id: "PRE", label: "Presença" },
    ],
  },
  {
    id: "defesas",
    label: "Defesas",
    cost: 1,
    items: [
      { id: "ESQUIVA", label: "Esquiva" },
      { id: "APARAR", label: "Aparar" },
      { id: "FORTITUDE", label: "Fortitude" },
      { id: "VONTADE", label: "Vontade" },
      { id: "INICIATIVA", label: "Iniciativa" },
    ],
  },
  {
    id: "pericias",
    label: "Perícias",
    cost: 0.5,
    items: [
      { id: "ACRO", label: "Acrobacia" },
      { id: "ATLETISMO", label: "Atletismo" },
      { id: "COMBATE_DISTANCIA", label: "Combate à Distância" },
      { id: "COMBATE_CORPO_A_CORPO", label: "Combate Corpo-a-Corpo" },
      { id: "ENGANACAO", label: "Enganação" },
      { id: "ESPECIALIDADE", label: "Especialidade" },
      { id: "FURTIVIDADE", label: "Furtividade" },
      { id: "INTIMIDACAO", label: "Intimidação" },
      { id: "INTUICAO", label: "Intuição" },
      { id: "INVESTIGACAO", label: "Investigação" },
      { id: "PERCEPCAO", label: "Percepção" },
      { id: "PERSUASAO", label: "Persuasão" },
      { id: "PRESTIDIGITACAO", label: "Prestidigitação" },
      { id: "TECNOLOGIA", label: "Tecnologia" },
      { id: "TRATAMENTO", label: "Tratamento" },
      { id: "VEICULOS", label: "Veículos" },
    ],
  },
  {
    id: "vantagens",
    label: "Vantagens",
    cost: 1,
    items: [
      { id: "combate", label: "Vantagens de Combate" },
      { id: "pericia", label: "Vantagens de Perícia" },
      { id: "sorte", label: "Vantagens de Sorte" },
      { id: "gerais", label: "Vantagens Gerais" },
    ],
  },
];
