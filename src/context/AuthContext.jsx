// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // { id, school_id, full_name, role, email, contact_number }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('id, school_id, full_name, role, email, contact_number')
          .eq('auth_user_id', session.user.id)
          .single();
        if (!error) setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }
    loadProfile();
  }, [session]);

  async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    return data.session;
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }

  const value = useMemo(
    () => ({
      user: session?.user || null,
      role: profile?.role || null,
      profile,
      loading,
      login,
      logout,
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
