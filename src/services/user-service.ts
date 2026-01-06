import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import type { User } from "firebase/auth";
import { toDateSafe } from "@/lib/mappers/character-mapper";

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  updatedAt: Date;
}

export const UserService = {
  /**
   * Sincroniza o perfil do usuário no Firestore
   */
  async syncUserProfile(user: User): Promise<void> {
    const userRef = doc(db, "users", user.uid);
    
    // Simplificadamente sempre atualiza ou cria o perfil ao logar
    const profile: Partial<UserProfile> = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      updatedAt: new Date(),
    };

    await setDoc(userRef, profile, { merge: true });
  },

  /**
   * Busca o perfil de um usuário específico
   */
  async getUser(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return null;
      
      const data = snap.data();
      return {
        id: snap.id,
        email: data.email || null,
        displayName: data.displayName || null,
        photoURL: data.avatar?.url || data.photoURL || null,
        updatedAt: toDateSafe(data.updatedAt),
      };
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      return null;
    }
  },

  /**
   * Lista todos os usuários (apenas para admins)
   */
  async listAllUsers(): Promise<UserProfile[]> {
    try {
      const usersCol = collection(db, "users");
      // Não usamos orderBy na query para não omitir documentos sem o campo updatedAt
      const snapshot = await getDocs(usersCol);
      
      return snapshot.docs
        .map(d => {
          const data = d.data();
          return {
            id: d.id,
            email: data.email || null,
            displayName: data.displayName || null,
            photoURL: data.avatar?.url || data.photoURL || null,
            updatedAt: toDateSafe(data.updatedAt),
          } as UserProfile;
        })
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      console.error("[UserService] Erro ao listar usuários:", error);
      throw error;
    }
  }
};
