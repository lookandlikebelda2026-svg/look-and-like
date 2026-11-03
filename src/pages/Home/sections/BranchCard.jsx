import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export function BranchCard({ branch }) {
  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-[#F0CDD7]/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      {/* 1. Branch Image Banner */}
      <div className="relative w-full h-36 xs:h-40 sm:h-40 md:h-44 overflow-hidden bg-[#FFF3F6]">
        <img
          src={branch.imageUrl}
          alt={`${branch.name} salon branch interior`}
          onError={(e) => {
            if (branch.fallbackImageUrl && e.currentTarget.src !== branch.fallbackImageUrl) {
              e.currentTarget.src = branch.fallbackImageUrl;
            }
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
          loading="lazy"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="bg-white/95 backdrop-blur-xs text-[#D6204E] font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xs">
            {branch.number}
          </span>
          <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs">
            {branch.tag}
          </span>
        </div>
      </div>

      {/* 2. Slim Body Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3.5 sm:gap-4">
        <div>
          {/* Branch Title */}
          <h3 className="font-bold text-base sm:text-lg text-deep-espresso group-hover:text-[#D6204E] transition-colors leading-tight mb-2">
            {branch.name}
          </h3>

          {/* Location / Address Link */}
          <a
            href={branch.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="group/loc flex items-start gap-1.5 text-xs text-[#6B5A60] hover:text-[#D6204E] transition-colors leading-relaxed mb-3"
            title="Open in Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D6204E] shrink-0 mt-0.5 group-hover/loc:scale-110 transition-transform" />
            <span className="group-hover/loc:underline line-clamp-2">
              {branch.addressFull.replace('\n', ', ')}
            </span>
          </a>

          {/* Contact Details (Phone & Hours) */}
          <div className="space-y-1.5 pt-2 border-t border-[#F0CDD7]/50 text-xs text-[#5C4D52]">
            <a
              href={`tel:${branch.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-between py-0.5 group/phone hover:text-[#D6204E] transition-colors"
              title="Call salon branch"
            >
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D6204E] shrink-0" />
                <span className="font-medium">{branch.phoneDisplay}</span>
              </span>
              <span className="text-[10px] text-[#D6204E] font-bold uppercase tracking-wider underline sm:no-underline sm:group-hover/phone:underline">
                Call Now
              </span>
            </a>
            <p className="flex items-center gap-1.5 text-[#7A6B70]">
              <Clock className="w-3.5 h-3.5 text-[#D6204E] shrink-0" />
              <span className="truncate">{branch.hours}</span>
            </p>
          </div>
        </div>

        {/* 3. Touch-Friendly Action Footer */}
        <div className="pt-3 border-t border-[#F0CDD7]/60 flex items-center justify-between gap-2">
          {/* Location / Directions Link */}
          <a
            href={branch.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#D6204E] hover:text-[#B81942] py-2 px-3 rounded-xl bg-[#FFF3F6] hover:bg-[#FCE5EB] transition-colors flex-1 text-center"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Directions</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://api.whatsapp.com/send?phone=${String(branch.whatsAppNumber || '919046466767').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(branch.prefillMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] text-white py-2 px-3.5 rounded-xl text-xs font-medium shadow-xs hover:shadow-sm active:scale-95 transition-all text-center flex-1"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
