/**
 * Mapeia erros do Firebase para mensagens amigáveis em português.
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Erro ao autenticar. Tente novamente.";
  }

  const firebaseError = error as FirebaseError;
  const code = firebaseError.code || "";

  // Firebase Authentication errors
  const errorMap: Record<string, string> = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/email-already-in-use": "Este e-mail já está registrado.",
    "auth/operation-not-allowed":
      "Operação não permitida. Contate o administrador.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/account-exists-with-different-credential":
      "Uma conta com este e-mail já existe com outro método de autenticação.",
    "auth/popup-blocked":
      "Popup foi bloqueado. Verifique as configurações do navegador.",
    "auth/popup-closed-by-user": "Login cancelado.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
  };

  return errorMap[code] || "Erro ao autenticar. Tente novamente.";
}

// Type for Firebase error with code property
interface FirebaseError extends Error {
  code?: string;
}
