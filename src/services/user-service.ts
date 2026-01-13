import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { toDateSafe } from "@/lib/mappers/character-mapper";

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  updatedAt: Date;
  isAdmin?: boolean;
  disabled?: boolean;
}

export const UserService = {
  /**
   * Sincroniza o perfil do usuário no Firestore
   */
  async syncUserProfile(user: User): Promise<void> {
    try {
      const userRef = doc(db, "users", user.uid);

      // Forçamos o refresh do token para garantir que as custom claims mais recentes (como admin)
      // sejam detectadas e sincronizadas com o Firestore.
      const tokenResult = await user.getIdTokenResult(true);
      const isAdminClaim = !!tokenResult.claims.admin;

      const profile: Partial<UserProfile> = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: new Date(),
        isAdmin: isAdminClaim,
      };

      await setDoc(userRef, profile, { merge: true });
      console.debug("[UserService] Profile synced", {
        uid: user.uid,
        isAdmin: isAdminClaim,
      });
    } catch (err) {
      console.error("[UserService] Error syncing user profile:", err);
    }
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
        isAdmin: data.isAdmin || false,
        disabled: data.disabled || false,
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
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            email: data.email || null,
            displayName: data.displayName || null,
            photoURL: data.avatar?.url || data.photoURL || null,
            updatedAt: toDateSafe(data.updatedAt),
            isAdmin: data.isAdmin || false,
            disabled: data.disabled || false,
          } as UserProfile;
        })
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      console.error("[UserService] Erro ao listar usuários:", error);
      throw error;
    }
  },

  /**
   * Atualiza o perfil de um usuário (Admin only API)
   */
  async updateAdminSettings(
    userId: string,
    data: { isAdmin?: boolean; disabled?: boolean },
  ): Promise<void> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao atualizar usuário");
    }
  },

  /**
   * Exclui um usuário (Admin only API)
   */
  async deleteUser(userId: string): Promise<void> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao excluir usuário");
    }
  },
};
