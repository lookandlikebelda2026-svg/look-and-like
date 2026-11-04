import React from 'react';
import { ARTISTS } from '../../../../constants/team';
import { TeamCard } from './TeamCard';

export function TeamSection() {
  return (
    <div className="pt-8">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-black font-semibold">
          The Artists
        </span>
        <h3 className="font-headline-lg text-headline-lg md:text-display-md text-deep-espresso mt-2">
          Meet <span className="italic font-normal text-black font-serif">the</span> team
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
          Trained internationally in Paris, London, and Tokyo — obsessed with nuance and craft.
        </p>
      </div>

      {/* 4 Artist Arched Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {ARTISTS.map((artist) => (
          <TeamCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
