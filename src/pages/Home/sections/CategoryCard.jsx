import React from 'react';

export function CategoryCard({ item, onSelectCategory }) {
  return (
    <div className="group flex flex-col bg-white rounded-[100px_100px_20px_20px] sm:rounded-[120px_120px_20px_20px] p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-border-warm/60">
      {/* Arch Shaped Image Frame */}
      <div className="relative w-full h-[260px] sm:h-[320px] rounded-[90px_90px_16px_16px] sm:rounded-[105px_105px_16px_16px] overflow-hidden mb-4 sm:mb-5 bg-white border border-border-warm/30">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={item.alt}
          src={item.imageUrl}
        />
        <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-label-sm text-[10px] sm:text-label-sm text-deep-espresso font-semibold uppercase shadow-xs border border-border-warm/40">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="px-1.5 sm:px-2 pb-2 sm:pb-3 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <h3 className="font-headline-sm text-base sm:text-headline-sm text-deep-espresso">
            {item.title}
          </h3>
          <span className="font-sans font-price text-base sm:text-lg text-[#D6204E] font-bold">
            {item.price}
          </span>
        </div>

        <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant mb-3 sm:mb-4 flex-grow leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-tertiary font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider pt-2.5 sm:pt-3 border-t border-border-warm/40">
          <span>{item.duration}</span>
          <a
            className="text-deep-espresso group-hover:text-terracotta-rose font-semibold flex items-center gap-1 transition-colors"
            href="#branch-booking"
            onClick={() => onSelectCategory && onSelectCategory(item.id)}
          >
            <span>Book Ritual</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
}
