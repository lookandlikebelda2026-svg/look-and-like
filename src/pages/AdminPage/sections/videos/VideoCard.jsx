import React from 'react';
import { ArrowUp, ArrowDown, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { YouTubeIcon } from '../../../../components/icons';
import { getYouTubeThumbnailUrl } from '../../../../utils/youtube';

/**
 * Individual Video Card in Admin Management Studio
 */
export function VideoCard({
  video,
  index,
  totalCount,
  onMove,
  onEdit,
  onDelete,
}) {
  const displayThumb = video.thumbnailUrl || (video.youtubeUrl ? getYouTubeThumbnailUrl(video.youtubeUrl, 'hq') : null);

  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-border-warm/70 shadow-2xs hover:shadow-xs overflow-hidden flex flex-col group transition-all duration-200">
      {/* Video Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
        {displayThumb ? (
          <img
            src={displayThumb}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                'https://placehold.co/640x360/2A1F1B/FFFFFF?text=YouTube+Video';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-500">
            <YouTubeIcon className="w-8 h-8 text-rose-500 mb-1" />
            <span className="text-[10px]">No Thumbnail</span>
          </div>
        )}

        {/* Index Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/95 text-deep-espresso shadow-2xs">
            #{index + 1}
          </span>
          {video.category && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 text-white backdrop-blur-xs">
              {video.category}
            </span>
          )}
        </div>
      </div>

      {/* Video Details & Actions */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 gap-2 bg-white">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs sm:text-sm font-bold text-deep-espresso truncate leading-snug">
              {video.category || video.title || 'Video Film'}
            </span>
            {video.youtubeUrl && (
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-stone-500 hover:text-rose-600 transition-colors font-medium shrink-0"
              >
                <YouTubeIcon className="w-3 h-3 text-rose-600 shrink-0" />
                <span>Watch</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          {/* Reorder Actions */}
          <div className="flex items-center gap-0.5 bg-[#FAF8F5] rounded-lg p-0.5 border border-stone-200">
            <button
              type="button"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
              title="Move Earlier"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onMove(index, 1)}
              disabled={index === totalCount - 1}
              className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
              title="Move Later"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>

          {/* Edit & Delete */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onEdit(video, index)}
              className="p-1 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-md transition-colors cursor-pointer"
              title="Edit Video"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(index)}
              className="p-1 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              title="Delete Video"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
