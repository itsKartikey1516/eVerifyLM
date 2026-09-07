import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PortalLayout } from './components/PortalLayout';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { VerifyPage } from './pages/VerifyPage';
import { Registry } from './pages/Registry';
import { Docs } from './pages/Docs';
import { Legal } from './pages/Legal';
import { CertificateView } from './pages/CertificateView';

import { DashboardHome } from './pages/dashboard/DashboardHome';
import { Instruments } from './pages/dashboard/Instruments';
import { Applications } from './pages/dashboard/Applications';
import { ApplicationDetail } from './pages/dashboard/ApplicationDetail';
import { Certificates } from './pages/dashboard/Certificates';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';
import { AdminUsers } from './pages/dashboard/AdminUsers';
import { AuditLogs } from './pages/dashboard/AuditLogs';

export function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/verify/:token" element={<VerifyPage />} />
            <Route path="/registry" element={<Registry />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/privacy" element={<Legal />} />
            <Route path="/terms" element={<Legal />} />
            <Route path="/certificate/:id" element={<CertificateView />} />

            {/* Dashboard Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="instruments" element={<Instruments />} />
              <Route path="applications" element={<Applications />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
