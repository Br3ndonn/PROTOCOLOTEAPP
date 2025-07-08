import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FormInput from './FormInput';
import IntercorrenciasSection from './IntercorrenciasSection';
import SomatorioSection from './SomatorioSection';
import TentativasGrid from './TentativasGrid';
import { AtividadeData, CompletudeOption } from './types';

interface AtividadeContainerProps {
  atividade: AtividadeData;
  onUpdateData: (field: keyof AtividadeData, value: any) => void;
  onUpdatePontuacao: (tentativaId: string, value: number) => void;
  onUpdateIntercorrencia: (intercorrenciaId: string, field: 'selecionada' | 'frequencia' | 'intensidade', value: boolean | number) => void;
  onSalvar: () => void;
  onToggleMinimizar: () => void;
  onCalcularSomatorio: () => void;
  onDesfazer: () => void;
  onExcluir: () => void;
  completudeOptions: CompletudeOption[];
}

const AtividadeContainer: React.FC<AtividadeContainerProps> = ({
  atividade,
  onUpdateData,
  onUpdatePontuacao,
  onUpdateIntercorrencia,
  onSalvar,
  onToggleMinimizar,
  onCalcularSomatorio,
  onDesfazer,
  onExcluir,
  completudeOptions
}) => {
  return (
    <View style={[
      styles.atividadeContainer,
      atividade.salva && styles.atividadeContainerSalva
    ]}>
      {/* Header da atividade */}
      <TouchableOpacity 
        style={styles.atividadeHeader}
        onPress={onToggleMinimizar}
      >
        <View style={styles.atividadeHeaderContent}>
          <Text style={styles.atividadeTitle}>{atividade.atividade}</Text>
          <View style={styles.atividadeStatus}>
            {atividade.salva && (
              <View style={styles.statusSalva}>
                <IconSymbol name="checkmark.circle.fill" size={16} color="#10b981" />
                <Text style={styles.statusSalvaText}>Salva</Text>
              </View>
            )}
            <IconSymbol 
              name={atividade.minimizada ? "chevron.down" : "chevron.up"} 
              size={20} 
              color="#6b7280" 
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Conteúdo da atividade (visível apenas se não estiver minimizada) */}
      {!atividade.minimizada && (
        <View style={styles.atividadeContent}>
          {/* Meta */}
          <FormInput
            label="Meta"
            value={atividade.meta}
            onChangeText={(text) => onUpdateData('meta', text)}
            placeholder="Meta estabelecida para esta atividade"
            multiline
            required
          />

          {/* Completude do Planejado */}
          <View style={styles.completudeSection}>
            <Text style={styles.completudeTitle}>Completude do Planejado</Text>
            <View style={styles.optionsContainer}>
              {completudeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    atividade.completude === option && styles.optionSelected
                  ]}
                  onPress={() => onUpdateData('completude', option)}
                >
                  <Text style={[
                    styles.optionText,
                    atividade.completude === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Desempenho nas Tentativas */}
          <TentativasGrid
            tentativas={atividade.tentativas}
            onUpdatePontuacao={onUpdatePontuacao}
          />

          {/* Intercorrências */}
          <IntercorrenciasSection
            houveIntercorrencia={atividade.houveIntercorrencia}
            intercorrencias={atividade.intercorrencias}
            onToggleIntercorrencia={() => onUpdateData('houveIntercorrencia', !atividade.houveIntercorrencia)}
            onUpdateIntercorrencia={onUpdateIntercorrencia}
          />

          {/* Somatório */}
          <SomatorioSection
            somatorio={atividade.somatorio}
            onCalcularSomatorio={onCalcularSomatorio}
            onChangeSomatorio={(value) => onUpdateData('somatorio', value)}
          />

          {/* Botões de Ação */}
          {!atividade.salva ? (
            <TouchableOpacity 
              style={styles.salvarAtividadeButton}
              onPress={onSalvar}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
              <Text style={styles.salvarAtividadeButtonText}>Salvar Atividade</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.acoesAdicionaisContainer}>
              <TouchableOpacity 
                style={styles.desfazerButton}
                onPress={onDesfazer}
              >
                <IconSymbol name="arrow.uturn.left" size={20} color="#ffffff" />
                <Text style={styles.desfazerButtonText}>Desfazer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.excluirButton}
                onPress={onExcluir}
              >
                <IconSymbol name="trash" size={20} color="#ffffff" />
                <Text style={styles.excluirButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AtividadeContainer;
