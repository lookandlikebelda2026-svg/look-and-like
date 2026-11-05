/**
 * Client-side Image Compression & Optimization Utility
 * Uses HTML5 Canvas for high-performance in-browser compression.
 */

/**
 * Standard Presets tailored for Parlour & Admin Media
 */
export const COMPRESSION_PRESETS = {
  photo: {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.84,
    format: 'image/webp',
    label: 'Editorial Photo (HD)',
    preserveTransparency: false,
  },
  logo: {
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.92,
    format: 'image/png',
    label: 'Brand Logo (Transparent)',
    preserveTransparency: true,
  },
  thumbnail: {
    maxWidth: 1280,
    maxHeight: 720,
    quality: 0.82,
    format: 'image/webp',
    label: 'Video Poster Thumbnail',
    preserveTransparency: false,
  },
  banner: {
    maxWidth: 2560,
    maxHeight: 1440,
    quality: 0.85,
    format: 'image/webp',
    label: 'Hero Banner (4K/2K)',
    preserveTransparency: false,
  },
  lossless: {
    maxWidth: 2560,
    maxHeight: 2560,
    quality: 0.95,
    format: 'image/webp',
    label: 'High Fidelity',
    preserveTransparency: true,
  },
};

/**
 * Measure natural image dimensions (width & height) from any URL, File, or Blob
 * @param {string|File|Blob} source - URL or File object
 * @returns {Promise<{width: number, height: number, aspectRatio: number}>}
 */
export function getImageDimensions(source) {
  return new Promise((resolve, reject) => {
    if (!source) {
      return reject(new Error('No image source provided'));
    }

    const img = new Image();
    let objectUrl = null;

    img.onload = () => {
      const dimensions = {
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        aspectRatio: (img.naturalWidth || 1) / (img.naturalHeight || 1),
      };
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(dimensions);
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for dimension calculation'));
    };

    if (typeof source === 'string') {
      img.crossOrigin = 'anonymous';
      img.src = source;
    } else if (source instanceof Blob || source instanceof File) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else {
      reject(new Error('Unsupported source type'));
    }
  });
}

/**
 * Format bytes into human readable format (KB, MB)
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validate an image file before processing
 * @param {File|Blob} file
 * @param {Object} [options]
 * @param {number} [options.maxSizeBytes=26214400] - 25MB default
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateImageFile(file, options = {}) {
  const { maxSizeBytes = 25 * 1024 * 1024 } = options;

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/svg+xml',
  ];

  if (file.type && !validTypes.includes(file.type.toLowerCase()) && !file.type.startsWith('image/')) {
    return {
      valid: false,
      error: `Unsupported format (${file.type || 'unknown'}). Please choose JPG, PNG, WebP, GIF, or AVIF.`,
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Maximum allowed is ${formatBytes(maxSizeBytes)}.`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Compress an image File or Blob with configurable quality, max dimensions, and output format.
 * Preserves transparency for PNGs/logos, maintains aspect ratio, and falls back cleanly if compression is unneeded.
 * 
 * @param {File|Blob} file - The source image file
 * @param {Object} options - Compression options or preset name
 * @returns {Promise<{
 *   blob: Blob,
 *   file: File,
 *   previewUrl: string,
 *   originalWidth: number,
 *   originalHeight: number,
 *   compressedWidth: number,
 *   compressedHeight: number,
 *   originalSize: number,
 *   compressedSize: number,
 *   savedBytes: number,
 *   savedPercent: number,
 *   format: string,
 *   fileName: string,
 *   revoke: () => void
 * }>}
 */
