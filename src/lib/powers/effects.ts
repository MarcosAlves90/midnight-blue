import { Effect } from "../../components/powers/types";

export const EFFECT_CATEGORIES: Record<string, string> = {
  ataque:
    "Efeitos de ataque são usados ofensivamente. Exigem uma ação padrão, um teste de ataque e causam dano ou outras penalidades; permitem testes de salvamento.",
  controle:
    "Efeitos de controle concedem influência sobre objetos, ambiente ou seres (invocações, mover objetos). Normalmente exigem ação padrão e podem ser sustentados.",
  defesa:
    "Efeitos de defesa concedem bônus de salvamento, imunidade ou proteção; muitos são permanentes ou sutis.",
  geral:
    "Efeitos gerais não se encaixam em categorias especiais e seguem as regras descritas em sua descrição.",
  movimento:
    "Efeitos de movimento fornecem deslocamento ou modos de locomoção (velocidade, voo, teleporte). Geralmente são ativados com ação livre ou movimento.",
  sensorial:
    "Efeitos sensoriais ampliam/alteram sentidos ou criam ilusões; normalmente são permanentes ou sustentados e ativados com ação livre.",
};

export const SENSE_TYPES = [
  "visão",
  "audição",
  "olfato",
  "tato",
  "rádio",
  "mental",
  "especial",
];

