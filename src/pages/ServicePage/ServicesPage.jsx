import React, { useState, useEffect, useMemo } from 'react';
import { useContentStorage } from '../../services/contentStorage';
import { ServicesPageSkeleton } from '../../components/common/Skeleton';
import { HeroSection } from './sections/HeroSection';
import { CategoryServicesSection } from './sections/CategoryServicesSection';
import Reservation from './sections/Reservation';

export function ServicesPage({ onNavigate, onNotify, onOpenBooking }) {
  const { servicesData = [], loadingServices } = useContentStorage();

  const [selectedFilter, setSelectedFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#category-')) {
        return hash.replace('#category-', '');
      }
    }
    return 'all';
  });

  const [expandedServiceId, setExpandedServiceId] = useState(null);

  // Map live service categories from content storage
  const categories = useMemo(() => {
    return (servicesData || []).map((svc) => ({
      id: svc.id,
      key: svc.id,
      title: svc.name,
      subtitle: svc.description,
      startingPrice: svc.startingPrice ? `₹${Number(svc.startingPrice).toLocaleString('en-IN')}` : '',
      image: svc.images?.[0]?.url,
      images: svc.images,
      items: (svc.plans || []).map((plan) => ({
        id: plan.id,
        planId: plan.id,
        name: plan.name,
        bookingService: plan.name,
        description: plan.description,
        price: plan.startingPrice ? `₹${Number(plan.startingPrice).toLocaleString('en-IN')}` : '',
        photos: (plan.images || []).map((img) => (typeof img === 'string' ? img : img.url)),
        subCategories: (plan.subplans || []).map((sub) => ({
          id: sub.id,
          name: sub.name,
          price: sub.price,
        })),
        subplans: (plan.subplans || []).map((sub) => ({
          id: sub.id,
          name: sub.name,
          price: sub.price,
        })),
      })),
    }));
  }, [servicesData]);

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
        setSelectedFilter(cat);
        setTimeout(() => {
          const el = document.getElementById(`category-${cat}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
        return;
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
      : categories.filter((c) => c.key === selectedFilter || c.id === selectedFilter);

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* 1. Hero Header Section */}
      <HeroSection onOpenBooking={onOpenBooking} />

      {/* 2. Categorized Services Display Section, Skeleton while loading, or Clean Empty State */}
      {loadingServices ? (
        <ServicesPageSkeleton />
      ) : categories.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 px-6 rounded-3xl bg-[#FAF8F5] border border-[#F0CDD7] my-10">
          <span className="text-[#D6204E] text-2xl font-serif">✦</span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-deep-espresso mt-2 mb-2">
            Services In Preparation
          </h3>
          <p className="text-xs sm:text-sm text-[#7A6B70] leading-relaxed mb-6">
            Our parlour service menu is currently being updated. Please check back shortly or contact our atelier directly to book an appointment.
          </p>
        </div>
      ) : (
        <CategoryServicesSection
          displayedCategories={displayedCategories}
          expandedServiceId={expandedServiceId}
          onToggleExpand={handleToggleExpand}
          onBookService={handleBookService}
          onBookCategory={handleBookCategory}
        />
      )}

      {/* 3. Reservation CTA Section */}
      <Reservation onOpenBooking={onOpenBooking} />
    </div>
  );
}

export default ServicesPage;
