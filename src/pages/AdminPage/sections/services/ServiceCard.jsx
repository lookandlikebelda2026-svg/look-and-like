import React, { useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Tag,
  ImageIcon,
} from 'lucide-react';
import {
  LotusIcon,
  HairShearsIcon,
  NailCareIcon,
  MakeUpBrushIcon,
  SpaWellnessIcon,
} from '../../../../components/icons';
import skinCareImg from '../../../../asset/services/service-skin.png';
import hairCareImg from '../../../../asset/services/service-hair.png';
import nailCareImg from '../../../../asset/services/service-nails.png';
import makeUpImg from '../../../../asset/services/service-makeup.png';
import spaImg from '../../../../asset/services/service-spa.png';

function getServiceIcon(iconTypeOrKey, className = "w-3 h-3 text-[#D6204E]") {
  const key = String(iconTypeOrKey || '').toLowerCase();
  if (key.includes('hair') || key.includes('cut') || key.includes('shears')) {
    return <HairShearsIcon className={className} />;
  }
  if (key.includes('nail')) {
    return <NailCareIcon className={className} />;
  }
  if (key.includes('makeup') || key.includes('make-up') || key.includes('brush') || key.includes('bridal')) {
    return <MakeUpBrushIcon className={className} />;
  }
  if (key.includes('spa') || key.includes('wellness') || key.includes('massage')) {
    return <SpaWellnessIcon className={className} />;
  }
  if (key.includes('sparkles')) {
    return <Sparkles className={className} />;
  }
  return <LotusIcon className={className} />;
}

function getDefaultImage(iconTypeOrKey) {
  const key = String(iconTypeOrKey || '').toLowerCase();
  if (key.includes('hair') || key.includes('shears')) return hairCareImg;
  if (key.includes('nail')) return nailCareImg;
  if (key.includes('makeup') || key.includes('make-up') || key.includes('bridal')) return makeUpImg;
  if (key.includes('spa')) return spaImg;
  return skinCareImg;
}

/**
 * ServiceCard Component
 * Displays a full Service (e.g. Hair Care) with its arranged Plans and Subplans according to the Service hierarchy.
 */
