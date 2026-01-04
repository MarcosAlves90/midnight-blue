/**
 * @file news-service.ts
 * @description Sistema de geração procedural de notícias Cyberpunk/RPG com suporte a 
 * gramática PT-BR, validação robusta e aleatoriedade avançada.
 */

// --- TIPAGEM AVANÇADA ---

/**
 * Tipos de notícias disponíveis no sistema.
 * "emergency" é um nível crítico superior ao "alert".
 */
export type NewsType = "info" | "warning" | "alert" | "emergency";

/**
 * Interface principal de uma notícia gerada.
 */
export interface NewsItem {
  title: string;
  content: string;
  type: NewsType;
  timestamp: string;
  status?: string;
  source?: string;
  metadata?: {
    seed?: number;
    glitched?: boolean;
    version: string;
    tags?: string[];
  };
}

/**
 * Representa um item com propriedades gramaticais para concordância em PT-BR.
 */
export interface GrammaticalItem {
  text: string;
  gender: 'M' | 'F';
  number: 'S' | 'P';
  hasArticle?: boolean;
  tags?: string[];
}

/**
 * Representa uma ação/verbo com variações de número e tempo.
 */
export interface ActionItem {
  singular: string;
  plural: string;
  tense?: 'past' | 'present' | 'future';
  intensity?: number;
}

/**
 * Configuração do motor de geração.
 */
export interface NewsConfig {
  glitchChance: number;
  memorySize: number;
  weights: Record<NewsType, number>;
  onGenerate?: (item: NewsItem) => void;
}

// --- DADOS EXPANDIDOS (LORE IMERSIVO) ---

const LOCATIONS: GrammaticalItem[] = [
  { text: "Sevastópol", gender: 'F', number: 'S', hasArticle: false, tags: ["city", "urban"] },
  { text: "Setor 7", gender: 'M', number: 'S', hasArticle: true, tags: ["slums", "dangerous"] },
  { text: "Orla Leste", gender: 'F', number: 'S', hasArticle: true, tags: ["coast", "border"] },
  { text: "Neo-Tokyo", gender: 'F', number: 'S', hasArticle: false, tags: ["city", "tech"] },
  { text: "Deep Web", gender: 'F', number: 'S', hasArticle: true, tags: ["digital", "hidden"] },
  { text: "Península da Crimeia", gender: 'F', number: 'S', hasArticle: true, tags: ["warzone"] },
  { text: "Setor 4", gender: 'M', number: 'S', hasArticle: true, tags: ["industrial"] },
  { text: "Base da USC", gender: 'F', number: 'S', hasArticle: true, tags: ["military"] },
  { text: "Laboratórios Infinity", gender: 'M', number: 'P', hasArticle: true, tags: ["tech", "research"] },
  { text: "Setor 9", gender: 'M', number: 'S', hasArticle: true, tags: ["residential"] },
  { text: "Zona Neutra", gender: 'F', number: 'S', hasArticle: true, tags: ["border"] },
  { text: "Subterrâneos de Sevastópol", gender: 'M', number: 'P', hasArticle: true, tags: ["underground"] },
  { text: "Órbita Baixa", gender: 'F', number: 'S', hasArticle: true, tags: ["space"] },
  { text: "Arquivos Mortos da USC", gender: 'M', number: 'P', hasArticle: true, tags: ["secret"] },
  { text: "Distrito Industrial", gender: 'M', number: 'S', hasArticle: true, tags: ["industrial"] },
  { text: "Nexo de Dados", gender: 'M', number: 'S', hasArticle: true, tags: ["digital", "tech"] },
  { text: "Setor de Contenção S", gender: 'M', number: 'S', hasArticle: true, tags: ["prison", "dangerous"] },
  { text: "Colônia Lunar Alpha", gender: 'F', number: 'S', hasArticle: true, tags: ["space", "colony"] },
  { text: "Plataforma Marítima Delta", gender: 'F', number: 'S', hasArticle: true, tags: ["ocean"] },
  { text: "Deserto de Sal de Atacama", gender: 'M', number: 'S', hasArticle: true, tags: ["wasteland"] },
  { text: "Ninho de Corvos", gender: 'M', number: 'S', hasArticle: true, tags: ["slums"] },
  { text: "Cidade Flutuante de Aether", gender: 'F', number: 'S', hasArticle: true, tags: ["sky", "elite"] },
  { text: "Bunker 101", gender: 'M', number: 'S', hasArticle: true, tags: ["underground", "safe"] },
  { text: "Casterfield", gender: 'F', number: 'S', hasArticle: false, tags: ["suburb"] },
  { text: "Hillsborough", gender: 'M', number: 'S', hasArticle: false, tags: ["suburb"] },
  { text: "Sede da Associação", gender: 'F', number: 'S', hasArticle: true, tags: ["hq"] },
  { text: "Núcleo Silverwing", gender: 'M', number: 'S', hasArticle: true, tags: ["hq", "tech"] },
  { text: "Vácuo de Oort", gender: 'M', number: 'S', hasArticle: true, tags: ["space", "void"] },
  { text: "Sub-nível 99", gender: 'M', number: 'S', hasArticle: true, tags: ["underground", "secret"] },
  { text: "Estação Orbital Tiamat", gender: 'F', number: 'S', hasArticle: true, tags: ["space", "military"] }
];

