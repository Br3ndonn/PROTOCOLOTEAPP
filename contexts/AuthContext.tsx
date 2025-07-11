import { useAuthState } from '@/hooks/useAuthState';
import { AuthService } from '@/services/authService';
import { ErrorHandler, logError } from '@/utils/errorHandler';
import { User } from '@supabase/supabase-js';
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (nomeCompleto: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();

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