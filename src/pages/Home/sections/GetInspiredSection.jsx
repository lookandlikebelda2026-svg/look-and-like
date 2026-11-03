import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_INSPIRED_IMAGES, INSTAGRAM_URL } from '../../../constants/inspiration';
import { InstagramIcon } from '../../../components/icons';
import { useContentStorage } from '../../../services/contentStorage';
import { ArrowRight } from 'lucide-react';

/**
 * Auto-adaptive partition: distributes any number of images into `colCount` columns.
 * Uses native flex-1 so each column has identical total height without gaps or jagged edges.
 */
function partitionImages(items, colCount) {
  if (!items || items.length === 0) return [];
  const cols = Math.max(1, Math.min(colCount, items.length));

  // Exact 6-image preset matching editorial lookbook: [1 tall, 2 stacked, 1 tall, 2 stacked]
  if (items.length === 6 && cols === 4) {
    return [
      [items[0]],
      [items[1], items[2]],
      [items[3]],
      [items[4], items[5]]
    ];
  }

  // Adaptive distribution for any count N
  const base = Math.floor(items.length / cols);
  const remainder = items.length % cols;
  const result = [];
  let cur = 0;

  for (let c = 0; c < cols; c++) {
    // Distribute remainder alternating for visually balanced cadence
    const take = base + (c < remainder ? 1 : 0);
    result.push(items.slice(cur, cur + take));
    cur += take;
  }
  return result;
}

export function GetInspiredSection({ images: propImages, instagramUrl = INSTAGRAM_URL, onNavigate }) {
  const navigate = useNavigate();
  const { inspiredImages: storedImages } = useContentStorage();
  const images = propImages || storedImages;
  const [activeLook, setActiveLook] = useState(0);
  const scrollRef = useRef(null);

  if (!images || images.length === 0) return null;

  const desktopCols = partitionImages(images, 4);

  const handleDotClick = (index) => {
    setActiveLook(index);
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
    const cardWidth = container.offsetWidth * 0.8;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex >= 0 && newIndex < images.length && newIndex !== activeLook) {
      setActiveLook(newIndex);
    }
  };

  return (
    <section className="w-full bg-white pt-8 scroll-mt-20" id="inspiration">
      <span id="get-inspired" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Section Heading */}
        <div className="mb-6 text-center sm:mb-10 md:mb-14">
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#D6204E]">
            — THE LOOKBOOK —
          </span>

          <h2 className="font-display-lg text-3xl italic tracking-tight text-deep-espresso sm:text-4xl md:text-display-lg">
            Get Inspired
          </h2>
        </div>

        {/* Desktop Gallery — 4 Columns (≥ md) */}
        <div className="hidden h-[520px] w-full flex-row overflow-hidden rounded-3xl border border-border-warm/60 shadow-sm md:flex lg:h-[600px]">
          {desktopCols.map((col, colIdx) => (
            <div
              key={colIdx}
              className="flex h-full min-w-0 flex-1 flex-col"
            >
              {col.map((img, imgIdx) => (
                <div
                  key={img.id || `${colIdx}-${imgIdx}`}
                  className="group relative min-h-0 w-full flex-1 overflow-hidden"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.alt || "Get Inspired Gallery Look"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Phone Only: Horizontal Touch-Snap Lookbook Carousel with Peek (< md) */}
        <div className="-mx-4 md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="w-[84%] xs:w-[78%] max-w-[320px] flex-none snap-center group"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#F0CDD7]/80 shadow-xs bg-[#FFF3F6]">
                  <img
                    src={img.imageUrl}
                    alt={img.alt || "Get Inspired Gallery Look"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeLook === idx
                    ? 'w-6 bg-[#D6204E]'
                    : 'w-2 bg-[#F0CDD7] hover:bg-[#D6204E]/60'
                }`}
              />
            ))}
          </div>

          <p className="text-center text-[11px] text-[#7A6B70] mt-2">
            ✦ Swipe to browse the bridal &amp; editorial lookbook
          </p>
        </div>

        {/* Dedicated Page Link / CTA */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate('/inspiration');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-warm bg-white hover:border-[#D6204E] hover:bg-[#FFF3F6]/60 px-6 sm:px-8 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-deep-espresso hover:text-[#D6204E] shadow-2xs hover:shadow-sm transition-all duration-300 cursor-pointer active:scale-95 group"
          >
            <span>Explore Complete Lookbook Gallery</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Follow on Instagram (Commented out per user request) */}
        {/* <div className="mt-8 flex justify-center sm:mt-10 md:mt-12">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1e1e1e] px-6 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-300 hover:bg-deep-espresso hover:shadow-md sm:px-8 sm:text-xs sm:tracking-[0.2em]"
          >
            <InstagramIcon className="h-4 w-4 shrink-0" />
            <span>Follow Us on Instagram</span>
          </a>
        </div> */}

      </div>
    </section>
  );
}
