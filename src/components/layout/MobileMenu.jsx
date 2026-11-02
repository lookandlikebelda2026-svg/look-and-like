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

    if (link.page === 'services') {
      navigate('/services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.page === 'inspiration') {
      navigate('/inspiration');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (location.pathname !== '/') {
        navigate('/');
      }
      if (link.href && link.href.startsWith('#') && link.href.length > 1) {
        setTimeout(() => {
          const el = document.querySelector(link.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
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
              <span className="text-xs text-tertiary">·</span>
              <span className="font-label-sm text-[11px] text-tertiary uppercase tracking-wider">Menu</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-white border border-border-warm hover:bg-neutral-100 text-deep-espresso flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 mt-4 sm:mt-6">
            {NAV_LINKS.map((link) => {
              const isServicesActive = location.pathname === '/services' && link.page === 'services';
              const isInspirationActive = (location.pathname === '/inspiration' || location.pathname === '/lookbook') && link.page === 'inspiration';
              const isHomeActive = location.pathname === '/' && link.label === 'Home';
              const isActive = isServicesActive || isInspirationActive || isHomeActive;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`font-label-md text-xs uppercase tracking-wider py-3 px-2 rounded-xl transition-colors border-b border-border-warm/30 flex items-center justify-between ${
                    isActive
                      ? 'text-terracotta-rose font-bold bg-blush-mist/50'
                      : 'text-on-surface-variant hover:text-terracotta-rose hover:bg-neutral-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-rose" />
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
            <Phone size={16} className="text-terracotta-rose" />
            <span>Consultation Hotline</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenBooking) onOpenBooking();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-deep-espresso hover:bg-terracotta-rose text-white font-label-md text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <Calendar size={16} />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
