import React from 'react';
import { Calendar } from 'lucide-react';
import { LotusIcon } from '../../../components/icons';

export function Reservation({ onOpenBooking }) {
  return (
    <section className="w-full bg-[#FFF3F6] py-12 sm:py-16 border-t border-[#F0CDD7]/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        <LotusIcon className="w-8 h-8 text-[#D6204E] mx-auto mb-3" />
        <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-black mb-2">
          RESERVATIONS &amp; CONSULTATIONS
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-deep-espresso leading-tight">
          Reserve Your <span className="italic font-normal text-black font-serif">Chair</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#5C4D52] mt-2 max-w-md mx-auto leading-relaxed">
          Ready to experience tailored luxury? Reserve your chair with our master artists across all categories.
        </p>
        <div className="mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => onOpenBooking?.()}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#D6204E] to-[#B81942] hover:from-[#B81942] hover:to-[#961234] text-white font-medium text-[11px] sm:text-sm px-4 xs:px-6 sm:px-8 py-2 sm:py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Reservation;
