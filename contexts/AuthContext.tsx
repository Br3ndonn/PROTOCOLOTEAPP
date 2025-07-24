import { sincronizarProfessor } from '@/components/Auth';
import { useAuthState } from '@/hooks/useAuthState';
import { AuthService } from '@/services/authService';
import { ProfessorData, professorService } from '@/services/ProfessorService';
import { ErrorHandler, logError } from '@/utils/errorHandler';
import { User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  professor: ProfessorData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (nomeCompleto: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();
  const [professor, setProfessor] = useState<ProfessorData | null>(null);

  // Função para carregar dados do professor
  const carregarDadosProfessor = async (userId: string) => {
    try {
      const { data, error } = await professorService.buscarPorId(userId);
      if (data) {
        setProfessor(data);
        console.log('Dados do professor carregados:', data);
      } else if (error) {
        console.error('Erro ao carregar dados do professor:', error);
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar professor:', error);
    }
  };

  // Sincronizar professor quando usuário for carregado
  useEffect(() => {
    if (user && !loading) {
      sincronizarProfessor(user).then(({ success, error }) => {
        if (!success && error) {
          console.warn('Erro na sincronização do professor:', error);
        }
      });
      
      // Carregar dados do professor
      carregarDadosProfessor(user.id);
    } else if (!user) {
      setProfessor(null);
    }
  }, [user, loading]);

  const signIn = async (email: string, password: string) => {
    try {
      await AuthService.signIn(email, password);
      return {};
    } catch (error) {
      const appError = ErrorHandler.handleError(error);
      logError(error, 'AuthContext.signIn');
      return { error: appError.message };
    }
  };

  const signUp = async (nomeCompleto: string, email: string, password: string) => {
    try {
      const data = await AuthService.signUp(email, password, nomeCompleto);
      
      if (data.user && !data.user.email_confirmed_at) {
        return { error: 'Verifique seu email para confirmar cadastro' };
      }
      
      return {};
    } catch (error) {
      const appError = ErrorHandler.handleError(error);
      logError(error, 'AuthContext.signUp');
      return { error: appError.message };
    }
  };

  const signOut = async () => {
    try {
      // Limpar o estado do professor imediatamente
      setProfessor(null);
      await AuthService.signOut();
    } catch (error) {
      logError(error, 'AuthContext.signOut');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email);
      return {};
    } catch (error) {
      const appError = ErrorHandler.handleError(error);
      logError(error, 'AuthContext.resetPassword');
      return { error: appError.message };
    }
  };

  const value = {
    user,
    professor,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
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