import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary.server';
import type { CloudinaryUploadResult } from '@/lib/cloudinary';

// This route uses the Node.js runtime because the Cloudinary SDK requires Node APIs.
export const runtime = 'nodejs';

type UploadRequest = {
  image: string;
  folder?: string;
  public_id?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as UploadRequest;
    const { image, folder, public_id } = body ?? {};

    // Basic validation
    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "image" in request body. Provide a data URL (data:...;base64,...) or a remote HTTPS URL.' }, { status: 400 });
    }

    // Accept only data URLs or https URLs to avoid unsupported schemes
    const isDataUrl = /^data:.*;base64,/.test(image);
    const isRemote = /^https?:\/\//.test(image);
    if (!isDataUrl && !isRemote) {
      return NextResponse.json({ error: 'Invalid image format. Only data URLs or remote HTTP/HTTPS URLs are supported.' }, { status: 400 });
    }

    // Sanitize public_id (allow letters, numbers, dashes, underscores and slashes)
    if (public_id && !/^[\w\-\/]+$/.test(public_id)) {
      return NextResponse.json({ error: 'Invalid public_id. Use only letters, numbers, dashes, underscores and slashes.' }, { status: 400 });
    }

    const result: CloudinaryUploadResult = await uploadImage(image, { folder, public_id });

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
    // Map known Cloudinary errors to a readable message
    let message = 'Unknown error';
    if (err instanceof Error) message = err.message;
    else if (typeof err === 'string') message = err;
    else message = String(err);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
