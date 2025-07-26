import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/PerfilProfessorSyles';

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  return (
    <View style={styles.actionsSection}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#ffffff" />
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
};