const ENTITIES: GrammaticalItem[] = [
  { text: "Infinity Corp", gender: 'F', number: 'S', tags: ["corp", "tech"] },
  { text: "Sevastopol", gender: 'F', number: 'S', tags: ["city", "gov"] },
  { text: "USC", gender: 'F', number: 'S', tags: ["gov", "military"] },
  { text: "Divisão de Contenção", gender: 'F', number: 'S', tags: ["military"] },
  { text: "Agentes de Campo", gender: 'M', number: 'P', tags: ["combat"] },
  { text: "G7", gender: 'M', number: 'S', tags: ["gov"] },
  { text: "Corporação Infinity", gender: 'F', number: 'S', tags: ["corp"] },
  { text: "Inteligência Sevastopol", gender: 'F', number: 'S', tags: ["spy"] },
  { text: "Comando Central", gender: 'M', number: 'S', tags: ["military"] },
  { text: "Resistência Ultra", gender: 'F', number: 'S', tags: ["rebel"] },
  { text: "Conselho de Segurança", gender: 'M', number: 'S', tags: ["gov"] },
  { text: "Unidade de Resposta Rápida", gender: 'F', number: 'S', tags: ["military"] },
  { text: "Sindicato das Sombras", gender: 'M', number: 'S', tags: ["crime"] },
  { text: "IA Central", gender: 'F', number: 'S', tags: ["digital", "ai"] },
  { text: "Ordem do Crisântemo", gender: 'F', number: 'S', tags: ["cult"] },
  { text: "Coletivo Zero", gender: 'M', number: 'S', tags: ["hackers"] },
  { text: "Patrulha de Ferro", gender: 'F', number: 'S', tags: ["mercenary"] },
  { text: "Senhores do Aço", gender: 'M', number: 'P', tags: ["mercenary", "combat"] },
  { text: "Coligação Mellífera", gender: 'F', number: 'S', tags: ["corp", "trade"] },
  { text: "Associação de Heróis", gender: 'F', number: 'S', tags: ["hero"] },
  { text: "Silverwing", gender: 'F', number: 'S', tags: ["corp", "tech"] },
  { text: "Sakrax Klann", gender: 'M', number: 'S', tags: ["cult", "alien"] },
  { text: "Ultrax Klann", gender: 'M', number: 'S', tags: ["cult", "dangerous"] },
  { text: "Black Pulse", gender: 'F', number: 'S', tags: ["hackers"] },
  { text: "Família Monroe", gender: 'F', number: 'S', tags: ["elite", "crime"] }
];

const SUBJECTS: GrammaticalItem[] = [
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
  { text: "Vírus de Pensamento", gender: 'M', number: 'S' },
  { text: "Sinal Cinza", gender: 'M', number: 'S' },
  { text: "Armamentos Não Rastreáveis", gender: 'M', number: 'P' },
  { text: "Artefatos Arcanos", gender: 'M', number: 'P' },
  { text: "Remédios Medicinais", gender: 'M', number: 'P' },
  { text: "Protocolos de Treinamento", gender: 'M', number: 'P' },
  { text: "Ultra-Humanos Perseguidos", gender: 'M', number: 'P' },
  { text: "Evidências de Crimes", gender: 'F', number: 'P' },
  { text: "Redes de Tráfico", gender: 'F', number: 'P' }
];