export async function compressImage(file, options = {}) {
  // Check if a string preset was passed
  const presetConfig = typeof options === 'string' 
    ? (COMPRESSION_PRESETS[options] || COMPRESSION_PRESETS.photo)
    : (COMPRESSION_PRESETS[options.preset] || {});

  const merged = {
    ...COMPRESSION_PRESETS.photo,
    ...presetConfig,
    ...(typeof options === 'object' ? options : {}),
  };

  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const originalSize = file.size || 0;
  const isPng = file.type === 'image/png';
  const isSvg = file.type === 'image/svg+xml';

  // SVGs are vector graphics; do not rasterize/compress with canvas
  if (isSvg) {
    const previewUrl = URL.createObjectURL(file);
    return {
      blob: file,
      file,
      previewUrl,
      originalWidth: 0,
      originalHeight: 0,
      compressedWidth: 0,
      compressedHeight: 0,
      originalSize,
      compressedSize: originalSize,
      savedBytes: 0,
      savedPercent: 0,
      format: 'image/svg+xml',
      fileName: file.name || 'vector_graphic.svg',
      revoke: () => URL.revokeObjectURL(previewUrl),
    };
  }

  // Format selection with transparency preservation
  let targetFormat = merged.format || 'image/webp';
  if ((isPng || merged.preserveTransparency) && targetFormat === 'image/jpeg') {
    // Prevent black background on transparent images
    targetFormat = 'image/png';
  }

  const maxWidth = merged.maxWidth || 2048;
  const maxHeight = merged.maxHeight || 2048;
  const quality = typeof merged.quality === 'number' ? merged.quality : 0.84;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file data.'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to parse image data into canvas.'));

      img.onload = () => {
        try {
          const originalWidth = img.naturalWidth || img.width;
          const originalHeight = img.naturalHeight || img.height;

          // Calculate target dimensions maintaining aspect ratio
          let targetWidth = originalWidth;
          let targetHeight = originalHeight;

          if (maxWidth && targetWidth > maxWidth) {
            targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
            targetWidth = maxWidth;
          }

          if (maxHeight && targetHeight > maxHeight) {
            targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
            targetHeight = maxHeight;
          }

          // Create offscreen canvas
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) {
            return reject(new Error('Canvas 2D rendering context is unavailable.'));
          }

          // Preserve transparent background for PNG / WebP
          if (targetFormat === 'image/png' || targetFormat === 'image/webp') {
            ctx.clearRect(0, 0, targetWidth, targetHeight);
          } else {
            // Fill with pure white background for JPEG
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          }

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw onto canvas
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // Canvas conversion failed, fall back safely to original file
                const fallbackUrl = URL.createObjectURL(file);
                return resolve({
                  blob: file,
                  file,
                  previewUrl: fallbackUrl,
                  originalWidth,
                  originalHeight,
                  compressedWidth: originalWidth,
                  compressedHeight: originalHeight,
                  originalSize,
                  compressedSize: originalSize,
                  savedBytes: 0,
                  savedPercent: 0,
                  format: file.type || 'image/jpeg',
                  fileName: file.name || 'image.jpg',
                  revoke: () => URL.revokeObjectURL(fallbackUrl),
                });
              }

              // Check if compressed blob is unexpectedly larger than original file
              const isSmaller = blob.size < originalSize;
              const finalBlob = isSmaller ? blob : file;
              const finalSize = finalBlob.size;
              const savedBytes = Math.max(0, originalSize - finalSize);
              const savedPercent = originalSize > 0
                ? Math.max(0, Math.round(((originalSize - finalSize) / originalSize) * 100))
                : 0;

              // Generate filename with extension
              const rawBaseName = (file.name || 'salon_image').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
              const ext = isSmaller
                ? (targetFormat === 'image/webp' ? '.webp' : (targetFormat === 'image/png' ? '.png' : '.jpg'))
                : (file.name ? file.name.substring(file.name.lastIndexOf('.')) : '.jpg');
              const finalFileName = `${rawBaseName}_optimized${ext}`;

              const compressedFile = new File([finalBlob], finalFileName, {
                type: isSmaller ? targetFormat : file.type,
                lastModified: Date.now(),
              });

              const previewUrl = URL.createObjectURL(finalBlob);

              resolve({
                blob: finalBlob,
                file: compressedFile,
                previewUrl,
                originalWidth,
                originalHeight,
                compressedWidth: targetWidth,
                compressedHeight: targetHeight,
                originalSize,
                compressedSize: finalSize,
                savedBytes,
                savedPercent,
                format: isSmaller ? targetFormat : file.type,
                fileName: finalFileName,
                revoke: () => URL.revokeObjectURL(previewUrl),
              });
            },
            targetFormat,
            quality
          );
        } catch (canvasErr) {
          console.warn('Canvas compression error, using original file fallback:', canvasErr);
          const fallbackUrl = URL.createObjectURL(file);
          resolve({
            blob: file,
            file,
            previewUrl: fallbackUrl,
            originalWidth: img.naturalWidth || 0,
            originalHeight: img.naturalHeight || 0,
            compressedWidth: img.naturalWidth || 0,
            compressedHeight: img.naturalHeight || 0,
            originalSize,
            compressedSize: originalSize,
            savedBytes: 0,
            savedPercent: 0,
            format: file.type || 'image/jpeg',
            fileName: file.name || 'image.jpg',
            revoke: () => URL.revokeObjectURL(fallbackUrl),
          });
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple files concurrently with progress notification
 * @param {Array<File>} files
 * @param {Object} [options]
 * @returns {Promise<Array<Object>>}
 */
export async function compressMultipleImages(files, options = {}) {
  if (!files || !files.length) return [];
  const results = [];
  for (const file of files) {
    try {
      const res = await compressImage(file, options);
      results.push(res);
    } catch (e) {
      console.error('Failed to compress file:', file.name, e);
    }
  }
  return results;
}

export default {
  COMPRESSION_PRESETS,
  getImageDimensions,
  formatBytes,
  validateImageFile,
  compressImage,
  compressMultipleImages,
};
