import React from 'react';
import { Play } from 'lucide-react';
import { getYouTubeThumbnailUrl } from '../../../../utils/youtube';

const FALLBACK_THUMBNAIL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23FFF3F6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23D6204E' font-family='sans-serif' font-size='20' font-weight='600'%3ELook %26 Like Atelier Film%3C/text%3E%3C/svg%3E";

export function VideoCard({ video, onPlay }) {
  if (!video) return null;

  const thumbnail =
    video.thumbnailUrl ||
    getYouTubeThumbnailUrl(video.youtubeUrl) ||
    FALLBACK_THUMBNAIL;

  return (
    <article
      onClick={() => onPlay?.(video)}
      className="group flex flex-col text-left rounded-2xl sm:rounded-3xl overflow-hidden bg-white hover:bg-white border border-[#F0CDD7]/80 hover:border-[#D6204E]/60 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer h-full"
    >
      {/* 16:9 Landscape Thumbnail Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#FFF3F6]">
        <img
          src={thumbnail}
          alt={video.alt || video.title || 'Look & Like Film'}
          className="w-full h-full object-cover opacity-95 transition-transform duration-500 ease-out group-hover:scale-105 select-none"
          loading="lazy"
          onError={(e) => {
            const fallback = getYouTubeThumbnailUrl(video.youtubeUrl, 'mqdefault');
            if (fallback && e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            } else {
              e.currentTarget.src = FALLBACK_THUMBNAIL;
            }
          }}
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 pointer-events-none" />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-xs">
            {video.category || 'Atelier Story'}
          </span>
          <span className="bg-white/90 backdrop-blur-xs text-[#D6204E] font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
            {video.duration || 'Film'}
          </span>
        </div>

        {/* Centered Play Button with Lucide Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-white/80 text-[#D6204E] flex items-center justify-center transition-all duration-300 group-hover:bg-[#D6204E] group-hover:border-[#D6204E] group-hover:text-white group-hover:scale-110 shadow-lg">
            <Play className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E] fill-[#D6204E] group-hover:text-white group-hover:fill-white ml-0.5 transition-colors" />
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-start gap-1 bg-white">
        <h3 className="font-bold text-xs sm:text-sm text-deep-espresso group-hover:text-[#D6204E] transition-colors leading-tight line-clamp-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-[11px] text-[#7A6B70] leading-[1.3] line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </article>
  );
}

export default VideoCard;
