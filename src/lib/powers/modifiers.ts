import { Modifier } from "../../components/pages/status/powers/types";

export const COMMON_EXTRAS: Modifier[] = [
  {
    id: "acurado",
    name: "Acurado",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Adiciona +2 por graduação nos testes de ataque feitos com o efeito.",
  },
  {
    id: "afeta-intangivel",
    name: "Afeta Intangível",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Faz com que o efeito funcione contra alvos intangíveis.",
  },
  {
    id: "afeta-outros",
    name: "Afeta Outros",
    type: "extra",
    costPerRank: 1,
    description: "Permite estender um efeito de alcance pessoal a outros.",
  },
  {
    id: "alcance",
    name: "Alcance",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Aumenta o alcance de um efeito de perto em 1,5 metros por graduação.",
  },
  {
    id: "alcance-estendido",
    name: "Alcance Estendido",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Dobra todas as categorias de alcance de um efeito à distância.",
  },
  {
    id: "area",
    name: "Área",
    type: "extra",
    costPerRank: 1,
    description: "Permite que o efeito afete uma área em vez de um único alvo.",
  },
  {
    id: "ataque",
    name: "Ataque",
    type: "extra",
    costPerRank: 0,
    description:
      "Transforma um efeito de alcance pessoal em um efeito de ataque de alcance perto.",
  },
  {
    id: "caracteristica",
    name: "Característica",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Adiciona uma habilidade ou benefício menor ao efeito básico.",
  },
  {
    id: "contagioso",
    name: "Contagioso",
    type: "extra",
    costPerRank: 1,
    description:
      "O efeito funciona em qualquer um que entre em contato com o alvo original.",
  },
  {
    id: "descritor-variavel",
    name: "Descritor Variável",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Permite mudar o descritor de um efeito como uma ação livre.",
  },
  {
    id: "dimensional",
    name: "Dimensional",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Permite que o efeito funcione em alvos em outras dimensões.",
  },
  {
    id: "distancia-aumentada",
    name: "Distância Aumentada",
    type: "extra",
    costPerRank: 1,
    description:
      "Melhora o alcance de um efeito (ex: de perto para à distância).",
  },
  {
    id: "dividido",
    name: "Dividido",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Permite que o efeito seja dividido entre dois ou mais alvos.",
  },
  {
    id: "duracao-aumentada",
    name: "Duração Aumentada",
    type: "extra",
    costPerRank: 1,
    description:
      "Aumenta a duração de um efeito (ex: de instantâneo para concentração).",
  },
  {
    id: "efeito-alternativo",
    name: "Efeito Alternativo",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Permite trocar um efeito por outro (arranjo).",
  },
  {
    id: "efeito-secundario",
    name: "Efeito Secundário",
    type: "extra",
    costPerRank: 1,
    description:
      "Um efeito instantâneo atinge o alvo uma segunda vez na rodada seguinte.",
  },
  {
    id: "engatilhado",
    name: "Engatilhado",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Permite que um efeito instantâneo seja ativado automaticamente sob circunstâncias específicas.",
  },
  {
    id: "impenetravel",
    name: "Impenetrável",
    type: "extra",
    costPerRank: 1,
    description: "Torna uma defesa altamente resistente a efeitos mais fracos.",
  },
  {
    id: "inato",
    name: "Inato",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "O efeito é parte inata de sua natureza e não pode ser Nulificado.",
  },
  {
    id: "indireto",
    name: "Indireto",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Permite que o efeito se origine de um ponto que não seja o usuário.",
  },
  {
    id: "ligado",
    name: "Ligado",
    type: "extra",
    costPerRank: 0,
    isFlat: true,
    description:
      "Combina dois ou mais efeitos para que funcionem simultaneamente.",
  },
  {
    id: "multiataque",
    name: "Multiataque",
    type: "extra",
    costPerRank: 1,
    description:
      "Permite atingir múltiplos alvos ou um único alvo múltiplas vezes.",
  },
  {
    id: "penetrante",
    name: "Penetrante",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "O efeito ignora Resistência Impenetrável.",
  },
  {
    id: "preciso",
    name: "Preciso",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Permite realizar tarefas que exijam delicadeza e controle fino.",
  },
  {
    id: "reacao",
    name: "Reação",
    type: "extra",
    costPerRank: 1,
    description:
      "Altera a ação exigida para o efeito funcionar como uma reação.",
  },
  {
    id: "resistencia-alternativa",
    name: "Resistência Alternativa",
    type: "extra",
    costPerRank: 1,
    description: "Altera o teste de salvamento do efeito.",
  },
  {
    id: "reversivel",
    name: "Reversível",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Permite remover condições ou danos causados pelo efeito à vontade.",
  },
  {
    id: "ricochetear",
    name: "Ricochetear",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Permite que o ataque ricocheteie em superfícies para mudar sua direção.",
  },
  {
    id: "seletivo",
    name: "Seletivo",
    type: "extra",
    costPerRank: 1,
    description: "Permite escolher quem é ou não afetado por um efeito.",
  },
  {
    id: "sonifero",
    name: "Sonífero",
    type: "extra",
    costPerRank: 0,
    description: "Deixa o alvo adormecido em vez de incapacitado.",
  },
  {
    id: "sustentado",
    name: "Sustentado",
    type: "extra",
    costPerRank: 0,
    description: "Altera um efeito de duração permanente para sustentada.",
  },
  {
    id: "sutil",
    name: "Sutil",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Torna o efeito menos perceptível ou indetectável.",
  },
  {
    id: "teleguiado",
    name: "Teleguiado",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description:
      "Concede uma oportunidade adicional de acertar um ataque à distância.",
  },
  {
    id: "traicoeiro",
    name: "Traiçoeiro",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    description: "Torna o resultado do efeito mais difícil de detectar.",
  },
];