const ACTIONS: ActionItem[] = [
  { singular: "detectou", plural: "detectaram", tense: 'past', intensity: 2 },
  { singular: "interceptou", plural: "interceptaram", tense: 'past', intensity: 3 },
  { singular: "iniciou testes", plural: "iniciaram testes", tense: 'present', intensity: 1 },
  { singular: "ativou protocolo", plural: "ativaram protocolo", tense: 'past', intensity: 4 },
  { singular: "investiga", plural: "investigam", tense: 'present', intensity: 1 },
  { singular: "monitora", plural: "monitoram", tense: 'present', intensity: 1 },
  { singular: "neutralizou", plural: "neutralizaram", tense: 'past', intensity: 5 },
  { singular: "reportou", plural: "reportaram", tense: 'past', intensity: 2 },
  { singular: "bloqueou", plural: "bloquearam", tense: 'past', intensity: 3 },
  { singular: "codificou", plural: "codificaram", tense: 'past', intensity: 2 },
  { singular: "deslocou", plural: "deslocaram", tense: 'past', intensity: 2 },
  { singular: "suprimiu", plural: "suprimiram", tense: 'past', intensity: 4 },
  { singular: "reivindicou", plural: "reivindicaram", tense: 'past', intensity: 3 },
  { singular: "isolou", plural: "isolaram", tense: 'past', intensity: 4 },
  { singular: "hackeou", plural: "hackearam", tense: 'past', intensity: 4 },
  { singular: "expurgou", plural: "expurgaram", tense: 'past', intensity: 5 },
  { singular: "sincronizou", plural: "sincronizaram", tense: 'past', intensity: 2 },
  { singular: "deletou", plural: "deletaram", tense: 'past', intensity: 4 },
  { singular: "reconfigurou", plural: "reconfiguraram", tense: 'past', intensity: 3 },
  { singular: "resgatou", plural: "resgataram", tense: 'past', intensity: 3 },
  { singular: "subornou", plural: "subornaram", tense: 'past', intensity: 3 },
  { singular: "lavou dinheiro de", plural: "lavaram dinheiro de", tense: 'past', intensity: 4 },
  { singular: "expandiu influência em", plural: "expandiram influência em", tense: 'past', intensity: 3 },
  { singular: "desestabilizou", plural: "desestabilizaram", tense: 'past', intensity: 5 },
  { singular: "flagrou", plural: "flagraram", tense: 'past', intensity: 3 },
  { singular: "avistou", plural: "avistaram", tense: 'past', intensity: 2 },
  { singular: "vazou", plural: "vazaram", tense: 'past', intensity: 4 },
  { singular: "está monitorando", plural: "estão monitorando", tense: 'present', intensity: 1 }
];

const INTENSIFIERS = ["massivo", "crítico", "sem precedentes", "altamente instável", "de nível catastrófico", "em larga escala", "de origem desconhecida"];
const STATUS_TAGS = ["CONFIRMADO", "EM INVESTIGAÇÃO", "CRÍTICO", "ARQUIVADO", "PENDENTE", "SIGILOSO", "EMERGÊNCIA", "BLOQUEADO", "ATIVO"];
const SOURCES = ["SAT-7", "AGENTE_X", "INF_CORP_FEED", "SEV_INTEL", "NODE_DEEP_WEB", "UPLINK_LUNAR", "IA_CORE", "RADIO_LIVRE"];

// --- MOTOR DE GERAÇÃO ---

class NewsGeneratorEngine {
  private memory: string[] = [];
  private config: NewsConfig = {
    glitchChance: 0.15,
    memorySize: 10,
    weights: { info: 0.5, warning: 0.3, alert: 0.15, emergency: 0.05 }
  };

  /**
   * Gerador de números pseudo-aleatórios (LCG) para suporte a seeds.
   */
  private seededRandom(seed: number) {
    const m = 2 ** 35 - 31;
    const a = 185852;
    let s = seed % m;
    return () => (s = (s * a) % m) / m;
  }

  // --- HELPERS GRAMATICAIS ---

  public getPrepIn(loc: GrammaticalItem) {
    if (!loc.hasArticle) return "em";
    if (loc.gender === 'M') return loc.number === 'S' ? "no" : "nos";
    return loc.number === 'S' ? "na" : "nas";
  }

  public getPrepOf(item: GrammaticalItem) {
    if (item.gender === 'M') return item.number === 'S' ? "do" : "dos";
    return item.number === 'S' ? "da" : "das";
  }

  public getVerb(subject: GrammaticalItem, action: ActionItem) {
    return subject.number === 'S' ? action.singular : action.plural;
  }

