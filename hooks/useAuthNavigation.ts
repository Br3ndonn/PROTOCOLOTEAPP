import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useAuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const {user, loading} = useAuth();

  useEffect(() => {
    if(!loading) {
        if(pathname === '/') {
            if(user) {
                router.replace('/Alunos');
            } else {
                router.replace('/LoginScreen');
            }
        }
    }
  }, [loading, pathname, router, user]);

  return { user, loading };
}