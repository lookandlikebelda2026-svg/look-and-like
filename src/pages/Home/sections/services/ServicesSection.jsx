import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContentStorage } from '../../../../services/contentStorage';
import { ServicesSkeleton } from '../../../../components/common/Skeleton';
import skinCareImg from '../../../../asset/services/service-skin.png';
import hairCareImg from '../../../../asset/services/service-hair.png';
import nailCareImg from '../../../../asset/services/service-nails.png';
import makeUpImg from '../../../../asset/services/service-makeup.png';
import {
  LotusIcon,
  HairShearsIcon,
  NailCareIcon,
  MakeUpBrushIcon,
} from '../../../../components/icons';

function getServiceIcon(nameOrKey) {
  const key = String(nameOrKey || '').toLowerCase();
  if (key.includes('hair') || key.includes('cut') || key.includes('shears')) {
    return <HairShearsIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />;
  }
  if (key.includes('nail')) {
    return <NailCareIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />;
  }
  if (key.includes('makeup') || key.includes('make-up') || key.includes('brush') || key.includes('bridal')) {
    return <MakeUpBrushIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />;
  }
  return <LotusIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#D6204E]" />;
}

function getDefaultImage(nameOrKey) {
  const key = String(nameOrKey || '').toLowerCase();
  if (key.includes('hair') || key.includes('shears')) return hairCareImg;
  if (key.includes('nail')) return nailCareImg;
  if (key.includes('makeup') || key.includes('make-up') || key.includes('bridal')) return makeUpImg;
  return skinCareImg;
}

export function ServicesSection({ onSelectService, onNavigate }) {
  const navigate = useNavigate();
  const { servicesData = [], loadingServices } = useContentStorage();

  if (loadingServices) {
    return <ServicesSkeleton />;
  }

  // If no services have been added via the Admin Panel, do not render dummy services
  if (!servicesData || servicesData.length === 0) {
    return null;
  }

  const handleCardClick = (serviceId) => {
    navigate(`/services#category-${serviceId}`);
  };

  return (
    <section className="w-full bg-white py-6 sm:py-10 scroll-mt-20" id="services">
      <span id="curated-services" className="sr-only" aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-5 sm:mb-8 text-center">
          <span className="mb-0.5 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black leading-tight">
            OUR SERVICES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-deep-espresso tracking-tight">
            Our Services
          </h2>
        </div>

        {/* 4 Main Categories Grid */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-5 lg:gap-5">
          {servicesData.map((service) => {
            const primaryImage =
              service.images?.[0]?.url ||
              getDefaultImage(service.name);

            const plansCount = service.plans?.length || 0;
            const startingPrice = service.startingPrice
              ? `₹${Number(service.startingPrice).toLocaleString('en-IN')}`
              : '';

            return (
              <div
                key={service.id}
                onClick={() => handleCardClick(service.id)}
                className="group relative bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl border border-[#F0CDD7]/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer w-full"
              >
                {/* Single Card Image Banner */}
                <div className="relative w-full h-32 xs:h-36 sm:h-48 md:h-52 bg-[#FFF3F6] overflow-hidden">
                  <img
                    src={primaryImage}
                    alt={service.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = getDefaultImage(service.name);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                  {plansCount > 0 && (
                    <span className="absolute top-2 right-2 xs:top-2.5 xs:right-2.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] font-medium px-2 xs:px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none select-none">
                      {plansCount} {plansCount === 1 ? 'PLAN' : 'PLANS'}
                    </span>
                  )}
                </div>

                {/* Card Details */}
                <div className="pt-0 pb-3 sm:pb-4 px-2.5 xs:px-3 sm:px-4 flex flex-col flex-1 justify-between bg-white relative z-10">
                  {/* Category Circular Badge */}
                  <div className="-mt-4 xs:-mt-4.5 sm:-mt-6 mb-1 xs:mb-1.5 w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border border-[#F0CDD7] flex items-center justify-center z-20 transition-transform duration-300 group-hover:scale-110">
                    <div className="scale-75 xs:scale-85 sm:scale-100 flex items-center justify-center text-[#D6204E]">
                      {getServiceIcon(service.name)}
                    </div>
                  </div>

                  <div>
                    <div className="mb-0.5 xs:mb-1">
                      <h3 className="font-bold text-xs xs:text-sm sm:text-base lg:text-lg text-deep-espresso group-hover:text-[#D6204E] transition-colors leading-tight truncate">
                        {service.name}
                      </h3>
                    </div>

                    <p className="text-[9.5px] xs:text-[10.5px] sm:text-xs text-[#7A6B70] leading-tight mb-2 sm:mb-3 line-clamp-1 xs:line-clamp-2 min-h-[1.2em] sm:min-h-[2.4em]">
                      {service.description || 'Custom tailored parlour treatments'}
                    </p>

                    {startingPrice && (
                      <div className="mb-2 xs:mb-3 flex flex-row items-baseline gap-1 xs:gap-1.5 whitespace-nowrap">
                        <span className="text-[9px] xs:text-[10px] sm:text-xs text-[#7A6B70] font-medium leading-none">
                          Starting from
                        </span>
                        <span className="font-sans font-price text-xs xs:text-sm sm:text-base lg:text-lg font-bold text-[#D6204E] leading-none">
                          {startingPrice}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Explore Link */}
                  <div className="pt-1.5 xs:pt-2 border-t border-[#F0CDD7]/50 flex items-center justify-between text-[#D6204E] font-semibold text-[10px] xs:text-[11px] sm:text-xs group-hover:underline">
                    <span>View Menu &amp; Plans</span>
                    <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
