import React from 'react';
import { ArrowUp, ArrowDown, Edit3, Trash2, ExternalLink } from 'lucide-react';

/**
 * Individual Lookbook Editorial Card in the Management Panel
 */
export function LookbookCard({
  look,
  index,
  totalCount,
  onMove,
  onEdit,
  onDelete,
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-border-warm/70 shadow-xs hover:shadow-sm overflow-hidden flex flex-col group transition-all">
      {/* Image Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-stone-100">
        <img
          src={look.imageUrl}
          alt={look.alt || 'Lookbook Look'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x500/F0CDD7/D6204E?text=Missing+Image';
          }}
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 backdrop-blur-xs text-deep-espresso border border-border-warm shadow-2xs">
          Look {index + 1}
        </div>

        {/* Quick Action Overlay (Reorder Up/Down) */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs rounded-full p-1 border border-border-warm shadow-2xs">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Left/Up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === totalCount - 1}
            className="p-1 text-stone-600 hover:text-deep-espresso disabled:opacity-20 cursor-pointer"
            title="Move Right/Down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Metadata & Actions */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <p className="text-xs text-deep-espresso font-medium line-clamp-2 mb-3">
          {look.alt || 'No description provided'}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <a
            href={look.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-stone-500 hover:text-[#D6204E] flex items-center gap-1"
          >
            <span>Full URL</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(look, index)}
              className="p-1.5 text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-lg transition-colors cursor-pointer"
              title="Edit look"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete look"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LookbookCard;

