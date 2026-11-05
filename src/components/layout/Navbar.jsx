import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { LOGO_URL, NAV_LINKS } from '../../constants/navigation';
import { MobileMenu } from './MobileMenu';

export function Navbar({ onOpenBooking }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, link) => {
    e.preventDefault();

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

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    if (onOpenBooking) {
      onOpenBooking();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(42,31,27,0.04)] border-b border-border-warm/60">
        <div className="py-3 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo Brand */}
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                alt="Look & Like Logo"
                className="w-full h-full object-contain select-none"
                src={LOGO_URL}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base sm:text-xl font-bold text-deep-espresso tracking-tight leading-none truncate">
                Look &amp; Like
              </span>
              <span className="font-label-sm text-[10px] text-tertiary uppercase tracking-widest leading-none mt-1 hidden sm:block">
                Hair · Beauty · Spa
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 2xl:gap-7 shrink-0">
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
                  className={`text-[11px] xl:text-xs uppercase tracking-wider font-semibold transition-colors py-1 relative cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#D6204E] font-bold'
                      : 'text-black hover:text-[#D6204E]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#D6204E] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Book Appointment CTA */}
            <a
              onClick={handleBookClick}
              className="inline-flex items-center justify-center bg-deep-espresso text-white hover:opacity-90 font-label-md text-[9.5px] xs:text-[10px] sm:text-xs uppercase tracking-wider px-2.5 xs:px-3 sm:px-5 py-1.5 xs:py-1.5 sm:py-2 rounded-full transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
              href="#branch-booking"
            >
              <span className="sm:hidden">Book Now</span>
              <span className="hidden sm:inline">Book Appointment</span>
            </a>

            {/* Mobile Hamburger Button: borderless clean 3-bar icon */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-1.5 flex items-center justify-center text-black hover:text-[#D6204E] transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}

export default Navbar;
