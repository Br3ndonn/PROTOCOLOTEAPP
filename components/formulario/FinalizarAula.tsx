import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAtividadesTemporarias } from '../../hooks/useAtividadesTemporarias';
import { aulaService, CriarAulaInput } from '../../services/AulaService';
import { COMPLETUDE_REVERSE_MAPPING } from '../../services/ProgressoAtividadeService';

interface FinalizarAulaProps {
  dadosAula: Omit<CriarAulaInput, 'atividades'>;
  onSucesso?: (aulaId: number) => void;
  onError?: (error: any) => void;
}

const FinalizarAula: React.FC<FinalizarAulaProps> = ({
  dadosAula,
  onSucesso,
  onError
}) => {
  const {
    atividades,
    loading: atividadesLoading,
    validarTodasAtividades,
    prepararParaSalvamento,
    obterEstatisticas,
    limparAtividades,
    error: atividadesError
  } = useAtividadesTemporarias();

  const [salvandoAula, setSalvandoAula] = useState(false);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const estatisticas = obterEstatisticas();

  const handleFinalizarAula = async () => {
    try {
      setSalvandoAula(true);

      // Validar atividades antes de salvar
      const { valid, errors } = validarTodasAtividades();
      if (!valid) {
        Alert.alert(
          'Erro de Validação',
          `Existem problemas nas atividades:\n\n${errors.join('\n')}`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Preparar dados das atividades para salvamento
      const atividadesParaSalvar = prepararParaSalvamento();

      // Criar dados completos da aula
      const dadosCompletos: CriarAulaInput = {
        ...dadosAula,
        atividades: atividadesParaSalvar
      };

      console.log('Finalizando aula com dados:', dadosCompletos);

      // Criar aula no banco de dados
      const { data: aulaData, error } = await aulaService.criar(dadosCompletos);

      if (error) {
        console.error('Erro ao criar aula:', error);
        onError?.(error);
        Alert.alert(
          'Erro ao Salvar Aula',
          typeof error === 'string' ? error : 
          error.message || 'Ocorreu um erro inesperado ao salvar a aula.'
        );
        return;
      }

      if (!aulaData) {
        Alert.alert('Erro', 'Não foi possível criar a aula.');
        return;
      }

      // Limpar atividades temporárias após sucesso
      limparAtividades();

      // Notificar sucesso
      onSucesso?.(aulaData.id_aula);

      Alert.alert(
        'Sucesso!',
        `Aula criada com sucesso!\n\nID da Aula: ${aulaData.id_aula}\nAtividades salvas: ${atividadesParaSalvar.length}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erro inesperado ao finalizar aula:', error);
      onError?.(error);
      Alert.alert(
        'Erro Inesperado',
        'Ocorreu um erro inesperado. Tente novamente.'
      );
    } finally {
      setSalvandoAula(false);
    }
  };

  const handleLimparAtividades = () => {
    Alert.alert(
      'Confirmar Limpeza',
      'Tem certeza que deseja limpar todas as atividades salvas? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: limparAtividades }
      ]
    );
  };

  if (atividadesLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.sectionTitle}>Processando atividades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.novaAtividadeHeader}>
        <Text style={styles.sectionTitle}>Finalizar Aula</Text>
        <TouchableOpacity
          onPress={() => setMostrarDetalhes(!mostrarDetalhes)}
          style={styles.novaAtividadeButton}
        >
          <Text style={styles.novaAtividadeButtonText}>
            {mostrarDetalhes ? 'Ocultar' : 'Ver'} Detalhes
          </Text>
          <IconSymbol 
            name={mostrarDetalhes ? "chevron.up" : "chevron.down"} 
            size={16} 
            color="#ffffff" 
          />
        </TouchableOpacity>
      </View>

      {/* Estatísticas Resumidas */}
      <View style={styles.tentativasContainer}>
        <Text style={styles.tentativaTitle}>
          Atividades: {estatisticas.total} | Tentativas: {estatisticas.totalTentativas} | Pontos: {estatisticas.totalNotas} | Média: {estatisticas.mediaNotas}
        </Text>
      </View>

      {/* Detalhes das Atividades */}
      {mostrarDetalhes && (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Atividades Salvas:</Text>
          {atividades.length === 0 ? (
            <View style={styles.container}>
              <IconSymbol name="exclamationmark.triangle" size={24} color="#f59e0b" />
              <Text style={styles.tentativaTitle}>
                Nenhuma atividade foi salva ainda.
              </Text>
            </View>
          ) : (
            atividades.map((atividade, index) => (
              <View key={atividade.id_temporario} style={styles.atividadeContainer}>
                <Text style={styles.atividadeTitle}>
                  {index + 1}. {atividade.nome_atividade || `Atividade ${atividade.id_planejamento_atividades}`}
                </Text>
                <View style={styles.container}>
                  <Text style={styles.tentativaTitle}>
                    Completude: {COMPLETUDE_REVERSE_MAPPING[atividade.completude]}
                  </Text>
                  <Text style={styles.tentativaTitle}>
                    Tentativas: {atividade.tentativas_realizadas} | Pontos: {atividade.soma_notas}
                  </Text>
                  {atividade.observacoes && (
                    <Text style={styles.tentativaTitle}>
                      Obs: {atividade.observacoes}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Mensagem de Erro */}
      {atividadesError && (
        <View style={styles.container}>
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#ef4444" />
          <Text style={styles.tentativaTitle}>{atividadesError}</Text>
        </View>
      )}

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        {atividades.length > 0 && (
          <TouchableOpacity
            style={styles.limparButton}
            onPress={handleLimparAtividades}
            disabled={salvandoAula}
          >
            <IconSymbol name="trash" size={16} color="#ef4444" />
            <Text style={styles.limparButtonText}>Limpar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.salvarButton,
            atividades.length === 0 && styles.limparButton
          ]}
          onPress={handleFinalizarAula}
          disabled={salvandoAula || atividades.length === 0}
        >
          {salvandoAula ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.salvarButtonText}>Salvando...</Text>
            </>
          ) : (
            <>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
              <Text style={styles.salvarButtonText}>Finalizar Aula</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FinalizarAula;
