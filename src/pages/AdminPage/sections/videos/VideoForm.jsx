import React, { useState, useEffect } from 'react';
import { Check, Play } from 'lucide-react';
import { YouTubeIcon } from '../../../../components/icons';
import { extractYouTubeId, getYouTubeThumbnailUrl, isValidYouTubeUrl } from '../../../../utils/youtube';

const CATEGORY_PRESETS = [
  'Bridal',
  'Salon Tour',
  'Hair Art',
  'Head Spa',
  'Nail Design',
  'Skin Care',
  'Treatments',
  'Editorial',
];

/**
 * Add / Edit YouTube Video Form
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

  // Measure thumbnail dimensions in pixels
  useEffect(() => {
    if (!displayThumb) {
      setThumbPixelSize(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setThumbPixelSize(`${img.naturalWidth} × ${img.naturalHeight} px`);
    };
    img.onerror = () => {
      setThumbPixelSize(null);
    };
    img.src = displayThumb;
  }, [displayThumb]);

  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#F0CDD7] shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <YouTubeIcon className="w-4 h-4 text-rose-600" />
          <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D6204E]">
            {isEditing ? 'Edit YouTube Film' : 'Add New YouTube Film'}
          </h5>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Live YouTube Thumbnail & Video Preview */}
        <div className="flex flex-col items-center justify-start border border-dashed border-stone-300 rounded-xl bg-stone-900 p-2 min-h-[160px] overflow-hidden">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-stone-950 flex items-center justify-center">
            {displayThumb ? (
              <>
                <img
                  src={displayThumb}
                  alt="Video thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to high quality if maxres fails
                    if (formData.youtubeUrl) {
                      e.currentTarget.src = getYouTubeThumbnailUrl(formData.youtubeUrl, 'hq');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-3 text-stone-500">
                <YouTubeIcon className="w-8 h-8 mx-auto mb-1 text-stone-600" />
                <span className="text-[11px] block text-stone-400">
                  Enter YouTube URL to preview
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Size readout */}
          {thumbPixelSize && (
            <div className="w-full mt-2 flex items-center justify-between text-[10px] text-stone-400 font-mono px-1">
              <span>Thumbnail Size:</span>
              <span className="text-rose-400 font-semibold">{thumbPixelSize}</span>
            </div>
          )}
        </div>

        {/* Right Column: Form Inputs */}
        <div className="md:col-span-2 space-y-3.5">
          {/* YouTube URL input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-deep-espresso flex items-center gap-1.5">
                <YouTubeIcon className="w-3.5 h-3.5 text-rose-600" />
                <span>YouTube Video URL</span>
                <span className="text-rose-500">*</span>
              </label>
              {ytId && (
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Valid YouTube link
                </span>
              )}
            </div>
            <input
              type="url"
              required
              value={formData.youtubeUrl || ''}
              onChange={(e) => onChange({ ...formData, youtubeUrl: e.target.value })}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40 font-mono"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Supports standard YouTube links, Shorts, youtu.be, or embed URLs.
            </p>
          </div>

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-deep-espresso mb-1">
                Video Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => onChange({ ...formData, title: e.target.value })}
                placeholder="e.g. Architectural Bridal Styling & Balayage"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deep-espresso mb-1">
                Category
              </label>
              <select
                value={formData.category || 'Bridal'}
                onChange={(e) => onChange({ ...formData, category: e.target.value })}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D6204E]/40 bg-white"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-deep-espresso hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Update Film' : 'Save YouTube Film'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default VideoForm;
