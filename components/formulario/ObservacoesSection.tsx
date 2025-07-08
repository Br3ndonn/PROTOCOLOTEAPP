import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, View } from 'react-native';
import FormInput from './FormInput';

interface ObservacoesSectionProps {
  observacoes: string;
  onChangeObservacoes: (text: string) => void;
}

const ObservacoesSection: React.FC<ObservacoesSectionProps> = ({
  observacoes,
  onChangeObservacoes
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Observações Adicionais</Text>
      <FormInput
        label=""
        value={observacoes}
        onChangeText={onChangeObservacoes}
        placeholder="Adicione observações sobre o desempenho, comportamento ou outros aspectos relevantes..."
        multiline
      />
    </View>
  );
};

export default ObservacoesSection;
