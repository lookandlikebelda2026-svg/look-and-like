import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { LOGO_URL } from '../../constants/navigation';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '../icons';
import { useViewCount } from '../../services/viewCounterService';

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
    href: 'https://wa.me/919046466767',
  },
];

const OPENING_HOURS = [
  'Tue – Sat: 9 AM – 8 PM',
  'Sun: 10 AM – 6 PM',
  'Monday: Closed',
];

export function Footer() {
  const navigate = useNavigate();
  const { views } = useViewCount();
  return (
    <footer className="w-full bg-[#FFF8FA] text-[#5C4D52] border-t border-[#F0CDD7]/90">
      {/* Single Full-Width Footer Section */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 py-8 sm:py-7">
          {/* Brand */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Look & Like home"
              className="shrink-0"
            >
              <img
                src={LOGO_URL}
                alt="Look & Like"
                loading="lazy"
                className="h-11 w-auto object-contain"
              />
            </a>

            <div className="min-w-0">
              <h2 className="font-serif text-2xl sm:text-[1.7rem] font-bold leading-tight tracking-tight text-deep-espresso">
                Look &amp; Like
              </h2>

              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#5C4D52]">
                Editorial Luxury Hair, Beauty &amp; Spa Studio.
              </p>

              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6204E]">
                Your beauty, our signature
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:border-l lg:border-[#F0CDD7]/80 lg:pl-8">
            <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8F2946]">
              Visit Our Studio
            </h3>

            <div className="space-y-1">
              {OPENING_HOURS.map((hours) => (
                <p
                  key={hours}
                  className="text-xs sm:text-sm leading-relaxed text-[#5C4D52]"
                >
                  {hours}
                </p>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center gap-3 lg:items-end">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8F2946]">
              Stay Connected
            </p>

            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => {
                const IconComponent = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#F0CDD7] bg-white text-[#D6204E] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6204E] hover:bg-gradient-to-r hover:from-[#D6204E] hover:to-[#B81942] hover:text-white hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <IconComponent className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar with Live View Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0CDD7]/60 py-4 text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-[#7A6B70]">
            © {new Date().getFullYear()} Look &amp; Like Ltd. All rights reserved.
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F0CDD7] shadow-2xs text-[11px] font-medium text-deep-espresso">
            <Eye className="w-3.5 h-3.5 text-[#D6204E]" />
            <span className="font-bold text-[#D6204E]">
              {views ? views.toLocaleString() : '1,482'}
            </span>
            <span className="text-[#7A6B70]">Studio Views</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
