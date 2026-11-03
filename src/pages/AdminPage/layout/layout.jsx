import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Briefcase } from 'lucide-react';
import { YouTubeIcon } from '../../../components/icons';
import { getLocalAdminSession, logoutAdmin } from '../../../services/authService';

// Layout Subsections
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Mainbody } from './Mainbody';
import { LogoutModal } from './LogoutModal';
import { Footer } from './Footer';

/**
 * Admin Layout (Entry Point)
 * A restructured, highly responsive, production-ready SaaS administration dashboard.
 * Inspired by modern administrative workspaces:
 * - Desktop/Tablet: Fixed collapsible Sidebar (w-[260px] or w-20), fixed Header, smooth margin transition.
 * - Mobile: Sliding Off-Canvas Drawer (hamburger trigger), and Ergonomic Bottom Navigation bar.
 * - Modals: Dedicated Logout Confirmation Dialog.
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
  const navigate = useNavigate();
  const currentUser = adminUser || getLocalAdminSession();

  // Layout View States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Core Management Items
  const items = navItems || [
    {
      id: 'lookbook',
      label: 'Lookbook Photos',
      shortLabel: 'Lookbook',
      icon: ImageIcon,
      count: counts.lookbook,
    },
    {
      id: 'partners',
      label: 'Brand Partners',
      shortLabel: 'Partners',
      icon: Briefcase,
      count: counts.partners,
    },
    {
      id: 'videos',
      label: 'YouTube Films',
      shortLabel: 'Videos',
      icon: YouTubeIcon,
      count: counts.videos,
    },
  ];

  // Dynamic Header Title Calculation
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'lookbook':
        return 'Lookbook Photos';
      case 'partners':
        return 'Brand Partners';
      case 'videos':
        return 'YouTube Films';
      default:
        return 'Admin Studio';
    }
  };

  // Sign out confirmation handler
  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await logoutAdmin();
      onLogout?.();
      navigate('/');
      onNotify?.('Signed out of Admin Studio successfully.', 'info');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FAF8F5] text-deep-espresso flex font-sans">
      {/* 1. Mobile Off-Canvas Drawer Navigation */}
      <MobileDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        items={items}
        activeTab={activeTab}
        onTabChange={onTabChange}
        currentUser={currentUser}
        handleLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* 2. Mobile Bottom Sticky Navigation */}
      <BottomNav
        items={items}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* 3. Desktop/Tablet Fixed Collapsible Sidebar */}
      <Sidebar
        items={items}
        activeTab={activeTab}
        onTabChange={onTabChange}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        currentUser={currentUser}
        handleLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* 4. Main Panel Workspace */}
      <div
        className={`
          flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ml-0
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[260px]'}
        `}
      >
        {/* Fixed Top Header (never scrolls) */}
        <Header
          setDrawerOpen={setDrawerOpen}
          title={getHeaderTitle()}
          handleLogout={() => setIsLogoutModalOpen(true)}
        />

        {/* Scrollable Main Content Container */}
        <div className="flex-1 overflow-y-auto">
          <Mainbody>
            {children}
          </Mainbody>

          {showFooter && <Footer />}
        </div>
      </div>

      {/* 5. Logout Confirmation Warning Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}

export { Layout as AdminLayout };
export default Layout;
