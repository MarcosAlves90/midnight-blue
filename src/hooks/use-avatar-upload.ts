import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authError, authSuccess } from "@/lib/toast";
import {
  saveAvatarToFirebase,
  extractPublicIdFromUrl as extractPublicId,
} from "@/lib/avatar-service";

interface AvatarUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

interface UseAvatarUploadReturn {
  uploading: boolean;
  error: string | null;
  uploadAvatar: (
    file: File,
    previousPhotoURL?: string | null,
  ) => Promise<AvatarUploadResult | null>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const AVATAR_FOLDER = "midnight-blue/avatars";

/**
 * Hook para upload de avatares do usuário ao Cloudinary
 * Valida arquivo, converte para base64 e envia para API
 * Integrado com Firebase para salvar metadata e photoURL
 */
export function useAvatarUpload(): UseAvatarUploadReturn {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Validar tipo
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      const error =
        "Formato de imagem não suportado. Use JPEG, PNG, WebP ou GIF.";
      setError(error);
      authError(error);
      return false;
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      const error = "Arquivo muito grande. Máximo 5MB.";
      setError(error);
      authError(error);
      return false;
    }

    setError(null);
    return true;
  }, []);

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * Deleta uma imagem anterior do Cloudinary
   */
  const deletePreviousAvatar = useCallback(
    async (previousPhotoURL: string | null | undefined): Promise<void> => {
      if (!previousPhotoURL) return;

      try {
        const publicId = extractPublicId(previousPhotoURL);
        if (!publicId) {
          console.warn(
            "Não foi possível extrair public_id da URL:",
            previousPhotoURL,
          );
          return;
        }

        console.log("Deletando avatar anterior:", publicId);

        const response = await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: publicId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Erro ao deletar avatar anterior:", errorData.error);
          // Não lançar erro - não impede upload do novo
          return;
        }

        console.log("Avatar anterior deletado com sucesso");
      } catch (err) {
        console.error("Erro ao deletar avatar anterior:", err);
        // Não lançar erro - não impede upload do novo
      }
    },
    [],
  );

  const uploadAvatar = useCallback(
    async (
      file: File,
      previousPhotoURL?: string | null,
    ): Promise<AvatarUploadResult | null> => {
      try {
        // Validar arquivo
        if (!validateFile(file)) {
          return null;
        }

        setUploading(true);
        setError(null);

        // Deletar avatar anterior (aguardar antes de fazer upload do novo)
        if (previousPhotoURL) {
          await deletePreviousAvatar(previousPhotoURL);
        }

        // Converter para base64
        const base64 = await fileToBase64(file);

        // Enviar para API
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            folder: AVATAR_FOLDER,
            public_id: `user-${Date.now()}`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao fazer upload da imagem");
        }

        const data = await response.json();

        if (!data.ok || !data.result) {
          throw new Error(data.error || "Upload falhou");
        }

        // Salvar no Firebase (Auth + Firestore)
        if (!user?.uid) {
          throw new Error("Usuário não autenticado");
        }

        const firebaseSaved = await saveAvatarToFirebase(
          user.uid,
          data.result.secure_url,
          data.result.public_id,
        );

        if (!firebaseSaved) {
          throw new Error("Erro ao salvar avatar no Firebase");
        }

        authSuccess("Avatar atualizado com sucesso!");
        return data.result as AvatarUploadResult;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido no upload";
        setError(message);
        authError(message);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [validateFile, fileToBase64, deletePreviousAvatar, user?.uid],
  );

  return { uploading, error, uploadAvatar };
}
