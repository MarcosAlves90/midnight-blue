import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary.server";
import type { CloudinaryUploadResult } from "@/lib/cloudinary";

export const runtime = "nodejs";

type UploadRequest = {
  image: string;
  folder?: string;
  public_id?: string;
};

type DeleteRequest = {
  public_id: string;
};

async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  if (!publicId) {
    throw new Error("public_id é obrigatório para deletar");
  }

  if (!/^[\w\-\/v.]+$/.test(publicId)) {
    throw new Error(`public_id inválido: ${publicId}`);
  }

  const cleanedPublicId = publicId.replace(/^v\d+\//, "");

  const mod = await import("cloudinary");
  const cloudinary = mod.v2;

  const { cloudName } = await import("@/lib/cloudinary");
  const isConfigured =
    cloudName &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!isConfigured) {
    throw new Error("Cloudinary não está configurado");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  console.log(`[Cloudinary Delete] Deletando public_id original: ${publicId}`);
  console.log(
    `[Cloudinary Delete] Deletando public_id limpo: ${cleanedPublicId}`,
  );

  const result = await cloudinary.uploader.destroy(cleanedPublicId);

  console.log(`[Cloudinary Delete] Resultado:`, result);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as UploadRequest;
    const { image, folder, public_id } = body ?? {};

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        {
          error:
            'Missing or invalid "image" in request body. Provide a data URL (data:...;base64,...) or a remote HTTPS URL.',
        },
        { status: 400 },
      );
    }

    const isDataUrl = /^data:.*;base64,/.test(image);
    const isRemote = /^https?:\/\//.test(image);
    if (!isDataUrl && !isRemote) {
      return NextResponse.json(
        {
          error:
            "Invalid image format. Only data URLs or remote HTTP/HTTPS URLs are supported.",
        },
        { status: 400 },
      );
    }

    if (public_id && !/^[\w\-\/]+$/.test(public_id)) {
      return NextResponse.json(
        {
          error:
            "Invalid public_id. Use only letters, numbers, dashes, underscores and slashes.",
        },
        { status: 400 },
      );
    }

    const result: CloudinaryUploadResult = await uploadImage(image, {
      folder,
      public_id,
    });

    // Return only safe fields to avoid exposing internal data
    const safe = {
      public_id: result.public_id,
      secure_url: result.secure_url || result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    };

    return NextResponse.json({ ok: true, result: safe }, { status: 200 });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;
    else if (typeof err === "string") message = err;
    else message = String(err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as DeleteRequest;
    const { public_id } = body ?? {};

    if (!public_id || typeof public_id !== "string") {
      return NextResponse.json(
        { error: 'Missing or invalid "public_id" in request body' },
        { status: 400 },
      );
    }

    console.log(`[API Upload DELETE] Recebido public_id: ${public_id}`);

    await deleteImageFromCloudinary(public_id);

    return NextResponse.json(
      { ok: true, message: "Imagem deletada com sucesso" },
      { status: 200 },
    );
  } catch (err: unknown) {
    let message = "Erro ao deletar imagem";
    if (err instanceof Error) message = err.message;
    else if (typeof err === "string") message = err;

    console.error(`[API Upload DELETE] Erro: ${message}`, err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
