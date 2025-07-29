import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@/styles/AlunoDetalhesStyles';

type AbaType = 'basicas' | 'complementares';

interface TabContainerProps {
  abaAtiva: AbaType;
  onTabChange: (aba: AbaType) => void;
}

export const TabContainer: React.FC<TabContainerProps> = ({ abaAtiva, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, abaAtiva === 'basicas' && styles.tabAtiva]}
        onPress={() => onTabChange('basicas')}
      >
        <Text style={[styles.tabText, abaAtiva === 'basicas' && styles.tabTextAtiva]}>
          Informações Básicas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, abaAtiva === 'complementares' && styles.tabAtiva]}
        onPress={() => onTabChange('complementares')}
      >
        <Text style={[styles.tabText, abaAtiva === 'complementares' && styles.tabTextAtiva]}>
          Informações Complementares
        </Text>
      </TouchableOpacity>
    </View>
  );
};
