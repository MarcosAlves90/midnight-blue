import { useState, useCallback } from "react";
import { authError, authSuccess } from "@/lib/toast";
import { extractPublicIdFromUrl } from "@/lib/cloudinary.config";

interface CharacterUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

interface UseCharacterUploadReturn {
  uploading: boolean;
  error: string | null;
  uploadImage: (
    file: File,
    previousImageUrl?: string | null,
  ) => Promise<CharacterUploadResult | null>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const CHARACTER_FOLDER = "midnight-blue/characters";

/**
 * Hook para upload de imagens de personagens ao Cloudinary
 * Valida arquivo, converte para base64 e envia para API
 */
export function useCharacterUpload(): UseCharacterUploadReturn {
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
  const deletePreviousImage = useCallback(
    async (previousImageUrl: string | null | undefined): Promise<void> => {
      if (!previousImageUrl) return;

      try {
        const publicId = extractPublicIdFromUrl(previousImageUrl);
        if (!publicId) {
          console.warn(
            "Não foi possível extrair public_id da URL:",
            previousImageUrl,
          );
          return;
        }

        console.log("Deletando imagem anterior:", publicId);

        const response = await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: publicId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Erro ao deletar imagem anterior:", errorData.error);
          return;
        }

        console.log("Imagem anterior deletada com sucesso");
      } catch (err) {
        console.error("Erro ao deletar imagem anterior:", err);
      }
    },
    [],
  );

  const uploadImage = useCallback(
    async (
      file: File,
      previousImageUrl?: string | null,
    ): Promise<CharacterUploadResult | null> => {
      try {
        // Validar arquivo
        if (!validateFile(file)) {
          return null;
        }

        setUploading(true);
        setError(null);

        // Deletar imagem anterior (opcional, mas recomendado para economizar espaço)
        if (previousImageUrl) {
          await deletePreviousImage(previousImageUrl);
        }

        // Converter para base64
        const base64 = await fileToBase64(file);

        // Enviar para API
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            folder: CHARACTER_FOLDER,
            public_id: `char-${Date.now()}`,
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

        authSuccess("Imagem do personagem atualizada!");
        return data.result as CharacterUploadResult;
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
    [validateFile, fileToBase64, deletePreviousImage],
  );

  return { uploading, error, uploadImage };
}
