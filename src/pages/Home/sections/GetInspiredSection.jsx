import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_INSPIRED_IMAGES, INSTAGRAM_URL } from '../../../constants/inspiration';
import { useContentStorage } from '../../../services/contentStorage';
import { LookbookSkeleton } from '../../../components/common/Skeleton';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Desktop Editorial Card
 */
function LookbookCard({ image, index, onClick, className = '' }) {
  if (!image) return null;
  return (
    <div
      onClick={() => onClick(index)}
      className={`group/card relative overflow-hidden rounded-2xl lg:rounded-3xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs hover:shadow-lg transition-all duration-300 w-full ${className}`}
      title="Click to preview full screen"
    >
      <img
        src={image.imageUrl}
        alt={image.alt || `Lookbook Look ${index + 1}`}
        loading="lazy"
        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out select-none group-hover/card:scale-105"
      />
      <div className="absolute inset-3.5 lg:inset-4 border-2 border-white rounded-xs sm:rounded-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
    </div>
  );
}

/**
 * Mobile Editorial Card
 */
function MobileLookbookCard({ image, index, onClick, heightClass = 'h-[200px]' }) {
  if (!image) return null;
  return (
    <div
      onClick={() => onClick(index)}
      className={`group/card relative overflow-hidden rounded-xl xs:rounded-2xl cursor-pointer bg-stone-900 border border-[#F0CDD7]/80 shadow-xs active:scale-[0.98] transition-transform w-full ${heightClass}`}
      title="Click to preview full screen"
    >
      <img
        src={image.imageUrl}
        alt={image.alt || `Lookbook Look ${index + 1}`}
        loading="lazy"
        className="h-full w-full object-cover object-center select-none"
      />
    </div>
  );
}

/**
 * DesktopBlock: 6-image rhythmic magazine block
 * Even blocks (0, 2): Tall, Stacked, Tall, Stacked
 * Odd blocks (1, 3): Stacked, Tall, Stacked, Tall
 */
function DesktopBlock({ blockIndex, blockImages, baseIndex, onCardClick }) {
  const isAlt = blockIndex % 2 === 1;

  // Explicit heights on every card � no h-full/flex-1 needed.
  // Tall col: 520px (md) / 560px (lg) / 600px (xl)
  // Stacked cards: (520 - gap14) / 2 = 253px (md) | (560 - gap18) / 2 = 271px (lg) | (600 - gap18) / 2 = 291px (xl)
  const tallH   = 'h-[520px] lg:h-[560px] xl:h-[600px]';
  const stackH  = 'h-[253px] lg:h-[271px] xl:h-[291px]';

  if (!isAlt) {
    return (
      <div className="grid grid-cols-4 gap-3.5 lg:gap-4.5 w-full select-none">
        {/* Col 1: Tall */}
        <LookbookCard
          image={blockImages[0]}
          index={baseIndex + 0}
          onClick={onCardClick}
          className={tallH}
        />

        {/* Col 2: Stacked Pair */}
        <div className="flex flex-col gap-3.5 lg:gap-4.5">
          <LookbookCard
            image={blockImages[1]}
            index={baseIndex + 1}
            onClick={onCardClick}
            className={stackH}
          />
          <LookbookCard
            image={blockImages[2]}
            index={baseIndex + 2}
            onClick={onCardClick}
            className={stackH}
          />
        </div>

        {/* Col 3: Tall */}
        <LookbookCard
          image={blockImages[3]}
          index={baseIndex + 3}
          onClick={onCardClick}
          className={tallH}
        />

        {/* Col 4: Stacked Pair */}
        <div className="flex flex-col gap-3.5 lg:gap-4.5">
          <LookbookCard
            image={blockImages[4]}
            index={baseIndex + 4}
            onClick={onCardClick}
            className={stackH}
          />
          <LookbookCard
            image={blockImages[5]}
            index={baseIndex + 5}
            onClick={onCardClick}
            className={stackH}
          />
        </div>
      </div>
    );
  }

  // Inverted Pattern: Stacked, Tall, Stacked, Tall
  return (
    <div className="grid grid-cols-4 gap-3.5 lg:gap-4.5 w-full select-none">
      {/* Col 1: Stacked Pair */}
      <div className="flex flex-col gap-3.5 lg:gap-4.5">
        <LookbookCard
          image={blockImages[0]}
          index={baseIndex + 0}
          onClick={onCardClick}
          className={stackH}
        />
        <LookbookCard
          image={blockImages[1]}
          index={baseIndex + 1}
          onClick={onCardClick}
          className={stackH}
        />
      </div>

      {/* Col 2: Tall */}
      <LookbookCard
        image={blockImages[2]}
        index={baseIndex + 2}
        onClick={onCardClick}
        className={tallH}
      />

      {/* Col 3: Stacked Pair */}
      <div className="flex flex-col gap-3.5 lg:gap-4.5">
        <LookbookCard
          image={blockImages[3]}
          index={baseIndex + 3}
          onClick={onCardClick}
          className={stackH}
        />
        <LookbookCard
          image={blockImages[4]}
          index={baseIndex + 4}
          onClick={onCardClick}
          className={stackH}
        />
      </div>

      {/* Col 4: Tall */}
      <LookbookCard
        image={blockImages[5]}
        index={baseIndex + 5}
        onClick={onCardClick}
        className={tallH}
      />
    </div>
  );
}

