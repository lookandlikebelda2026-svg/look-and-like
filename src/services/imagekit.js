/**
 * ImageKit Photo Upload & Delivery Service
 * Uses Web Crypto API for secure browser-side HMAC-SHA1 signature generation
 */

export const IMAGEKIT_CONFIG = {
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/mubxugavc',
  id: import.meta.env.VITE_IMAGEKIT_ID || 'mubxugavc',
};

/**
 * Generate HMAC-SHA1 signature for ImageKit client-side upload authentication
 * @param {number} [customExpire] Optional expiration unix timestamp in seconds
 * @returns {Promise<{token: string, expire: number, signature: string}>}
 */
export async function generateImageKitAuth(customExpire) {
  const privateKey =
    import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY ||
    import.meta.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('ImageKit private key is missing from environment configuration.');
  }

  // Token: unique random string
  const token = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);

  // Expire: Unix timestamp in seconds (valid for 30 minutes)
  const expire = customExpire || Math.floor(Date.now() / 1000) + 1800;

  // Compute HMAC-SHA1 signature using standard browser Web Crypto API
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(privateKey);
  const dataBuffer = encoder.encode(token + expire);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { token, expire, signature };
}

/**
 * Upload a photo file directly to ImageKit
 * @param {File|Blob|string} file - The file or base64 data to upload
 * @param {Object} [options]
 * @param {string} [options.fileName] - Name of the file
 * @param {string} [options.folder] - Target folder in ImageKit (e.g. '/lookbook')
 * @param {Array<string>} [options.tags] - Search tags for ImageKit media library
 * @param {Function} [options.onProgress] - Optional progress callback
 * @returns {Promise<{url: string, fileId: string, name: string, thumbnailUrl: string, width: number, height: number}>}
 */
export async function uploadImageToImageKit(file, options = {}) {
  const publicKey = IMAGEKIT_CONFIG.publicKey;
  if (!publicKey) {
    throw new Error('ImageKit public key is missing.');
  }

  const { folder = '/lookbook', fileName, tags = [] } = options;
  const { token, expire, signature } = await generateImageKitAuth();

  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'fileName',
    fileName || (file.name ? file.name : `photo-${Date.now()}.jpg`)
  );
  formData.append('publicKey', publicKey);
  formData.append('signature', signature);
  formData.append('expire', expire.toString());
  formData.append('token', token);
  formData.append('useUniqueFileName', 'true');

  if (folder) {
    formData.append('folder', folder);
  }
  if (tags && tags.length > 0) {
    formData.append('tags', tags.join(','));
  }

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || data.help || 'Failed to upload photo to ImageKit';
    throw new Error(errorMsg);
  }

  return {
    url: data.url,
    thumbnailUrl: data.thumbnailUrl,
    fileId: data.fileId,
    name: data.name,
    size: data.size,
    height: data.height,
    width: data.width,
    filePath: data.filePath,
  };
}

/**
 * Build an optimized ImageKit delivery URL with transformations
 * @param {string} pathOrUrl - Original image path or ImageKit URL
 * @param {Object} options - Transformation options (width, height, quality, format, blur)
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(pathOrUrl, options = {}) {
  if (!pathOrUrl) return '';
  const { width, height, quality = 85, format = 'auto', blur } = options;

  const tr = [];
  if (width) tr.push(`w-${width}`);
  if (height) tr.push(`h-${height}`);
  if (quality) tr.push(`q-${quality}`);
  if (format && format !== 'original') tr.push(`f-${format}`);
  if (blur) tr.push(`bl-${blur}`);

  if (tr.length === 0) return pathOrUrl;

  const trParam = tr.join(',');

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    if (pathOrUrl.includes('ik.imagekit.io')) {
      if (pathOrUrl.includes('tr=') || pathOrUrl.includes('tr:')) {
        return pathOrUrl;
      }
      const separator = pathOrUrl.includes('?') ? '&' : '?';
      return `${pathOrUrl}${separator}tr=${trParam}`;
    }
    return pathOrUrl;
  }

  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${IMAGEKIT_CONFIG.urlEndpoint}/tr:${trParam}${cleanPath}`;
}

