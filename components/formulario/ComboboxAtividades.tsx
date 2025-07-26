import { AtividadeParaSelecao, planejamentoAtividadesService } from '@/services/PlanejamentoAtividadesService';
import { styles } from '@/styles/FormularioStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ComboboxAtividadesProps {
  visible: boolean;
  onSelectAtividade: (atividade: AtividadeParaSelecao) => void;
  onCancel: () => void;
  aprendizId?: string; // ID do aprendiz para carregar atividades do planejamento
}

const ComboboxAtividades: React.FC<ComboboxAtividadesProps> = ({
  visible,
  onSelectAtividade,
  onCancel,
  aprendizId
}) => {
  const [atividades, setAtividades] = useState<AtividadeParaSelecao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoizar função de carregamento para evitar loops
  const carregarAtividades = useCallback(async () => {
    if (!aprendizId) {
      setError('ID do aprendiz não encontrado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando atividades para aprendiz:', aprendizId);
      
      const { data, error } = await planejamentoAtividadesService.buscarAtividadesPorAprendiz(aprendizId);
      
      if (error) {
        console.error('Erro ao carregar atividades:', error);
        setError('Erro ao carregar atividades do planejamento');
        return;
      }

      if (data && data.length > 0) {
        setAtividades(data);
        console.log(`Carregadas ${data.length} atividades`);
      } else {
        setAtividades([]);
        setError('Nenhuma atividade encontrada no planejamento deste aprendiz');
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar atividades:', error);
      setError('Erro inesperado ao carregar atividades');
    } finally {
      setLoading(false);
    }
  }, [aprendizId]);

  // Carregar atividades quando o componente fica visível
  useEffect(() => {
    if (visible && aprendizId) {
      carregarAtividades();
    }
  }, [visible, aprendizId, carregarAtividades]);

  if (!visible) return null;

  return (
    <View style={styles.comboboxContainer}>
      <Text style={styles.comboboxLabel}>
        Selecione uma atividade do plano de intervenção:
      </Text>
      
      {loading ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>
            Carregando atividades...
          </Text>
        </View>
      ) : error ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 10 }}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.cancelarComboboxButton, { backgroundColor: '#6366f1' }]}
            onPress={carregarAtividades}
          >
            <Text style={[styles.cancelarComboboxText, { color: 'white' }]}>
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : atividades.length === 0 ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#6b7280', textAlign: 'center' }}>
            Nenhuma atividade encontrada no planejamento deste aprendiz
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.comboboxScroll} showsVerticalScrollIndicator={false}>
          {atividades.map((atividade) => (
            <TouchableOpacity
              key={atividade.id}
              style={styles.comboboxItem}
              onPress={() => onSelectAtividade(atividade)}
            >
              <Text style={styles.comboboxItemCodigo}>
                {atividade.sigla} - {atividade.numero}
              </Text>
              <Text style={styles.comboboxItemNome}>{atividade.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <TouchableOpacity 
        style={styles.cancelarComboboxButton}
        onPress={onCancel}
      >
        <Text style={styles.cancelarComboboxText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComboboxAtividades;
