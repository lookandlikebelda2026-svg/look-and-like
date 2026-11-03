import React from 'react';
import { ArrowUp, ArrowDown, Edit3, Trash2, ExternalLink, Play } from 'lucide-react';
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
    <div className="relative bg-white rounded-2xl border border-border-warm/70 shadow-xs hover:shadow-sm overflow-hidden flex flex-col group transition-all">
      {/* Video Thumbnail with YouTube Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
        {displayThumb ? (
          <img
            src={displayThumb}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/640x360/2A1F1B/FFFFFF?text=YouTube+Video';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-500">
            <YouTubeIcon className="w-10 h-10 text-rose-500 mb-1" />
            <span className="text-xs">No Thumbnail</span>
          </div>
        )}

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Category & Order Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/95 backdrop-blur-xs text-deep-espresso border border-border-warm shadow-2xs">
            #{index + 1}
          </span>
          {video.category && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D6204E] text-white shadow-2xs">
              {video.category}
            </span>
          )}
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-black/80 text-white backdrop-blur-xs">
            {video.duration}
          </span>
        )}

        {/* Quick Reorder Overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded-full p-1 border border-border-warm shadow-2xs">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Earlier"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === totalCount - 1}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Later"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Details & Actions */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-deep-espresso line-clamp-1 leading-snug">
            {video.title}
          </h4>
          {video.description && (
            <p className="text-[11px] text-[#7A6B70] line-clamp-2 mt-0.5 leading-snug">
              {video.description}
            </p>
          )}

          {/* YouTube Link Pill */}
          {video.youtubeUrl && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
              <YouTubeIcon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-rose-600 hover:underline inline-flex items-center gap-1"
                title={video.youtubeUrl}
              >
                <span>{ytId ? `ID: ${ytId}` : 'Open YouTube'}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <span className="text-[10px] text-stone-400 font-mono">
            ID: {video.id}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(video, index)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-deep-espresso hover:bg-stone-100 transition-colors cursor-pointer"
              title="Edit Video"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
