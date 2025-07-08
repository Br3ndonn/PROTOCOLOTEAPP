import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, nomeCompleto: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  clearSession: () => Promise<void>; // ✅ Adicionar função para limpar sessão
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Função para inicializar sessão com tratamento de erro
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Erro ao recuperar sessão:', error.message);
          // Limpar sessão inválida
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Erro inesperado na inicialização:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // ✅ Escutar mudanças na autenticação com tratamento de erro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token renovado com sucesso');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('Usuário deslogado');
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
  console.log('🔐 AuthContext: Iniciando signIn...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('🔐 AuthContext: Resposta do Supabase:', { 
      hasData: !!data, 
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error?.message 
    });
    
    if (error) {
      console.log('❌ AuthContext: Erro no login:', error.message);
      return { error: error.message };
    }
    
    console.log('✅ AuthContext: Login bem-sucedido, usuário será atualizado pelo onAuthStateChange');
    return {};
  } catch (error) {
    console.log('💥 AuthContext: Erro inesperado:', error);
    return { error: 'Erro inesperado no login' };
  }
};

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_completo: nomeCompleto,
            display_name: nomeCompleto,
          }
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      // ✅ Só atualizar se o usuário foi criado e está confirmado
      if (data.user && !data.user.email_confirmed_at) {
        // Usuário criado mas precisa confirmar email
        return { error: 'Verifique seu email para confirmar a conta' };
      }
      
      return {};
    } catch (error) {
      return { error: 'Erro inesperado no cadastro' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Forçar logout local mesmo se der erro
      setUser(null);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://localhost:8081/reset-password', // ✅ Ajustar para seu app
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'Erro ao enviar email de recuperação' };
    }
  };

  // ✅ Função para limpar sessão corrompida
  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log('Sessão limpa com sucesso');
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearSession, // ✅ Adicionar ao contexto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
