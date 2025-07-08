import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ATIVIDADES_DISPONIVEIS } from './constants';

interface ComboboxAtividadesProps {
  visible: boolean;
  onSelectAtividade: (atividade: string) => void;
  onCancel: () => void;
}

const ComboboxAtividades: React.FC<ComboboxAtividadesProps> = ({
  visible,
  onSelectAtividade,
  onCancel
}) => {
  if (!visible) return null;

  return (
    <View style={styles.comboboxContainer}>
      <Text style={styles.comboboxLabel}>
        Selecione uma atividade do plano de intervenção:
      </Text>
      <ScrollView style={styles.comboboxScroll} showsVerticalScrollIndicator={false}>
        {ATIVIDADES_DISPONIVEIS.map((atividade) => (
          <TouchableOpacity
            key={atividade.id}
            style={styles.comboboxItem}
            onPress={() => onSelectAtividade(`${atividade.codigo} - ${atividade.nome}`)}
          >
            <Text style={styles.comboboxItemCodigo}>{atividade.codigo}</Text>
            <Text style={styles.comboboxItemNome}>{atividade.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.cancelarComboboxButton}
        onPress={onCancel}
      >
        <Text style={styles.cancelarComboboxText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComboboxAtividades;
