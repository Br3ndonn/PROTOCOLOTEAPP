import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AprendizDisplay, aprendizService, mapAprendizToDisplay } from '@/services/AprendizService';
import { styles } from '@/styles/AlunoDetalhesStyles';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function AlunoDetalhesScreen() {
  // Recebe os parâmetros da navegação
  const params = useLocalSearchParams();
  const [aprendiz, setAprendiz] = useState<AprendizDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'basicas' | 'complementares'>('basicas');

  // Carregar dados detalhados do aprendiz
  const carregarAprendiz = async () => {
    if (!params.id || typeof params.id !== 'string') {
      setError('ID do aprendiz não encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: dbError } = await aprendizService.buscarPorId(params.id);
      
      if (dbError) {
        console.error('Erro ao carregar aprendiz:', dbError);
        setError('Erro ao carregar dados do aprendiz');
        Alert.alert('Erro', 'Não foi possível carregar os dados do aprendiz');
        return;
      }

      if (data) {
        setAprendiz(mapAprendizToDisplay(data));
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setError('Erro inesperado ao carregar dados');
      Alert.alert('Erro', 'Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAprendiz();
  }, [params.id]);

  // Função para formatar data
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const handleNovaAula = () => {
    // Navegar para o formulário passando o ID do aprendiz
    router.push({
      pathname: '/Formulario',
      params: {
        aprendizId: params.id
      }
    });
  };

  if (loading) {
    return (
      <ScreenWrapper title="Carregando...">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>Carregando dados do aluno...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !aprendiz) {
    return (
      <ScreenWrapper title="Erro">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ef4444', marginBottom: 20, textAlign: 'center' }}>
            {error || 'Aprendiz não encontrado'}
          </Text>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#6366f1', 
              paddingHorizontal: 20, 
              paddingVertical: 10, 
              borderRadius: 8,
              marginBottom: 10
            }}
            onPress={carregarAprendiz}
          >
            <Text style={{ color: 'white' }}>Tentar novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#6b7280', 
              paddingHorizontal: 20, 
              paddingVertical: 10, 
              borderRadius: 8 
            }}
            onPress={() => router.back()}
          >
            <Text style={{ color: 'white' }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title={`Detalhes - ${aprendiz.nome}`}>
      {/* Sistema de Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'basicas' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('basicas')}
        >
          <Text style={[styles.tabText, abaAtiva === 'basicas' && styles.tabTextAtiva]}>
            Informações Básicas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'complementares' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('complementares')}
        >
          <Text style={[styles.tabText, abaAtiva === 'complementares' && styles.tabTextAtiva]}>
            Informações Complementares
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {abaAtiva === 'basicas' ? (
          <>
            {/* Card principal do aluno */}
            <View style={styles.alunoCard}>
              <View style={styles.alunoHeader}>
                <View style={styles.alunoAvatar}>
                  <IconSymbol name="figure.child" size={32} color="#6366f1" />
                </View>
                <View style={styles.alunoInfo}>
                  <Text style={styles.alunoNome}>{aprendiz.nome}</Text>
                  <Text style={styles.alunoIdade}>
                    Data de Nascimento: {formatarData(aprendiz.data_nascimento)}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: aprendiz.diagnostico ? '#10b981' : '#f59e0b' }
                ]}>
                  <Text style={styles.statusText}>
                    {aprendiz.diagnostico ? 'Diagnóstico' : 'Sem Diagnóstico'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Informações detalhadas */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informações</Text>
              
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <IconSymbol name="person.fill" size={20} color="#6366f1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nome Completo</Text>
                  <Text style={styles.infoValue}>{aprendiz.nome}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <IconSymbol name="calendar" size={20} color="#6366f1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Data de Nascimento</Text>
                  <Text style={styles.infoValue}>{formatarData(aprendiz.data_nascimento)}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <IconSymbol name="doc.text" size={20} color="#6366f1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Status do Diagnóstico</Text>
                  <Text style={[
                    styles.infoValue,
                    { color: aprendiz.diagnostico ? '#10b981' : '#f59e0b' }
                  ]}>
                    {aprendiz.diagnostico ? 'Diagnóstico confirmado' : 'Aguardando diagnóstico'}
                  </Text>
                </View>
              </View>

              {aprendiz.idade_diagnostico && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <IconSymbol name="clock" size={20} color="#6366f1" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Idade do Diagnóstico</Text>
                    <Text style={styles.infoValue}>{aprendiz.idade_diagnostico} anos</Text>
                  </View>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            {/* Informações Familiares */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informações Familiares</Text>
              
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <IconSymbol name="person.2" size={20} color="#6366f1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Possui Irmãos</Text>
                  <Text style={styles.infoValue}>{aprendiz.irmaos ? 'Sim' : 'Não'}</Text>
                </View>
              </View>
            </View>

            {/* Qualidades */}
            {aprendiz.qualidades && aprendiz.qualidades.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Qualidades</Text>
                <View style={styles.tagsContainer}>
                  {aprendiz.qualidades.map((qualidade, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{qualidade}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Características que Comprometem a Vida */}
            {aprendiz.caracteristica_compr_vida && aprendiz.caracteristica_compr_vida.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Características que Comprometem a Vida</Text>
                <View style={styles.tagsContainer}>
                  {aprendiz.caracteristica_compr_vida.map((caracteristica, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{caracteristica}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Informações de Saúde */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informações de Saúde</Text>
              
              {aprendiz.medicamentos && aprendiz.medicamentos.length > 0 && (
                <>
                  <Text style={styles.subsectionTitle}>Medicamentos</Text>
                  <View style={styles.tagsContainer}>
                    {aprendiz.medicamentos.map((medicamento, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: '#fef3c7' }]}>
                        <Text style={[styles.tagText, { color: '#92400e' }]}>{medicamento}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
              
              {aprendiz.qualidade_sono && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <IconSymbol name="moon.fill" size={20} color="#6366f1" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Qualidade do Sono</Text>
                    <Text style={styles.infoValue}>{aprendiz.qualidade_sono}</Text>
                  </View>
                </View>
              )}
              
              {aprendiz.alimentacao && (
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <IconSymbol name="fork.knife" size={20} color="#6366f1" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Alimentação</Text>
                    <Text style={styles.infoValue}>{aprendiz.alimentacao}</Text>
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Botão Nova Aula fixo na parte inferior */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.novaAulaButton} onPress={handleNovaAula}>
          <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
          <Text style={styles.novaAulaText}>Nova Aula</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

