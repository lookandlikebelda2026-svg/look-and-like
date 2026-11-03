import React, { useState, useRef } from 'react';
import { COLLECTION_VIDEOS } from '../../../../constants/videos';
import { useContentStorage } from '../../../../services/contentStorage';
import { VideoCard } from './VideoCard';
import { VideoPlayerModal } from './VideoPlayerModal';

export function VideoTourSection() {
  const { videos } = useContentStorage();
  const [activeVideo, setActiveVideo] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

  const videoList = videos && videos.length > 0 ? videos : COLLECTION_VIDEOS;
  // Limit initially to 4 videos on desktop unless "showAll" is toggled
  const displayedVideos = showAll ? videoList : videoList.slice(0, 4);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (scrollRef.current) {
      const card = scrollRef.current.children[index];
      if (card) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.82;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < displayedVideos.length && newIndex !== activeTab) {
      setActiveTab(newIndex);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden border-border-warm/40 bg-white text-on-surface sm:py-8"
      id="video-tour"
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="mx-auto mb-5 max-w-2xl text-center sm:mb-12">
          <span className="mb-1.5 block font-label-sm text-xs font-bold uppercase tracking-[0.25em] text-[#D6204E] sm:mb-3">
            OUR EXPERIENCE
          </span>

          <h2 className="font-display-md font-serif text-2xl leading-tight tracking-tight text-deep-espresso sm:text-3xl lg:text-display-md">
            Watch our beauty stories
          </h2>
        </div>

        {/* Phone Only: Story Category Quick-Tabs */}
       
        {/* Phone Only: Touch-Snap Carousel with Peek Effect */}
        <div className="-mx-4 sm:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayedVideos.map((video) => (
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
            {displayedVideos.map((video, idx) => (
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

        {/* Tablet and Desktop: Responsive Grid */}
        <div className="hidden grid-cols-2 gap-4 sm:grid lg:grid-cols-4 lg:gap-6">
          {displayedVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={(selected) => setActiveVideo(selected)}
            />
          ))}
        </div>

        {/* View All / Expand Toggle */}
        {videoList.length > 4 && (
          <div className="mt-6 text-center sm:mt-12">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-warm bg-transparent px-6 py-3 font-label-md text-xs uppercase tracking-wider text-deep-espresso shadow-xs transition-all duration-300 hover:border-deep-espresso hover:bg-neutral-100 active:scale-95 sm:px-7"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showAll ? "expand_less" : "video_library"}
              </span>

              <span>
                {showAll
                  ? "Show Fewer Films"
                  : `View All ${videoList.length} Films`}
              </span>
            </button>
          </div>
        )}
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
