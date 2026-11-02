import React, { useState } from 'react';
import { useContentStorage } from '../../services/contentStorage';
import { Layout } from './layout';
import {
  LookbookSection,
  PartnersSection,
} from './sections';

/**
 * AdminPanel
 * Master admin studio for managing Lookbook Editorial Photos and Brand Partners.
 */
export function AdminPanel({ adminUser, onLogout, onNotify }) {
  const [activeTab, setActiveTab] = useState('lookbook');

  // Content storage for Lookbook & Partners
  const {
    inspiredImages,
    partners,
    saveInspiredImages,
    resetInspiredImages,
    savePartners,
    resetPartners,
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
      }}
    >
      {activeTab === 'lookbook' && (
        <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-7 shadow-xs">
          <LookbookSection
            inspiredImages={inspiredImages}
            saveInspiredImages={saveInspiredImages}
            resetInspiredImages={resetInspiredImages}
            onNotify={onNotify}
          />
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl border border-[#F0CDD7] p-5 sm:p-7 shadow-xs">
          <PartnersSection
            partners={partners}
            savePartners={savePartners}
            resetPartners={resetPartners}
            onNotify={onNotify}
          />
        </div>
      )}
    </Layout>
  );
}

export default AdminPanel;
