import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useAtividadesTemporarias } from '../../hooks/useAtividadesTemporarias';
import { AtividadeParaSelecao } from '../../services/PlanejamentoAtividadesService';
import { converterAtividadeParaBanco, validarAtividadeParaSalvar } from '../../utils/atividadeConverter';
import AtividadeContainer from './AtividadeContainer';
import ComboboxAtividades from './ComboboxAtividades';
import { AtividadeData, CompletudeOption } from './types';

interface GerenciadorAtividadesProps {
  atividades: AtividadeData[];
  mostrarCombobox: boolean;
  completudeOptions: CompletudeOption[];
  aprendizId?: string; // ID do aprendiz para carregar atividades do planejamento
  onNovaAtividade: () => void;
  onSelecionarAtividade: (atividade: AtividadeParaSelecao) => void;
  onCancelarCombobox: () => void;
  onUpdateData: (atividadeId: string, field: keyof AtividadeData, value: any) => void;
  onUpdatePontuacao: (atividadeId: string, tentativaId: string, value: number) => void;
  onSalvar: (atividadeId: string) => void;
  onToggleMinimizar: (atividadeId: string) => void;
  onCalcularSomatorio: (atividadeId: string) => void;
  onDesfazer: (atividadeId: string) => void;
  onExcluir: (atividadeId: string) => void;
  // Nova prop para integração com sistema temporário
  onSalvarAtividadeTemporaria?: (atividade: AtividadeData) => void;
  // Props para integrar com o hook global de intercorrências
  adicionarIntercorrencia?: (intercorrencia: any) => string;
}

const GerenciadorAtividades: React.FC<GerenciadorAtividadesProps> = ({
  atividades,
  mostrarCombobox,
  completudeOptions,
  aprendizId,
  onNovaAtividade,
  onSelecionarAtividade,
  onCancelarCombobox,
  onUpdateData,
  onUpdatePontuacao,
  onSalvar,
  onToggleMinimizar,
  onCalcularSomatorio,
  onDesfazer,
  onExcluir,
  onSalvarAtividadeTemporaria,
  adicionarIntercorrencia
}) => {
  // Hook para gerenciar atividades temporárias
  const { salvarAtividadeLocal } = useAtividadesTemporarias();

  // Função para lidar com o salvamento de atividade
  const handleSalvarAtividade = async (atividadeId: string) => {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) {
      Alert.alert('Erro', 'Atividade não encontrada');
      return;
    }

    // Validar atividade antes de salvar
    const { valid, error } = validarAtividadeParaSalvar(atividade);
    if (!valid) {
      Alert.alert('Erro de Validação', error || 'Dados da atividade são inválidos');
      return;
    }

    try {
      // Se existe callback customizado, usar ele
      if (onSalvarAtividadeTemporaria) {
        onSalvarAtividadeTemporaria(atividade);
      } else {
        // Converter dados da atividade para formato do banco
        const dadosBanco = converterAtividadeParaBanco(atividade);
        if (!dadosBanco) {
          Alert.alert('Erro', 'Não foi possível preparar os dados da atividade para salvamento');
          return;
        }

        // Salvar localmente (temporariamente)
        const { success } = await salvarAtividadeLocal(dadosBanco);
        if (success) {
          // Marcar atividade como salva na interface
          onSalvar(atividadeId);
          Alert.alert('Sucesso', 'Atividade salva temporariamente. Será persistida quando a aula for finalizada.');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a atividade');
    }
  };
  return (
    <View style={styles.section}>
      {/* Header com botão Nova Atividade */}
      <View style={styles.novaAtividadeHeader}>
        <Text style={styles.sectionTitle}>Atividades da Aula</Text>
        <TouchableOpacity 
          style={styles.novaAtividadeButton}
          onPress={onNovaAtividade}
        >
          <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
          <Text style={styles.novaAtividadeButtonText}>Nova Atividade</Text>
        </TouchableOpacity>
      </View>

      {/* Combobox para seleção de atividade */}
      <ComboboxAtividades 
        visible={mostrarCombobox}
        onSelectAtividade={onSelecionarAtividade}
        onCancel={onCancelarCombobox}
        aprendizId={aprendizId}
      />

      {/* Lista de atividades adicionadas */}
      {atividades.map((atividade) => (
        <AtividadeContainer 
          key={atividade.id}
          atividade={atividade}
          aprendizId={aprendizId}
          onUpdateData={(field, value) => onUpdateData(atividade.id, field, value)}
          onUpdatePontuacao={(tentativaId, value) => onUpdatePontuacao(atividade.id, tentativaId, value)}
          onSalvar={() => handleSalvarAtividade(atividade.id)}
          onToggleMinimizar={() => onToggleMinimizar(atividade.id)}
          onCalcularSomatorio={() => onCalcularSomatorio(atividade.id)}
          onDesfazer={() => onDesfazer(atividade.id)}
          onExcluir={() => onExcluir(atividade.id)}
          completudeOptions={completudeOptions}
          adicionarIntercorrencia={adicionarIntercorrencia}
        />
      ))}
    </View>
  );
};

export default GerenciadorAtividades;
