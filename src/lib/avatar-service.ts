import { updateProfile } from "firebase/auth";
import {
  doc,
  updateDoc,
  setDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { authError } from "@/lib/toast";
import { extractPublicIdFromUrl } from "./cloudinary.config";

/**
 * Inicializa documento do usuário no Firestore se não existir
 * Necessário para aplicar regras de segurança corretamente
 */
async function ensureUserDocumentExists(userId: string): Promise<void> {
  if (!db) {
    throw new Error("Firestore não está inicializado");
  }

  if (!auth) {
    throw new Error("Firebase Auth não está inicializado");
  }

  const userDocRef = doc(db, "users", userId);

  try {
    // Tentar atualizar primeiro (mais rápido se já existe)
    await updateDoc(userDocRef, {
      updatedAt: serverTimestamp(),
    });
  } catch {
    // Se não existe, criar com dados básicos
    const currentUser = auth.currentUser;
    await setDoc(
      userDocRef,
      {
        displayName: currentUser?.displayName || "",
        email: currentUser?.email || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}

/**
 * Salva a URL do avatar no Firebase Auth e Firestore
 * @param userId - UID do usuário
 * @param avatarUrl - URL segura da imagem (Cloudinary)
 * @param publicId - public_id do Cloudinary (para rastreamento)
 */
export async function saveAvatarToFirebase(
  userId: string,
  avatarUrl: string,
  publicId: string,
): Promise<boolean> {
  try {
    if (!auth) {
      throw new Error("Firebase Auth não está inicializado");
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }

    if (currentUser.uid !== userId) {
      throw new Error("Não autorizado para atualizar este perfil");
    }

    // Garantir que o documento existe
    await ensureUserDocumentExists(userId);

    // 1. Atualizar photoURL no Firebase Auth
    await updateProfile(currentUser, {
      photoURL: avatarUrl,
    });

    // 2. Salvar metadata no Firestore
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      avatar: {
        url: avatarUrl,
        publicId: publicId,
        updatedAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao salvar avatar no Firebase";
    console.error("Erro ao salvar avatar:", message);
    authError(message);
    return false;
  }
}

export { extractPublicIdFromUrl };
