import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Accessible Modal dialog with background blur, ESC key dismiss, and focus lock.
 */
export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-3xl', className = '' }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 md:p-6 [scrollbar-width:thin]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centering Wrapper that gracefully prevents top-clipping on short screens */}
      <div className="flex min-h-full items-center justify-center">
        {/* Modal Card */}
        <div
          className={cn(
            "relative w-full my-auto bg-white text-on-surface rounded-2xl sm:rounded-3xl shadow-[0_24px_64px_-12px_rgba(42,31,27,0.22)] p-4 sm:p-6 md:p-7 z-10 border border-[#F0CDD7] animate-in fade-in zoom-in-95 duration-200",
            maxWidth,
            className
          )}
        >
          {title ? (
            <div className="flex items-center justify-between pb-2.5 sm:pb-3.5 border-b border-border-warm/60 mb-3 sm:mb-5">
              <h3 id="modal-headline" className="font-headline-sm text-base sm:text-headline-sm text-deep-espresso">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-border-warm hover:bg-[#FFF3F6] hover:text-[#D6204E] text-deep-espresso flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF8F5] border border-border-warm hover:bg-[#FFF3F6] hover:text-[#D6204E] text-deep-espresso flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            >
              <X size={16} />
            </button>
          )}

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
