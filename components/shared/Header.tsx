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

  // Determinar se deve mostrar o botão de voltar automaticamente
  const shouldShowBackButton = showBackButton !== undefined 
    ? showBackButton 
    : pathname !== '/LoginScreen' && pathname !== '/Alunos';

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

  return (
    <View style={styles.header}>
      {/* Botão de Voltar */}
      <View style={styles.sideButtonContainer}>
        {shouldShowBackButton && (
          <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
            <IconSymbol name="chevron.left" size={26} color="#6366f1" />
          </TouchableOpacity>
        )}
      </View>
      {/* Conteúdo central do Header */}
      <View style={styles.centerContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {user && (
          <Text style={styles.userInfo} numberOfLines={1}>
            Olá, {user.user_metadata?.nome_completo || user.email}
          </Text>
        )}
      </View>
      {/* Botão de Logout */}
      <View style={styles.sideButtonContainer}>
        {showLogout && (
          <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 70,
    // boxShadow para web
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    elevation: 2,
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
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    // boxShadow para web
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: '#1f2937',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 15,
    color: '#6366f1',
    marginTop: 2,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },
  userInfo: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    maxWidth: 180,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
  },
};

export default Header;
