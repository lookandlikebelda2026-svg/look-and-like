import React from 'react';

export function TeamCard({ artist }) {
  return (
    <div className="group flex flex-col items-center text-center">
      {/* Signature Arched Portrait Frame */}
      <div className="w-full h-80 rounded-[140px_140px_16px_16px] overflow-hidden shadow-md mb-4 bg-white border border-border-warm/40">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={artist.alt}
          src={artist.imageUrl}
        />
      </div>
      <h4 className="font-headline-sm text-headline-sm text-deep-espresso">
        {artist.name}
      </h4>
      <span className="font-label-sm text-label-sm text-black uppercase tracking-wider mt-1 font-semibold">
        {artist.title}
      </span>
      <span className="font-body-sm text-body-sm text-on-surface-variant mt-2">
        {artist.experience}
      </span>
    </div>
  );
}
