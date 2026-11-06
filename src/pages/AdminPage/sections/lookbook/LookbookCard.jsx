import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

/**
 * Individual Lookbook Editorial Card in the Management Panel
 */
export function LookbookCard({
  look,
  index,
  totalCount,
  onMove,
  onDelete,
}) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (!look.imageUrl) {
      setDimensions(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setDimensions(`${img.naturalWidth}×${img.naturalHeight}`);
    };
    img.onerror = () => {
      setDimensions(null);
    };
    img.src = look.imageUrl;
  }, [look.imageUrl]);

  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-border-warm/70 shadow-2xs hover:shadow-xs overflow-hidden flex flex-col group transition-all">
      {/* Image Thumbnail */}
      <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-stone-100">
        <img
          src={look.imageUrl}
          alt={look.alt || 'Lookbook Look'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x500/F0CDD7/D6204E?text=Missing+Image';
          }}
        />
        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/90 backdrop-blur-xs text-deep-espresso border border-border-warm shadow-2xs">
          #{index + 1}
        </div>

        {/* Pixel Size Badge */}
        {dimensions && (
          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-medium bg-black/75 text-white backdrop-blur-xs">
            {dimensions}
          </div>
        )}

        {/* Quick Action Overlay (Reorder Up/Down) */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-xs rounded-full p-0.5 border border-border-warm shadow-2xs">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Earlier"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === totalCount - 1}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Later"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2 sm:p-2.5 flex items-center justify-between text-xs">
        <span className="text-[11px] sm:text-xs font-semibold text-deep-espresso">
          Look #{index + 1}
        </span>

        <button
          type="button"
          onClick={() => onDelete(index)}
          className="p-1 sm:p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
          title="Delete look"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default LookbookCard;
