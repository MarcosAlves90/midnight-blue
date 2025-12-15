import type { Skill } from './types'

// Lista de perícias - por enquanto, apenas mapeadas para atributos (sem categorias)
export const INITIAL_SKILLS: Skill[] = [
  { 
    id: 'ACRO', 
    name: 'Acrobacia', 
    attribute: 'AGI', 
    abbreviation: 'ACR',
    description: 'Realiza manobras acrobáticas, como cambalhotas (para reduzir dano de queda), equilibrar-se em superfícies precárias (CD 5–20) e manobrar em combate. É usada para levantar-se de uma posição caído como ação livre (CD 20).'
  },
  { 
    id: 'ATLETISMO', 
    name: 'Atletismo', 
    attribute: 'FOR', 
    abbreviation: 'ATL',
    description: 'Usada para feitos físicos como saltar, escalar e nadar. Permite correr mais rápido (CD 15, aumentando a velocidade em +1 por rodada) e resistir a quedas (se falhar em escalar). A distância de saltos depende do resultado do teste.'
  },
  { 
    id: 'COMBATE_DISTANCIA', 
    name: 'Combate à Distância', 
    attribute: 'DES', 
    abbreviation: 'CBD',
    description: 'Representa o treinamento em um tipo específico de ataque à distância (como armas de fogo, controle de fogo, ou arremesso) e concede um bônus no teste de ataque. Cada ataque é uma perícia separada.'
  },
  { 
    id: 'COMBATE_CORPO_A_CORPO', 
    name: 'Combate Corpo-a-Corpo', 
    attribute: 'LUT', 
    abbreviation: 'CBC',
    description: 'Representa o treinamento em um tipo específico de ataque corpo-a-corpo (como espadas ou desarmado) e concede um bônus no teste de ataque. Assim como o Combate à Distância, cada ataque é uma perícia separada.'
  },
  { 
    id: 'ENGANACAO', 
    name: 'Enganação', 
    attribute: 'PRE', 
    abbreviation: 'ENG',
    description: 'Aborda atuação, blefe, trapaça e ludibriar os outros. Inclui: Blefar (oposto por Intuição ou Enganação do alvo), Disfarçar (oposto por Percepção, exigindo preparação) e Fintar (em combate, deixando o alvo vulnerável).'
  },
  { 
    id: 'ESPECIALIDADE', 
    name: 'Especialidade', 
    attribute: 'INT', 
    abbreviation: 'ESP',
    description: 'Perícia ampla que abrange conhecimento e treinamento em diferentes campos, como profissões ou áreas acadêmicas (ex: Ciência, Magia, Direito, etc.). Usada para responder a perguntas, pesquisar e praticar a profissão. Pode ser usada sem treinamento para tarefas básicas.'
  },
  { 
    id: 'FURTIVIDADE', 
    name: 'Furtividade', 
    attribute: 'AGI', 
    abbreviation: 'FUR',
    description: 'Usada para se mover despercebido ou esconder-se (oposto por Percepção). Permite mover-se a velocidade normal com penalidade de –5. Exige cobertura ou camuflagem para esconder-se.'
  },
  { 
    id: 'INTIMIDACAO', 
    name: 'Intimidação', 
    attribute: 'PRE', 
    abbreviation: 'INTI',
    description: 'Usada para coagir os outros através de ameaças. Inclui: Coagir (oposto por Intuição ou Vontade, para forçar cooperação) e Desmoralizar (em combate, deixando o alvo prejudicado ou desabilitado).'
  },
  { 
    id: 'INTUICAO', 
    name: 'Intuição', 
    attribute: 'PRO', 
    abbreviation: 'INTU',
    description: 'Permite discernir sentimentos e intenções, e avaliar se alguém é confiável. É usada para Detectar Ilusão e Resistir Influência (em testes opostos).'
  },
  { 
    id: 'INVESTIGACAO', 
    name: 'Investigação', 
    attribute: 'INT', 
    abbreviation: 'INV',
    description: 'Permite procurar e estudar pistas, reunir informações, analisar evidências e obter informações (através de contatos ou pesquisa). O tempo para buscar uma área depende do tamanho.'
  },
  { 
    id: 'PERCEPCAO', 
    name: 'Percepção', 
    attribute: 'PRO', 
    abbreviation: 'PER',
    description: 'Usada para notar coisas, como ouvir barulhos ou ver objetos. Discernir detalhes exige três graus de sucesso e há penalidade de –1 a cada 3 metros.'
  },
  { 
    id: 'PERSUASAO', 
    name: 'Persuasão', 
    attribute: 'PRE', 
    abbreviation: 'PES',
    description: 'Usada para lidar com pessoas, fazer as pessoas cooperarem, negociar e melhorar a atitude (hostil, desfavorável, indiferente, favorável, prestativo) dos outros. Mudar a atitude é um teste de CD 15.'
  },
  { 
    id: 'PRESTIDIGITACAO', 
    name: 'Prestidigitação', 
    attribute: 'DES', 
    abbreviation: 'PREST',
    description: 'Habilidade manual usada para esconder itens, roubar (CD 20, oposto por Percepção), desvencilhar-se de amarras (CD 15–25) e contorcer-se.'
  },
  { 
    id: 'TECNOLOGIA', 
    name: 'Tecnologia', 
    attribute: 'INT', 
    abbreviation: 'TEC',
    description: 'Usada para operar, construir, reparar e trabalhar com mecanismos e equipamentos. Inclui consertar itens (CD reduzida), Demolir (para maximizar dano de explosivos) e desarmar sistemas de segurança.'
  },
  { 
    id: 'TRATAMENTO', 
    name: 'Tratamento', 
    attribute: 'INT', 
    abbreviation: 'TRA',
    description: 'Usada para tratar ferimentos e doenças. Inclui Diagnosticar, Estabilizar (personagens moribundos), Oferecer Tratamento (para reduzir tempo de recuperação) e Reviver (remover condições tonto ou atordoado).'
  },
  { 
    id: 'VEICULOS', 
    name: 'Veículos', 
    attribute: 'DES', 
    abbreviation: 'VEI',
    description: 'Usada para operar veículos (carros, barcos, aviões, etc.). Testes são exigidos em condições estressantes para manobras (CD 5–25).'
  },
  // Outros padrão (bônus) se necessário — deixar `0` por padrão
]
