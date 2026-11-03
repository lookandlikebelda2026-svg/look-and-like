import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Edit3, Trash2 } from 'lucide-react';

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
    <div className="relative bg-white rounded-2xl border border-border-warm/70 shadow-xs hover:shadow-sm p-4 flex flex-col justify-between group transition-all">
      <div>
        {/* Logo Preview Tile */}
        <div className="relative h-16 w-full rounded-xl bg-[#FAF8F5] border border-border-warm/40 p-2 flex items-center justify-center mb-3">
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className="max-h-8 max-w-[110px] object-contain filter contrast-125 group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = 'block';
              }
            }}
          />
          <span className="hidden text-xs font-bold uppercase text-deep-espresso">
            {partner.name}
          </span>
          {dimensions && (
            <span className="absolute bottom-1 right-1.5 px-1 py-0.2 rounded text-[8.5px] font-mono bg-white/90 text-stone-500 border border-stone-200">
              {dimensions}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-deep-espresso uppercase truncate">
            {partner.name}
          </span>
          {partner.country && (
            <span className="text-[10px] text-[#D6204E] font-semibold uppercase tracking-wider">
              {partner.country}
            </span>
          )}
        </div>
        <p className="text-[11px] text-stone-500 line-clamp-1 mb-2">
          {partner.specialty || 'Luxury Partner'}
        </p>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Left"
          >
            <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === totalCount - 1}
            className="p-1 text-stone-500 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Right"
          >
            <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
          </button>
        </div>

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
  );
}

export default PartnerCard;

