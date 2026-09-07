import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './Spinner';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Spinner label="Authenticating session…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && profile) {
    const hasRole = roles.includes(profile.role);
    if (!hasRole) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-4 text-center">
          <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-xl font-bold text-amber-900">Restricted Section</h2>
            <p className="mt-2 text-sm text-amber-700">
              This module requires one of the following roles: <strong className="uppercase">{roles.join(', ')}</strong>.
              Your current profile role is <strong className="uppercase">{profile.role}</strong>.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="/dashboard"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
