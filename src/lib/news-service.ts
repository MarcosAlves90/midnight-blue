export type NewsType = "info" | "warning" | "alert";

export interface NewsItem {
  title: string;
  content: string;
  type: NewsType;
  timestamp: string;
  status?: string;
  source?: string;
}

export interface GrammaticalItem {
  text: string;
  gender: 'M' | 'F';
  number: 'S' | 'P';
  hasArticle?: boolean;
}

export interface ActionItem {
  singular: string;
  plural: string;
}

export const LOCATIONS: GrammaticalItem[] = [
  { text: "Sevastópol", gender: 'F', number: 'S', hasArticle: false },
  { text: "Setor 7", gender: 'M', number: 'S', hasArticle: true },
  { text: "Orla Leste", gender: 'F', number: 'S', hasArticle: true },
  { text: "Neo-Tokyo", gender: 'F', number: 'S', hasArticle: false },
  { text: "Deep Web", gender: 'F', number: 'S', hasArticle: true },
  { text: "Península da Crimeia", gender: 'F', number: 'S', hasArticle: true },
  { text: "Setor 4", gender: 'M', number: 'S', hasArticle: true },
  { text: "Base da USC", gender: 'F', number: 'S', hasArticle: true },
  { text: "Laboratórios Infinity", gender: 'M', number: 'P', hasArticle: true },
  { text: "Setor 9", gender: 'M', number: 'S', hasArticle: true },
  { text: "Zona Neutra", gender: 'F', number: 'S', hasArticle: true },
  { text: "Subterrâneos de Sevastópol", gender: 'M', number: 'P', hasArticle: true },
  { text: "Órbita Baixa", gender: 'F', number: 'S', hasArticle: true },
  { text: "Arquivos Mortos da USC", gender: 'M', number: 'P', hasArticle: true },
  { text: "Distrito Industrial", gender: 'M', number: 'S', hasArticle: true },
  { text: "Nexo de Dados", gender: 'M', number: 'S', hasArticle: true },
  { text: "Setor de Contenção S", gender: 'M', number: 'S', hasArticle: true },
  { text: "Colônia Lunar Alpha", gender: 'F', number: 'S', hasArticle: true },
  { text: "Plataforma Marítima Delta", gender: 'F', number: 'S', hasArticle: true },
  { text: "Deserto de Sal de Atacama", gender: 'M', number: 'S', hasArticle: true },
  { text: "Ninho de Corvos", gender: 'M', number: 'S', hasArticle: true },
  { text: "Cidade Flutuante de Aether", gender: 'F', number: 'S', hasArticle: true },
  { text: "Bunker 101", gender: 'M', number: 'S', hasArticle: true }
];

export const ENTITIES: GrammaticalItem[] = [
  { text: "Infinity Corp", gender: 'F', number: 'S' },
  { text: "Sevastopol", gender: 'F', number: 'S' },
  { text: "USC", gender: 'F', number: 'S' },
  { text: "Divisão de Contenção", gender: 'F', number: 'S' },
  { text: "Agentes de Campo", gender: 'M', number: 'P' },
  { text: "G7", gender: 'M', number: 'S' },
  { text: "Corporação Infinity", gender: 'F', number: 'S' },
  { text: "Inteligência Sevastopol", gender: 'F', number: 'S' },
  { text: "Comando Central", gender: 'M', number: 'S' },
  { text: "Resistência Ultra", gender: 'F', number: 'S' },
  { text: "Conselho de Segurança", gender: 'M', number: 'S' },
  { text: "Unidade de Resposta Rápida", gender: 'F', number: 'S' },
  { text: "Sindicato das Sombras", gender: 'M', number: 'S' },
  { text: "IA Central", gender: 'F', number: 'S' },
  { text: "Ordem do Crisântemo", gender: 'F', number: 'S' },
  { text: "Coletivo Zero", gender: 'M', number: 'S' },
  { text: "Patrulha de Ferro", gender: 'F', number: 'S' }
];

export const SUBJECTS: GrammaticalItem[] = [
  { text: "Indivíduo Classe S", gender: 'M', number: 'S' },
  { text: "Energia Ultra", gender: 'F', number: 'S' },
  { text: "Tecnologia Experimental", gender: 'F', number: 'S' },
  { text: "Inibidores de Genes", gender: 'M', number: 'P' },
  { text: "Traje de Supressão", gender: 'M', number: 'S' },
  { text: "Dados Criptografados", gender: 'M', number: 'P' },
  { text: "Pico de Radiação", gender: 'M', number: 'S' },
  { text: "Anomalia Temporal", gender: 'F', number: 'S' },
  { text: "Sinal Criptografado", gender: 'M', number: 'S' },
  { text: "Gene-Splicing", gender: 'M', number: 'S' },
  { text: "Matéria Escura", gender: 'F', number: 'S' },
  { text: "Consciência Digital", gender: 'F', number: 'S' },
  { text: "Artefato Pré-Queda", gender: 'M', number: 'S' },
  { text: "Protocolo de Extermínio", gender: 'M', number: 'S' },
  { text: "Célula de Energia", gender: 'F', number: 'S' },
  { text: "Nanobots Médicos", gender: 'M', number: 'P' },
  { text: "Motor de Dobra", gender: 'M', number: 'S' },
  { text: "IA Renegada", gender: 'F', number: 'S' },
  { text: "Vírus de Pensamento", gender: 'M', number: 'S' }
];

