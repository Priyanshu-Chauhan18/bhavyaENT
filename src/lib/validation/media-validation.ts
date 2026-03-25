/**
 * Media upload validation helpers.
 * 
 * Used by admin image upload components to validate files client-side
 * before uploading to Supabase Storage.
 * 
 * Keeps it simple: validate file → upload → create DB record.
 * No image processing, resizing, or orphan cleanup.
 */

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export type MediaValidationResult =
  | { valid: true }
  | { valid: false; error: string };

/**
 * Validates an image file for upload.
 * Checks MIME type and file size.
 */
export function validateImageFile(file: File): MediaValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return {
      valid: false,
      error: `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large (${sizeMB} MB). Maximum: 5 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Normalizes a filename for safe storage.
 * Removes special characters and adds timestamp prefix.
 */
export function normalizeFilename(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const baseName = originalName
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // replace special chars
    .replace(/-+/g, '-') // collapse dashes
    .toLowerCase()
    .slice(0, 50); // limit length

  return `${Date.now()}-${baseName}.${ext}`;
}
