import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BotoesAcaoProps {
  onSalvar: () => void;
  onLimpar: () => void;
}

const BotoesAcao: React.FC<BotoesAcaoProps> = ({ onSalvar, onLimpar }) => {
  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.limparButton} onPress={onLimpar}>
        <IconSymbol name="chevron.left" size={20} color="#ef4444" />
        <Text style={styles.limparButtonText}>Limpar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.salvarButton} onPress={onSalvar}>
        <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
        <Text style={styles.salvarButtonText}>Salvar Aula</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BotoesAcao;