export const ACTIONS: ActionItem[] = [
  { singular: "detectou", plural: "detectaram" },
  { singular: "interceptou", plural: "interceptaram" },
  { singular: "iniciou testes de", plural: "iniciaram testes de" },
  { singular: "ativou protocolo de", plural: "ativaram protocolo de" },
  { singular: "investiga", plural: "investigam" },
  { singular: "monitora", plural: "monitoram" },
  { singular: "neutralizou", plural: "neutralizaram" },
  { singular: "reportou", plural: "reportaram" },
  { singular: "bloqueou", plural: "bloquearam" },
  { singular: "codificou", plural: "codificaram" },
  { singular: "deslocou", plural: "deslocaram" },
  { singular: "suprimiu", plural: "suprimiram" },
  { singular: "reivindicou", plural: "reivindicaram" },
  { singular: "isolou", plural: "isolaram" },
  { singular: "hackeou", plural: "hackearam" },
  { singular: "expurgou", plural: "expurgaram" },
  { singular: "sincronizou", plural: "sincronizaram" },
  { singular: "deletou", plural: "deletaram" },
  { singular: "reconfigurou", plural: "reconfiguraram" }
];

export const STATUS_TAGS = ["CONFIRMADO", "EM INVESTIGAÇÃO", "CRÍTICO", "ARQUIVADO", "PENDENTE", "SIGILOSO"];
export const SOURCES = ["SAT-7", "AGENTE_X", "INF_CORP_FEED", "SEV_INTEL", "NODE_DEEP_WEB", "UPLINK_LUNAR"];

// Helpers gramaticais
export const getPrepIn = (loc: GrammaticalItem) => {
  if (!loc.hasArticle) return "em";
  if (loc.gender === 'M') return loc.number === 'S' ? "no" : "nos";
  return loc.number === 'S' ? "na" : "nas";
};

export const getPrepOf = (item: GrammaticalItem) => {
  if (item.gender === 'M') return item.number === 'S' ? "do" : "dos";
  return item.number === 'S' ? "da" : "das";
};

export const getVerb = (subject: GrammaticalItem, action: ActionItem) => {
  return subject.number === 'S' ? action.singular : action.plural;
};

export const getArticle = (item: GrammaticalItem, definite = true) => {
  if (definite) {
    if (item.gender === 'M') return item.number === 'S' ? "o" : "os";
    return item.number === 'S' ? "a" : "as";
  } else {
    if (item.gender === 'M') return item.number === 'S' ? "um" : "uns";
    return item.number === 'S' ? "uma" : "umas";
  }
};

export function generateNewsItem(): NewsItem {
  const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const type: NewsType = Math.random() > 0.85 ? "alert" : Math.random() > 0.65 ? "warning" : "info";
  const time = Math.random() > 0.5 ? "AGORA" : `${Math.floor(Math.random() * 59)}m`;
  
  const loc = rand(LOCATIONS);
  const ent = rand(ENTITIES);
  const sub = rand(SUBJECTS);
  const act = rand(ACTIONS);

  const templates = [
    () => ({
      title: `ALERTA: ${loc.text.toUpperCase()}`,
      content: `${ent.text} ${getVerb(ent, act)} ${sub.text} em área restrita.`,
      type,
      timestamp: time,
      status: rand(STATUS_TAGS),
      source: rand(SOURCES)
    }),
    () => ({
      title: `RELATÓRIO: ${ent.text.toUpperCase()}`,
      content: `${sub.text} ${getPrepIn(loc)} sob controle operacional.`,
      type,
      timestamp: time,
      status: rand(STATUS_TAGS),
      source: rand(SOURCES)
    }),
    () => ({
      title: "VIGILÂNCIA ATIVA",
      content: `Aumento de atividade de ${sub.text} detectado ${getPrepIn(loc)}.`,
      type,
      timestamp: time,
      status: rand(STATUS_TAGS),
      source: rand(SOURCES)
    }),
    () => ({
      title: `PROTOCOLO: ${ent.text.toUpperCase()}`,
      content: `${act.singular.charAt(0).toUpperCase() + act.singular.slice(1)} ${getPrepOf(sub)} ${getPrepIn(loc)} após incidente.`,
      type,
      timestamp: time,
      status: rand(STATUS_TAGS),
      source: rand(SOURCES)
    }),
    () => ({
      title: "TRANSMISSÃO CRIPTOGRAFADA",
      content: `Sinal de ${sub.text} originado ${getPrepIn(loc)} está sendo analisado.`,
      type,
      timestamp: time,
      status: rand(STATUS_TAGS),
      source: rand(SOURCES)
    }),
    () => ({
      title: "MOVIMENTAÇÃO SUSPEITA",
      content: `Comboio ${getPrepOf(ent)} transportando ${sub.text} foi visto ${getPrepIn(loc)}.`,
      type,
      timestamp: time,
      status: rand(STATUS_TAGS),
      source: rand(SOURCES)
    }),
    () => ({
      title: "FALHA DE SEGURANÇA",
      content: `Brecha ${getPrepIn(loc)} permitiu acesso a ${sub.text}. ${ent.text} em alerta.`,
      type: "alert" as NewsType,
      timestamp: time,
      status: "CRÍTICO",
      source: rand(SOURCES)
    }),
    () => ({
      title: "DESCOBERTA TECNOLÓGICA",
      content: `${ent.text} finalizou a pesquisa sobre ${sub.text} ${getPrepIn(loc)}.`,
      type: "info" as NewsType,
      timestamp: time,
      status: "ARQUIVADO",
      source: rand(SOURCES)
    }),
    () => ({
      title: "INTERCEPTAÇÃO DE IA",
      content: `IA ${getPrepOf(ent)} ${getVerb(ent, act)} tentativa de invasão por ${sub.text}.`,
      type: "warning" as NewsType,
      timestamp: time,
      status: "BLOQUEADO",
      source: "IA_CORE"
    })
  ];

  return rand(templates)();
}
