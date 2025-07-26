import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import ComboboxIntercorrencias from './ComboboxIntercorrencias';
import IntercorrenciaContainer from './IntercorrenciaContainer';
import IntercorrenciasSection from './IntercorrenciasSection';
import { IntercorrenciaData, IntercorrenciaGerenciada } from './types';

interface GerenciadorIntercorrenciasProps {
  intercorrencias: IntercorrenciaGerenciada[];
  aprendizId: string;
  atividadeId: string;
  disabled?: boolean;
  mostrarCombobox?: boolean;
  onIntercorrenciasChange?: (hasIntercorrencias: boolean) => void;
  onUpdateIntercorrencias?: (intercorrencias: IntercorrenciaData[]) => void;
  onNovaIntercorrencia?: () => void;
  onSelecionarIntercorrencia?: (intercorrencia: any) => void;
  onCancelarCombobox?: () => void;
  onSalvar?: (intercorrenciaId: string) => void;
  onToggleMinimizar?: (intercorrenciaId: string) => void;
  onDesfazer?: (intercorrenciaId: string) => void;
  onExcluir?: (intercorrenciaId: string) => void;
  // Nova prop para integração com sistema temporário
  onSalvarIntercorrenciaTemporaria?: (intercorrencia: IntercorrenciaData) => void;
}

const GerenciadorIntercorrencias: React.FC<GerenciadorIntercorrenciasProps> = ({ 
  intercorrencias,
  aprendizId,
  atividadeId,
  disabled = false,
  mostrarCombobox = false,
  onIntercorrenciasChange,
  onUpdateIntercorrencias,
  onNovaIntercorrencia,
  onSelecionarIntercorrencia,
  onCancelarCombobox,
  onSalvar,
  onToggleMinimizar,
  onDesfazer,
  onExcluir,
  onSalvarIntercorrenciaTemporaria
}) => {
  // Estado local para controle de intercorrências selecionadas
  const [intercorrenciasSelecionadas, setIntercorrenciasSelecionadas] = useState<IntercorrenciaData[]>([]);

  // Função para lidar com o salvamento de intercorrência
  const handleSalvarIntercorrencia = useCallback(async (intercorrenciaId: string) => {
    const intercorrencia = intercorrencias.find(i => i.id === intercorrenciaId);
    if (!intercorrencia) {
      Alert.alert('Erro', 'Intercorrência não encontrada');
      return;
    }

    // Validar intercorrência antes de salvar
    if (!intercorrencia.selecionada || !intercorrencia.frequencia || !intercorrencia.intensidade) {
      Alert.alert('Erro de Validação', 'Intercorrência deve estar selecionada com frequência e intensidade definidas');
      return;
    }

    try {
      // Se existe callback customizado, usar ele
      if (onSalvarIntercorrenciaTemporaria) {
        onSalvarIntercorrenciaTemporaria(intercorrencia);
      } else {
        // Marcar intercorrência como salva na interface
        onSalvar && onSalvar(intercorrenciaId);
        Alert.alert('Sucesso', 'Intercorrência salva temporariamente. Será persistida quando a aula for finalizada.');
      }
    } catch (error) {
      console.error('Erro ao salvar intercorrência:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a intercorrência');
    }
  }, [intercorrencias, onSalvarIntercorrenciaTemporaria, onSalvar]);

  // Função para adicionar nova intercorrência
  const handleNovaIntercorrencia = useCallback(() => {
    onNovaIntercorrencia && onNovaIntercorrencia();
  }, [onNovaIntercorrencia]);

  // Função para cancelar combobox
  const handleCancelarCombobox = useCallback(() => {
    onCancelarCombobox && onCancelarCombobox();
  }, [onCancelarCombobox]);

  if (disabled) {
    return null;
  }

  return (
    <View style={styles.section}>
      {/* Header com botão Nova Intercorrência */}
      <View style={styles.novaAtividadeHeader}>
        <Text style={styles.sectionTitle}>Intercorrências da Atividade</Text>
        {onNovaIntercorrencia && (
          <TouchableOpacity 
            style={styles.novaAtividadeButton}
            onPress={handleNovaIntercorrencia}
          >
            <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
            <Text style={styles.novaAtividadeButtonText}>Nova Intercorrência</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Combobox para seleção de intercorrência */}
      <ComboboxIntercorrencias 
        visible={mostrarCombobox}
        onSelectIntercorrencia={onSelecionarIntercorrencia || (() => {})}
        onCancel={handleCancelarCombobox}
      />

      {/* Seção de Intercorrências */}
      <IntercorrenciasSection
        aprendizId={aprendizId}
        atividadeId={atividadeId}
        onIntercorrenciasChange={onIntercorrenciasChange}
      />

      {/* Lista de intercorrências gerenciadas */}
      {intercorrencias.map((intercorrencia) => (
        <IntercorrenciaContainer 
          key={intercorrencia.id}
          intercorrencia={intercorrencia}
          onUpdateData={(field, value) => {
            // Notificar o componente pai sobre a mudança
            if (onUpdateIntercorrencias) {
              const intercorrenciasAtualizadas = intercorrencias.map(i => 
                i.id === intercorrencia.id 
                  ? { ...i, [field]: value }
                  : i
              );
              onUpdateIntercorrencias(intercorrenciasAtualizadas);
            }
          }}
          onSalvar={() => handleSalvarIntercorrencia(intercorrencia.id)}
          onToggleMinimizar={() => onToggleMinimizar?.(intercorrencia.id)}
          onDesfazer={() => onDesfazer?.(intercorrencia.id)}
          onExcluir={() => onExcluir?.(intercorrencia.id)}
        />
      ))}
    </View>
  );
};

export default GerenciadorIntercorrencias;
