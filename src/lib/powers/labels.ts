import {
  ActionType,
  RangeType,
  DurationType,
} from "../../components/status/powers/types";

export const ACTION_LABELS: Record<ActionType, string> = {
  padrao: "Padrão",
  movimento: "Movimento",
  livre: "Livre",
  reacao: "Reação",
  nenhuma: "Nenhuma",
};

export const RANGE_LABELS: Record<RangeType, string> = {
  pessoal: "Pessoal",
  perto: "Perto",
  distancia: "À Distância",
  percepcao: "Percepção",
  graduacao: "Graduação",
};

export const DURATION_LABELS: Record<DurationType, string> = {
  instantaneo: "Instantâneo",
  concentracao: "Concentração",
  sustentado: "Sustentado",
  continuo: "Contínuo",
  permanente: "Permanente",
};

export const ACTION_DESCRIPTIONS: Record<ActionType, string> = {
  padrao:
    "Usar o efeito exige uma ação padrão, que é a ação principal que você pode realizar em seu turno.",
  movimento:
    "Usar o efeito exige uma ação de movimento, tipicamente usada para se mover ou para ações que consomem tempo semelhante.",
  livre:
    "Usar ou ativar o efeito exige uma ação livre. Uma vez ativado, permanece assim até o próximo turno.",
  reacao:
    "O efeito não exige ação e funciona automaticamente em resposta a um evento-gatilho específico.",
  nenhuma: "O efeito não exige nenhuma ação e está sempre ativo.",
};

export const RANGE_DESCRIPTIONS: Record<RangeType, string> = {
  pessoal: "O efeito funciona apenas em você, o usuário.",
  perto: "O efeito pode visar qualquer coisa que você toque.",
  distancia:
    "O efeito funciona à distância e exige um teste de ataque à distância.",
  percepcao:
    "O efeito funciona em qualquer alvo que você possa perceber com um sentido acurado.",
  graduacao:
    "O alcance ou área do efeito é determinado pela graduação do próprio efeito.",
};

export const DURATION_DESCRIPTIONS: Record<DurationType, string> = {
  instantaneo:
    "O efeito ocorre e termina no mesmo turno, embora o seu resultado possa permanecer.",
  concentracao: "Você pode manter o efeito usando uma ação padrão todo turno.",
  sustentado: "Você pode manter o efeito usando uma ação livre todo turno.",
  continuo:
    "O efeito dura o tempo que você quiser, sem exigir ação de manutenção.",
  permanente: "O efeito está sempre ativo e não pode ser desativado.",
};
