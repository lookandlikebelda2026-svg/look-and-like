import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';

/**
 * LogoutModal Component
 * Confirmation dialog before logging out of the Admin Studio.
 * Inspired by modern dashboard UX to prevent accidental session termination.
 */
export function LogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#F0CDD7] z-10 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#FFF3F6] text-stone-500 hover:text-[#D6204E] flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-3.5 shadow-2xs">
            <LogOut className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-lg font-bold text-deep-espresso">
            Confirm Sign Out
          </h3>

          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed max-w-xs">
            Are you sure you want to end your active administrative session for Look &amp; Like?
          </p>

          <div className="grid grid-cols-2 gap-2.5 w-full mt-5">
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;