export const COMMON_FLAWS: Modifier[] = [
  {
    id: "alcance-diminuido",
    name: "Alcance Diminuído",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Reduz os multiplicadores de alcance para um efeito à distância.",
  },
  {
    id: "alcance-reduzido",
    name: "Alcance Reduzido",
    type: "falha",
    costPerRank: -1,
    description: "Diminui o alcance de um efeito em um passo.",
  },
  {
    id: "ativacao",
    name: "Ativação",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description: "O poder exige uma ação para ser preparado antes do uso.",
  },
  {
    id: "baseado-em-agarrar",
    name: "Baseado em Agarrar",
    type: "falha",
    costPerRank: -1,
    description:
      "O efeito só pode ser usado após um teste de agarrar bem-sucedido.",
  },
  {
    id: "cansativo",
    name: "Cansativo",
    type: "falha",
    costPerRank: -1,
    description: "O uso do efeito causa um nível de fadiga ao personagem.",
  },
  {
    id: "concentracao",
    name: "Concentração",
    type: "falha",
    costPerRank: -1,
    description: "Exige uma ação padrão por turno para manter o efeito.",
  },
  {
    id: "dependente-de-sentido",
    name: "Dependente de Sentido",
    type: "falha",
    costPerRank: -1,
    description:
      "O alvo deve ser capaz de perceber o efeito para que ele funcione.",
  },
  {
    id: "dissipacao",
    name: "Dissipação",
    type: "falha",
    costPerRank: -1,
    description: "O efeito perde eficiência cada vez que é usado.",
  },
  {
    id: "distracao",
    name: "Distração",
    type: "falha",
    costPerRank: -1,
    description: "O personagem fica vulnerável enquanto usa o efeito.",
  },
  {
    id: "efeito-colateral",
    name: "Efeito Colateral",
    type: "falha",
    costPerRank: -1,
    description: "Falhar ao usar o efeito causa um problema ao personagem.",
  },
  {
    id: "exige-teste",
    name: "Exige Teste",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "O personagem deve ser bem-sucedido em um teste para que o efeito funcione.",
  },
  {
    id: "inconstante",
    name: "Inconstante",
    type: "falha",
    costPerRank: -1,
    description: "O efeito funciona apenas metade do tempo ou usos limitados.",
  },
  {
    id: "incontrolavel",
    name: "Incontrolável",
    type: "falha",
    costPerRank: -1,
    description: "O personagem não tem controle sobre o efeito.",
  },
  {
    id: "impreciso",
    name: "Impreciso",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "Impõe uma penalidade de -2 nos testes de ataque com o efeito.",
  },
  {
    id: "limitado",
    name: "Limitado",
    type: "falha",
    costPerRank: -1,
    description: "O efeito funciona apenas em certas situações.",
  },
  {
    id: "tipo",
    name: "Tipo",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["compreender"],
    description:
      "Você só é capaz de compreender um tipo amplo de alvo (-1 por graduação) ou um tipo limitado (-2 por graduação).",
  },
  {
    id: "peculiaridade",
    name: "Peculiaridade",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description: "Um incômodo menor ligado ao efeito.",
  },
  {
    id: "perceptivel",
    name: "Perceptível",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description: "Um efeito contínuo ou permanente é perceptível.",
  },
  {
    id: "permanente",
    name: "Permanente",
    type: "falha",
    costPerRank: -1,
    description: "O efeito está sempre ativo e não pode ser desligado.",
  },
  {
    id: "removivel",
    name: "Removível",
    type: "falha",
    costPerRank: -1,
    isFlat: true,
    description:
      "O poder reside em um dispositivo externo que pode ser tirado.",
  },
  {
    id: "resistivel",
    name: "Resistivel",
    type: "falha",
    costPerRank: -1,
    description:
      "Concede um teste de salvamento a um efeito que normalmente não teria.",
  },
  {
    id: "retroalimentacao",
    name: "Retroalimentação",
    type: "falha",
    costPerRank: -1,
    description:
      "O usuário sofre dano quando a manifestação física de seu efeito sofre dano.",
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
      "Permite que um ser intangível use o efeito no mundo corpóreo; a graduação deste modificador limita a graduação do efeito usado.",
  },
  {
    id: "afeta-objetos",
    name: "Afeta Objetos",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura", "enfraquecer"],
    description:
      "Permite que efeitos normalmente resistidos por Fortitude funcionem em objetos não vivos.",
  },
  {
    id: "aumentar-massa",
    name: "Aumentar Massa",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["mover-objeto", "teleporte"],
    description: "Aumenta a graduação de massa que o efeito pode carregar.",
  },
  {
    id: "incuravel",
    name: "Incurável",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["dano", "enfraquecer"],
    description:
      "O dano ou condição causada pelo efeito não podem ser curados normalmente.",
  },
  {
    id: "amarrar",
    name: "Amarrar",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["criar"],
    description:
      "Permite que o usuário use sua Força para mover objetos criados, dada a conexão do criador com eles.",
  },
  {
    id: "amplo",
    name: "Amplo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["enfraquecer", "nulificar"],
    description:
      "Permite que o efeito afete um conjunto amplo de características ou contra-ataque efeitos de um descritor amplo.",
  },
  {
    id: "atomico",
    name: "Atômico",
    type: "extra",
    costPerRank: 1,
    isFlat: true,
    appliesTo: ["encolhimento"],
    description:
      "Permite diminuir até o nível molecular/atômico, concedendo imunidade e atravessar objetos sólidos.",
  },
  {
    id: "energizante",
    name: "Energizante",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura"],
    description: "Permite curar as condições fatigado e exausto.",
  },
  {
    id: "heroico",
    name: "Heróico",
    type: "extra",
    costPerRank: 2,
    appliesTo: ["invocar"],
    description:
      "As criaturas invocadas não são capangas e não sofrem a condição tonto.",
  },
  {
    id: "horda",
    name: "Horda",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["invocar"],
    description:
      "Se tiver Capangas Múltiplos, permite invocar todos com uma única ação padrão.",
  },
  {
    id: "progressiva",
    name: "Progressiva",
    type: "extra",
    costPerRank: 2,
    appliesTo: ["aflicao", "enfraquecer"],
    description:
      "O efeito aumenta em um grau a cada rodada se o alvo falhar no salvamento.",
  },
  {
    id: "redirecionar",
    name: "Redirecionar/Reflexão",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["deflexao", "imunidade"],
    description: "Permite refletir ou redirecionar ataques.",
  },
  {
    id: "ressurreicao",
    name: "Ressurreição",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura"],
    description: "Permite restaurar a vida dos mortos.",
  },
  {
    id: "controlado",
    name: "Controlado",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["invocar"],
    description:
      'Os capangas invocados recebem a condição "controlado" e seguem suas ordens.',
  },
  {
    id: "condicao-extra",
    name: "Condição Extra",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["aflicao"],
    description: "Aflição impõe condições adicionais por grau de sucesso.",
  },
  {
    id: "concentracao-aflicao",
    name: "Concentração",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["aflicao"],
    description:
      "Uma Aflição de Concentração exige que o usuário gaste uma ação padrão por rodada para mantê-la; enquanto o usuário mantiver, o alvo faz um novo teste de salvamento a cada rodada para evitar o efeito (sem necessidade de teste de ataque).",
  },
  {
    id: "cumulativo",
    name: "Cumulativo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["aflicao", "leitura-mental"],
    description:
      "Graus de sucesso se somam em vez de usar apenas o resultado mais recente.",
  },
  {
    id: "seletivo-ambiente",
    name: "Seletivo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["ambiente"],
    description:
      "Com este extra você pode variar o ambiente dentro de sua área afetada, afetando alguns enquanto não afeta outros, ou até mesmo misturando ambientes diferentes (tornando parte da área fria e outra quente, por exemplo).",
  },
  {
    id: "afeta-outros-camuflagem",
    name: "Afeta Outros",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["camuflagem"],
    description:
      "Você pode conceder Camuflagem a outros personagens através do alcance, caso também aplique o modificador A Distância.",
  },
  {
    id: "area-camuflagem",
    name: "Área",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["camuflagem"],
    description:
      "Camuflagem com Afeta Outros ou Alcance, afetando múltiplos alvo em uma área.",
  },
  {
    id: "ataque-camuflagem",
    name: "Ataque",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["camuflagem"],
    description:
      "Use este extra para um efeito Camuflagem que você pode projetar sobre outro, criando um campo de Camuflagem Visual (por exemplo). Funciona como um ataque.",
  },
  {
    id: "preciso-camuflagem",
    name: "Preciso",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["camuflagem"],
    description:
      "Você pode variar entre camuflagem total, parcial ou nenhuma, escondendo apenas algumas partes. Se afetar múltiplos sentidos, pode afetar alguns sentidos por vez.",
  },
  {
    id: "dano-mod",
    name: "Dano",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["mover-objeto"],
    description:
      "Permite que o efeito cause dano direto como uma aplicação de Força.",
  },
  {
    id: "efeito-alternativo-dinamico",
    name: "Efeito Alternativo Dinâmico",
    type: "extra",
    costPerRank: 2,
    description:
      "Permite que efeitos alternativos compartilhem pontos de poder e operem simultaneamente com eficiência reduzida.",
  },
  {
    id: "estacionario",
    name: "Estacionário",
    type: "extra",
    costPerRank: 0,
    appliesTo: ["criar"],
    description:
      "Objetos criados ficam imóveis no ar e resistem a serem movidos com Força igual à graduação do efeito.",
  },
  {
    id: "elo-mental",
    name: "Elo Mental",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["invocar"],
    description: "Concede um elo telepático com os capangas invocados.",
  },
  {
    id: "forca-normal",
    name: "Força Normal",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["encolhimento"],
    description:
      "Conserva Força, Velocidade e Intimidação totais quando encolhido.",
  },
  {
    id: "independente",
    name: "Independente",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["ilusão"],
    description:
      "As ilusões ativas exigem apenas uma ação livre para manutenção.",
  },
  {
    id: "ligacao-sensorial",
    name: "Ligação Sensorial",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["leitura-mental"],
    description:
      'Permite "entrar" nos sentidos do alvo e perceber o que ele percebe.',
  },
  {
    id: "metamorfo",
    name: "Metamorfo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["morfar"],
    description:
      "Permite conjunto de características alternativas (mudança de estatísticas físicas) além da aparência.",
  },
  {
    id: "movel",
    name: "Móvel",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["criar"],
    description: "Permite mover objetos criados usando a graduação de Criar.",
  },
  {
    id: "mudar-direcao-velocidade",
    name: "Mudar Direção/Velocidade",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["teleporte"],
    description:
      "Concede controle sobre orientação e/ou velocidade após Teleporte.",
  },
  {
    id: "nao-condutor",
    name: "Não Condutor",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["sentido-remoto"],
    description:
      "Ataques sensoriais mirados no local remoto não afetam o usuário.",
  },
  {
    id: "percepcao-extra",
    name: "Percepção (Extra)",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["cura", "mover-objeto"],
    description:
      "Permite usar o efeito à distância sem exigir teste de ataque.",
  },
  {
    id: "portal",
    name: "Portal",
    type: "extra",
    costPerRank: 2,
    appliesTo: ["teleporte"],
    description: "Abre um portal que transporta outros através dele.",
  },
  {
    id: "sacrificio",
    name: "Sacrifício",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["invocar"],
    description:
      "Gasta um Ponto Heroico para direcionar um ataque para um capanga.",
  },
  {
    id: "sem-esforco",
    name: "Sem Esforço",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["leitura-mental", "nulificar"],
    description:
      "Permite tentar novamente o uso do efeito um número ilimitado de vezes após falhas.",
  },
  {
    id: "simultaneo",
    name: "Simultâneo",
    type: "extra",
    costPerRank: 1,
    appliesTo: ["enfraquecer", "nulificar"],
    description:
      "O efeito afeta todas as características de um mesmo conjunto ao mesmo tempo.",
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
      "Uma ou mais de suas características é diminuída enquanto outras são aumentadas. Esta falha vale tantos pontos quanto a redução na(s) característica(s) afetada(s). Por exemplo, se você perder Intelecto enquanto ganha Força, o valor da falha é igual à perda de Intelecto. O efeito deve custar pelo menos 1 ponto.",
  },
  {
    id: "limitado-aumentada",
    name: "Limitado",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["caracteristica-aumentada"],
    description:
      "Características Aumentadas normalmente são Limitadas, como Apenas Noturnas (ou Diurnas), Enquanto Irritado (ou em qualquer outro estado emocional), Submarina (ou em algum outro tipo de ambiente), e assim por diante. Uma limitação que raramente apareça deve ser tratada como uma complicação.",
  },
  {
    id: "grau-limitado",
    name: "Grau Limitado",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["aflicao"],
    description:
      "A Aflição está limitada a dois graus de efeito por aplicação deste modificador; duas aplicações limitam a um grau de efeito.",
  },
  {
    id: "recuperacao-instantanea",
    name: "Recuperação Instantânea",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["aflicao"],
    description:
      "O alvo se recupera automaticamente sem necessidade de teste no fim da rodada em que a duração do efeito termina (Aflições instantâneas duram apenas uma rodada).",
  },
  {
    id: "limitado-camuflagem",
    name: "Limitado",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Sua Camuflagem funciona apenas sob certas circunstâncias, como em meio a névoa, sombras ou em áreas urbanas. Um exemplo é Limitado a Máquinas, que exige que sua Camuflagem engane apenas sentidos com um descritor tecnológico.",
  },
  {
    id: "mesclar",
    name: "Mesclar",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Você se mescia com os arredores. Sua Camuflagem não funciona se você se mover mais rápido que metade de sua velocidade anterior.",
  },
  {
    id: "parcial-camuflagem",
    name: "Parcial",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Seu efeito concede apenas camuflagem parcial, em vez de total.",
  },
  {
    id: "passiva-camuflagem",
    name: "Passiva",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Sua camuflagem dura apenas até que você faça algo que o deixe aberto a um teste de ataque ou do efeito, quando então sua camuflagem se desfaz e você não pode tentar novamente na rodada seguinte.",
  },
  {
    id: "resistivel-camuflagem",
    name: "Resistível",
    type: "falha",
    costPerRank: -1,
    appliesTo: ["camuflagem"],
    description:
      "Sua Camuflagem oferece um teste de salvamento para qualquer personagem que tenta penetrá-la (escolha uma defesa apropriada).",
  },
];