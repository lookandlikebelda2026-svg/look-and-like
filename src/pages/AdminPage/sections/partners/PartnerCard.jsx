import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Briefcase } from 'lucide-react';
import { getOptimizedImageUrl } from '../../../../services/imagekit';

/**
 * Individual Brand Partner Card in the Management Panel
 */
export function PartnerCard({
  partner,
  index,
  totalCount,
  onMove,
  onDelete,
}) {
  const logoUrl = getOptimizedImageUrl(partner.logoUrl, { width: 160, height: 80, quality: 65, format: 'webp' }) || partner.logoUrl;

  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-border-warm/70 shadow-2xs hover:shadow-xs overflow-hidden flex flex-col group transition-all">
      {/* Logo Showcase */}
      <div className="relative h-20 sm:h-24 w-full overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFE] to-white border-b border-[#F0CDD7]/60 flex items-center justify-center p-2 sm:p-3">
        {partner.logoUrl ? (
          <img
            src={logoUrl}
            alt="Brand Partner Logo"
            className="max-h-7 sm:max-h-9 max-w-[80px] sm:max-w-[100px] object-contain filter contrast-110 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}

        {/* Fallback */}
        <div className={`${partner.logoUrl ? 'hidden' : 'flex'} flex-col items-center justify-center text-stone-400 gap-1`}>
          <Briefcase className="w-6 h-6 opacity-40" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Partner #{index + 1}</span>
        </div>

        {/* Order Badge */}
        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/95 backdrop-blur-xs text-deep-espresso border border-border-warm shadow-2xs">
          #{index + 1}
        </div>

        {/* Reorder Overlay */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-xs rounded-full p-0.5 border border-border-warm shadow-2xs">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Left"
          >
            <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === totalCount - 1}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Right"
          >
            <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
          </button>
        </div>
      </div>

      {/* Details & Delete Action */}
      <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5 bg-white">
        <span className="text-[11px] sm:text-xs font-semibold text-deep-espresso">
          Partner #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="p-1 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
          title="Delete partner"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default PartnerCard;
