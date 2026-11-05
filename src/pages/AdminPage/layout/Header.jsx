import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ExternalLink, ArrowLeft } from 'lucide-react';

/**
 * Header Component
 * Top navigation header with dynamic title, back button, and header actions.
 */
export function Header({
  setDrawerOpen,
  title = 'Management Studio',
  onBack,
  actions,
  handleLogout,
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F0CDD7] flex items-center justify-between px-3 sm:px-6 lg:px-8 h-14 sm:h-16 shrink-0 shadow-2xs">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* If onBack provided, render Back button; otherwise render Menu drawer trigger */}
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center text-stone-600 hover:text-deep-espresso hover:bg-[#FFF3F6] p-1.5 sm:p-2 rounded-xl border border-stone-200 transition-colors shrink-0 cursor-pointer"
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-deep-espresso" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center justify-center text-deep-espresso cursor-pointer hover:bg-[#FFF3F6] hover:text-[#D6204E] p-1.5 sm:p-2 rounded-xl border border-stone-200 transition-colors shrink-0"
            title="Open Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Section Page Title */}
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-serif font-bold text-deep-espresso tracking-tight truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right-side Actions or Live Site Link */}
      <div className="flex items-center gap-1.5 shrink-0">
        {actions ? (
          actions
        ) : (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-[#D6204E] hover:bg-[#FFF3F6] transition-colors"
            title="Open storefront in new tab"
          >
            <span className="hidden sm:inline">View Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
        )}
      </div>
    </header>
  );
}

export default Header;
