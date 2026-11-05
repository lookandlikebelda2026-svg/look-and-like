import React from 'react';

/**
 * Elegant Lotus Flower SVG Icon matching Look & Like brand motif
 */
export function LotusIcon({ className = "w-5 h-5 text-[#D6204E]" }) {
  return (
    <svg
      viewBox="0 0 48 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 4 C21 13, 21 21, 24 28 C27 21, 27 13, 24 4 Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M22 10 C15 15, 14 23, 23 28 C20 21, 21 15, 22 10 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M26 10 C33 15, 34 23, 25 28 C28 21, 27 15, 26 10 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M19 17 C10 20, 7 26, 18 30 C14 26, 16 21, 19 17 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M29 17 C38 20, 41 26, 30 30 C34 26, 32 21, 29 17 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M16 31 C21 33, 27 33, 32 31" strokeWidth="2" />
    </svg>
  );
}

/**
 * Parlour Styling Shears SVG Icon
 */
export function HairShearsIcon({ className = "w-5 h-5 text-[#D6204E]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="3" fill="currentColor" fillOpacity="0.15" />
      <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.15" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

/**
 * Manicure & Nail Polish SVG Icon
 */
export function NailCareIcon({ className = "w-5 h-5 text-[#D6204E]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="7" y="10" width="10" height="11" rx="2.5" fill="currentColor" fillOpacity="0.2" />
      <path d="M10 10V5h4v5" fill="currentColor" fillOpacity="0.1" />
      <line x1="12" y1="13" x2="12" y2="17" strokeWidth="2" />
      <line x1="5" y1="21" x2="19" y2="21" strokeWidth="2" />
    </svg>
  );
}

/**
 * Luxury Powder Brush SVG Icon
 */
export function MakeUpBrushIcon({ className = "w-5 h-5 text-[#D6204E]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 3c2-1 4.5 1 4 3.5-1 3-3.5 4.5-5 5-1.2.4-2.5 0-3-1s0-2.5.5-3.5c1-2 2-3.5 3.5-4z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M11.5 10.5l2 2" strokeWidth="2.4" />
      <path d="M12.5 11.5L5 19a1.5 1.5 0 002 2l7.5-7.5" strokeWidth="2" />
      <circle cx="19" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Spa & Wellness SVG Icon
 */
export function SpaWellnessIcon({ className = "w-5 h-5 text-[#D6204E]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 6 6c0 3.5-3 6.5-6 9-3-2.5-6-5.5-6-9a6 6 0 0 0 6-6z" fill="currentColor" fillOpacity="0.18" />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" fillOpacity="0.2" />
      <path d="M8 21h8" strokeWidth="2" />
    </svg>
  );
}

/**
 * Instagram Camera SVG Icon
 */
export function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * Facebook Social SVG Icon
 */
export function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/**
 * WhatsApp Messaging SVG Icon
 */
export function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

/**
 * YouTube Brand SVG Icon
 */
export function YouTubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
