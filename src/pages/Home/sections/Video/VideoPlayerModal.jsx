import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeId } from '../../../../utils/youtube';

export function VideoPlayerModal({ video, isOpen, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const youtubeId = extractYouTubeId(video.youtubeUrl);
  const embedUrl = youtubeId ? getYouTubeEmbedUrl(youtubeId, true) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      {/* Cinematic Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-deep-espresso text-ivory-cream rounded-2xl sm:rounded-3xl shadow-2xl p-3.5 sm:p-6 md:p-7 z-10 border border-white/20 overflow-hidden max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-3 sm:mb-5">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D6204E] animate-ping shrink-0" />
            <span className="font-label-sm text-[10px] sm:text-xs uppercase tracking-widest text-[#F0CDD7] font-bold truncate">
              {video.category || "Atelier Experience"} · {video.duration || "Full HD"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {video.youtubeUrl && (
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/70 hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close video player"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-[#D6204E] text-ivory-cream flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 16:9 Video Player Frame */}
        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/70 bg-stone-900">
              <p className="text-sm font-semibold">Video preview unavailable</p>
              <p className="text-xs text-white/50 mt-1">Please provide a valid YouTube URL in the Admin Panel.</p>
            </div>
          )}
        </div>

        {/* Description & Metadata */}
        <div className="pt-4 sm:pt-5 space-y-2">
          <h3 id="video-modal-title" className="font-serif text-lg sm:text-2xl font-bold text-white tracking-tight">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-xs sm:text-sm text-ivory-cream/80 leading-relaxed font-sans">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerModal;
