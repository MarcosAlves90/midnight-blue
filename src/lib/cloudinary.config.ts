/**
 * Cloudinary small config helper — keeps client/server concerns separate and
 * provides compact helpers for building/normalizing URLs without importing
 * the SDK on the client.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

export const cloudName = CLOUD_NAME;

export const buildImageUrl = (publicId: string): string => {
  if (!publicId) return '';
  if (!CLOUD_NAME) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${publicId}`;
};

export const normalizeCloudinarySrc = (src?: string): string => {
  if (!src || typeof src !== 'string') return '';
  try {
    const url = new URL(src);
    if (url.hostname !== 'res.cloudinary.com') return src;

    const parts = url.pathname.split('/').filter(Boolean);

    // Remove cloud name if present
    if (parts[0] === CLOUD_NAME || parts[0] === process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) parts.shift();

    if (parts[0] === 'image' && parts[1] === 'upload') parts.splice(0, 2);

    if (parts[0] && /^v\d+$/.test(parts[0])) parts.shift();

    return parts.join('/');
  } catch {
    return src;
  }
};
