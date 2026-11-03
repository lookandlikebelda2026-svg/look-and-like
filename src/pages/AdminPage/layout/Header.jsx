import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ExternalLink, LogOut } from 'lucide-react';

/**
 * Header Component
 * Sticky top navigation header (height: 64px) with viewport menu toggles,
 * dynamic title, live website shortcut, and admin status badge.
 * Inspired by modern SaaS dashboard architectures.
 */
export function Header({ setDrawerOpen, title = 'Management Studio', handleLogout }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#F0CDD7] flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 shrink-0 shadow-2xs">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Menu Drawer Toggle */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden flex items-center justify-center text-deep-espresso cursor-pointer hover:bg-[#FFF3F6] hover:text-[#D6204E] p-2 rounded-xl border border-stone-200 transition-colors shrink-0"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Section Page Title */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl lg:text-2xl font-serif font-bold text-deep-espresso tracking-tight truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>

    
    </header>
  );
}

export default Header;
