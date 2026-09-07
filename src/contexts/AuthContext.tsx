import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, api } from '../lib/supabase';
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
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      fetchProfile(s?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      fetchProfile(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile(user);
  }, [fetchProfile, user]);

  const switchDemoRole = useCallback(async (role: UserRole) => {
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
    setUser(mockUser);
    const prof = await api.post('/api/profiles', {
      email: demoEmail,
      full_name: demoNames[role],
      role
    });
    setProfile(prof);
  }, []);

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
