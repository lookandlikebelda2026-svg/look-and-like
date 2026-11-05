import React, { useState, useEffect } from 'react';
import { CURATED_MENU_DATA } from '../../constants/services';
import { HeroSection } from './sections/HeroSection';
import { CategoryServicesSection } from './sections/CategoryServicesSection';
import Reservation from './sections/Reservation';

export function ServicesPage({ onNavigate, onNotify, onOpenBooking }) {
  const [selectedFilter, setSelectedFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#category-')) {
        const cat = hash.replace('#category-', '');
        if (['hair', 'skin', 'nails', 'makeup', 'spa'].includes(cat)) {
          return cat;
        }
      }
    }
    return 'all';
  });

  const [expandedServiceId, setExpandedServiceId] = useState(null);

  // Maintain consistent category ordering
  const categoryOrder = ['hair', 'skin', 'nails', 'makeup', 'spa'];
  const categories = categoryOrder
    .map((key) => CURATED_MENU_DATA[key])
    .filter(Boolean);

  // Toggle single expanded service row across the page
  const handleToggleExpand = (id) => {
    setExpandedServiceId((prev) => (prev === id ? null : id));
  };

  // Preselect service and open the booking popup
  const handleBookService = (categoryKey, serviceItem) => {
    if (onOpenBooking) {
      if (typeof serviceItem === 'object' && serviceItem !== null) {
        onOpenBooking({
          category: categoryKey,
          service: serviceItem.bookingService || serviceItem.name,
          serviceId: categoryKey,
          planId: serviceItem.planId || serviceItem.id,
          planName: serviceItem.planName || serviceItem.name,
          subplanId: serviceItem.subplanId || null,
          subplanName: serviceItem.subplanName || serviceItem.subCategory || null,
          price: serviceItem.price,
        });
      } else {
        onOpenBooking({
          category: categoryKey,
          service: serviceItem,
        });
      }
    }
  };

  // Preselect whole category
  const handleBookCategory = (categoryKey) => {
    if (onOpenBooking) {
      onOpenBooking({
        category: categoryKey,
      });
    }
  };

  // Sync category filter from hash on mount / hashchange and scroll
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#category-')) {
        const cat = hash.replace('#category-', '');
        if (['hair', 'skin', 'nails', 'makeup', 'spa'].includes(cat)) {
          setSelectedFilter(cat);
          setTimeout(() => {
            const el = document.getElementById(`category-${cat}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const displayedCategories =
    selectedFilter === 'all'
      ? categories
      : categories.filter((c) => c.key === selectedFilter);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* 1. Hero Header Section */}
      <HeroSection onOpenBooking={onOpenBooking} />

      {/* 2. Categorized Services Display Section */}
      <CategoryServicesSection
        displayedCategories={displayedCategories}
        expandedServiceId={expandedServiceId}
        onToggleExpand={handleToggleExpand}
        onBookService={handleBookService}
        onBookCategory={handleBookCategory}
      />

      {/* 3. Reservation CTA Section */}
      <Reservation onOpenBooking={onOpenBooking} />
    </div>
  );
}

export default ServicesPage;
