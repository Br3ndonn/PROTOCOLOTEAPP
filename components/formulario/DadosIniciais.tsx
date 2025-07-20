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
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Text style={{ fontSize: 16, color: '#374151' }}>
              {formData.aprendiz || 'Nome do aprendiz'}
            </Text>
          </View>
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
        label="Local"
        value={formData.local}
        onChangeText={(text) => onUpdateFormData('local', text)}
        placeholder="Local da atividade"
      />
    </View>
  );
};

export default DadosIniciais;
