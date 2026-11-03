import React from 'react';

/**
 * BottomNavigation Component
 * Mobile-only sticky bottom navigation bar (height: 64px) with rounded top,
 * touch-friendly tabs, active indicator, and badge counts.
 * Inspired by modern SaaS mobile layout conventions.
 */
export function BottomNav({ items = [], activeTab, onTabChange }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Mobile Admin Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0CDD7] h-16 rounded-t-2xl shadow-[0_-6px_20px_rgba(42,31,27,0.08)] flex justify-around items-center px-2 lg:hidden select-none pb-[calc(env(safe-area-inset-bottom,0px))]"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const label = item.shortLabel || item.label;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange?.(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all cursor-pointer active:scale-95 ${
              isActive ? 'text-[#D6204E] font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className="relative">
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#FFF3F6] border border-[#F0CDD7]' : ''
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'scale-110 text-[#D6204E]' : 'text-stone-500'
                    }`}
                  />
                )}
              </div>

              {/* Count badge */}
              {item.count !== undefined && item.count !== null && item.count > 0 && (
                <span className="absolute -top-1 -right-1.5 px-1 min-w-[14px] h-[14px] rounded-full bg-[#D6204E] text-white text-[9px] font-bold font-mono flex items-center justify-center border border-white">
                  {item.count}
                </span>
              )}
            </div>

            <span className="text-[10px] font-medium tracking-tight truncate max-w-[70px]">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
