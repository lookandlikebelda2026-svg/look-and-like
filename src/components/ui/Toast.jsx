import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Toast feedback notification
 */
export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="text-whatsapp-green" size={20} />,
    error: <AlertCircle className="text-error" size={20} />,
    info: <Info className="text-terracotta-rose" size={20} />
  };

  return (
    <div
      className={cn(
        "fixed top-4 sm:top-auto sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center gap-3 bg-white/95 border border-border-warm px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-top-4 sm:slide-in-from-bottom-4 duration-300 sm:max-w-md",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="shrink-0">{icons[type] || icons.info}</div>
      <p className="font-body-sm text-xs sm:text-body-sm text-deep-espresso font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss message"
        className="text-on-surface-variant hover:text-deep-espresso ml-1 sm:ml-2 p-1 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
}
