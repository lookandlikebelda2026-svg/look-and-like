import React, { useState, useMemo, useEffect } from 'react';

/**
 * ServiceItem with clean horizontal scrollable images,
 * interactive sub category list display, and bottom price + book appointment button.
 */
export function ServiceItem({ item, isExpanded, onToggle, onBook }) {
  // Normalize sub categories / sub-plans list
  const subCategories = useMemo(() => {
    if (Array.isArray(item.subCategories) && item.subCategories.length > 0) {
      return item.subCategories.map((sub, idx) => ({
        id: sub.id || `sub-${idx}`,
        name: sub.name,
        duration: sub.duration || '',
        price: typeof sub.price === 'number' ? `₹${sub.price.toLocaleString('en-IN')}` : sub.price,
      }));
    }
    if (Array.isArray(item.subplans) && item.subplans.length > 0) {
      return item.subplans.map((sub, idx) => ({
        id: sub.id || `sub-${idx}`,
        name: sub.name,
        duration: sub.duration || '',
        price: typeof sub.price === 'number' ? `₹${sub.price.toLocaleString('en-IN')}` : sub.price,
      }));
    }

    // Default tiered sub category options based on base price
    const rawPrice = item.price;
    const numPrice = Number(String(rawPrice || '2999').replace(/[^0-9.]/g, '')) || 2999;
    return [
      {
        id: `${item.id}-basic`,
        name: 'Basic Option',
        duration: 'Essential Care',
        price: `₹${Math.round(numPrice * 0.75).toLocaleString('en-IN')}`,
      },
      {
        id: `${item.id}-mid`,
        name: 'Mid Option',
        duration: 'Complete Treatment',
        price: `₹${numPrice.toLocaleString('en-IN')}`,
      },
      {
        id: `${item.id}-adv`,
        name: 'Advanced Option',
        duration: 'Deluxe Signature Ritual',
        price: `₹${Math.round(numPrice * 1.3).toLocaleString('en-IN')}`,
      },
    ];
  }, [item]);

  // Selected sub category state (defaults to mid/standard tier if available)
  const [selectedSubId, setSelectedSubId] = useState(
    () => subCategories[1]?.id || subCategories[0]?.id
  );

  useEffect(() => {
    if (subCategories.length > 0 && !subCategories.some((s) => s.id === selectedSubId)) {
      setSelectedSubId(subCategories[1]?.id || subCategories[0]?.id);
    }
  }, [subCategories, selectedSubId]);

  const selectedSub = subCategories.find((s) => s.id === selectedSubId) || subCategories[0];
  const currentPrice = selectedSub?.price || item.price;

  return (
    <div className="border-b border-border-warm/70 last:border-b-0 transition-colors">
      {/* Clickable Row Trigger */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`service-details-${item.id}`}
        id={`service-trigger-${item.id}`}
        className="w-full text-left py-3.5 sm:py-4 flex items-center justify-between sm:items-baseline gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-rose/60 rounded-xl cursor-pointer transition-colors"
      >
        <div className="min-w-0 flex items-start gap-2 sm:gap-3 flex-1">
          {/* Animated Chevron Indicator */}
          <span
            className={`material-symbols-outlined text-[18px] sm:text-[20px] text-terracotta-rose mt-0.5 transition-transform duration-300 shrink-0 ${
              isExpanded ? 'rotate-90 text-deep-espresso' : 'group-hover:translate-x-0.5'
            }`}
            aria-hidden="true"
          >
            chevron_right
          </span>

          <div className="min-w-0 pr-1">
            <span className="font-body-md font-medium text-deep-espresso block text-sm sm:text-base leading-snug group-hover:text-terracotta-rose transition-colors">
              {item.name}
            </span>
            <small className="block text-[11px] sm:text-body-sm text-on-surface-variant font-normal mt-0.5 leading-tight">
              {item.desc}
            </small>
          </div>
        </div>

        {/* Dotted Line Leader (hidden on very small mobile for clean fit) */}
        <span
          className="hidden xs:block flex-grow border-b border-dotted border-border-warm translate-y-[-5px] min-w-3 sm:min-w-6 opacity-75"
          aria-hidden="true"
        />

        {/* Price in elegant Playfair Display / Serif */}
        <span className="font-sans font-price not-italic text-sm sm:text-base text-[#D6204E] font-bold whitespace-nowrap pl-2 shrink-0">
          {item.price}
        </span>
      </button>

      {/* Expandable Details Section: Horizontal Image Gallery + Sub Category List + Bottom Price & Booking */}
      <div
        id={`service-details-${item.id}`}
        role="region"
        aria-labelledby={`service-trigger-${item.id}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'grid-rows-[1fr] opacity-100 mb-4'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#FAF8F5]/90 rounded-2xl p-3.5 sm:p-5 border border-border-warm/70 shadow-xs ml-0 sm:ml-7 flex flex-col gap-4">
            {/* Horizontal Scroll Image Gallery */}
            {item.photos && item.photos.length > 0 && (
              <div className="relative">
                <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                  {item.photos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      className="w-36 sm:w-56 shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-white border border-border-warm/60 shadow-xs group/img"
                    >
                      <img
                        src={photo.url}
                        alt={photo.alt || `${item.name} photo ${pIdx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Category List Type Display */}
            {subCategories && subCategories.length > 0 && (
              <div className="pt-2 border-t border-border-warm/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-deep-espresso flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6204E]" />
                    Sub Categories / Plan Options
                  </span>
                  <span className="text-[10px] text-[#7A6B70] font-medium">
                    {subCategories.length} Options
                  </span>
                </div>

                <div className="space-y-1.5">
                  {subCategories.map((sub, sIdx) => {
                    const isSelected = selectedSubId === sub.id;
                    return (
                      <button
                        key={sub.id || sIdx}
                        type="button"
                        onClick={() => setSelectedSubId(sub.id)}
                        className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? 'bg-[#FFF3F6] border-[#D6204E] ring-1 ring-[#D6204E]/30 shadow-2xs'
                            : 'bg-white hover:bg-[#FFF9FA] border-stone-200 hover:border-[#F0CDD7]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Radio Selection Indicator */}
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#D6204E] text-white'
                                : 'border border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <span
                              className={`text-xs sm:text-sm font-semibold block truncate ${
                                isSelected ? 'text-[#D6204E]' : 'text-deep-espresso'
                              }`}
                            >
                              {sub.name}
                            </span>
                            {sub.duration && (
                              <span className="text-[10px] text-[#7A6B70] block leading-tight">
                                {sub.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`font-sans font-price text-xs sm:text-sm font-bold shrink-0 pl-2 ${
                            isSelected ? 'text-[#D6204E]' : 'text-stone-700'
                          }`}
                        >
                          {sub.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Row: Price & Book Appointment Button */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2.5 sm:gap-3 border-t border-border-warm/60">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Price:
                </span>
                <span className="font-sans font-price not-italic text-base sm:text-lg text-deep-espresso font-bold">
                  {currentPrice}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onBook({
                    ...item,
                    name: item.name,
                    planId: item.id,
                    planName: item.name,
                    subplanId: selectedSub?.id,
                    subplanName: selectedSub?.name,
                    price: currentPrice,
                    subCategory: selectedSub?.name,
                  })
                }
                className="inline-flex items-center justify-center gap-1.5 bg-deep-espresso text-ivory-cream hover:bg-terracotta-rose text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceItem;
