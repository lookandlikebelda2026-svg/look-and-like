import React, { useState, useEffect } from 'react';
import { Check, Play } from 'lucide-react';
import { YouTubeIcon } from '../../../../components/icons';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../../../../utils/youtube';

const CATEGORY_PRESETS = [
  'Bridal',
  'Parlour Tour',
  'Hair Art',
  'Head Spa',
  'Nail Design',
  'Skin Care',
  'Treatments',
  'Editorial',
];

/**
 * Add / Edit YouTube Video Form
 * Simplified without title input field.
 */
export function VideoForm({
  isEditing,
  formData,
  onChange,
  onSubmit,
  onCancel,
  onNotify,
}) {
  const [thumbPixelSize, setThumbPixelSize] = useState(null);
  const ytId = extractYouTubeId(formData.youtubeUrl);
  const autoYtThumb = formData.youtubeUrl ? getYouTubeThumbnailUrl(formData.youtubeUrl, 'maxres') : '';
  const displayThumb = formData.thumbnailUrl || autoYtThumb;

  useEffect(() => {
    if (!displayThumb) {
      setThumbPixelSize(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setThumbPixelSize(`${img.naturalWidth}×${img.naturalHeight}`);
    };
    img.onerror = () => {
      setThumbPixelSize(null);
    };
    img.src = displayThumb;
  }, [displayThumb]);

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 sm:mb-6 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#F0CDD7] shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
        <div className="flex items-center gap-1.5">
          <YouTubeIcon className="w-4 h-4 text-rose-600" />
          <h5 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#D6204E]">
            {isEditing ? 'Edit Video' : 'Add Video'}
          </h5>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer shrink-0"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Thumbnail Preview */}
        <div className="flex flex-col items-center justify-start border border-dashed border-stone-300 rounded-xl bg-stone-900 p-2 min-h-[120px] sm:min-h-[140px] overflow-hidden">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-stone-950 flex items-center justify-center">
            {displayThumb ? (
              <>
                <img
                  src={displayThumb}
                  alt="Video preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (formData.youtubeUrl) {
                      e.currentTarget.src = getYouTubeThumbnailUrl(formData.youtubeUrl, 'hq');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-2 text-stone-500">
                <YouTubeIcon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 text-stone-600" />
                <span className="text-[10px] block text-stone-400">
                  Enter URL to preview
                </span>
              </div>
            )}
          </div>

          {thumbPixelSize && (
            <div className="w-full mt-1.5 flex items-center justify-between text-[9px] text-stone-400 font-mono px-1">
              <span>Thumbnail:</span>
              <span className="text-rose-400 font-semibold">{thumbPixelSize}</span>
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="md:col-span-2 space-y-2.5">
          <div>
            <div className="flex items-center justify-between mb-1 whitespace-nowrap">
              <label className="text-[11px] sm:text-xs font-bold text-deep-espresso flex items-center gap-1">
                <span>YouTube URL</span>
                <span className="text-rose-500">*</span>
              </label>
              {ytId && (
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Valid link
                </span>
              )}
            </div>
            <input
              type="url"
              required
              value={formData.youtubeUrl || ''}
              onChange={(e) => onChange({ ...formData, youtubeUrl: e.target.value })}
              className="w-full px-2.5 py-1.5 sm:py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#D6204E] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-deep-espresso mb-1">
              Category
            </label>
            <select
              value={formData.category || 'Bridal'}
              onChange={(e) => onChange({ ...formData, category: e.target.value })}
              className="w-full px-2 py-1.5 sm:py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#D6204E] bg-white"
            >
              {CATEGORY_PRESETS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 rounded-xl shadow-xs cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Video' : 'Save Video'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default VideoForm;
