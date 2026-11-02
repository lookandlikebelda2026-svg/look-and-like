import React from 'react';

/**
 * Footer for the Management Panel Layout
 */
export function Footer({ onClose }) {
  return (
    <div className="px-5 sm:px-8 py-3.5 border-t border-border-warm bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Changes persist to browser storage and sync in real time.</span>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-deep-espresso bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer"
        >
          Done
        </button>
      )}
    </div>
  );
}

export { Footer as ManagementPanelFooter };
export default Footer;
