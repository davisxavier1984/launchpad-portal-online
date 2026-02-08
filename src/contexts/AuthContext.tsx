import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validateAdminAccess, rateLimiter } from '@/lib/security';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authUser: AuthUser | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async (userId: string): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, name, role, is_active')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        isActive: data.is_active,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profile = await fetchAdminProfile(session.user.id);
          setAuthUser(profile);
        } else {
          setAuthUser(null);
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await fetchAdminProfile(session.user.id);
        setAuthUser(profile);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const rateLimitKey = `login_${email}`;
    if (!rateLimiter.canProceed(rateLimitKey)) {
      return { error: new Error('Muitas tentativas de login. Tente novamente em alguns minutos.') };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      rateLimiter.reset(rateLimitKey);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
  };

  const isAdmin = validateAdminAccess(authUser?.role);

  const hasPermission = (permission: string): boolean => {
    if (!authUser || !isAdmin) return false;

    switch (authUser.role) {
      case 'super_admin':
        return true;
      case 'admin':
        return ['read_news', 'write_news', 'manage_news', 'read_categories'].includes(permission);
      case 'editor':
        return ['read_news', 'write_news'].includes(permission);
      case 'viewer':
        return ['read_news'].includes(permission);
      default:
        return false;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    authUser,
    isAdmin,
    signIn,
    signOut,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}