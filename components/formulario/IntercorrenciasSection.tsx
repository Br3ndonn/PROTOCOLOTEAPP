import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/FormularioStyles';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useIntercorrenciasTemporarias } from '../../hooks/useIntercorrenciasTemporarias';
import { IntercorrenciaData, intercorrenciaService } from '../../services/IntercorrenciaService';

interface IntercorrenciaFormData extends IntercorrenciaData {
  selecionada: boolean;
  frequencia: number | null;
  intensidade: number | null;
}

interface IntercorrenciasSectionProps {
  aprendizId: string;
  atividadeId: string;
  onIntercorrenciasChange?: (hasIntercorrencias: boolean) => void;
  // Props para integrar com o hook global de intercorrências
  adicionarIntercorrencia?: (intercorrencia: any) => string;
}

const IntercorrenciasSection: React.FC<IntercorrenciasSectionProps> = ({
  aprendizId,
  atividadeId,
  onIntercorrenciasChange,
  adicionarIntercorrencia: adicionarIntercorrenciaGlobal
}) => {
  const [houveIntercorrencia, setHouveIntercorrencia] = useState(false);
  const [intercorrencias, setIntercorrencias] = useState<IntercorrenciaFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const { adicionarIntercorrencia: adicionarLocal, removerIntercorrencia: removerIntercorrenciaTemporaria } = useIntercorrenciasTemporarias();

  // Usar a função global se fornecida, senão usar a local
  const adicionarIntercorrencia = adicionarIntercorrenciaGlobal || adicionarLocal;

  // Carregar intercorrências do banco
  useEffect(() => {
    carregarIntercorrencias();
  }, []);

  // Notificar mudanças de estado
  useEffect(() => {
    if (onIntercorrenciasChange) {
      const hasIntercorrenciasSelecionadas = intercorrencias.some(i => i.selecionada);
      onIntercorrenciasChange(houveIntercorrencia && hasIntercorrenciasSelecionadas);
    }
  }, [houveIntercorrencia, intercorrencias, onIntercorrenciasChange]);

  const carregarIntercorrencias = async () => {
    try {
      console.log('🔄 Carregando intercorrências do banco de dados...');
      setLoading(true);
      
      const resultado = await intercorrenciaService.buscarTodas();
      if (resultado.error) {
        throw new Error(resultado.error.message || 'Erro ao buscar intercorrências');
      }
      
      const dadosIntercorrencias = resultado.data || [];
      console.log('📋 Intercorrências carregadas:', dadosIntercorrencias);
      
      // Converter para formato do formulário
      const intercorrenciasFormatadas: IntercorrenciaFormData[] = dadosIntercorrencias.map((item: IntercorrenciaData) => ({
        ...item,
        selecionada: false,
        frequencia: null,
        intensidade: null
      }));
      
      setIntercorrencias(intercorrenciasFormatadas);
      console.log('✅ Intercorrências formatadas para o formulário:', intercorrenciasFormatadas);
    } catch (error) {
      console.error('❌ Erro ao carregar intercorrências:', error);
      Alert.alert('Erro', 'Não foi possível carregar as intercorrências');
    } finally {
      setLoading(false);
    }
  };

  const toggleIntercorrencia = () => {
    const novoEstado = !houveIntercorrencia;
    console.log('🔄 Toggling intercorrência:', { anterior: houveIntercorrencia, novo: novoEstado });
    
    setHouveIntercorrencia(novoEstado);
    
    // Se desmarcar, limpar todas as seleções
    if (!novoEstado) {
      setIntercorrencias(prev => prev.map(item => ({
        ...item,
        selecionada: false,
        frequencia: null,
        intensidade: null
      })));
      console.log('🧹 Limpando todas as seleções de intercorrências');
    }
  };

  const updateIntercorrencia = async (
    intercorrenciaId: number, 
    field: 'selecionada' | 'frequencia' | 'intensidade', 
    value: boolean | number
  ) => {
    console.log('🔄 Atualizando intercorrência:', { intercorrenciaId, field, value });
    
    setIntercorrencias(prev => prev.map(item => {
      if (item.id_intercorrencia === intercorrenciaId) {
        const updated = { ...item, [field]: value };
        
        // Se desmarcou, limpar frequência e intensidade
        if (field === 'selecionada' && !value) {
          updated.frequencia = null;
          updated.intensidade = null;
          // remover intercorrência temporária se desmarcar
          removerIntercorrenciaTemporaria(String(item.id_intercorrencia));
        }
        
        // Se marcou e tem frequência/intensidade, salvar no cache temporário
        if (updated.selecionada && updated.frequencia && updated.intensidade) {
          salvarIntercorrenciaTemporaria(updated);
        }
        
        return updated;
      }
      return item;
    }));
  };

  const salvarIntercorrenciaTemporaria = async (intercorrencia: IntercorrenciaFormData) => {
    try {
      console.log('💾 Salvando intercorrência para atividade específica:', {
        atividadeId,
        intercorrencia: intercorrencia.nome,
        frequencia: intercorrencia.frequencia,
        intensidade: intercorrencia.intensidade
      });
      
      await adicionarIntercorrencia({
        id_intercorrencia: intercorrencia.id_intercorrencia,
        nome_intercorrencia: intercorrencia.nome,
        frequencia: intercorrencia.frequencia!,
        intensidade: intercorrencia.intensidade!
      });
      
      console.log('✅ Intercorrência salva no cache temporário para a atividade:', atividadeId);
    } catch (error) {
      console.error('❌ Erro ao salvar intercorrência temporária:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.intercorrenciasSection}>
        <Text style={styles.intercorrenciasTitle}>Carregando intercorrências...</Text>
      </View>
    );
  }
  return (
    <View style={styles.intercorrenciasSection}>
      <Text style={styles.intercorrenciasTitle}>Intercorrências da Atividade</Text>
      
      {/* Checkbox principal */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={toggleIntercorrencia}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, houveIntercorrencia && styles.checkboxChecked]}>
          {houveIntercorrencia && (
            <IconSymbol name="checkmark" size={16} color="#ffffff" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>Houve intercorrência durante esta atividade?</Text>
      </TouchableOpacity>

      {/* Lista de intercorrências */}
      {houveIntercorrencia && (
        <View style={styles.intercorrenciasContainer}>
          <Text style={styles.sectionSubtitle}>
            Selecione as intercorrências e defina frequência e intensidade (1-4):
          </Text>
          
          {intercorrencias.map((intercorrencia) => (
            <View key={intercorrencia.id_intercorrencia} style={styles.intercorrenciaItem}>
              {/* Radio button e nome */}
              <TouchableOpacity 
                style={styles.radioContainer}
                onPress={() => updateIntercorrencia(intercorrencia.id_intercorrencia, 'selecionada', !intercorrencia.selecionada)}
              >
                <View style={[styles.radio, intercorrencia.selecionada && styles.radioSelected]}>
                  {intercorrencia.selecionada && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.intercorrenciaNome}>{intercorrencia.nome}</Text>
              </TouchableOpacity>

              {/* Campos de frequência e intensidade */}
              {intercorrencia.selecionada && (
                <View style={styles.frequenciaIntensidadeContainer}>
                  {/* Frequência */}
                  <View style={styles.nivelContainer}>
                    <Text style={styles.nivelLabel}>Frequência</Text>
                    <View style={styles.nivelBotoes}>
                      {[1, 2, 3, 4].map((nivel) => (
                        <TouchableOpacity
                          key={nivel}
                          style={[
                            styles.nivelBotao,
                            intercorrencia.frequencia === nivel && styles.nivelBotaoSelected
                          ]}
                          onPress={() => updateIntercorrencia(intercorrencia.id_intercorrencia, 'frequencia', nivel)}
                        >
                          <Text style={[
                            styles.nivelTexto,
                            intercorrencia.frequencia === nivel && styles.nivelTextoSelected
                          ]}>
                            {nivel}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Intensidade */}
                  <View style={styles.nivelContainer}>
                    <Text style={styles.nivelLabel}>Intensidade</Text>
                    <View style={styles.nivelBotoes}>
                      {[1, 2, 3, 4].map((nivel) => (
                        <TouchableOpacity
                          key={nivel}
                          style={[
                            styles.nivelBotao,
                            intercorrencia.intensidade === nivel && styles.nivelBotaoSelected
                          ]}
                          onPress={() => updateIntercorrencia(intercorrencia.id_intercorrencia, 'intensidade', nivel)}
                        >
                          <Text style={[
                            styles.nivelTexto,
                            intercorrencia.intensidade === nivel && styles.nivelTextoSelected
                          ]}>
                            {nivel}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default IntercorrenciasSection;
