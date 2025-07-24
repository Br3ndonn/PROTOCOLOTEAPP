import LoadingScreen from '@/components/shared/LoadingScreen';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Chamar o hook de navegação
  const { user, loading: authLoading } = useAuthNavigation();
  
  useEffect(() => {
    // Aguardar que a autenticação termine de carregar
    if (!authLoading) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Mostrar loading enquanto verifica autenticação
  if (loading || authLoading) {
    return <LoadingScreen />;
  }

  // Esta tela não deveria ser renderizada na prática,
  // pois a navegação automática já redirecionou o usuário
  return <LoadingScreen />;
}