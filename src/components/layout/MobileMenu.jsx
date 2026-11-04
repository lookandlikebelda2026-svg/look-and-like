import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Phone, Calendar } from 'lucide-react';
import { NAV_LINKS, CONTACT_INFO } from '../../constants/navigation';

export function MobileMenu({ isOpen, onClose, onOpenBooking }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    onClose();

    // 1. Dedicated Page: Services (/services)
    if (link.page === 'services' || link.label === 'Services') {
      if (location.pathname === '/services') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/services');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // 2. Dedicated Page: Lookbook (/inspiration)
    if (link.page === 'inspiration' || link.label === 'Lookbook') {
      if (location.pathname === '/inspiration' || location.pathname === '/lookbook') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/inspiration');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // 3. Home link (Top of /)
    if (link.label === 'Home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // 4. Section anchors on Home page (#branches, #video-tour, #contact)
    const targetHash = link.href.startsWith('#')
      ? link.href
      : link.href.includes('#')
      ? `#${link.href.split('#')[1]}`
      : null;

    if (location.pathname === '/') {
      if (targetHash) {
        const el = document.querySelector(targetHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      if (targetHash) {
        setTimeout(() => {
          const el = document.querySelector(targetHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-white/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-5 sm:p-6 shadow-2xl flex flex-col justify-between border-l border-border-warm animate-in slide-in-from-right duration-300 overflow-y-auto z-10">
        <div>
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-border-warm">
            <div className="flex items-center gap-2">
              <span className="font-display-md text-lg font-bold text-deep-espresso">Look &amp; Like</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-1.5 text-deep-espresso hover:text-[#D6204E] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 mt-4 sm:mt-6">
            {NAV_LINKS.map((link) => {
              const isServicesActive = location.pathname === '/services' && (link.page === 'services' || link.label === 'Services');
              const isInspirationActive = (location.pathname === '/inspiration' || location.pathname === '/lookbook') && (link.page === 'inspiration' || link.label === 'Lookbook');
              const isHomeActive = location.pathname === '/' && link.label === 'Home';
              const isActive = isServicesActive || isInspirationActive || isHomeActive;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`font-label-md text-xs uppercase tracking-wider py-3 px-2 rounded-xl transition-colors border-b border-border-warm/30 flex items-center justify-between ${
                    isActive
                      ? 'text-[#D6204E] font-bold bg-[#FFF3F6]'
                      : 'text-black hover:text-[#D6204E] hover:bg-neutral-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6204E]" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2.5 pt-5 pb-2 border-t border-border-warm mt-5">
          <a
            href={`tel:${CONTACT_INFO.consultationPhone}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white border border-border-warm hover:bg-neutral-100 text-deep-espresso font-label-md text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            <Phone size={16} className="text-[#D6204E]" />
            <span>Consultation Hotline</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenBooking) onOpenBooking();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#D6204E] hover:bg-[#B81942] text-white font-label-md text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <Calendar size={16} />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
