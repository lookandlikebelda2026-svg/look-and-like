import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CONTACT_INFO } from '../../constants/navigation';
import { WhatsAppIcon } from '../icons';

export function PageLayout({ children, onOpenBooking }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-on-surface overflow-x-clip">
      <Navbar onOpenBooking={onOpenBooking} />
      <main className="w-full sm:pt-15 bg-white flex-grow min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)]">
        {children}
      </main>
      <Footer />

      {/* Floating Persistent WhatsApp Concierge Button */}
      <aside aria-label="Quick WhatsApp Concierge" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
        <a
          aria-label="Chat on WhatsApp"
          className="flex items-center justify-center bg-whatsapp-green text-ivory-cream p-3 sm:p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
          href={`https://wa.me/${CONTACT_INFO.defaultWhatsApp}?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment%20at%20Look%20%26%20Like.`}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon className="w-6 h-6" />
        </a>
      </aside>
    </div>
  );
}

export default PageLayout;
