import { Modifier } from "../../components/pages/status/powers/types";

export const COMMON_EXTRAS: Modifier[] = [
  {
    id: "acurado",
    name: "Acurado",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Bônus de ataque de +2 por graduação. (+1 PF por graduação)",
  },
  {
    id: "afeta-intangivel",
    name: "Afeta Intangível",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O efeito funciona em seres intangíveis com metade de seu efeito (1 graduação) ou com seu efeito completo (2 graduações). (+1 ou +2 PF)",
  },
  {
    id: "afeta-outros",
    name: "Afeta Outros",
    type: "extra",
    costPerRank: 1,
    description: "Efeito pessoal funciona nos outros. (+1 PP)",
  },
  {
    id: "afeta-tangivel",
    name: "Afeta Tangível",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O Efeito funciona em seres tangíveis com graduação igual à da graduação do extra. (+1 PF por graduação)",
  },
  {
    id: "alcance",
    name: "Alcance",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O alcance do efeito aumenta em 1,5 metros por graduação. (+1 PF por graduação)",
  },
  {
    id: "alcance-estendido",
    name: "Alcance Estendido",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Dobra o alcance à distância por graduação. (+1 PF por graduação)",
  },
  {
    id: "area",
    name: "Área",
    type: "extra",
    costPerRank: 1,
    description: "O efeito funciona em uma área. (+1 PP)",
  },
  {
    id: "ataque",
    name: "Ataque",
    type: "extra",
    costPerRank: 0,
    description:
      "Um efeito pessoal funciona nos outros como um ataque. (+0 PP)",
  },
  {
    id: "caracteristica",
    name: "Característica",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Adiciona uma habilidade ou benefício menor a um efeito. (+1 PF por graduação)",
  },
  {
    id: "contagioso",
    name: "Contagioso",
    type: "extra",
    costPerRank: 1,
    description:
      "O efeito funciona em qualquer um que entre em contato com o alvo. (+1 PP)",
  },
  {
    id: "descritor-variavel",
    name: "Descritor Variável",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "O efeito pode mudar de descritores. (+1 ou +2 PF)",
  },
  {
    id: "dimensional",
    name: "Dimensional",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O efeito funciona em alvos em outras dimensões. (+1 a +3 PF)",
  },
  {
    id: "distancia-aumentada",
    name: "Distância Aumentada",
    type: "extra",
    costPerRank: 1,
    description: "Melhora o alcance de um efeito. (+1 PP)",
  },
  {
    id: "dividido",
    name: "Dividido",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O efeito pode ser dividido em efeitos múltiplos, menores. (+1 PF por graduação)",
  },
  {
    id: "duracao-aumentada",
    name: "Duração Aumentada",
    type: "extra",
    costPerRank: 1,
    description: "Aumenta a duração de um efeito. (+1 PP)",
  },
  {
    id: "efeito-alternativo",
    name: "Efeito Alternativo",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Substitui um efeito por outro em um poder. (+1 ou +2 PF)",
  },
  {
    id: "efeito-secundario",
    name: "Efeito Secundário",
    type: "extra",
    costPerRank: 1,
    description: "Efeito instantâneo funciona duas vezes no alvo. (+1 PP)",
  },
  {
    id: "condicional",
    name: "Condicional",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Efeito pode ter sua ativação definida para mais tarde. (+1 PF por graduação)",
  },
  {
    id: "impenetravel",
    name: "Impenetrável",
    type: "extra",
    costPerRank: 1,
    description:
      "Um salvamento ignora efeitos cujo modificador de dificuldade tenha a metade ou menos graduações que ela. (+1 PP)",
  },
  {
    id: "inato",
    name: "Inato",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Efeito não pode ser Nulificado. (+1 PF)",
  },
  {
    id: "indireto",
    name: "Indireto",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Efeito pode se originar de um ponto que não seja o usuário. (+1 PF por graduação)",
  },
  {
    id: "ligado",
    name: "Ligado",
    type: "extra",
    costPerRank: 0,
    isFlat: true,
    description: "Dois ou mais efeitos funcionam como um. (0 PF)",
  },
  {
    id: "multiataque",
    name: "Multiataque",
    type: "extra",
    costPerRank: 1,
    description:
      "Efeito pode atingir múltiplos alvos ou um único alvo múltiplas vezes. (+1 PP)",
  },
  {
    id: "penetrante",
    name: "Penetrante",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Efeito atravessa Resistência Impenetrável. (+1 PF por graduação)",
  },
  {
    id: "preciso",
    name: "Preciso",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Efeito pode realizar tarefas delicadas e precisas. (+1 PF)",
  },
  {
    id: "reacao",
    name: "Reação",
    type: "extra",
    costPerRank: 1,
    description:
      "A ação exigida pelo efeito muda para reação. (+1 a +3 PP)",
  },
  {
    id: "resistencia-alternativa",
    name: "Resistência Alternativa",
    type: "extra",
    costPerRank: 1,
    description: "O efeito usa uma salvamento diferente. (+0 ou +1 PP)",
  },
  {
    id: "reversivel",
    name: "Reversível",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Efeito pode ser removido à vontade como uma ação livre. (+1 PF)",
  },
  {
    id: "ricochetear",
    name: "Ricochetear",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O atacante pode ricochetear o efeito para mudar sua direção. (+1 PF)",
  },
  {
    id: "seletivo",
    name: "Seletivo",
    type: "extra",
    costPerRank: 1,
    description:
      "Efeito resistível funciona apenas nos alvos que vocês escolher. (+1 PP)",
  },
  {
    id: "sonifero",
    name: "Sonífero",
    type: "extra",
    costPerRank: 0,
    description:
      "O efeito deixo os alvos adormecidos em vez de incapacitados. (+0 PP)",
  },
  {
    id: "sustentado",
    name: "Sustentado",
    type: "extra",
    costPerRank: 0,
    description: "Torna um efeito permanente em sustentado. (+0 PP)",
  },
  {
    id: "sutil",
    name: "Sutil",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O efeito é menos perceptível (1 ponto) ou completamente imperceptível (2 pontos). (+1 ou +2 PF)",
  },
  {
    id: "teleguiado",
    name: "Teleguiado",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Um efeito de ataque ganha chances adicionais de acertar o alvo. (+1 PF por graduação)",
  },
  {
    id: "traicoeiro",
    name: "Traiçoeiro",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O resultado do efeito é mais difícil de ser detectado. (+1 PF)",
  },
];

