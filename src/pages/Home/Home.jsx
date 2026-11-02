import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { PartnersSection } from './sections/partners/PartnersSection';
import { GallerySection } from './sections/GallerySection';
import { ServicesSection } from './sections/services/ServicesSection';
import { CtaBannerSection } from './sections/CtaBannerSection';
import { AboutSection } from './sections/AboutSection';
import { GetInspiredSection } from './sections/GetInspiredSection';
import { VideoTourSection } from './sections/video/VideoTourSection';
import { ContactSection } from './sections/ContactSection';

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
      {/* SECTION 1: HERO */}
      <HeroSection onNavigate={onNavigate} onOpenBooking={onOpenBooking} />

      {/* SECTION 2: BRAND PARTNERS */}
      <PartnersSection />

      {/* SECTION 3: SHOWCASE GALLERY (4 CORE SPECIALTIES) */}
      {/* <GallerySection onSelectCategory={handleSelectCategory} /> */}

      {/* SECTION 4: CURATED SERVICES MENU (thequickwebsite.com style) */}
      <ServicesSection
        onSelectService={handleSelectCategory}
        onNavigate={onNavigate}
      />

      {/* SECTION: CTA PROMOTIONAL BANNER */}
      

      {/* SECTION 5: ABOUT US & ARTIST TEAM SPOTLIGHT */}
      {/* <AboutSection /> */}

      {/* SECTION: GET INSPIRED SHOWCASE */}
      <GetInspiredSection onNavigate={onNavigate} />

      {/* SECTION 6: VIDEO SANCTUARY TOUR */}
      <VideoTourSection />
      <CtaBannerSection onOpenBooking={onOpenBooking} />

      {/* SECTION 7: CONTACT US & MULTI-BRANCH LOCATION HUBS */}
      <ContactSection onNotify={onNotify} />
    </div>
  );
}
