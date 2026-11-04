import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { PartnersSection } from './sections/partners/PartnersSection';
import { GetInspiredSection } from './sections/GetInspiredSection';
import { ServicesSection } from './sections/services/ServicesSection';
import { ContactSection } from './sections/ContactSection';
import { CtaBannerSection } from './sections/CtaBannerSection';
import { AboutSection } from './sections/AboutSection';
import { VideoTourSection } from './sections/video/VideoTourSection';

export function Home({ onNavigate, onNotify, onOpenBooking }) {
  const handleSelectCategory = (categoryOrObject, maybeService) => {
    let preselected = null;
    if (typeof categoryOrObject === 'object' && categoryOrObject !== null) {
      preselected = categoryOrObject;
    } else if (maybeService) {
      preselected = { category: categoryOrObject, service: maybeService };
    } else if (categoryOrObject) {
      preselected = { category: categoryOrObject };
    }
    if (onOpenBooking) {
      onOpenBooking(preselected);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO */}
      <HeroSection onNavigate={onNavigate} onOpenBooking={onOpenBooking} />

      {/* 2. BRAND */}
      <PartnersSection />

      {/* 3. LOOKBOOK */}
      <GetInspiredSection onNavigate={onNavigate} />

      {/* 4. SERVICE */}
      <ServicesSection
        onSelectService={handleSelectCategory}
        onNavigate={onNavigate}
      />

      {/* 5. BRANCH */}
      <ContactSection onNotify={onNotify} />

      {/* 6. BOOK APPOINTMENT */}
      <CtaBannerSection onOpenBooking={onOpenBooking} />

      {/* 7. ABOUT US */}
      <AboutSection />

      {/* 8. VIDEO */}
      <VideoTourSection />
    </div>
  );
}

export default Home;