export const COMMON_FLAWS: Modifier[] = [
  {
    id: "acao-aumentada",
    name: "Ação Aumentada",
    type: "falha",
    costPerRank: -1,
    description:
      "Aumenta a ação exigida para usar o efeito. (–1 a –3 PP)",
  },
  {
    id: "alcance-diminuido",
    name: "Alcance Diminuído",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Reduz alcances perto, médio e longo para o efeito. (–1 PF por graduação)",
  },
  {
    id: "alcance-reduzido",
    name: "Alcance Reduzido",
    type: "falha",
    costPerRank: -1,
    description: "Diminui o alcance de um efeito. (–1 ou –2 PP)",
  },
  {
    id: "ativacao",
    name: "Ativação",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Efeito exige uma ação de movimento (1 ponto) ou padrão (2 pontos) para ser ativado. (–1 ou –2 PF)",
  },
  {
    id: "baseado-em-agarrar",
    name: "Baseado em Agarrar",
    type: "falha",
    costPerRank: -1,
    description:
      "O efeito exige um ataque bem-sucedido de agarrar para ser usado. (–1 PP)",
  },
  {
    id: "cansativo",
    name: "Cansativo",
    type: "falha",
    costPerRank: -1,
    description:
      "Efeito causa um nível de fatiga quando usado. (–1 PP)",
  },
  {
    id: "concentracao",
    name: "Concentração",
    type: "falha",
    costPerRank: -1,
    description:
      "A duração de um efeito sustentado se torna concentração. (–1 PP)",
  },
  {
    id: "dependente-de-sentido",
    name: "Dependente de Sentido",
    type: "falha",
    costPerRank: -1,
    description:
      "Alvo deve ser capaz de perceber o efeito para que ele funcione. (–1 PP)",
  },
  {
    id: "dissipacao",
    name: "Dissipação",
    type: "falha",
    costPerRank: -1,
    description:
      "O efeito perde 1 graduação cada vez que é usado. (–1 PP)",
  },
  {
    id: "distracao",
    name: "Distração",
    type: "falha",
    costPerRank: -1,
    description:
      "Você fica vulnerável enquanto usa o efeito. (–1 PP)",
  },
  {
    id: "efeito-colateral",
    name: "Efeito Colateral",
    type: "falha",
    costPerRank: -1,
    description:
      "Falhar em usar o efeito causa um efeito colateral problemático. (–1 ou –2 PP)",
  },
  {
    id: "exige-teste",
    name: "Exige Teste",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Você deve ser bem-sucedido em um teste para usar o efeito. (–1 PF por graduação)",
  },
  {
    id: "inconstante",
    name: "Inconstante",
    type: "falha",
    costPerRank: -1,
    description:
      "Efeito funciona apenas a metade do tempo (resultado de 11 ou mais). (–1 PP)",
  },
  {
    id: "incontrolavel",
    name: "Incontrolável",
    type: "falha",
    costPerRank: -1,
    description: "Você não tem controle sobre o efeito. (–1 PP)",
  },
  {
    id: "impreciso",
    name: "Impreciso",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Cada graduação impõe -2 em testes de ataque com o efeito em questão. (–1 PF por graduação)",
  },
  {
    id: "limitado",
    name: "Limitado",
    type: "falha",
    costPerRank: -1,
    description:
      "Efeito perde mais ou menos a metade de sua eficiência. (–1 PP)",
  },
  {
    id: "peculiaridade",
    name: "Peculiaridade",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Uma falha menor ligada a um efeito. O oposto de uma Característica. (–1 PF por graduação)",
  },
  {
    id: "perceptivel",
    name: "Perceptível",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description: "Efeito contínuo ou permanente é perceptível. (–1 PF)",
  },
  {
    id: "permanente",
    name: "Permanente",
    type: "falha",
    costPerRank: -1,
    description:
      "Efeito não pode ser desligado ou melhorado com esforço extra. (–1 PP)",
  },
  {
    id: "removivel",
    name: "Removível",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Efeito pode ser removido do usuário. (–1 ou –2 PF a cada 5 pontos)",
  },
  {
    id: "resistivel",
    name: "Resistível",
    type: "falha",
    costPerRank: -1,
    description: "Efeito ganha um teste de salvamento. (–1 PP)",
  },
  {
    id: "retroalimentacao",
    name: "Retroalimentação",
    type: "falha",
    costPerRank: -1,
    description:
      "Você sofre dano quando a manifestação de seu efeito sofre dano. (–1 PP)",
  },
];

