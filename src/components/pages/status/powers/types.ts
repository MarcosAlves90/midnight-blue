export type ActionType =
  | "padrao"
  | "movimento"
  | "livre"
  | "reacao"
  | "nenhuma";
export type RangeType =
  | "pessoal"
  | "perto"
  | "distancia"
  | "percepcao"
  | "graduacao";
export type DurationType =
  | "instantaneo"
  | "concentracao"
  | "sustentado"
  | "continuo"
  | "permanente";

export interface Modifier {
  id: string;
  name: string;
  type: "extra" | "falha";
  costPerRank: number; // positivo para extras, negativo para falhas
  isFlat?: boolean; // se é um modificador fixo
  description: string;
  appliesTo?: string[]; // IDs de efeitos aos quais este modificador se aplica (opcional)
}

export interface ModifierInstance {
  id: string;
  modifierId: string; // referência ao modifier original
  modifier: Modifier;
  customDescription?: string; // descrição personalizada para esta instância
  options?: Record<string, unknown>; // opções específicas para esta instância
}

export type EffectCategory =
  | "ataque"
  | "controle"
  | "defesa"
  | "geral"
  | "movimento"
  | "sensorial";

export interface Effect {
  id: string;
  name: string;
  baseCost: number;
  description: string;
  category: EffectCategory;
  action: ActionType;
  range: RangeType;
  duration: DurationType;
}

export interface EffectOptions {
  sub?: string;
  ppCost?: number;
  [key: string]: unknown;
}

export interface Power {
  id: string;
  name: string;
  effects: Effect[];
  rank: number;
  descriptors: string[];
  modifiers: ModifierInstance[];
  customAction?: ActionType;
  customRange?: RangeType;
  customDuration?: DurationType;
  notes?: string;
  // Opções específicas por efeito (ex: ambiente -> { sub: 'luz', ppCost: 2 })
  effectOptions?: Record<string, EffectOptions>;
}
