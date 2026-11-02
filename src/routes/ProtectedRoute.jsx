import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLocalAdminSession, subscribeToAuth } from '../services/authService';
import { LoginModal } from '../components/common/LoginModal';

/**
 * Route wrapper that protects /admin using the luxury login modal popup.
 * If unauthenticated, displays the login modal popup over the screen.
 * Closing the modal navigates back to the homepage.
 */
export function ProtectedRoute({ children, onNotify }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState(() => getLocalAdminSession());
  const [isModalOpen, setIsModalOpen] = useState(!adminUser);

  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  useEffect(() => {
    // Keep in sync with Firebase Auth state
    const unsubscribe = subscribeToAuth((user) => {
      setAdminUser(user);
      if (user) {
        setIsModalOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <LoginModal
          isOpen={isModalOpen}
          initialMode={initialMode}
          onClose={() => {
            setIsModalOpen(false);
            navigate('/');
          }}
          onSuccess={(user) => {
            setAdminUser(user);
            setIsModalOpen(false);
          }}
          onNotify={onNotify}
        />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
