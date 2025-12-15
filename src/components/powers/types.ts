export type ActionType = 'padrao' | 'movimento' | 'livre' | 'reacao' | 'nenhuma'
export type RangeType = 'pessoal' | 'perto' | 'distancia' | 'percepcao' | 'graduacao'
export type DurationType = 'instantaneo' | 'concentracao' | 'sustentado' | 'continuo' | 'permanente'

export interface Modifier {
  id: string
  name: string
  type: 'extra' | 'falha'
  costPerRank: number // positivo para extras, negativo para falhas
  isFlat?: boolean // se é um modificador fixo
  description: string
}

export interface Effect {
  id: string
  name: string
  baseCost: number
  description: string
  action: ActionType
  range: RangeType
  duration: DurationType
}

export interface Power {
  id: string
  name: string
  effects: Effect[]
  rank: number
  descriptors: string[]
  modifiers: Modifier[]
  customAction?: ActionType
  customRange?: RangeType
  customDuration?: DurationType
  notes?: string
}

export interface PowerBuilderState {
  powers: Power[]
  isEditMode: boolean
}
