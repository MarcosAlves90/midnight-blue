import type { Skill } from './types'

// Lista de perícias - por enquanto, apenas mapeadas para atributos (sem categorias)
export const INITIAL_SKILLS: Skill[] = [
  { id: 'ACRO', name: 'Acrobacia', attribute: 'AGI', abbreviation: 'ACR' },
  { id: 'ATLETISMO', name: 'Atletismo', attribute: 'FOR', abbreviation: 'ATL' },
  { id: 'COMBATE_DISTANCIA', name: 'Combate à Distância', attribute: 'DES', abbreviation: 'CBD' },
  { id: 'COMBATE_CORPO_A_CORPO', name: 'Combate Corpo-a-Corpo', attribute: 'LUT', abbreviation: 'CBC' },
  { id: 'ENGANACAO', name: 'Enganação', attribute: 'PRE', abbreviation: 'ENG' },
  { id: 'ESPECIALIDADE', name: 'Especialidade', attribute: 'INT', abbreviation: 'ESP' },
  { id: 'FURTIVIDADE', name: 'Furtividade', attribute: 'AGI', abbreviation: 'FUR' },
  { id: 'INTIMIDACAO', name: 'Intimidação', attribute: 'PRE', abbreviation: 'INTI' },
  { id: 'INTUICAO', name: 'Intuição', attribute: 'PRO', abbreviation: 'INTU' },
  { id: 'INVESTIGACAO', name: 'Investigação', attribute: 'INT', abbreviation: 'INV' },
  { id: 'PERCEPCAO', name: 'Percepção', attribute: 'PRO', abbreviation: 'PER' },
  { id: 'PERSUASAO', name: 'Persuasão', attribute: 'PRE', abbreviation: 'PES' },
  { id: 'PRESTIDIGITACAO', name: 'Prestidigitação', attribute: 'DES', abbreviation: 'PREST' },
  { id: 'TECNOLOGIA', name: 'Tecnologia', attribute: 'INT', abbreviation: 'TEC' },
  { id: 'TRATAMENTO', name: 'Tratamento', attribute: 'INT', abbreviation: 'TRA' },
  { id: 'VEICULOS', name: 'Veículos', attribute: 'DES', abbreviation: 'VEI' },
  // Outros padrão (bônus) se necessário — deixar `0` por padrão
]
