import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContentStorage } from '../../services/contentStorage';
import { useReviews } from '../../services/reviewFirebaseService';
import { Layout } from './layout';
import {
  ServicesSection,
  LookbookSection,
  PartnersSection,
  VideosSection,
  AdminReviewsSection,
  BannerAdminSection,
} from './sections';

/**
 * AdminPanel
 * Master admin studio for managing Parlour Services, Lookbook Editorial Photos, Brand Partners, YouTube Films, Client Reviews, and Hero/About Banners.
 */
export function AdminPanel({ adminUser, onLogout, onNotify }) {
  const location = useLocation();
  const searchTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(searchTab || 'services');

  useEffect(() => {
    if (searchTab && ['services', 'lookbook', 'partners', 'videos', 'reviews', 'banners'].includes(searchTab)) {
      setActiveTab(searchTab);
    }
  }, [searchTab]);

  // Content storage for Services, Lookbook, Partners & YouTube Videos
  const {
    servicesData,
    loadingServices,
    loadingLookbook,
    loadingPartners,
    loadingVideos,
    saveServicesData,
    resetServicesData,
    inspiredImages,
    partners,
    videos,
    saveInspiredImages,
    resetInspiredImages,
    savePartners,
    resetPartners,
    saveVideos,
    resetVideos,
  } = useContentStorage();

  // Reviews moderation storage
  const {
    reviews,
    pendingCount,
    loading: loadingReviews,
    verifyReview,
    deleteReview,
    addReview,
  } = useReviews();

  // Total services count
  const totalServicesCount = Array.isArray(servicesData)
    ? servicesData.length
    : Object.keys(servicesData || {}).length;

  return (
    <Layout
      adminUser={adminUser}
      onLogout={onLogout}
      onNotify={onNotify}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      counts={{
        services: totalServicesCount,
        lookbook: inspiredImages.length,
        partners: partners.length,
        videos: videos.length,
        reviews: pendingCount,
      }}
    >
      {activeTab === 'services' && (
        <ServicesSection
          servicesData={servicesData}
          loading={loadingServices}
          saveServicesData={saveServicesData}
          resetServicesData={resetServicesData}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'lookbook' && (
        <LookbookSection
          inspiredImages={inspiredImages}
          loading={loadingLookbook}
          saveInspiredImages={saveInspiredImages}
          resetInspiredImages={resetInspiredImages}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'partners' && (
        <PartnersSection
          partners={partners}
          loading={loadingPartners}
          savePartners={savePartners}
          resetPartners={resetPartners}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'videos' && (
        <VideosSection
          videos={videos}
          loading={loadingVideos}
          saveVideos={saveVideos}
          resetVideos={resetVideos}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'reviews' && (
        <AdminReviewsSection
          reviews={reviews}
          pendingCount={pendingCount}
          loading={loadingReviews}
          verifyReview={verifyReview}
          deleteReview={deleteReview}
          addReview={addReview}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'banners' && (
        <BannerAdminSection onNotify={onNotify} />
      )}
    </Layout>
  );
}

export default AdminPanel;
