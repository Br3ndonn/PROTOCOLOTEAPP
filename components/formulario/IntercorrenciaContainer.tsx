import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FormInput from './FormInput';
import { IntercorrenciaGerenciada } from './types';

interface IntercorrenciaContainerProps {
  intercorrencia: IntercorrenciaGerenciada;
  onUpdateData: (field: keyof IntercorrenciaGerenciada, value: any) => void;
  onSalvar: () => void;
  onToggleMinimizar: () => void;
  onDesfazer: () => void;
  onExcluir: () => void;
}

const IntercorrenciaContainer: React.FC<IntercorrenciaContainerProps> = ({
  intercorrencia,
  onUpdateData,
  onSalvar,
  onToggleMinimizar,
  onDesfazer,
  onExcluir
}) => {
  return (
    <View style={[
      styles.atividadeContainer,
      intercorrencia.salva && styles.atividadeContainerSalva
    ]}>
      {/* Header da intercorrência */}
      <TouchableOpacity 
        style={styles.atividadeHeader}
        onPress={onToggleMinimizar}
      >
        <View style={styles.atividadeHeaderContent}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>
            {intercorrencia.nome}
            {intercorrencia.salva && (
              <Text style={{ color: '#10b981', fontWeight: '500' }}> ✓ Validada</Text>
            )}
          </Text>
          <IconSymbol 
            name={intercorrencia.minimizada ? "chevron.right" : "chevron.down"} 
            size={16} 
            color="#6b7280" 
          />
        </View>
      </TouchableOpacity>

      {/* Conteúdo da intercorrência (visível apenas se não estiver minimizada) */}
      {!intercorrencia.minimizada && (
        <View style={styles.atividadeContent}>
          {/* Frequência */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Frequência (1-4)</Text>
            <FormInput
              label=""
              value={intercorrencia.frequencia.toString()}
              onChangeText={(text) => {
                const valor = parseInt(text) || 1;
                if (valor >= 1 && valor <= 4) {
                  onUpdateData('frequencia', valor);
                }
              }}
              placeholder="1"
              keyboardType="numeric"
            />
          </View>

          {/* Intensidade */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Intensidade (1-4)</Text>
            <FormInput
              label=""
              value={intercorrencia.intensidade.toString()}
              onChangeText={(text) => {
                const valor = parseInt(text) || 1;
                if (valor >= 1 && valor <= 4) {
                  onUpdateData('intensidade', valor);
                }
              }}
              placeholder="1"
              keyboardType="numeric"
            />
          </View>

          {/* Botões de Ação */}
          {!intercorrencia.salva ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, paddingTop: 15 }}>
              <TouchableOpacity style={styles.salvarButton} onPress={onSalvar}>
                <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
                <Text style={styles.salvarButtonText}>Validar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.excluirButton} onPress={onExcluir}>
                <IconSymbol name="trash" size={20} color="white" />
                <Text style={styles.excluirButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, paddingTop: 15 }}>
              <TouchableOpacity style={styles.desfazerButton} onPress={onDesfazer}>
                <IconSymbol name="arrow.uturn.left" size={20} color="white" />
                <Text style={styles.desfazerButtonText}>Desfazer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.excluirButton} onPress={onExcluir}>
                <IconSymbol name="trash" size={20} color="white" />
                <Text style={styles.excluirButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default IntercorrenciaContainer;
