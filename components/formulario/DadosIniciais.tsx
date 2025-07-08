import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, View } from 'react-native';
import FormInput from './FormInput';
import { FormData } from './types';

interface DadosIniciaisProps {
  formData: FormData;
  onUpdateFormData: (field: keyof FormData, value: string) => void;
}

const DadosIniciais: React.FC<DadosIniciaisProps> = ({
  formData,
  onUpdateFormData
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dados Iniciais</Text>
      
      <FormInput
        label="Aprendiz"
        value={formData.aprendiz}
        onChangeText={(text) => onUpdateFormData('aprendiz', text)}
        placeholder="Nome do aprendiz"
        required
      />
      
      <FormInput
        label="Responsável"
        value={formData.responsavel}
        onChangeText={(text) => onUpdateFormData('responsavel', text)}
        placeholder="Nome do responsável"
        required
      />
      
      <FormInput
        label="Data / Horário"
        value={formData.data}
        onChangeText={(text) => onUpdateFormData('data', text)}
        placeholder="DD/MM/AAAA - HH:MM"
        required
      />
      
      <FormInput
        label="Local"
        value={formData.local}
        onChangeText={(text) => onUpdateFormData('local', text)}
        placeholder="Local da atividade"
      />
    </View>
  );
};

export default DadosIniciais;
