import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { ServicesPage } from '../pages/ServicePage/ServicesPage';
import { InspirationPage } from '../pages/InspirationPage';
import { AdminPanel } from '../pages/AdminPage/AdminPanel';
import { ProtectedRoute } from './ProtectedRoute';
import { PageLayout } from '../components/layout/PageLayout';

export function AppRoutes({ onOpenBooking, onNotify }) {
  return (
    <Routes>
      {/* 1. Customer-Facing Pages Wrapped in Main PageLayout */}
      <Route
        path="/"
        element={
          <PageLayout onOpenBooking={onOpenBooking}>
            <Home onOpenBooking={onOpenBooking} onNotify={onNotify} />
          </PageLayout>
        }
      />
      <Route
        path="/services"
        element={
          <PageLayout onOpenBooking={onOpenBooking}>
            <ServicesPage onOpenBooking={onOpenBooking} onNotify={onNotify} />
          </PageLayout>
        }
      />
      <Route
        path="/inspiration"
        element={
          <PageLayout onOpenBooking={onOpenBooking}>
            <InspirationPage onOpenBooking={onOpenBooking} onNotify={onNotify} />
          </PageLayout>
        }
      />
      <Route
        path="/lookbook"
        element={<Navigate to="/inspiration" replace />}
      />

      {/* 2. Admin Management Studio (Protected with Unified Login/Register Modal Popup) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute onNotify={onNotify}>
            <AdminPanel onNotify={onNotify} />
          </ProtectedRoute>
        }
      />

      {/* 3. Redirect /admin/signup and /signup directly to /admin modal in register mode */}
      <Route
        path="/admin/signup"
        element={<Navigate to="/admin?mode=register" replace />}
      />
      <Route
        path="/signup"
        element={<Navigate to="/admin?mode=register" replace />}
      />

      {/* Redirect /login to /admin to trigger login modal */}
      <Route
        path="/login"
        element={<Navigate to="/admin" replace />}
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
