import type { UploadApiResponse } from 'cloudinary';

export type CloudinaryUploadResult = UploadApiResponse;

// Re-exports compactos para uso no cliente (não importam o SDK)
export { isCloudinaryConfigured, cloudName, buildImageUrl, normalizeCloudinarySrc } from './cloudinary.config';



