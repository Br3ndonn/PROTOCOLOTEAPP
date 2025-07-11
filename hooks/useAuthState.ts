import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o supabase está disponível
    if (!supabase || !supabase.auth) {
      console.error('❌ Cliente Supabase não está disponível');
      setLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        console.log('🔍 Inicializando autenticação...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('⚠️ Erro ao recuperar sessão:', error);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
          console.log('✅ Sessão recuperada:', !!session?.user);
        }
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listener para mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event);
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, setUser };
}