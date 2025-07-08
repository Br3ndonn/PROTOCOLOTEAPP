import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AtividadeContainer from './AtividadeContainer';
import ComboboxAtividades from './ComboboxAtividades';
import { AtividadeData, CompletudeOption } from './types';

interface GerenciadorAtividadesProps {
  atividades: AtividadeData[];
  mostrarCombobox: boolean;
  completudeOptions: CompletudeOption[];
  onNovaAtividade: () => void;
  onSelecionarAtividade: (atividade: string) => void;
  onCancelarCombobox: () => void;
  onUpdateData: (atividadeId: string, field: keyof AtividadeData, value: any) => void;
  onUpdatePontuacao: (atividadeId: string, tentativaId: string, value: number) => void;
  onUpdateIntercorrencia: (atividadeId: string, intercorrenciaId: string, field: 'selecionada' | 'frequencia' | 'intensidade', value: boolean | number) => void;
  onSalvar: (atividadeId: string) => void;
  onToggleMinimizar: (atividadeId: string) => void;
  onCalcularSomatorio: (atividadeId: string) => void;
  onDesfazer: (atividadeId: string) => void;
  onExcluir: (atividadeId: string) => void;
}

const GerenciadorAtividades: React.FC<GerenciadorAtividadesProps> = ({
  atividades,
  mostrarCombobox,
  completudeOptions,
  onNovaAtividade,
  onSelecionarAtividade,
  onCancelarCombobox,
  onUpdateData,
  onUpdatePontuacao,
  onUpdateIntercorrencia,
  onSalvar,
  onToggleMinimizar,
  onCalcularSomatorio,
  onDesfazer,
  onExcluir
}) => {
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
      />

      {/* Lista de atividades adicionadas */}
      {atividades.map((atividade) => (
        <AtividadeContainer 
          key={atividade.id}
          atividade={atividade}
          onUpdateData={(field, value) => onUpdateData(atividade.id, field, value)}
          onUpdatePontuacao={(tentativaId, value) => onUpdatePontuacao(atividade.id, tentativaId, value)}
          onUpdateIntercorrencia={(intercorrenciaId, field, value) => onUpdateIntercorrencia(atividade.id, intercorrenciaId, field, value)}
          onSalvar={() => onSalvar(atividade.id)}
          onToggleMinimizar={() => onToggleMinimizar(atividade.id)}
          onCalcularSomatorio={() => onCalcularSomatorio(atividade.id)}
          onDesfazer={() => onDesfazer(atividade.id)}
          onExcluir={() => onExcluir(atividade.id)}
          completudeOptions={completudeOptions}
        />
      ))}
    </View>
  );
};

export default GerenciadorAtividades;
