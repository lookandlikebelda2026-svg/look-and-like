/**
 * YouTube Utility Functions
 * Extracts video ID and generates embed/thumbnail URLs for all common YouTube formats
 */

/**
 * Extract YouTube 11-character video ID from URL
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Raw video ID
 * @param {string} url
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // Regex for YouTube URLs
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = clean.match(regExp);

  return match ? match[1] : null;
}

/**
 * Get YouTube Embed URL with standard autoplay/no-cookie configuration
 * @param {string} urlOrId
 * @param {boolean} [autoplay=true]
 * @returns {string|null}
 */
export function getYouTubeEmbedUrl(urlOrId, autoplay = true) {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
}

/**
 * Get YouTube Thumbnail URL
 * @param {string} urlOrId
 * @param {'hqdefault'|'maxresdefault'|'mqdefault'} [quality='hqdefault']
 * @returns {string|null}
 */
export function getYouTubeThumbnailUrl(urlOrId, quality = 'hqdefault') {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

/**
 * Check if a URL or string is a valid YouTube reference
 * @param {string} url
 * @returns {boolean}
 */
export function isValidYouTubeUrl(url) {
  return !!extractYouTubeId(url);
}

export default {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  isValidYouTubeUrl,
};
