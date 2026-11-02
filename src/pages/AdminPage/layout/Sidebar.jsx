import React from 'react';

/**
 * Responsive Sidebar Navigation for Admin Layout
 */
export function Sidebar({ items = [], activeTab, onTabChange }) {
  if (!items || items.length === 0) return null;

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange?.(item.id)}
            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-white text-[#D6204E] border border-[#F0CDD7] shadow-xs'
                : 'text-[#6B5A60] hover:text-deep-espresso hover:bg-white/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && item.count !== null && (
              <span className="text-[11px] text-[#7A6B70] font-normal">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}

export default Sidebar;
