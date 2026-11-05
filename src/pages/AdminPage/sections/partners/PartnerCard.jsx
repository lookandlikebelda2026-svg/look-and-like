import React from 'react';
import { ArrowUp, ArrowDown, Edit3, Trash2, ExternalLink, Briefcase } from 'lucide-react';

/**
 * Individual Brand Partner Card in the Management Panel
 */
export function PartnerCard({
  partner,
  index,
  totalCount,
  onMove,
  onEdit,
  onDelete,
}) {
  const brandName = partner.name || 'Brand Partner';

  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-border-warm/70 shadow-2xs hover:shadow-xs overflow-hidden flex flex-col group transition-all">
      {/* Logo Showcase */}
      <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFE] to-white border-b border-[#F0CDD7]/60 flex items-center justify-center p-3 sm:p-4">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={brandName}
            className="max-h-12 sm:max-h-16 max-w-[120px] sm:max-w-[150px] object-contain filter contrast-110 transition-transform duration-300 group-hover:scale-105"
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
          <span className="text-[9px] font-semibold uppercase tracking-wider">{brandName}</span>
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

      {/* Details & Actions */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 gap-1.5 bg-white">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-deep-espresso uppercase tracking-wider truncate leading-tight">
            {brandName}
          </h4>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-xs">
          {partner.logoUrl ? (
            <a
              href={partner.logoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-stone-500 hover:text-[#D6204E] flex items-center gap-1 font-medium transition-colors"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Logo</span>
            </a>
          ) : (
            <span className="text-[10px] text-stone-400">No URL</span>
          )}

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onEdit(partner, index)}
              className="p-1 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-md transition-colors cursor-pointer"
              title="Edit partner"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="p-1 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              title="Delete partner"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerCard;
