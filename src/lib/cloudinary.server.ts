import type { UploadApiOptions } from "cloudinary";
import {
  isCloudinaryConfigured,
  cloudName,
  type CloudinaryUploadResult,
} from "./cloudinary";

/**
 * Retorna uma instância configurada do cliente v2 do Cloudinary (apenas no servidor).
 */
async function getCloudinaryClient() {
  if (typeof window !== "undefined") {
    throw new Error("O SDK do Cloudinary só pode ser usado no servidor.");
  }

  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary não está configurado. Defina as variáveis de ambiente necessárias.",
    );
  }

  // Dinamicamente importar o SDK apenas no servidor
  const mod = await import("cloudinary");
  const cloudinary = mod.v2;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

export const uploadImage = async (
  imageData: string,
  options?: UploadApiOptions,
): Promise<CloudinaryUploadResult> => {
  if (!imageData) throw new Error("Nenhum dado de imagem fornecido");

  const cloudinary = await getCloudinaryClient();

  const uploadParams: UploadApiOptions = {
    resource_type: "image",
    ...(options as UploadApiOptions),
  };

  const result = (await cloudinary.uploader.upload(
    imageData,
    uploadParams,
  )) as CloudinaryUploadResult;
  return result;
};
