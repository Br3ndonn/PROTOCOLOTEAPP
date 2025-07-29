import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/AlunoDetalhesStyles';

interface BottomActionsProps {
  aprendizId: string;
  onGerarGrafico: () => void;
}

export const BottomActions: React.FC<BottomActionsProps> = ({ aprendizId, onGerarGrafico }) => {
  const handleNovaAula = () => {
    router.push({
      pathname: '/Formulario',
      params: {
        aprendizId: aprendizId
      }
    });
  };

  return (
    <>
      <View style={{ height: 16 }} />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.gerarGraficoButton} onPress={onGerarGrafico}>
          <IconSymbol name="chart.bar.fill" size={24} color="#ffffff" />
          <Text style={styles.gerarGraficoText}>Gerar Gráfico</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.novaAulaButton} onPress={handleNovaAula}>
          <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
          <Text style={styles.novaAulaText}>Nova Aula</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
