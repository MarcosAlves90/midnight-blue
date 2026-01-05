/**
 * Utilitários para validação e análise de senhas.
 */

export interface PasswordStrength {
  score: number; // 0 a 5
  label: string;
  color: string;
  feedback: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      score: 0,
      label: "Vazia",
      color: "bg-border",
      feedback: ["A senha não pode estar vazia."],
    };
  }

  // 1. Comprimento
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Use pelo menos 8 caracteres.");
  }

  if (password.length >= 12) {
    score += 1;
  }

  // 2. Complexidade
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (hasUppercase) score += 1;
  else feedback.push("Adicione uma letra maiúscula.");

  if (hasNumber) score += 1;
  else feedback.push("Adicione um número.");

  if (hasSymbol) score += 1;
  else feedback.push("Adicione um caractere especial.");

  // Ajuste de score se for muito curta
  if (password.length < 6) {
    score = Math.min(score, 1);
  }

  // Mapeamento de resultados
  const results = [
    { label: "Muito Fraca", color: "bg-red-500" },
    { label: "Fraca", color: "bg-red-400" },
    { label: "Média", color: "bg-yellow-500" },
    { label: "Boa", color: "bg-blue-500" },
    { label: "Forte", color: "bg-green-500" },
    { label: "Muito Forte", color: "bg-emerald-600" },
  ];

  const result = results[score] || results[0];

  return {
    score,
    label: result.label,
    color: result.color,
    feedback,
  };
}
