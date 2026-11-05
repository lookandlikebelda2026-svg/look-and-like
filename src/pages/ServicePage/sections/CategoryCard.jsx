import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusIcon } from '../../../components/icons';

export function CategoryCard({ meta = {}, category = {}, onBookCategory }) {
  const IconComponent = meta.icon || LotusIcon;
  const treatmentsCount = category?.items?.length;

  return (
    <div className="group relative w-full overflow-hidden rounded-[1.75rem] border border-[#F0CDD7]/90 bg-white shadow-[0_6px_24px_rgba(214,32,78,0.06)] transition-all duration-300 hover:shadow-[0_14px_35px_rgba(214,32,78,0.12)]">
      {/* Prominent Beauty Service Image */}
      <div className="relative w-full h-64 sm:h-72 lg:h-[320px] overflow-hidden bg-[#FFF3F6]">
        <img
          src={meta.image}
          alt={meta.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 select-none"
        />

        {/* Soft Luxury Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent pointer-events-none" />

        {/* Floating Treatment Count Badge matching Tour Badge styling */}
        {treatmentsCount ? (
          <span className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none select-none">
            {treatmentsCount} TREATMENTS
          </span>
        ) : null}

        {/* Category Circular Badge Overlapping Bottom-Left */}
        <div className="absolute -bottom-5 left-5 z-10 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white bg-white text-[#D6204E] shadow-md ring-1 ring-[#F0CDD7] transition-transform duration-300 group-hover:scale-110">
          <IconComponent className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
        </div>
      </div>

      {/* Minimal, Clean Card Content */}
      <div className="flex flex-col px-5 pt-8 pb-5 sm:px-6 sm:pb-6">
        {/* Title */}
        <div className="mb-1.5">
          <h3 className="font-serif text-2xl font-bold leading-tight text-deep-espresso transition-colors group-hover:text-[#D6204E]">
            {meta.title}
          </h3>
        </div>

        {/* Concise Subtitle */}
        {meta.subtitle && (
          <p className="text-xs sm:text-sm text-[#7A6B70] leading-relaxed mb-3 line-clamp-2">
            {meta.subtitle}
          </p>
        )}

        {/* Starting Price with large text right above the reserve chair button */}
        {meta.startingPrice && (
          <div className="mb-4 flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-xs sm:text-sm text-[#7A6B70] font-medium">
              Starting from
            </span>
            <span className="font-sans font-price text-xl sm:text-2xl font-bold text-[#D6204E] leading-none">
              {meta.startingPrice}
            </span>
          </div>
        )}

        {/* Prominent Action Button matching Parlour Brand Crimson */}
        <button
          type="button"
          onClick={() => onBookCategory?.(category?.key)}
          className="group/btn inline-flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] px-3 sm:px-4 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          <span>Reserve {meta.title} Chair</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default CategoryCard;
