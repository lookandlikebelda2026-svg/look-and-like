import React from 'react';
import { Image as ImageIcon, Briefcase } from 'lucide-react';
import { getLocalAdminSession } from '../../../services/authService';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Mainbody } from './Mainbody';
import { Footer } from './Footer';

/**
 * Admin Layout (Entry Point)
 * Master shell composing Header, Sidebar, and Mainbody sections.
 */
export function Layout({
  children,
  activeTab = 'lookbook',
  onTabChange,
  navItems,
  counts = {},
  adminUser,
  onLogout,
  onNotify,
  showFooter = false,
}) {
  const currentUser = adminUser || getLocalAdminSession();

  const items = navItems || [
    {
      id: 'lookbook',
      label: 'Lookbook Photos',
      icon: ImageIcon,
      count: counts.lookbook,
    },
    {
      id: 'partners',
      label: 'Brand Partners',
      icon: Briefcase,
      count: counts.partners,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-deep-espresso flex flex-col font-sans">
      {/* 1. Top Header */}
      <Header
        currentUser={currentUser}
        onLogout={onLogout}
        onNotify={onNotify}
      />

      {/* 2. Studio Layout Body */}
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          items={items}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        {/* Main Content Area */}
        <Mainbody>
          {children}
        </Mainbody>
      </div>

      {/* 3. Optional Footer */}
      {showFooter && <Footer />}
    </div>
  );
}

export { Layout as AdminLayout };
export default Layout;
