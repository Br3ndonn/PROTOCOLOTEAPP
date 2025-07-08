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
          onPress: () => signOut()
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
      {shouldShowBackButton && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#6366f1" />
        </TouchableOpacity>
      )}
      
      {/* Conteúdo do Header */}
      <View style={[styles.headerContent, shouldShowBackButton && styles.headerContentWithBack]}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {user && (
          <Text style={styles.userInfo}>
            Olá, {user.user_metadata?.nome_completo || user.email}
          </Text>
        )}
      </View>
      
      {/* Botão de Logout */}
      {showLogout && (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 60,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerContentWithBack: {
    marginLeft: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  userInfo: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    marginLeft: 8,
  },
};

export default Header;