export const EFFECT_SPECIFIC_EXTRAS: Modifier[] = [
  {
    id: "afeta-corporeo",
    name: "Afeta Corpóreo",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["intangibilidade"],
    description:
      "O efeito funciona em seres corpóreos com graduação igual à graduação do extra. (+1 PF por graduação)",
  },
  {
    id: "afeta-objetos",
    name: "Afeta Objetos",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura", "enfraquecer"],
    description:
      "Efeito resistido por Fortitude funciona sobre objetos. (+0 ou +1 PP)",
  },
  {
    id: "aumentar-massa",
    name: "Aumentar Massa",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["mover-objeto", "teleporte"],
    description:
      "Efeito pode carregar uma quantidade maior de massa. (+1 PF por graduação)",
  },
  {
    id: "incuravel",
    name: "Incurável",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["dano", "enfraquecer"],
    description:
      "Efeito não pode ser contra-atacado ou removido usando Cura ou Regeneração. (+1 PF)",
  },
  {
    id: "amarrar",
    name: "Amarrar",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["criar"],
    description:
      "Permite que o usuário use sua Força para mover objetos criados, dada a conexão do criador com eles. (+1 PF)",
  },
  {
    id: "amplo",
    name: "Amplo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["enfraquecer", "nulificar"],
    description:
      "Permite que o efeito afete um conjunto amplo de características ou contra-ataque efeitos de um descritor amplo. (+1 PP)",
  },
  {
    id: "atomico",
    name: "Atômico",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["encolhimento"],
    description:
      "Permite diminuir até o nível molecular/atômico, concedendo imunidade e atravessar objetos sólidos. (+1 PF)",
  },
  {
    id: "energizante",
    name: "Energizante",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura"],
    description: "Permite curar as condições fatigado e exausto. (+1 PP)",
  },
  {
    id: "heroico",
    name: "Heróico",
    type: "extra",
    costPerRank: 2,
    appliesTo: ["invocar"],
    description:
      "As criaturas invocadas não são capangas e não sofrem a condição tonto. (+2 PP)",
  },
  {
    id: "horda",
    name: "Horda",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["invocar"],
    description:
      "Se tiver Capangas Múltiplos, permite invocar todos com uma única ação padrão. (+1 PP)",
  },
  {
    id: "progressiva",
    name: "Progressiva",
    type: "extra",
    costPerRank: 2,
    appliesTo: ["aflicao", "enfraquecer"],
    description:
      "O efeito aumenta em um grau a cada rodada se o alvo falhar no salvamento. (+2 PP)",
  },
  {
    id: "redirecionar",
    name: "Redirecionar/Reflexão",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["deflexao", "imunidade"],
    description: "Permite refletir ou redirecionar ataques. (+1 PP)",
  },
  {
    id: "ressurreicao",
    name: "Ressurreição",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura"],
    description: "Permite restaurar a vida dos mortos. (+1 PP)",
  },
  {
    id: "controlado",
    name: "Controlado",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["invocar"],
    description:
      'Os capangas invocados recebem a condição "controlado" e seguem suas ordens. (+1 PP)',
  },
  {
    id: "condicao-extra",
    name: "Condição Extra",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["aflicao"],
    description: "Aflição impõe condições adicionais por grau de sucesso. (+1 PP)",
  },
  {
    id: "concentracao-aflicao",
    name: "Concentração",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["aflicao"],
    description:
      "Uma Aflição de Concentração exige que o usuário gaste uma ação padrão por rodada para mantê-la; enquanto o usuário mantiver, o alvo faz um novo teste de salvamento a cada rodada para evitar o efeito (sem necessidade de teste de ataque). (+1 PP)",
  },
  {
    id: "cumulativo",
    name: "Cumulativo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["aflicao", "leitura-mental"],
    description:
      "Graus de sucesso se somam em vez de usar apenas o resultado mais recente. (+1 PP)",
  },
  {
    id: "seletivo-ambiente",
    name: "Seletivo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["ambiente"],
    description:
      "Com este extra você pode variar o ambiente dentro de sua área afetada, afetando alguns enquanto não afeta outros, ou até mesmo misturando ambientes diferentes (tornando parte da área fria e outra quente, por exemplo). (+1 PP)",
  },
  {
    id: "afeta-outros-camuflagem",
    name: "Afeta Outros",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["camuflagem"],
    description:
      "Você pode conceder Camuflagem a outros personagens através do alcance, caso também aplique o modificador A Distância. (+1 PP)",
  },
  {
    id: "area-camuflagem",
    name: "Área",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["camuflagem"],
    description:
      "Camuflagem com Afeta Outros ou Alcance, afetando múltiplos alvo em uma área. (+1 PP)",
  },
  {
    id: "ataque-camuflagem",
    name: "Ataque",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["camuflagem"],
    description:
      "Use este extra para um efeito Camuflagem que você pode projetar sobre outro, criando um campo de Camuflagem Visual (por exemplo). Funciona como um ataque. (+1 PP)",
  },
  {
    id: "preciso-camuflagem",
    name: "Preciso",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["camuflagem"],
    description:
      "Você pode variar entre camuflagem total, parcial ou nenhuma, escondendo apenas algumas partes. Se afetar múltiplos sentidos, pode afetar alguns sentidos por vez. (+1 PF)",
  },
  {
    id: "dano-mod",
    name: "Dano",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["mover-objeto"],
    description:
      "Permite que o efeito cause dano direto como uma aplicação de Força. (+1 PP)",
  },
  {
    id: "efeito-alternativo-dinamico",
    name: "Efeito Alternativo Dinâmico",
    type: "extra",
    costPerRank: 2,
    isFlat: true,
    description:
      "Permite que efeitos alternativos compartilhem pontos de poder e operem simultaneamente com eficiência reduzida. (+2 PF)",
  },
  {
    id: "estacionario",
    name: "Estacionário",
    type: "extra",
    costPerRank: 0,
    isFlat: true,
    appliesTo: ["criar"],
    description:
      "Objetos criados ficam imóveis no ar e resistem a serem movidos com Força igual à graduação do efeito. (+0 PF)",
  },
  {
    id: "elo-mental",
    name: "Elo Mental",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["invocar"],
    description: "Concede um elo telepático com os capangas invocados. (+1 PF)",
  },
  {
    id: "forca-normal",
    name: "Força Normal",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["encolhimento"],
    description:
      "Conserva Força, Velocidade e Intimidação totais quando encolhido. (+1 PF)",
  },
  {
    id: "independente",
    name: "Independente",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["ilusão"],
    description:
      "As ilusões ativas exigem apenas uma ação livre para manutenção. (+1 PP)",
  },
  {
    id: "ligacao-sensorial",
    name: "Ligação Sensorial",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["leitura-mental"],
    description:
      'Permite "entrar" nos sentidos do alvo e perceber o que ele percebe. (+1 PF)',
  },
  {
    id: "metamorfo",
    name: "Metamorfo",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["morfar"],
    description:
      "Permite conjunto de características alternativas (mudança de estatísticas físicas) além da aparência. (+1 PF por graduação)",
  },
  {
    id: "movel",
    name: "Móvel",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["criar"],
    description: "Permite mover objetos criados usando a graduação de Criar. (+1 PP)",
  },
  {
    id: "mudar-direcao-velocidade",
    name: "Mudar Direção/Velocidade",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["teleporte"],
    description:
      "Concede controle sobre orientação e/ou velocidade após Teleporte. (+1 PF)",
  },
  {
    id: "nao-condutor",
    name: "Não Condutor",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["sentido-remoto"],
    description:
      "Ataques sensoriais mirados no local remoto não afetam o usuário. (+1 PF)",
  },
  {
    id: "percepcao-extra",
    name: "Percepção (Extra)",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura", "mover-objeto"],
    description:
      "Permite usar o efeito à distância sem exigir teste de ataque. (+1 PP)",
  },
  {
    id: "portal",
    name: "Portal",
    type: "extra",
    costPerRank: 2,
    appliesTo: ["teleporte"],
    description: "Abre um portal que transporta outros através dele. (+2 PP)",
  },
  {
    id: "sacrificio",
    name: "Sacrifício",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["invocar"],
    description:
      "Gasta um Ponto Heroico para direcionar um ataque para um capanga. (+1 PF)",
  },
  {
    id: "sem-esforco",
    name: "Sem Esforço",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["leitura-mental", "nulificar"],
    description:
      "Permite tentar novamente o uso do efeito um número ilimitado de vezes após falhas. (+1 PP)",
  },
  {
    id: "simultaneo",
    name: "Simultâneo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["enfraquecer", "nulificar"],
    description:
      "O efeito afeta todas as características de um mesmo conjunto ao mesmo tempo. (+1 PP)",
  },
];


