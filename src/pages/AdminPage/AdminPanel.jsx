import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContentStorage } from '../../services/contentStorage';
import { Layout } from './layout';
import {
  ServicesSection,
  LookbookSection,
  PartnersSection,
  VideosSection,
} from './sections';

/**
 * AdminPanel
 * Master admin studio for managing Salon Services, Lookbook Editorial Photos, Brand Partners, and YouTube Films.
 */
export function AdminPanel({ adminUser, onLogout, onNotify }) {
  const location = useLocation();
  const searchTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(searchTab || 'services');

  useEffect(() => {
    if (searchTab && ['services', 'lookbook', 'partners', 'videos'].includes(searchTab)) {
      setActiveTab(searchTab);
    }
  }, [searchTab]);

  // Content storage for Services, Lookbook, Partners & YouTube Videos
  const {
    servicesData,
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
      }}
    >
      {activeTab === 'services' && (
        <ServicesSection
          servicesData={servicesData}
          saveServicesData={saveServicesData}
          resetServicesData={resetServicesData}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'lookbook' && (
        <LookbookSection
          inspiredImages={inspiredImages}
          saveInspiredImages={saveInspiredImages}
          resetInspiredImages={resetInspiredImages}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'partners' && (
        <PartnersSection
          partners={partners}
          savePartners={savePartners}
          resetPartners={resetPartners}
          onNotify={onNotify}
        />
      )}

      {activeTab === 'videos' && (
        <VideosSection
          videos={videos}
          saveVideos={saveVideos}
          resetVideos={resetVideos}
          onNotify={onNotify}
        />
      )}
    </Layout>
  );
}

export default AdminPanel;