export function ServiceCard({
  service,
  index,
  totalCount,
  onMove,
  onEdit,
  onDelete,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Normalize plans array
  const rawPlans = service.plans || service.pricePlans || [];
  const plans = rawPlans.map((p, pIdx) => {
    const rawImages = p.images || p.photos || [];
    const images = rawImages.map((img) => (typeof img === 'string' ? { url: img, alt: p.name } : img));
    const subplans = Array.isArray(p.subplans)
      ? p.subplans
      : p.price
      ? [
          {
            id: `sub-${p.id || pIdx}-basic`,
            name: 'Standard',
            price: Number(String(p.price).replace(/[^0-9.]/g, '')) || 0,
          },
        ]
      : [];

    let startingPrice = Number(p.startingPrice);
    if (isNaN(startingPrice) || startingPrice <= 0) {
      const prices = subplans.map((s) => s.price).filter((pr) => typeof pr === 'number' && pr > 0);
      startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
    }

    return {
      id: p.id || `plan-${pIdx}`,
      name: p.name || `Plan ${pIdx + 1}`,
      description: p.description || p.desc || '',
      images,
      startingPrice,
      subplans,
    };
  });

  // Normalize service images
  const serviceImages = Array.isArray(service.images)
    ? service.images.map((img) => (typeof img === 'string' ? { url: img, alt: service.name } : img))
    : service.imageUrl
    ? [{ url: service.imageUrl, alt: service.name }]
    : [];

  const primaryImage =
    serviceImages[0]?.url ||
    service.imageUrl ||
    getDefaultImage(service.iconType || service.key || service.name);

  // Calculate starting price
  let startingPriceDisplay = '';
  const numStartingPrice = Number(service.startingPrice);
  if (!isNaN(numStartingPrice) && numStartingPrice > 0) {
    startingPriceDisplay = `₹${numStartingPrice.toLocaleString('en-IN')}`;
  } else if (plans.length > 0) {
    const allPrices = plans
      .map((p) => p.startingPrice)
      .filter((pr) => typeof pr === 'number' && pr > 0);
    if (allPrices.length > 0) {
      startingPriceDisplay = `₹${Math.min(...allPrices).toLocaleString('en-IN')}`;
    }
  }

  // Count total subplans across plans
  const totalSubplansCount = plans.reduce((acc, p) => acc + (p.subplans?.length || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Top Banner / Card Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-white via-[#FFF9FA] to-white border-b border-stone-100 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Cover image with circular Category Icon badge */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-[#F0CDD7] shrink-0 bg-[#FFF3F6] shadow-2xs">
            <img
              src={primaryImage}
              alt={service.name}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = getDefaultImage(service.name);
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#F0CDD7] shadow-xs flex items-center justify-center text-[#D6204E]">
              {getServiceIcon(service.iconType || service.key || service.name, "w-3.5 h-3.5 text-[#D6204E]")}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
                Service #{index + 1}
              </span>
              <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Layers className="w-3 h-3 text-stone-500" />
                {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
              </span>
              {totalSubplansCount > 0 && (
                <span className="text-[11px] font-medium text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full">
                  {totalSubplansCount} {totalSubplansCount === 1 ? 'Subplan option' : 'Subplan options'}
                </span>
              )}
              {startingPriceDisplay && (
                <span className="text-[11px] font-bold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2.5 py-0.5 rounded-full">
                  Starting from {startingPriceDisplay}
                </span>
              )}
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-deep-espresso truncate">
              {service.name}
            </h3>

            {(service.description || service.subtitle) && (
              <p className="text-xs text-[#7A6B70] mt-0.5 line-clamp-2 max-w-2xl">
                {service.description || service.subtitle}
              </p>
            )}

            {/* Service Images Mini Strip (if > 1 image) */}
            {serviceImages.length > 1 && (
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[10px] uppercase font-bold text-stone-400 mr-1 flex items-center gap-1 shrink-0">
                  <ImageIcon className="w-3 h-3" />
                  Gallery ({serviceImages.length}):
                </span>
                {serviceImages.map((img, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="w-7 h-7 rounded-lg overflow-hidden border border-[#F0CDD7] bg-[#FFF3F6] shrink-0"
                    title={img.alt || `Service image ${imgIdx + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || ''}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Reorder Buttons */}
          <div className="flex items-center gap-0.5 bg-[#FAF8F5] rounded-xl p-1 border border-stone-200">
            <button
              type="button"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              className="p-1.5 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
              title="Move Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMove(index, 1)}
              disabled={index === totalCount - 1}
              className="p-1.5 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
              title="Move Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Edit Service & Plans */}
          <button
            type="button"
            onClick={() => onEdit(service, index)}
            className="p-2 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-xl border border-stone-200 transition-colors cursor-pointer"
            title="Edit Service & Plans"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Service */}
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-stone-200 transition-colors cursor-pointer"
            title="Delete Service"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Toggle Expand Plans Accordion */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-stone-500 hover:text-deep-espresso hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors cursor-pointer ml-1"
            title={isExpanded ? 'Collapse Plans' : 'Expand Plans'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Plans Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D6204E]" />
              Plans &amp; Subplan Pricing Tiers
            </h4>
            <span className="text-[11px] text-stone-400">
              {plans.length} {plans.length === 1 ? 'configured plan' : 'configured plans'}
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-6 text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              No plans configured for this service yet. Click Edit to add plans and subplans.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {plans.map((plan, pIdx) => (
                <div
                  key={plan.id || pIdx}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-[#F0CDD7] flex flex-col justify-between transition-all shadow-2xs"
                >
                  <div className="space-y-2">
                    {/* Header: Name and Starting Price */}
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-bold text-deep-espresso leading-snug">
                        {plan.name}
                      </h5>
                      <span className="font-sans font-price text-xs font-bold text-[#D6204E] bg-white px-2.5 py-0.5 rounded-full border border-[#F0CDD7] whitespace-nowrap shadow-2xs">
                        From ₹{Number(plan.startingPrice || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Short Description */}
                    {plan.description && (
                      <p className="text-xs text-[#7A6B70] leading-snug line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                    {/* Plan Images Gallery Preview */}
                    {plan.images && plan.images.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                        {plan.images.map((img, imgI) => (
                          <div
                            key={imgI}
                            className="w-11 h-11 rounded-lg overflow-hidden border border-stone-200 bg-white shrink-0 shadow-2xs"
                            title={img.alt || `Plan photo ${imgI + 1}`}
                          >
                            <img
                              src={img.url}
                              alt={img.alt || ''}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                        <span className="text-[10px] text-stone-400 font-medium ml-1 whitespace-nowrap">
                          {plan.images.length} {plan.images.length === 1 ? 'photo' : 'photos'}
                        </span>
                      </div>
                    )}

                    {/* Subplans List */}
                    <div className="pt-2.5 border-t border-stone-200/80">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#D6204E]" />
                          Subplans ({plan.subplans?.length || 0})
                        </span>
                      </div>

                      {plan.subplans && plan.subplans.length > 0 ? (
                        <div className="space-y-1.5">
                          {plan.subplans.map((sub, sIdx) => (
                            <div
                              key={sub.id || sIdx}
                              className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs"
                            >
                              <span className="font-medium text-deep-espresso truncate pr-2">
                                {sub.name}
                              </span>
                              <span className="font-bold text-[#D6204E] shrink-0 font-sans font-price">
                                ₹{Number(sub.price || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-stone-400 italic">No subplans added</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ServiceCard;
