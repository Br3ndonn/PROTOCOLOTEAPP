import { styles } from '@/styles/LoginScreenStyles';
import React from 'react';
import { Text, View } from 'react-native';

interface AuthHeaderProps {
  isSignUp: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ isSignUp }) => {
  return (
    <View>
      <Text style={styles.title}>Protocolo TEA</Text>
      <Text style={styles.subtitle}>
        {isSignUp ? 'Criar Conta' : 'Fazer Login'}
      </Text>
    </View>
  );
};