/**
 * MobileBlock: 6-image rhythmic mobile block
 * Exact height match (550px) between columns
 */
function MobileBlock({ blockIndex, blockImages, baseIndex, onCardClick }) {
  const isAlt = blockIndex % 2 === 1;

  if (!isAlt) {
    return (
      <div className="grid grid-cols-[1.14fr_0.86fr] gap-2.5 xs:gap-3 w-full select-none">
        {/* Col 1 */}
        <div className="flex flex-col gap-2.5 xs:gap-3">
          <MobileLookbookCard
            image={blockImages[0]}
            index={baseIndex + 0}
            onClick={onCardClick}
            heightClass="h-[215px] xs:h-[240px]"
          />
          <MobileLookbookCard
            image={blockImages[2]}
            index={baseIndex + 2}
            onClick={onCardClick}
            heightClass="h-[145px] xs:h-[160px]"
          />
          <MobileLookbookCard
            image={blockImages[4]}
            index={baseIndex + 4}
            onClick={onCardClick}
            heightClass="h-[190px] xs:h-[210px]"
          />
        </div>

        {/* Col 2 */}
        <div className="flex flex-col gap-2.5 xs:gap-3">
          <MobileLookbookCard
            image={blockImages[1]}
            index={baseIndex + 1}
            onClick={onCardClick}
            heightClass="h-[155px] xs:h-[170px]"
          />
          <MobileLookbookCard
            image={blockImages[3]}
            index={baseIndex + 3}
            onClick={onCardClick}
            heightClass="h-[225px] xs:h-[250px]"
          />
          <MobileLookbookCard
            image={blockImages[5]}
            index={baseIndex + 5}
            onClick={onCardClick}
            heightClass="h-[170px] xs:h-[190px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1.14fr_0.86fr] gap-2.5 xs:gap-3 w-full select-none">
      {/* Col 1 (Inverted) */}
      <div className="flex flex-col gap-2.5 xs:gap-3">
        <MobileLookbookCard
          image={blockImages[0]}
          index={baseIndex + 0}
          onClick={onCardClick}
          heightClass="h-[155px] xs:h-[170px]"
        />
        <MobileLookbookCard
          image={blockImages[2]}
          index={baseIndex + 2}
          onClick={onCardClick}
          heightClass="h-[225px] xs:h-[250px]"
        />
        <MobileLookbookCard
          image={blockImages[4]}
          index={baseIndex + 4}
          onClick={onCardClick}
          heightClass="h-[170px] xs:h-[190px]"
        />
      </div>

      {/* Col 2 (Inverted) */}
      <div className="flex flex-col gap-2.5 xs:gap-3">
        <MobileLookbookCard
          image={blockImages[1]}
          index={baseIndex + 1}
          onClick={onCardClick}
          heightClass="h-[215px] xs:h-[240px]"
        />
        <MobileLookbookCard
          image={blockImages[3]}
          index={baseIndex + 3}
          onClick={onCardClick}
          heightClass="h-[145px] xs:h-[160px]"
        />
        <MobileLookbookCard
          image={blockImages[5]}
          index={baseIndex + 5}
          onClick={onCardClick}
          heightClass="h-[190px] xs:h-[210px]"
        />
      </div>
    </div>
  );
}

/**
 * GetInspiredSection
 * Home Page Editorial Lookbook Showcase
 */
export function GetInspiredSection({ images: propImages, instagramUrl = INSTAGRAM_URL, onNavigate }) {
  const navigate = useNavigate();
  const { inspiredImages: storedImages, loadingLookbook } = useContentStorage();
  const images = propImages || storedImages || GET_INSPIRED_IMAGES;

  // Display 12 curated looks on the home page (2 balanced blocks)
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (activeLightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeLightboxIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null || !images || images.length === 0) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, images]);

  if (loadingLookbook && !propImages) {
    return <LookbookSkeleton />;
  }

  if (!images || images.length === 0) return null;

  // Display 12 curated looks on the home page (2 balanced blocks)
  const displayedImages = images.slice(0, 12);
  const blocks = [];
  for (let i = 0; i < displayedImages.length; i += 6) {
    blocks.push({
      blockIndex: Math.floor(i / 6),
      baseIndex: i,
      images: displayedImages.slice(i, i + 6),
    });
  }

  return (
    <section className="w-full bg-white py-8 sm:py-12 lg:py-16 scroll-mt-20" id="inspiration">
      <span id="get-inspired" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Heading: Centered Eyebrow + Title */}
        <div className="mb-6 sm:mb-8 text-center">
          <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            THE LOOKBOOK
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight">
            Get Inspired
          </h2>
        </div>

        {/* DESKTOP VIEW (≥ md): Editorial Blocks (12 looks shown upfront) */}
        <div className="hidden md:flex flex-col gap-4 sm:gap-5 w-full">
          {blocks.map((block) => (
            <DesktopBlock
              key={`desktop-block-${block.blockIndex}`}
              blockIndex={block.blockIndex}
              blockImages={block.images}
              baseIndex={block.baseIndex}
              onCardClick={setActiveLightboxIndex}
            />
          ))}
        </div>

        {/* MOBILE VIEW (< md): 2-Column Asymmetrical Collage Blocks */}
        <div className="md:hidden flex flex-col gap-3.5 w-full">
          {blocks.map((block) => (
            <MobileBlock
              key={`mobile-block-${block.blockIndex}`}
              blockIndex={block.blockIndex}
              blockImages={block.images}
              baseIndex={block.baseIndex}
              onCardClick={setActiveLightboxIndex}
            />
          ))}
        </div>

        {/* Dedicated Action Button Below Gallery */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate('/inspiration');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black hover:bg-neutral-800 text-white px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer group whitespace-nowrap"
          >
            <span>Explore Full Lookbook</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/90 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Full-Screen Pure Image Lightbox for Desktop & Mobile */}
      {activeLightboxIndex !== null && images[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6 cursor-zoom-out animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Navigation Controls */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer z-20"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer z-20"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-4 right-4 p-2.5 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all cursor-pointer z-20"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Active Image */}
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeLightboxIndex].imageUrl}
              alt={images[activeLightboxIndex].alt || 'Lookbook Look'}
              className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none"
            />
            {images[activeLightboxIndex].alt && (
              <p className="mt-2.5 text-center text-xs sm:text-sm text-white/80 max-w-md px-4">
                {images[activeLightboxIndex].alt}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default GetInspiredSection;
