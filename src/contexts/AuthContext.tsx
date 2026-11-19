import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../lib/supabase';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  user: any;
  session: any;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  switchDemoRole: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (u: any) => {
    if (!u?.email) {
      setProfile(null);
      return;
    }
    try {
      const prof = await api.post('/api/profiles', {
        email: u.email,
        full_name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0]
      });
      setProfile(prof);
    } catch (err) {
      console.error('Profile load failed:', err);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('everify_demo_role');
    if (saved && ['citizen', 'lmo', 'gatc', 'admin'].includes(saved)) {
      switchRole(saved as UserRole).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    sessionStorage.removeItem('everify_demo_role');
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile(user);
  }, [fetchProfile, user]);

  const switchRole = useCallback(async (role: UserRole) => {
    const demoEmail = `${role}@demo.in`;
    const demoNames: Record<UserRole, string> = {
      citizen: 'Rajesh Kumar',
      lmo: 'Suresh Patil (LMO)',
      gatc: 'Dr. Ananya Roy (GATC)',
      admin: 'Vikramaditya Deshmukh (IAS)'
    };
    const mockUser = {
      id: `demo-${role}`,
      email: demoEmail,
      user_metadata: { full_name: demoNames[role] }
    };
    const prof = await api.post('/api/profiles', {
      email: demoEmail,
      full_name: demoNames[role],
      role
    });
    sessionStorage.setItem('everify_demo_role', role);
    setProfile(prof);
    setUser(mockUser);
  }, []);

  const switchDemoRole = switchRole;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signOut,
      refreshProfile,
      switchDemoRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
