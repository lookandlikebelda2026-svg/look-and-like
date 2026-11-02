import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut } from 'lucide-react';
import { LOGO_URL } from '../../../constants/navigation';
import { logoutAdmin } from '../../../services/authService';

/**
 * Admin Top Navigation Bar Header
 */
export function Header({ currentUser, onLogout, onNotify }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout?.();
    navigate('/');
    onNotify?.('Signed out successfully.', 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#F0CDD7] shadow-xs">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF3F6] border border-[#F0CDD7] flex items-center justify-center">
            <img src={LOGO_URL} alt="Look & Like" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-deep-espresso">
              Look &amp; Like
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider text-[#D6204E] bg-[#FFF3F6] px-2 py-0.5 rounded-full border border-[#F0CDD7]">
              Content Studio
            </span>
          </div>
        </div>

        {/* Quick Actions & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Live Website Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-deep-espresso hover:text-[#D6204E] bg-white hover:bg-[#FFF8FA] border border-[#F0CDD7] rounded-xl transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Website</span>
          </button>

          {/* Admin User Info */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-bold text-deep-espresso">
              {currentUser?.displayName || 'Administrator'}
            </span>
            <span className="text-[10px] text-[#7A6B70]">
              {currentUser?.email || 'admin@lookandlike.com'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
