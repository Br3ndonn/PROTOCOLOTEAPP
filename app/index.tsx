import LoadingScreen from '@/components/shared/LoadingScreen';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Chamar o hook de navegação
  useAuthNavigation();
  
  useEffect(() => {
    // Simulate loading time for navigation check
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen />;
  }

  // Esta tela não deveria ser renderizada na prática,
  // pois a navegação automática já redirecionou o usuário
  return <LoadingScreen />;
}