export const EFFECT_SPECIFIC_FLAWS: Modifier[] = [
  {
    id: "caracteristica-diminuida",
    name: "Característica Diminuída",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    appliesTo: ["caracteristica-aumentada"],
    description:
      "Uma ou mais de suas características é diminuída enquanto outras são aumentadas. Esta falha vale tantos pontos quanto a redução na(s) característica(s) afetada(s). (–1 PF por graduação)",
  },
  {
    id: "limitado-aumentada",
    name: "Limitado",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["caracteristica-aumentada"],
    description:
      "Características Aumentadas normalmente são Limitadas, como Apenas Noturnas, Enquanto Irritado ou Submarina. (–1 PP)",
  },
  {
    id: "grau-limitado",
    name: "Grau Limitado",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["aflicao"],
    description:
      "A Aflição está limitada a dois graus de efeito por aplicação deste modificador; duas aplicações limitam a um grau de efeito. (–1 PP)",
  },
  {
    id: "recuperacao-instantanea",
    name: "Recuperação Instantânea",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["aflicao"],
    description:
      "O alvo se recupera automaticamente sem necessidade de teste no fim da rodada em que a duração do efeito termina. (–1 PP)",
  },
  {
    id: "limitado-camuflagem",
    name: "Limitado",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Sua Camuflagem funciona apenas sob certas circunstâncias, como em meio a névoa, sombras ou áreas urbanas. (–1 PP)",
  },
  {
    id: "mesclar",
    name: "Mesclar",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Você se mescia com os arredores. Sua Camuflagem não funciona se você se mover mais rápido que metade de sua velocidade anterior. (–1 PP)",
  },
  {
    id: "parcial-camuflagem",
    name: "Parcial",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Seu efeito concede apenas camuflagem parcial, em vez de total. (–1 PP)",
  },
  {
    id: "passiva-camuflagem",
    name: "Passiva",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Sua camuflagem dura apenas até que você faça algo que o deixe aberto a um teste de ataque ou do efeito. (–1 PP)",
  },
  {
    id: "resistivel-camuflagem",
    name: "Resistível",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Sua Camuflagem oferece um teste de salvamento para qualquer personagem que tenta penetrá-la. (–1 PP)",
  },
];
