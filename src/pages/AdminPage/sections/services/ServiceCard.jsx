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
} from 'lucide-react';
import {
  LotusIcon,
  HairShearsIcon,
  NailCareIcon,
  MakeUpBrushIcon,
} from '../../../../components/icons';
import skinCareImg from '../../../../asset/services/service-skin.png';
import hairCareImg from '../../../../asset/services/service-hair.png';
import nailCareImg from '../../../../asset/services/service-nails.png';
import makeUpImg from '../../../../asset/services/service-makeup.png';

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
  return <LotusIcon className={className} />;
}

function getDefaultImage(iconTypeOrKey) {
  const key = String(iconTypeOrKey || '').toLowerCase();
  if (key.includes('hair') || key.includes('shears')) return hairCareImg;
  if (key.includes('nail')) return nailCareImg;
  if (key.includes('makeup') || key.includes('make-up') || key.includes('bridal')) return makeUpImg;
  return skinCareImg;
}

/**
 * ServiceCard Component
 * Displays a 1-of-4 Service Category with its 1 image and arranged Plans and Subplans (no images for plans/subplans).
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
      images: [],
      startingPrice,
      subplans,
    };
  });

  // Exactly 1 primary image for the main category
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
    const allPrices = plans.map((p) => p.startingPrice).filter((pr) => typeof pr === 'number' && pr > 0);
    if (allPrices.length > 0) {
      startingPriceDisplay = `₹${Math.min(...allPrices).toLocaleString('en-IN')}`;
    }
  }

  const totalSubplansCount = plans.reduce(
    (acc, p) => acc + (p.subplans?.length || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col">
      {/* Top Banner / Card Header */}
      <div className="p-3 sm:p-5 bg-gradient-to-r from-white via-[#FFF9FA] to-white border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Exactly 1 Category Cover Image */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[#F0CDD7] shrink-0 bg-[#FFF3F6] shadow-2xs">
            <img
              src={primaryImage}
              alt={service.name}
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = getDefaultImage(service.name);
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#F0CDD7] shadow-xs flex items-center justify-center text-[#D6204E]">
              {getServiceIcon(service.iconType || service.key || service.name, "w-3 h-3 text-[#D6204E]")}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#FFF3F6] text-[#D6204E] border border-[#F0CDD7]">
                #{index + 1}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Layers className="w-3 h-3 text-stone-500" />
                {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
              </span>
              {startingPriceDisplay && (
                <span className="text-[10px] sm:text-[11px] font-bold text-[#D6204E] bg-[#FFF3F6] border border-[#F0CDD7] px-2 py-0.5 rounded-full">
                  From {startingPriceDisplay}
                </span>
              )}
              {totalSubplansCount > 0 && (
                <span className="hidden sm:inline-flex text-[11px] font-medium text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full">
                  {totalSubplansCount} options
                </span>
              )}
            </div>

            <h3 className="font-serif text-sm sm:text-lg font-bold text-deep-espresso truncate">
              {service.name}
            </h3>

            {(service.description || service.subtitle) && (
              <p className="text-xs text-[#7A6B70] mt-0.5 line-clamp-1 sm:line-clamp-2">
                {service.description || service.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Card Controls */}
        <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
          {/* Move Up */}
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1.5 text-stone-500 hover:text-deep-espresso hover:bg-stone-100 disabled:opacity-25 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            title="Move category up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === totalCount - 1}
            className="p-1.5 text-stone-500 hover:text-deep-espresso hover:bg-stone-100 disabled:opacity-25 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            title="Move category down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Edit Service */}
          <button
            type="button"
            onClick={() => onEdit(service, index)}
            className="p-1.5 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-lg border border-stone-200 transition-colors cursor-pointer"
            title="Edit Service"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Service */}
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            title="Delete Service"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Expand Plans Accordion */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-stone-500 hover:text-deep-espresso hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Plans' : 'Expand Plans'}
          >
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Plans Body (No images for plans/subplans) */}
      {isExpanded && (
        <div className="p-3 sm:p-5 bg-white space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-500 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#D6204E]" />
              Plans &amp; Pricing
            </h4>
            <span className="text-[10px] text-stone-400">
              {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-4 text-xs text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              No plans yet. Click Edit to add plans.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
              {plans.map((plan, pIdx) => (
                <div
                  key={plan.id || pIdx}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 hover:border-[#F0CDD7] flex flex-col justify-between transition-all shadow-2xs"
                >
                  <div className="space-y-1.5">
                    {/* Header: Name and Starting Price */}
                    <div className="flex items-start justify-between gap-1.5">
                      <h5 className="text-xs sm:text-sm font-bold text-deep-espresso leading-snug truncate">
                        {plan.name}
                      </h5>
                      <span className="font-sans font-price text-[11px] font-bold text-[#D6204E] bg-white px-2 py-0.5 rounded-full border border-[#F0CDD7] whitespace-nowrap shrink-0 shadow-2xs">
                        From ₹{Number(plan.startingPrice || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Short Description */}
                    {plan.description && (
                      <p className="text-[11px] text-[#7A6B70] leading-snug line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                    {/* Subplans List */}
                    <div className="pt-2 border-t border-stone-200/80">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-stone-500 mb-1">
                        <span className="flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-[#D6204E]" />
                          Subplans ({plan.subplans?.length || 0})
                        </span>
                      </div>

                      {plan.subplans && plan.subplans.length > 0 ? (
                        <div className="space-y-1">
                          {plan.subplans.map((sub, sIdx) => (
                            <div
                              key={sub.id || sIdx}
                              className="flex items-center justify-between px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[11px]"
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
                        <p className="text-[10px] text-stone-400 italic">No subplans</p>
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
