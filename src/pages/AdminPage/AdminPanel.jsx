import React, { useState } from 'react';
import { useContentStorage } from '../../services/contentStorage';
import { Layout } from './layout';
import {
  LookbookSection,
  PartnersSection,
  VideosSection,
} from './sections';

/**
 * AdminPanel
 * Master admin studio for managing Lookbook Editorial Photos, Brand Partners, and YouTube Films.
 */
export function AdminPanel({ adminUser, onLogout, onNotify }) {
  const [activeTab, setActiveTab] = useState('lookbook');

  // Content storage for Lookbook, Partners & YouTube Videos
  const {
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

  return (
    <Layout
      adminUser={adminUser}
      onLogout={onLogout}
      onNotify={onNotify}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      counts={{
        lookbook: inspiredImages.length,
        partners: partners.length,
        videos: videos.length,
      }}
    >
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
