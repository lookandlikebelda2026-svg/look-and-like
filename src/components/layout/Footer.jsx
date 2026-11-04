import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL, CONTACT_INFO } from '../../constants/navigation';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '../icons';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    icon: InstagramIcon,
    href: 'https://instagram.com',
  },
  {
    name: 'Facebook',
    icon: FacebookIcon,
    href: 'https://facebook.com',
  },
  {
    name: 'WhatsApp',
    icon: WhatsAppIcon,
    href: `https://wa.me/${CONTACT_INFO.defaultWhatsApp}`,
  },
];

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-[#FFF3F6] text-[#5C4D52] border-t border-[#F0CDD7]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-7 sm:py-9">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8 text-center sm:text-left">
          {/* Brand Info */}
          <div className="flex flex-col items-center sm:items-start gap-1 sm:gap-1.5">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Look & Like home"
              className="flex items-center gap-2.5 active:scale-95 transition-transform"
            >
              <img
                src={LOGO_URL}
                alt="Look & Like"
                loading="lazy"
                className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply"
              />
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-deep-espresso">
                Look &amp; Like
              </span>
            </a>
            <p className="text-xs sm:text-sm text-[#6B5A60]">
              Editorial Luxury Hair, Beauty &amp; Spa Studio.
            </p>
          </div>

          {/* Social Links & Phone */}
          <div className="flex flex-col items-center sm:items-end gap-2.5">
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F0CDD7] bg-white text-[#D6204E] hover:bg-[#D6204E] hover:text-white transition-all active:scale-95"
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>

            <a
              href={`tel:${CONTACT_INFO.consultationPhone.replace(/\s+/g, '')}`}
              className="text-xs font-semibold text-[#D6204E] hover:underline transition-colors"
            >
              {CONTACT_INFO.consultationPhone}
            </a>
          </div>
        </div>

        {/* Clean Bottom Bar: Copyright & Powered by MERO */}
        <div className="mt-5 pt-4 border-t border-[#F0CDD7]/60 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] sm:text-xs text-[#7A6B70] text-center sm:text-left">
          <p>© {new Date().getFullYear()} Look &amp; Like Ltd. All rights reserved.</p>
          <p>
            Powered by{' '}
            <a
              href="https://m4mero.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-deep-espresso hover:text-[#D6204E] transition-colors hover:underline"
            >
              MERO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
