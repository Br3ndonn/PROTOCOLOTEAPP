import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { styles } from '@/styles/AlunoDetalhesStyles';

interface LoadingScreenProps {
  title?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ title = "Carregando..." }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={{ marginTop: 10, color: '#6b7280' }}>Carregando dados do aluno...</Text>
    </View>
  );
};

interface ErrorScreenProps {
  error: string | null;
  onRetry: () => void;
  onGoBack: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry, onGoBack }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#ef4444', marginBottom: 20, textAlign: 'center' }}>
        {error || 'Aprendiz não encontrado'}
      </Text>
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#6366f1', 
          paddingHorizontal: 20, 
          paddingVertical: 10, 
          borderRadius: 8,
          marginBottom: 10
        }}
        onPress={onRetry}
      >
        <Text style={{ color: 'white' }}>Tentar novamente</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#6b7280', 
          paddingHorizontal: 20, 
          paddingVertical: 10, 
          borderRadius: 8 
        }}
        onPress={onGoBack}
      >
        <Text style={{ color: 'white' }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};
