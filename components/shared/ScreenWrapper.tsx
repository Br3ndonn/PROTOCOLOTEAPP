// components/shared/ScreenWrapper.tsx
import { usePathname } from 'expo-router';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import Header from './Header';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showBackButton?: boolean;
  showLogout?: boolean;
  onBackPress?: () => void;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  title,
  subtitle,
  showHeader,
  showBackButton,
  showLogout = true,
  onBackPress
}) => {
  const pathname = usePathname();
  
  // Determinar se deve mostrar o header
  const shouldShowHeader = showHeader !== undefined 
    ? showHeader 
    : pathname !== '/LoginScreen'; // Mostrar header em todas as telas exceto login

  // Títulos automáticos baseados na rota
  const getAutoTitle = () => {
    if (title) return title;
    
    switch (pathname) {
      case '/Alunos':
        return 'Lista de Alunos';
      case '/':
      case '/index':
        return 'Protocolo TEA';
      case '/AlunoDetalhes':
        return 'Detalhes do Aluno';
      case '/Formulario':
        return 'Formulário de Avaliação';
      case '/Cronograma':
        return 'Cronograma';
      default:
        return 'Protocolo TEA';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {shouldShowHeader && (
        <Header
          title={getAutoTitle()}
          subtitle={subtitle}
          showBackButton={showBackButton}
          showLogout={showLogout}
          onBackPress={onBackPress}
        />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
};

export default ScreenWrapper;
