import React from 'react';
import { ArrowUp, ArrowDown, Edit3, Trash2, ExternalLink, Play , MoreVertical } from 'lucide-react';
import { YouTubeIcon } from '../../../../components/icons';
import { getYouTubeThumbnailUrl, extractYouTubeId } from '../../../../utils/youtube';

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
  const ytId = extractYouTubeId(video.youtubeUrl);
  const displayThumb = video.thumbnailUrl || (video.youtubeUrl ? getYouTubeThumbnailUrl(video.youtubeUrl, 'hq') : null);

  return (
  <div className="relative bg-white rounded-2xl border border-border-warm/70 shadow-xs hover:shadow-md overflow-hidden flex flex-col group transition-all duration-300">

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
        <YouTubeIcon className="w-10 h-10 text-rose-500 mb-1" />
        <span className="text-xs">No Thumbnail</span>
      </div>
    )}

  

    {/* Badges */}
    <div className="absolute top-3 left-3 flex items-center gap-1.5">
      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-white/95 text-deep-espresso shadow-sm">
        #{index + 1}
      </span>

      
    </div>
  </div>

  {/* Video Details */}
  <div className="p-2 flex flex-col flex-1">

    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-deep-espresso line-clamp-2 leading-snug">
        {video.title}
      </h4>

      {video.youtubeUrl && (
        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className=" inline-flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-rose-600 transition-colors font-medium"
        >
          <YouTubeIcon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          Watch on YouTube
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>

    {/* Bottom Action Bar */}
    <div className=" border-t border-stone-100 flex items-center justify-between">

      {/* Reorder Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-deep-espresso disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Move Earlier"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Up</span>
        </button>

        <button
          type="button"
          onClick={() => onMove(index, 1)}
          disabled={index === totalCount - 1}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-deep-espresso disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Move Later"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Down</span>
        </button>
      </div>

      {/* More Actions */}
      <div className="relative group/actions">

        <button
          type="button"
          className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-deep-espresso transition-colors"
          title="More actions"
          aria-label="More video actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown */}
        <div className="absolute bottom-full right-0 mb-2 w-36 bg-white rounded-xl border border-border-warm shadow-lg p-1.5 opacity-0 invisible translate-y-1 group-hover/actions:opacity-100 group-hover/actions:visible group-hover/actions:translate-y-0 focus-within:opacity-100 focus-within:visible transition-all duration-200 z-20">

          <button
            type="button"
            onClick={() => onEdit(video, index)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-deep-espresso transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Video
          </button>

          <div className="h-px bg-stone-100 my-1" />

          <button
            type="button"
            onClick={() => onDelete(index)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Video
          </button>

        </div>
      </div>

    </div>
  </div>
</div>
  );
}

export default VideoCard;
