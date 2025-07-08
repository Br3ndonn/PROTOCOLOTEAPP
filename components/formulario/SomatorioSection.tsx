import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SomatorioSectionProps {
  somatorio: string;
  onCalcularSomatorio: () => void;
  onChangeSomatorio: (value: string) => void;
}

const SomatorioSection: React.FC<SomatorioSectionProps> = ({
  somatorio,
  onCalcularSomatorio,
  onChangeSomatorio
}) => {
  return (
    <View style={styles.somatorioSection}>
      <Text style={styles.somatorioTitle}>Somatório da Pontuação</Text>
      <View style={styles.somatorioContainer}>
        <TouchableOpacity 
          style={styles.calcularButton} 
          onPress={onCalcularSomatorio}
        >
          <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
          <Text style={styles.calcularButtonText}>Calcular</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.somatorioInput}
          value={somatorio}
          onChangeText={onChangeSomatorio}
          placeholder="Total"
          keyboardType="numeric"
          editable={false}
        />
      </View>
    </View>
  );
};

export default SomatorioSection;