export const EFFECTS: Effect[] = [
  {
    id: "aflicao",
    name: "Aflição",
    baseCost: 1,
    description:
      "Impõe condições debilitantes (como tonto, atordoado, ou incapacitado) no alvo após um ataque corpo-a-corpo bem-sucedido. O alvo pode resistir com Fortitude ou Vontade contra CD [graduação + 10].",
    category: "ataque",
    action: "padrao",
    range: "perto",
    duration: "instantaneo",
  },
  {
    id: "alongamento",
    name: "Alongamento",
    baseCost: 1,
    description:
      "Permite esticar seu corpo ou membros, aumentando o seu alcance em combate e fornecendo bônus em testes de agarrar.",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "ambiente",
    name: "Ambiente",
    baseCost: 1,
    description:
      "Permite alterar o ambiente ao seu redor (calor, frio, visibilidade ou impedimento de movimento) em uma área determinada pela graduação do efeito.",
    category: "controle",
    action: "padrao",
    range: "graduacao",
    duration: "sustentado",
  },
  {
    id: "camuflagem",
    name: "Camuflagem",
    baseCost: 2,
    description:
      "Concede camuflagem total contra um sentido específico ou tipo de sentido, tornando-o mais difícil de ser percebido ou mirado.",
    category: "sensorial",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "caracteristica",
    name: "Característica",
    baseCost: 1,
    description:
      "Concede uma característica menor — um efeito que concede uma habilidade útil de vez em quando — por graduação. Na prática, é uma versão do Benefício, mas como um poder. Se algo tem efeito de jogo, é uma Característica; se não, é apenas um descritor. Pode ter duração sustentada sem mudança no custo.",
    category: "geral",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "caracteristica-aumentada",
    name: "Característica Aumentada",
    baseCost: 1,
    description:
      "Melhora uma de suas características (habilidade, defesa, etc.). Enquanto o efeito estiver ativo, você aumenta a característica escolhida em sua graduação. O custo por graduação é igual ao da característica afetada. Por ser um efeito de poder, pode ser combinada com esforço extra e outros efeitos, mas ainda está sujeita aos limites do nível de poder.",
    category: "geral",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "compreender",
    name: "Compreender",
    baseCost: 2,
    description:
      "Permite compreender ou falar diferentes formas de comunicação, como línguas, comunicação animal, ou espíritos, dependendo das graduações.",
    category: "geral",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "comunicacao",
    name: "Comunicação",
    baseCost: 4,
    description:
      "Permite comunicar-se à distância usando um meio que não a voz normal (mental, rádio, tátil, etc.). O alcance é determinado pela graduação do efeito.",
    category: "geral",
    action: "livre",
    range: "graduacao",
    duration: "sustentado",
  },
  {
    id: "controle-sorte",
    name: "Controle da Sorte",
    baseCost: 3,
    description:
      "Permite gastar pontos heroicos ou usos da vantagem Sorte para afetar as rolagens e a sorte de outros personagens.",
    category: "controle",
    action: "reacao",
    range: "percepcao",
    duration: "instantaneo",
  },
  {
    id: "crescimento",
    name: "Crescimento",
    baseCost: 2,
    description:
      "Aumenta temporariamente o seu tamanho, concedendo Força e Vigor aumentados, mas reduzindo a agilidade e a furtividade.",
    category: "geral",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "criar",
    name: "Criar",
    baseCost: 2,
    description:
      "Permite conjurar objetos sólidos e estacionários de um meio específico (rocha, gelo, energia, etc.), com volume e Resistência baseados na graduação.",
    category: "controle",
    action: "padrao",
    range: "distancia",
    duration: "sustentado",
  },
  {
    id: "cura",
    name: "Cura",
    baseCost: 2,
    description:
      "Permite remover condições de dano e estabilizar alvos moribundos (CD 10). Também pode conceder bônus para resistir a doenças e venenos.",
    category: "geral",
    action: "padrao",
    range: "perto",
    duration: "instantaneo",
  },
  {
    id: "dano",
    name: "Dano",
    baseCost: 1,
    description:
      "Causa dano físico a um alvo em combate corpo-a-corpo, forçando um teste de Resistência. A falha resulta em penalidades cumulativas, tontura, abatimento ou incapacitação.",
    category: "ataque",
    action: "padrao",
    range: "perto",
    duration: "instantaneo",
  },
  {
    id: "deflexao",
    name: "Deflexão",
    baseCost: 1,
    description:
      "Permite defender ativamente outros personagens contra ataques à distância, substituindo a defesa normal do alvo.",
    category: "defesa",
    action: "padrao",
    range: "distancia",
    duration: "instantaneo",
  },
  {
    id: "encolhimento",
    name: "Encolhimento",
    baseCost: 2,
    description:
      "Permite diminuir temporariamente o seu tamanho, aumentando a furtividade e as defesas ativas, mas reduzindo a Força e a velocidade.",
    category: "geral",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "enfraquecer",
    name: "Enfraquecer",
    baseCost: 1,
    description:
      "Reduz temporariamente uma característica específica (habilidade, perícia, poder) do alvo. A perda de pontos é cumulativa e reversível ao longo do tempo.",
    category: "ataque",
    action: "padrao",
    range: "perto",
    duration: "instantaneo",
  },
  {
    id: "escavacao",
    name: "Escavação",
    baseCost: 1,
    description:
      "Permite mover-se através do solo (terra e areia) com uma velocidade reduzida, que pode ser ainda mais reduzida ao escavar rocha.",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "ilusao",
    name: "Ilusão",
    baseCost: 1,
    description:
      "Cria impressões falsas controlando os sentidos dos outros, que podem variar de sons e imagens a percepções mentais.",
    category: "sensorial",
    action: "padrao",
    range: "percepcao",
    duration: "sustentado",
  },
  {
    id: "imortalidade",
    name: "Imortalidade",
    baseCost: 2,
    description:
      "Permite retornar à vida após a morte, com o tempo de recuperação diminuindo com graduações mais altas.",
    category: "defesa",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "imunidade",
    name: "Imunidade",
    baseCost: 1,
    description:
      "Concede imunidade a efeitos específicos, permitindo que o personagem ignore testes de salvamento contra eles. O custo varia de 1 a 80 pontos, dependendo da abrangência do efeito.",
    category: "defesa",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "intangibilidade",
    name: "Intangibilidade",
    baseCost: 5,
    description:
      "Permite assumir uma forma menos sólida (fluida, gasosa, energética ou fantasmagórica), ganhando imunidade a dano físico e a capacidade de atravessar objetos sólidos.",
    category: "defesa",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "invocar",
    name: "Invocar",
    baseCost: 2,
    description:
      "Permite chamar um capanga (personagem criado com 15 pontos de poder por graduação) para ajudá-lo. O capanga age sob suas ordens, mas geralmente está sujeito à condição tonto.",
    category: "controle",
    action: "padrao",
    range: "perto",
    duration: "sustentado",
  },
  {
    id: "leitura-mental",
    name: "Leitura Mental",
    baseCost: 2,
    description:
      "Permite ler a mente do alvo. O grau de contato (pensamentos superficiais, memórias, subconsciente) é determinado pelo grau de sucesso num teste oposto contra Vontade.",
    category: "sensorial",
    action: "padrao",
    range: "percepcao",
    duration: "sustentado",
  },
  {
    id: "membros-extras",
    name: "Membros Extras",
    baseCost: 1,
    description:
      "Concede membros manipuladores adicionais, o que pode fornecer bônus em testes de agarrar ou permitir que você segure mais objetos.",
    category: "geral",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "morfar",
    name: "Morfar",
    baseCost: 5,
    description:
      "Permite alterar a aparência (mas não as características) para se disfarçar em outra forma. Garante um bônus de +20 em testes de Enganação para disfarce.",
    category: "geral",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "mover-objeto",
    name: "Mover Objeto",
    baseCost: 2,
    description:
      "Permite mover objetos sem contato físico, usando a graduação do efeito como Força efetiva para erguer e mover peso.",
    category: "controle",
    action: "padrao",
    range: "distancia",
    duration: "sustentado",
  },
  {
    id: "movimento",
    name: "Movimento",
    baseCost: 2,
    description:
      "Concede formas especiais de movimento, como Andar na Água, Balançar-se, Escalar Paredes, Permear, Viagem Dimensional, ou Viagem Temporal. Cada opção custa 2 pontos por graduação.",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "natacao",
    name: "Natação",
    baseCost: 1,
    description: "Concede velocidade aquática (graduação do efeito - 2).",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "nulificar",
    name: "Nulificar",
    baseCost: 1,
    description:
      "Permite contra-atacar ou desligar os efeitos de um poder com um descritor específico (magia, eletricidade, etc.). Exige um teste oposto bem-sucedido contra a graduação do efeito ou a Vontade do usuário.",
    category: "controle",
    action: "padrao",
    range: "distancia",
    duration: "instantaneo",
  },
  {
    id: "protecao",
    name: "Proteção",
    baseCost: 1,
    description:
      "Fornece um bônus de +1 à sua defesa Resistência por graduação.",
    category: "defesa",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "rapidez",
    name: "Rapidez",
    baseCost: 1,
    description:
      "Permite realizar tarefas de rotina (que podem ser feitas com testes de rotina) muito mais rápido, reduzindo o tempo necessário.",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "regeneracao",
    name: "Regeneração",
    baseCost: 1,
    description:
      "Permite recuperar-se rapidamente de dano, removendo penalidades de Resistência ou outras condições de dano ao longo do tempo.",
    category: "defesa",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "salto",
    name: "Salto",
    baseCost: 1,
    description:
      "Permite dar saltos longos (a distância coberta é determinada pela graduação do efeito) sem sofrer dano na aterrissagem.",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "instantaneo",
  },
  {
    id: "sentidos",
    name: "Sentidos",
    baseCost: 1,
    description:
      "Melhora ou adiciona sentidos (visão no escuro, sentidos acurados, ultra-audição, etc.). O custo varia dependendo do tipo e abrangência do sentido.",
    category: "sensorial",
    action: "nenhuma",
    range: "pessoal",
    duration: "permanente",
  },
  {
    id: "sentido-remoto",
    name: "Sentido Remoto",
    baseCost: 1,
    description:
      "Permite deslocar um ou mais sentidos para longe, percebendo o ambiente como se estivesse no local remoto.",
    category: "sensorial",
    action: "livre",
    range: "graduacao",
    duration: "sustentado",
  },
  {
    id: "teleporte",
    name: "Teleporte",
    baseCost: 2,
    description:
      "Permite mover-se instantaneamente para outro local dentro do alcance da graduação do efeito, sem atravessar a distância intermediária.",
    category: "movimento",
    action: "movimento",
    range: "graduacao",
    duration: "instantaneo",
  },
  {
    id: "transformacao",
    name: "Transformação",
    baseCost: 2,
    description:
      "Permite alterar a forma ou composição material de objetos inanimados (como metal em água), que revertem ao normal quando o efeito não é mantido.",
    category: "geral",
    action: "padrao",
    range: "perto",
    duration: "sustentado",
  },
  {
    id: "variavel",
    name: "Variável",
    baseCost: 7,
    description:
      "Concede um conjunto de (graduação x 5) pontos de poder que podem ser alocados para diferentes efeitos de um tipo e descritor apropriados. Permite grande flexibilidade, mas requer uma ação para reconfigurar.",
    category: "geral",
    action: "padrao",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "velocidade",
    name: "Velocidade",
    baseCost: 1,
    description:
      "Permite mover-se mais rápido que o normal, aumentando sua velocidade terrestre. O efeito também melhora outras formas de movimento baseadas na velocidade terrestre.",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
  {
    id: "voo",
    name: "Voo",
    baseCost: 2,
    description:
      "Permite voar ou flutuar, concedendo uma graduação de velocidade de voo igual à graduação do efeito.",
    category: "movimento",
    action: "livre",
    range: "pessoal",
    duration: "sustentado",
  },
];
