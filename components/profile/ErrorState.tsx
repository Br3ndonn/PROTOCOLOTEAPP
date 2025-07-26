import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/PerfilProfessorSyles';

export const ErrorState: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Usuário não encontrado</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.replace('/LoginScreen')}
        >
          <Text style={styles.loginButtonText}>Ir para Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
