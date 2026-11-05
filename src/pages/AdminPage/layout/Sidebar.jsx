import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  LogOut,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { LOGO_URL } from '../../../constants/navigation';

/**
 * Sidebar Component
 * Fixed left sidebar for desktop and tablet screens (collapsible).
 * Inspired by modern SaaS dashboard layouts with collapse/expand toggle,
 * tooltips, count badges, and admin profile actions.
 */
export function Sidebar({
  items = [],
  activeTab,
  onTabChange,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
  handleLogout,
}) {
  const navigate = useNavigate();

  return (
    <aside
      className={`
        hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-[#F0CDD7] transition-all duration-300 select-none shadow-xs
        ${sidebarCollapsed ? 'w-20' : 'w-[260px]'}
      `}
    >
      {/* Top Header: Logo & Expand/Collapse Button */}
      <div
        className={`border-b border-[#F0CDD7] flex items-center h-16 shrink-0 transition-all ${
          sidebarCollapsed ? 'justify-center px-3' : 'justify-between px-5'
        }`}
      >
        {!sidebarCollapsed ? (
          <>
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer overflow-hidden min-w-0 group"
              title="View Storefront"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="font-serif font-bold text-sm xl:text-base text-deep-espresso tracking-tight block truncate group-hover:text-[#D6204E] transition-colors leading-none">
                  Look &amp; Like
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#D6204E] bg-[#FFF3F6] px-1.5 py-0.2 rounded-full border border-[#F0CDD7]/60 inline-block mt-0.5">
                  Studio
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarCollapsed(true)}
              className="p-1.5 text-stone-400 hover:text-[#D6204E] hover:bg-[#FFF3F6] rounded-xl transition-colors cursor-pointer shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#FFF3F6] rounded-xl transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <img src={LOGO_URL} alt="Look & Like" className="w-full h-full object-contain" />
            </div>
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!sidebarCollapsed && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block px-3 mb-2">
            Management
          </span>
        )}

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange?.(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-3'
              } rounded-2xl transition-all duration-200 cursor-pointer text-xs font-semibold ${
                isActive
                  ? 'bg-[#FFF3F6] text-[#D6204E] font-bold border border-[#F0CDD7] shadow-xs'
                  : 'text-stone-600 hover:bg-[#FAF8F5] hover:text-deep-espresso border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white text-[#D6204E] shadow-2xs'
                      : 'bg-stone-100/70 text-stone-500 group-hover:bg-white group-hover:text-deep-espresso'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </div>

                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

           
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#F0CDD7] space-y-1.5 shrink-0 bg-[#FAF8F5]/40">
        {/* View Live Website Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          title={sidebarCollapsed ? 'View Live Website' : undefined}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2.5 px-3 py-2.5'
          } rounded-xl text-xs font-semibold text-deep-espresso hover:text-[#D6204E] bg-white hover:bg-[#FFF8FA] border border-[#F0CDD7] transition-all cursor-pointer shadow-2xs`}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {!sidebarCollapsed && (
            <span className="truncate">View Live Website</span>
          )}
        </button>

        {/* Current Admin Account Card */}
        <div
          title={sidebarCollapsed ? `${currentUser?.displayName || 'Admin'} (${currentUser?.email || 'admin@lookandlike.com'})` : undefined}
          className={`p-2 rounded-xl bg-white border border-[#F0CDD7]/80 flex items-center ${
            sidebarCollapsed ? 'justify-center' : 'justify-between gap-2'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#D6204E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-deep-espresso truncate">
                  {currentUser?.displayName || 'Administrator'}
                </p>
                <p className="text-[10px] text-stone-500 truncate">
                  {currentUser?.email || 'admin@lookandlike.com'}
                </p>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Standalone Logout Button when Collapsed */}
        {sidebarCollapsed && (
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="w-full flex items-center justify-center py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
