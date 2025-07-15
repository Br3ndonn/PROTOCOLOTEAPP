import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, View } from 'react-native';
import FormInput from './FormInput';
import SeletorAprendiz from './SeletorAprendiz';
import { FormData } from './types';

interface DadosIniciaisProps {
  formData: FormData;
  onUpdateFormData: (field: keyof FormData, value: string) => void;
  aprendizPreenchidoAutomaticamente?: boolean;
  loadingAprendiz?: boolean;
}

const DadosIniciais: React.FC<DadosIniciaisProps> = ({
  formData,
  onUpdateFormData,
  aprendizPreenchidoAutomaticamente = false,
  loadingAprendiz = false
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dados Iniciais</Text>
      
      {/* Campo Aprendiz - usar seletor se não foi preenchido automaticamente */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: '#374151',
          marginBottom: 8
        }}>
          Aprendiz <Text style={{ color: '#ef4444' }}>*</Text>
        </Text>
        {aprendizPreenchidoAutomaticamente ? (
          <FormInput
            label=""
            value={formData.aprendiz}
            onChangeText={(text) => onUpdateFormData('aprendiz', text)}
            placeholder="Nome do aprendiz"
            required={false}
          />
        ) : (
          <SeletorAprendiz
            valorSelecionado={formData.aprendiz}
            onSelecionar={(nome) => onUpdateFormData('aprendiz', nome)}
          />
        )}
        {loadingAprendiz && (
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            Carregando dados do aprendiz...
          </Text>
        )}
      </View>
      
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
