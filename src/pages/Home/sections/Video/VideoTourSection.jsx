import React, { useState, useRef } from 'react';
import { COLLECTION_VIDEOS } from '../../../../constants/videos';
import { useContentStorage } from '../../../../services/contentStorage';
import { VideoCard } from './VideoCard';
import { VideoPlayerModal } from './VideoPlayerModal';

export function VideoTourSection() {
  const { videos } = useContentStorage();
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

  const rawList = videos && videos.length > 0 ? videos : COLLECTION_VIDEOS;
  // Ensure a symmetrical 2-row grid (6 films: 3x2 on desktop, 2x3 on tablet)
  const videoList = rawList.slice(0, 6);

  const handleTabClick = (index) => {
    setActiveTab(index);
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index];
    if (card) {
      const targetLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !container.children.length) return;
    const center = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(center - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeTab && closestIndex >= 0 && closestIndex < videoList.length) {
      setActiveTab(closestIndex);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white text-on-surface py-8 sm:py-12 lg:py-16 scroll-mt-20"
      id="video-tour"
    >
      {/* Supporting #experience anchor for direct navigation */}
      <span id="experience" className="sr-only" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading: Centered Eyebrow + Title */}
        <div className="mb-6 sm:mb-10 text-center">
          <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            OUR EXPERIENCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight">
            Watch Our Stories
          </h2>
        </div>

        {/* Phone Only: Horizontal Touch-Snap Carousel with Peek */}
        <div className="-mx-4 sm:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {videoList.map((video) => (
              <div
                key={video.id}
                className="w-[88%] xs:w-[82%] max-w-[340px] flex-none snap-center"
              >
                <VideoCard
                  video={video}
                  onPlay={(selected) => setActiveVideo(selected)}
                />
              </div>
            ))}
          </div>

          {/* Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-3.5">
            {videoList.map((video, idx) => (
              <button
                key={video.id}
                type="button"
                onClick={() => handleTabClick(idx)}
                aria-label={`Go to ${video.title}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'w-6 bg-[#D6204E]'
                    : 'w-2 bg-[#F0CDD7] hover:bg-[#D6204E]/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tablet and Desktop: Symmetrical Grid (3 columns on lg, 2 columns on sm/md) */}
        <div className="hidden grid-cols-2 gap-4 sm:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {videoList.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={(selected) => setActiveVideo(selected)}
            />
          ))}
        </div>
      </div>

      {/* Interactive Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
}

export default VideoTourSection;
