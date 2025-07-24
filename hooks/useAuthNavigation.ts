import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useAuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const {user, loading} = useAuth();

  useEffect(() => {
    if(!loading) {
        // Se não há usuário logado e não está na tela de login, redirecionar para login
        if (!user && pathname !== '/LoginScreen') {
            router.replace('/LoginScreen');
        }
        // Se há usuário logado e está na página inicial ou login, redirecionar para Alunos
        else if (user && (pathname === '/' || pathname === '/LoginScreen')) {
            router.replace('/Alunos');
        }
        // Se não há usuário e está na página inicial, redirecionar para login
        else if (!user && pathname === '/') {
            router.replace('/LoginScreen');
        }
    }
  }, [loading, pathname, router, user]);

  return { user, loading };
}