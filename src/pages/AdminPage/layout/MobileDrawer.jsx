import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import { LOGO_URL } from '../../../constants/navigation';

/**
 * MobileDrawer Component
 * Off-canvas sliding drawer for mobile viewport sizes (< 1024px).
 * Inspired by modern SaaS dashboard layouts with backdrop blur,
 * full navigation list, count badges, and admin profile actions.
 */
export function MobileDrawer({
  drawerOpen,
  setDrawerOpen,
  items = [],
  activeTab,
  onTabChange,
  currentUser,
  handleLogout,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
        drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!drawerOpen}
    >
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 bottom-0 left-0 bg-white w-[285px] max-w-[85vw] border-r border-[#F0CDD7] flex flex-col justify-between transition-transform duration-300 shadow-2xl ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Header with Logo & Dismiss */}
        <div>
          <div className="px-5 py-4 border-b border-[#F0CDD7] flex items-center justify-between">
            <div
              onClick={() => {
                navigate('/');
                setDrawerOpen(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="View Storefront"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="font-serif font-bold text-base text-deep-espresso tracking-tight block truncate group-hover:text-[#D6204E] transition-colors">
                  Look &amp; Like
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6204E] bg-[#FFF3F6] px-1.5 py-0.5 rounded-full border border-[#F0CDD7]/60">
                  Admin Studio
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#FFF3F6] text-stone-500 hover:text-[#D6204E] border border-stone-200 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-3 mb-2">
              Management Sections
            </span>

            <nav className="space-y-1" aria-label="Mobile Drawer Navigation">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange?.(item.id);
                      setDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-xs font-semibold ${
                      isActive
                        ? 'bg-[#FFF3F6] text-[#D6204E] font-bold border border-[#F0CDD7] shadow-xs'
                        : 'text-stone-600 hover:bg-[#FAF8F5] hover:text-deep-espresso border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-white text-[#D6204E] shadow-2xs'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count !== null && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-[#D6204E] text-white font-bold'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#F0CDD7] space-y-2.5 bg-[#FAF8F5]/60">
          {/* View Live Website */}
          <button
            type="button"
            onClick={() => {
              navigate('/');
              setDrawerOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-deep-espresso hover:text-[#D6204E] bg-white border border-[#F0CDD7] transition-all cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>

          {/* Current Admin Account snippet */}
          <div className="p-2.5 rounded-xl bg-white border border-[#F0CDD7]/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#D6204E] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-deep-espresso truncate">
                {currentUser?.displayName || 'Administrator'}
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {currentUser?.email || 'admin@lookandlike.com'}
              </p>
            </div>
          </div>

          {/* Logout Action */}
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileDrawer;

