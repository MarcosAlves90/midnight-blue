import type { Skill } from './types'

// Lista de perícias - por enquanto, apenas mapeadas para atributos (sem categorias)
export const INITIAL_SKILLS: Skill[] = [
  { id: 'ACRO', name: 'Acrobacia', attribute: 'DES', abbreviation: 'ACR' },
  { id: 'ARTES', name: 'Artes', attribute: 'PRE', abbreviation: 'ART' },
  { id: 'ATLETISMO', name: 'Atletismo', attribute: 'FOR', abbreviation: 'ATL' },
  { id: 'CIENCIAS', name: 'Ciências', attribute: 'INT', abbreviation: 'CIE' },
  { id: 'ENGANACAO', name: 'Enganação', attribute: 'PRE', abbreviation: 'ENG' },
  { id: 'FOCO', name: 'Foco', attribute: 'PRE', abbreviation: 'FCO' },
  { id: 'FORTITUDE', name: 'Fortitude', attribute: 'VIG', abbreviation: 'FOT' },
  { id: 'FURTIVIDADE', name: 'Furtividade', attribute: 'DES', abbreviation: 'FUR' },
  { id: 'HISTORIA', name: 'História', attribute: 'INT', abbreviation: 'HIS' },
  { id: 'INICIATIVA', name: 'Iniciativa', attribute: 'DES', abbreviation: 'INI' },
  { id: 'INTIMIDACAO', name: 'Intimidação', attribute: 'PRE', abbreviation: 'INTI' },
  { id: 'INTUICAO', name: 'Intuição', attribute: 'INT', abbreviation: 'INTU' },
  { id: 'INVESTIGACAO', name: 'Investigação', attribute: 'INT', abbreviation: 'INV' },
  { id: 'LUTA', name: 'Luta', attribute: 'FOR', abbreviation: 'LUT' },
  { id: 'MAGIA_ARCANA', name: 'Magia Arcana', attribute: 'INT', abbreviation: 'MAG' },
  { id: 'MEDICINA', name: 'Medicina', attribute: 'INT', abbreviation: 'MED' },
  { id: 'PERCEPCAO', name: 'Percepção', attribute: 'PRE', abbreviation: 'PER' },
  { id: 'PERSUASAO', name: 'Persuasão', attribute: 'PRE', abbreviation: 'PES' },
  { id: 'PILOTAGEM', name: 'Pilotagem', attribute: 'DES', abbreviation: 'PIL' },
  { id: 'PRECISAO', name: 'Precisão', attribute: 'DES', abbreviation: 'PRC' },
  { id: 'PRESTIDIGITACAO', name: 'Prestidigitação', attribute: 'DES', abbreviation: 'PREST' },
  { id: 'PROFISSAO', name: 'Profissão', attribute: 'INT', abbreviation: 'PRO' },
  { id: 'REFLEXOS', name: 'Reflexos', attribute: 'DES', abbreviation: 'REF' },
  { id: 'RELIGIAO', name: 'Religião', attribute: 'PRE', abbreviation: 'REL' },
  { id: 'SOBREVIVENCIA', name: 'Sobrevivência', attribute: 'INT', abbreviation: 'SOB' },
  { id: 'TATICA', name: 'Tática', attribute: 'INT', abbreviation: 'TAT' },
  { id: 'TECNOLOGIA', name: 'Tecnologia', attribute: 'INT', abbreviation: 'TEC' },
  { id: 'VONTADE', name: 'Vontade', attribute: 'PRE', abbreviation: 'VON' },
  // Outros padrão (bônus) se necessário — deixar `0` por padrão
]
