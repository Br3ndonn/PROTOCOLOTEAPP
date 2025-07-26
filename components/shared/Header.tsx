import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showLogout = true,
  showBackButton,
  onBackPress
}) => {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Determinar se deve mostrar o ícone de perfil (apenas na tela de alunos)
  const shouldShowProfileIcon = pathname === '/Alunos';
  
  // Determinar se deve mostrar o botão de voltar (em todas as telas exceto alunos e login)
  const shouldShowBackButton = !shouldShowProfileIcon && pathname !== '/LoginScreen';

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            // Forçar navegação para tela de login após logout
            router.replace('/LoginScreen');
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    router.push('/PerfilProfessor');
  };

  return (
    <View style={styles.header}>
      {/* Ícone de Perfil (apenas na tela de alunos) ou Botão de Voltar */}
      <View style={styles.sideButtonContainer}>
        {shouldShowProfileIcon ? (
          <TouchableOpacity onPress={handleProfilePress} style={styles.iconButton}>
            <IconSymbol name="person.circle" size={28} color="#ffffff" />
          </TouchableOpacity>
        ) : shouldShowBackButton ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
            <IconSymbol name="chevron.left" size={26} color="#ffffff" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Conteúdo central do Header */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>Protocolo TEA</Text>
        {title && <Text style={styles.subtitle}>{title}</Text>}
      </View>
      
      {/* Espaço vazio do lado direito para manter simetria */}
      <View style={styles.sideButtonContainer} />
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 14,
    backgroundColor: '#6366f1',
    borderBottomWidth: 1,
    borderBottomColor: '#4f46e5',
    minHeight: 70,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  sideButtonContainer: {
    width: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },
};

export default Header;