  public getArticle(item: GrammaticalItem, definite = true) {
    if (definite) {
      if (item.gender === 'M') return item.number === 'S' ? "o" : "os";
      return item.number === 'S' ? "a" : "as";
    } else {
      if (item.gender === 'M') return item.number === 'S' ? "um" : "uns";
      return item.number === 'S' ? "uma" : "umas";
    }
  }

  /**
   * Aplica efeito de glitch no texto.
   */
  private applyGlitch(text: string, randomFn: () => number): string {
    const chars = "@#$%&*01_!?-+";
    return text.split('').map(c => 
      randomFn() < 0.08 ? chars[Math.floor(randomFn() * chars.length)] : c
    ).join('');
  }

  /**
   * Gera um item de notícia.
   */
  public generate(seed?: number): NewsItem {
    const random = seed !== undefined ? this.seededRandom(seed) : Math.random;
    const rand = <T>(arr: T[]) => arr[Math.floor(random() * arr.length)];

    // Seleção de tipo baseada em peso
    const typeRoll = random();
    let type: NewsType = "info";
    if (typeRoll > 0.95) type = "emergency";
    else if (typeRoll > 0.80) type = "alert";
    else if (typeRoll > 0.50) type = "warning";

    // Evitar repetição excessiva usando memória
    let loc = rand(LOCATIONS);
    let attempts = 0;
    while (this.memory.includes(loc.text) && attempts < 5) {
      loc = rand(LOCATIONS);
      attempts++;
    }
    this.memory.push(loc.text);
    if (this.memory.length > this.config.memorySize) this.memory.shift();

    const ent = rand(ENTITIES);
    const sub = rand(SUBJECTS);
    const act = rand(ACTIONS);
    const intensifier = random() > 0.7 ? ` ${rand(INTENSIFIERS)}` : "";
    const time = random() > 0.8 ? "??:??" : (random() > 0.5 ? "AGORA" : `${Math.floor(random() * 59)}m`);

    // Templates Dinâmicos (30+)
    const templates = [
      () => ({
        title: `ALERTA: ${loc.text.toUpperCase()}`,
        content: `${ent.text} ${this.getVerb(ent, act)} ${sub.text}${intensifier} em área restrita.`,
      }),
      () => ({
        title: `RELATÓRIO: ${ent.text.toUpperCase()}`,
        content: `${sub.text} ${this.getPrepIn(loc)} ${loc.text} sob controle operacional.`,
      }),
      () => ({
        title: "VIGILÂNCIA ATIVA",
        content: `Aumento de atividade de ${sub.text}${intensifier} detectado ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: `PROTOCOLO: ${ent.text.toUpperCase()}`,
        content: `Confirmada a presença de ${sub.text} ${this.getPrepIn(loc)} ${loc.text} após incidente.`,
      }),
      () => ({
        title: "TRANSMISSÃO CRIPTOGRAFADA",
        content: `Sinal de ${sub.text} originado ${this.getPrepIn(loc)} ${loc.text} está sendo analisado por ${ent.text}.`,
      }),
      () => ({
        title: "MOVIMENTAÇÃO SUSPEITA",
        content: `Comboio ${this.getPrepOf(ent)} ${ent.text} transportando ${sub.text} foi visto ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "FALHA DE SEGURANÇA",
        content: `Brecha ${this.getPrepIn(loc)} ${loc.text} permitiu acesso a ${sub.text}. ${ent.text} em alerta máximo.`,
      }),
      () => ({
        title: "DESCOBERTA TECNOLÓGICA",
        content: `${ent.text} finalizou a pesquisa sobre ${sub.text} ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "INTERCEPTAÇÃO DE IA",
        content: `IA ${this.getPrepOf(ent)} ${ent.text} ${this.getVerb(ent, act)} tentativa de invasão por ${sub.text}.`,
      }),
      () => ({
        title: "SINAL CINZA DETECTADO",
        content: `Os Senhores do Aço utilizaram o Sinal Cinza para coordenar resgate de ${sub.text} ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "MONOPÓLIO TECNOLÓGICO",
        content: `Nações tornam-se dependentes ${this.getPrepOf(ent)} ${ent.text} após nova atualização de ${sub.text}.`,
      }),
      () => ({
        title: "OPERAÇÃO DA COLIGAÇÃO",
        content: `A Coligação Mellífera desestabilizou a economia local ${this.getPrepIn(loc)} ${loc.text} usando ${sub.text}.`,
      }),
      () => ({
        title: "CONFLITO DE JURISDIÇÃO",
        content: `Silverwing removeu a jurisdição da Sevastopol ${this.getPrepIn(loc)} ${loc.text} através de subornos e ${sub.text}.`,
      }),
      () => ({
        title: "ATIVIDADE DO CLÃ ULTRA",
        content: `O Ultrax Klann ${this.getVerb({text: "", gender: 'M', number: 'S'}, act)} ${sub.text} para financiar operações da Família Monroe.`,
      }),
      () => ({
        title: "RESGATE DE HERÓIS",
        content: `Senhores do Aço ${this.getVerb({text: "", gender: 'M', number: 'P'}, act)} ${sub.text} perseguidos pela Sevastopol ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "PARCERIA ESTRATÉGICA",
        content: `Associação de Heróis e Infinity Corp iniciam testes de novos ${sub.text} ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "TWIST: ALIANÇA INESPERADA",
        content: `${ent.text} aliou-se secretamente à Resistência Ultra para ${act.tense === 'past' ? 'terem neutralizado' : 'neutralizar'} ${sub.text}.`,
      }),
      () => ({
        title: "SINAL DE EMERGÊNCIA",
        content: `Pedido de socorro vindo ${this.getPrepOf(loc)} ${loc.text} menciona ${sub.text}${intensifier}.`,
      }),
      () => ({
        title: "VAZAMENTO DE DADOS",
        content: `Black Pulse vazou informações sobre ${sub.text} que ${ent.text} escondia ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "ANOMALIA DETECTADA",
        content: `Sensores ${this.getPrepOf(ent)} ${ent.text} captaram ${sub.text} instável ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "EXPURGO OPERACIONAL",
        content: `A Divisão de Contenção ${this.getVerb({text:'', gender:'F', number:'S'}, act)} todos os vestígios de ${sub.text} ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "MERCADO NEGRO ATIVO",
        content: `Tráfico de ${sub.text} cresce ${this.getPrepIn(loc)} ${loc.text} sob os olhos do Sindicato das Sombras.`,
      }),
      () => ({
        title: "SABOTAGEM INDUSTRIAL",
        content: `${sub.text} foi usado para sabotar as instalações ${this.getPrepOf(ent)} ${ent.text} ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "EVACUAÇÃO IMEDIATA",
        content: `Ordem de evacuação ${this.getPrepIn(loc)} ${loc.text} após ${sub.text} sair de controle.`,
      }),
      () => ({
        title: "EXPERIMENTO FALHO",
        content: `Teste com ${sub.text} ${this.getPrepIn(loc)} ${loc.text} resultou em ${intensifier} desastre para ${ent.text}.`,
      }),
      () => ({
        title: "INFILTRAÇÃO DIGITAL",
        content: `IA Central detectou ${sub.text} tentando acessar o ${this.getPrepOf(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "CONFRONTO ARMADO",
        content: `Agentes de Campo e Senhores do Aço disputam posse de ${sub.text} ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "REFORÇOS CHEGANDO",
        content: `Unidade de Resposta Rápida foi enviada para ${loc.text} para conter ${sub.text}.`,
      }),
      () => ({
        title: "CENSURA GOVERNAMENTAL",
        content: `USC bloqueou notícias sobre ${sub.text} ${this.getPrepIn(loc)} ${loc.text}.`,
      }),
      () => ({
        title: "SINAL DO VÁCUO",
        content: `Transmissão vinda ${this.getPrepOf(loc)} ${loc.text} sugere que ${ent.text} encontrou ${sub.text}.`,
      })
    ];

    const base = rand(templates)();
    const isGlitched = random() < this.config.glitchChance;

    const item: NewsItem = {
      ...base,
      type,
      timestamp: time,
      status: rand(STATUS_TAGS),
      source: rand(SOURCES),
      metadata: { 
        seed, 
        glitched: isGlitched, 
        version: "2.0.0",
        tags: [...(loc.tags || []), ...(ent.tags || [])]
      }
    };

    if (isGlitched) {
      item.content = this.applyGlitch(item.content, random);
      item.title = this.applyGlitch(item.title, random);
    }

    if (this.config.onGenerate) {
      this.config.onGenerate(item);
    }

    return item;
  }
}

const engine = new NewsGeneratorEngine();

/**
 * Gera um item de notícia (mantém compatibilidade com a API original).
 */
export function generateNewsItem(seed?: number): NewsItem {
  return engine.generate(seed);
}
