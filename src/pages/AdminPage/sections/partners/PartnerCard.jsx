import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Edit3, Trash2, ExternalLink, Briefcase } from 'lucide-react';

/**
 * Individual Brand Partner Card in the Management Panel
 * Image-first layout showcasing the brand logo prominently at the top,
 * followed by brand details and action controls.
 */
export function PartnerCard({
  partner,
  index,
  totalCount,
  onMove,
  onEdit,
  onDelete,
}) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (!partner.logoUrl) {
      setDimensions(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setDimensions(`${img.naturalWidth} × ${img.naturalHeight} px`);
    };
    img.onerror = () => {
      setDimensions(null);
    };
    img.src = partner.logoUrl;
  }, [partner.logoUrl]);

  return (
    <div className="relative bg-white rounded-2xl border border-border-warm/70 shadow-xs hover:shadow-md overflow-hidden flex flex-col group transition-all">
      {/* 1. Prior Hero Logo Image Showcase */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFE] to-white border-b border-[#F0CDD7]/60 flex items-center justify-center p-4">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="max-h-16 max-w-[160px] object-contain filter contrast-110 transition-transform duration-300 group-hover:scale-108"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}

        {/* Fallback icon if logo fails or is empty */}
        <div className={`${partner.logoUrl ? 'hidden' : 'flex'} flex-col items-center justify-center text-stone-400 gap-1`}>
          <Briefcase className="w-8 h-8 opacity-40" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">{partner.name || 'Brand Logo'}</span>
        </div>

        {/* Top-Left Order Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/95 backdrop-blur-xs text-deep-espresso border border-border-warm shadow-2xs">
          Partner #{index + 1}
        </div>

    \

        {/* Quick Reorder Overlay (Top Right) */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded-full p-1 border border-border-warm shadow-2xs">
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

      {/* 2. Details & Actions Section */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5 bg-white">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-deep-espresso uppercase tracking-wider truncate leading-tight">
            {partner.name}
          </h4>
        </div>

        {/* 3. Bottom Actions Bar */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          {partner.logoUrl ? (
            <a
              href={partner.logoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-stone-500 hover:text-[#D6204E] flex items-center gap-1 font-medium transition-colors"
            >
              <span>View Logo</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ) : (
            <span className="text-[10px] text-stone-400">No URL</span>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(partner, index)}
              className="p-1.5 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-lg transition-colors cursor-pointer"
              title="Edit partner"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
