import { IconSymbol } from '@/components/ui/IconSymbol';
import { IntercorrenciaData, intercorrenciaService } from '@/services/IntercorrenciaService';
import { styles } from '@/styles/FormularioStyles';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface ComboboxIntercorrenciasProps {
  visible: boolean;
  onSelectIntercorrencia: (intercorrencia: IntercorrenciaData) => void;
  onCancel: () => void;
}

const ComboboxIntercorrencias: React.FC<ComboboxIntercorrenciasProps> = ({
  visible,
  onSelectIntercorrencia,
  onCancel
}) => {
  const [intercorrencias, setIntercorrencias] = useState<IntercorrenciaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoizar função de carregamento para evitar loops
  const carregarIntercorrencias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando intercorrências disponíveis...');
      
      const { data, error } = await intercorrenciaService.buscarTodas();
      
      if (error) {
        console.error('Erro ao carregar intercorrências:', error);
        setError('Erro ao carregar intercorrências disponíveis');
        return;
      }

      if (data && data.length > 0) {
        setIntercorrencias(data);
        console.log(`Carregadas ${data.length} intercorrências`);
      } else {
        setIntercorrencias([]);
        setError('Nenhuma intercorrência encontrada no sistema');
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar intercorrências:', error);
      setError('Erro inesperado ao carregar intercorrências');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar intercorrências quando o componente fica visível
  useEffect(() => {
    if (visible) {
      carregarIntercorrencias();
    }
  }, [visible, carregarIntercorrencias]);

  if (!visible) return null;

  return (
    <View style={styles.comboboxContainer}>
      <Text style={styles.comboboxLabel}>
        Selecione uma intercorrência:
      </Text>
      
      {loading ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>
            Carregando intercorrências...
          </Text>
        </View>
      ) : error ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#ef4444', textAlign: 'center', marginBottom: 10 }}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.cancelarComboboxButton, { backgroundColor: '#6366f1' }]}
            onPress={carregarIntercorrencias}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : intercorrencias.length === 0 ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#6b7280', textAlign: 'center' }}>
            Nenhuma intercorrência encontrada no sistema
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.comboboxScroll} showsVerticalScrollIndicator={false}>
          {intercorrencias.map((intercorrencia) => (
            <TouchableOpacity
              key={intercorrencia.id_intercorrencia}
              style={styles.comboboxItem}
              onPress={() => onSelectIntercorrencia(intercorrencia)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
                  {intercorrencia.sigla} - {intercorrencia.nome}
                </Text>
                {intercorrencia.descricao && (
                  <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 20 }}>
                    {intercorrencia.descricao}
                  </Text>
                )}
              </View>
              <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <TouchableOpacity 
        style={styles.cancelarComboboxButton}
        onPress={onCancel}
      >
        <Text style={styles.cancelarComboboxText}>
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ComboboxIntercorrencias;
