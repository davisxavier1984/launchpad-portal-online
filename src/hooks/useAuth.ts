import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { validateAdminAccess, rateLimiter } from '@/lib/security';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Hook principal de autenticação
export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false
  });

  // Verificar sessão existente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (session?.user) {
          await updateUserState(session);
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await updateUserState(session);
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            isAdmin: false
          });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          await updateUserState(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Atualizar estado do usuário com dados do banco
  const updateUserState = async (session: Session) => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      // Buscar dados do usuário admin
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .eq('is_active', true)
        .single();

      if (error || !adminUser) {
        console.error('Usuário não encontrado ou inativo:', error);
        await supabase.auth.signOut();
        setState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false,
          isAdmin: false
        });
        return;
      }

      const authUser: AuthUser = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        isActive: adminUser.is_active,
        lastLogin: adminUser.last_login ? new Date(adminUser.last_login) : undefined
      };

      setState({
        user: authUser,
        session,
        loading: false,
        isAuthenticated: true,
        isAdmin: validateAdminAccess(authUser.role)
      });

      // Atualizar último login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', session.user.id);

    } catch (error) {
      console.error('Erro ao atualizar estado do usuário:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Função de login
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Rate limiting
    const rateLimitKey = `login_${email}`;
    if (!rateLimiter.canProceed(rateLimitKey)) {
      return {
        success: false,
        error: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
      };
    }

    try {
      setState(prev => ({ ...prev, loading: true }));

      // Validação básica
      if (!email || !password) {
        return {
          success: false,
          error: 'Email e senha são obrigatórios'
        };
      }

      // Primeiro, verificar se o usuário existe na tabela admin_users
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, is_active')
        .eq('email', email.toLowerCase().trim())
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        return {
          success: false,
          error: 'Credenciais inválidas ou usuário inativo'
        };
      }

      // Login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password
      });

      if (error) {
        console.error('Erro de login:', error);
        return {
          success: false,
          error: 'Credenciais inválidas'
        };
      }

      if (data.user && data.session) {
        // Reset rate limiter em caso de sucesso
        rateLimiter.reset(rateLimitKey);
        return { success: true };
      }

      return {
        success: false,
        error: 'Erro inesperado durante o login'
      };

    } catch (error) {
      console.error('Erro durante login:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Função de logout
  const signOut = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
      }

      // Limpar estado local
      setState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false
      });

    } catch (error) {
      console.error('Erro durante logout:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Atualizar sessão
  const refreshSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Erro ao atualizar sessão:', error);
        await signOut();
        return;
      }

      if (data.session) {
        await updateUserState(data.session);
      }
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      await signOut();
    }
  };

  return {
    ...state,
    signIn,
    signOut,
    refreshSession
  };
};

// Hook simplificado para verificação de autenticação
export const useRequireAuth = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirecionar para login ou mostrar modal
      console.warn('Usuário não autenticado tentando acessar área restrita');
    }
  }, [isAuthenticated, loading]);

  return { isAuthenticated, isAdmin, loading };
};

// Hook para verificar permissões específicas
export const usePermissions = () => {
  const { user, isAdmin } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user || !isAdmin) return false;

    // Implementar lógica de permissões baseada em role
    switch (user.role) {
      case 'super_admin':
        return true; // Super admin tem todas as permissões
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

  const canManageNews = (): boolean => hasPermission('manage_news');
  const canWriteNews = (): boolean => hasPermission('write_news');
  const canReadNews = (): boolean => hasPermission('read_news');

  return {
    hasPermission,
    canManageNews,
    canWriteNews,
    canReadNews
  };
};

export { AuthContext };
export type { AuthUser, AuthState, AuthContextType }; 