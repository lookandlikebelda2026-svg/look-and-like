import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import skinCareImg from '../../../../asset/services/service-skin.png';
import hairCareImg from '../../../../asset/services/service-hair.png';
import nailCareImg from '../../../../asset/services/service-nails.png';
import makeUpImg from '../../../../asset/services/service-makeup.png';
import spaImg from '../../../../asset/services/service-spa.png';
import {
  LotusIcon,
  HairShearsIcon,
  NailCareIcon,
  MakeUpBrushIcon,
  SpaWellnessIcon,
} from '../../../../components/icons';

/**
 * 4 Core Service Showcase Cards matching the dedicated atelier service card design
 */
const SERVICE_CARDS = [
  {
    id: 'skin-care',
    categoryKey: 'skin',
    title: 'Skin Care',
    subtitle: 'Facials, Cleanups, Anti-Aging & More',
    tagline: 'Clinical Bio-Active & Radiant Glow Facials',
    image: skinCareImg,
    startingPrice: '₹1,999',
    treatmentCount: '4 TREATMENTS',
    icon: <LotusIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  },
  {
    id: 'hair-care',
    categoryKey: 'hair',
    title: 'Hair Care',
    subtitle: 'Haircuts, Styling, Spa, Smoothening & More',
    tagline: 'Architectural Cuts, Balayage & Keratin Infusion',
    image: hairCareImg,
    startingPrice: '₹1,499',
    treatmentCount: '5 TREATMENTS',
    icon: <HairShearsIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  },
  {
    id: 'nail-care',
    categoryKey: 'nails',
    title: 'Nail Care',
    subtitle: 'Manicure, Pedicure, Nail Art & More',
    tagline: 'Russian BIAB, Couture Extensions & Spa Pedicures',
    image: nailCareImg,
    startingPrice: '₹999',
    treatmentCount: '4 TREATMENTS',
    icon: <NailCareIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  },
  {
    id: 'make-up',
    categoryKey: 'makeup',
    title: 'Make Up',
    subtitle: 'Bridal, Party, HD Makeup & More',
    tagline: 'Haute Bridal Glamour, Party HD & Editorial Looks',
    image: makeUpImg,
    startingPrice: '₹3,999',
    treatmentCount: '4 TREATMENTS',
    icon: <MakeUpBrushIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />
  }
];

export function ServicesSection({ onSelectService, onNavigate }) {
  const navigate = useNavigate();

  const handleCardClick = (categoryKey) => {
    navigate(`/services#category-${categoryKey}`);
  };

  const handleViewAll = (e) => {
    e.preventDefault();
    navigate('/services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white py-6 sm:py-10 scroll-mt-20" id="services">
      <span id="curated-services" className="sr-only" aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header: Perfectly Centered Eyebrow & Title */}
        <div className="mb-5 sm:mb-8 text-center">
          <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            OUR SERVICES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight">
            Our Services
          </h2>
        </div>

        {/* 4 Core Services Grid: 2x2 Grid on Mobile/Tablet, 4 Columns on Large Desktop */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-5 lg:gap-5">
          {SERVICE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.categoryKey)}
              className="group relative bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl border border-[#F0CDD7]/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer w-full"
            >
              {/* Card Image Banner */}
              <div className="relative w-full h-32 xs:h-36 sm:h-48 md:h-52 bg-[#FFF3F6] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                {/* Treatment Count Badge matching Tour Badge styling */}
                <span className="absolute top-2 right-2 xs:top-2.5 xs:right-2.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-medium px-2 xs:px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none select-none">
                  {card.treatmentCount}
                </span>
              </div>

              {/* Card Details: Overlapping Icon Badge + Title, Subtitle, Starting Price, Reserve Category */}
              <div className="pt-0 pb-3 sm:pb-4 px-2.5 xs:px-3 sm:px-4 flex flex-col flex-1 justify-between bg-white relative z-10">
                {/* 100% Fully Visible Circular Badge Overlapping Image Boundary */}
                <div className="-mt-4 xs:-mt-4.5 sm:-mt-6 mb-1 xs:mb-1.5 w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border border-[#F0CDD7] flex items-center justify-center z-20 transition-transform duration-300 group-hover:scale-110">
                  <div className="scale-75 xs:scale-85 sm:scale-100 flex items-center justify-center text-[#D6204E]">
                    {card.icon}
                  </div>
                </div>

                <div>
                  <div className="mb-0.5 xs:mb-1">
                    <h3 className="font-bold text-xs xs:text-sm sm:text-base lg:text-lg text-deep-espresso group-hover:text-[#D6204E] transition-colors leading-tight truncate">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-[9.5px] xs:text-[10.5px] sm:text-xs text-[#7A6B70] leading-tight mb-2 sm:mb-3 line-clamp-1 xs:line-clamp-2 min-h-[1.2em] sm:min-h-[2.4em]">
                    {card.subtitle}
                  </p>

                  {/* Starting Price: ALWAYS on One Single Line */}
                  <div className="mb-2 xs:mb-3 flex flex-row items-baseline gap-1 xs:gap-1.5 whitespace-nowrap">
                    <span className="text-[9px] xs:text-[10px] sm:text-xs text-[#7A6B70] font-medium leading-none">
                      Starting from
                    </span>
                    <span className="font-sans font-price text-xs xs:text-sm sm:text-base lg:text-lg font-bold text-[#D6204E] leading-none">
                      {card.startingPrice}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card.categoryKey);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] text-white text-[9px] xs:text-[10px] sm:text-[11px] font-medium py-1 xs:py-1.5 sm:py-2 px-2 xs:px-2.5 rounded-full shadow-2xs hover:shadow-sm transition-all active:scale-95 cursor-pointer mt-0.5 sm:mt-1 whitespace-nowrap"
                >
                  <span>Reserve Chair</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated Page Link / CTA */}
        {/* <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleViewAll}
            className="inline-flex min-h-[46px] sm:min-h-[50px] items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] px-7 sm:px-10 py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white shadow-md shadow-[#D6204E]/25 hover:shadow-lg hover:shadow-[#D6204E]/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer group whitespace-nowrap"
          >
            <span className="sm:hidden">Explore All Services</span>
            <span className="hidden sm:inline">Explore Complete Services Menu</span>
            <ArrowRight className="w-4 h-4 text-white shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div> */}
      </div>
    </section>
  );
}
