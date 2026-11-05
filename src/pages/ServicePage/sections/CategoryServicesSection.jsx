import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ServiceItem } from '../../Home/sections/services/ServiceItem';
import { CategoryCard } from './CategoryCard';
import skinCareImg from '../../../asset/services/service-skin.png';
import hairCareImg from '../../../asset/services/service-hair.png';
import nailCareImg from '../../../asset/services/service-nails.png';
import makeUpImg from '../../../asset/services/service-makeup.png';
import {
  LotusIcon,
  HairShearsIcon,
  NailCareIcon,
  MakeUpBrushIcon,
} from '../../../components/icons';

function getCategoryIcon(keyOrTitle) {
  const k = String(keyOrTitle || '').toLowerCase();
  if (k.includes('hair') || k.includes('cut') || k.includes('shears')) return HairShearsIcon;
  if (k.includes('nail')) return NailCareIcon;
  if (k.includes('makeup') || k.includes('make-up') || k.includes('brush') || k.includes('bridal')) return MakeUpBrushIcon;
  return LotusIcon;
}

const CATEGORY_CARD_CONFIG = {
  skin: {
    key: 'skin',
    title: 'Skin Care',
    subtitle: 'Facials, Cleanups, Anti-Aging & More',
    tagline: 'Clinical Bio-Active & Radiant Glow Facials',
    image: skinCareImg,
    icon: LotusIcon,
    startingPrice: '₹1,999'
  },
  hair: {
    key: 'hair',
    title: 'Hair Care',
    subtitle: 'Haircuts, Styling, Japanese Spa, Smoothening & More',
    tagline: 'Architectural Cuts, Balayage & Keratin Infusion',
    image: hairCareImg,
    icon: HairShearsIcon,
    startingPrice: '₹1,499'
  },
  nails: {
    key: 'nails',
    title: 'Nail Care',
    subtitle: 'Manicure, Pedicure, Russian BIAB & Nail Art',
    tagline: 'Russian BIAB, Couture Extensions & Spa Pedicures',
    image: nailCareImg,
    icon: NailCareIcon,
    startingPrice: '₹999'
  },
  makeup: {
    key: 'makeup',
    title: 'Make Up',
    subtitle: 'Bridal, Party, HD Airbrush & Glamour',
    tagline: 'Haute Bridal Glamour, Party HD & Editorial Looks',
    image: makeUpImg,
    icon: MakeUpBrushIcon,
    startingPrice: '₹3,999'
  }
};

export function CategoryServicesSection({
  displayedCategories = [],
  expandedServiceId,
  onToggleExpand,
  onBookService,
  onBookCategory,
}) {
  if (!displayedCategories || displayedCategories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-8 sm:py-8 flex-1">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col gap-12 sm:gap-16 lg:gap-24">
        {displayedCategories.map((category) => {
          const meta = CATEGORY_CARD_CONFIG[category.key] || {
            key: category.key || category.id,
            title: category.title || category.name,
            subtitle: category.subtitle || category.description,
            image: category.image || category.images?.[0]?.url || skinCareImg,
            startingPrice: category.startingPrice,
            icon: getCategoryIcon(category.key || category.title),
          };

          const items = category.items || [];

          return (
            <div
              key={category.key || category.id}
              id={`category-${category.key || category.id}`}
              className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.35fr)] gap-8 lg:gap-14 items-start scroll-mt-28 border border-[#EAD6D8] bg-[#FFFCFB] p-4 sm:p-6 lg:p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(100,55,60,0.04)]"
            >
              {/* LEFT: Beauty Category Card */}
              <div className="w-full min-w-0 lg:sticky lg:top-24 self-start">
                <CategoryCard
                  meta={meta}
                  category={category}
                  onBookCategory={onBookCategory}
                />
              </div>

              {/* RIGHT: Beauty Service Menu */}
              <div className="min-w-0 w-full pt-1">
                {/* Section Header */}
                <div className="pb-5 border-b border-[#EAD6D8]">
                  <div className="mb-2">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-black">
                      Our Signature Services
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.8rem] font-bold text-black leading-tight tracking-tight">
                    {category.title || category.name}
                  </h2>

                  {(category.subtitle || category.description) && (
                    <p className="text-sm sm:text-base text-[#846F73] leading-relaxed mt-2 max-w-xl">
                      {category.subtitle || category.description}
                    </p>
                  )}
                </div>

                {/* Service List */}
                <div className="flex flex-col">
                  {items.length === 0 ? (
                    <p className="text-xs text-stone-400 py-6 italic">No plans configured under this category yet.</p>
                  ) : (
                    items.map((item) => (
                      <ServiceItem
                        key={item.id}
                        item={item}
                        isExpanded={expandedServiceId === item.id}
                        onToggle={() => onToggleExpand(item.id)}
                        onBook={(service) =>
                          onBookService(category.key || category.id, service)
                        }
                      />
                    ))
                  )}
                </div>

                {/* Footer Note */}
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F9F0F0] px-4 py-3">
                  <span className="text-[#B66C7C] text-base leading-none mt-0.5">
                    ✦
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#846F73]">
                    Our beauty specialists personalise every treatment to your needs.
                    Final pricing may vary depending on hair length, products and consultation.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryServicesSection;
