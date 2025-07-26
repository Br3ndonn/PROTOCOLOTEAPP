import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AprendizDisplay, aprendizService, mapAprendizToDisplay } from '@/services/AprendizService';
import { aulaService } from '@/services/AulaService';
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
  const [ultimaAulaExpanded, setUltimaAulaExpanded] = useState(false);
  const [ultimaAulaInfo, setUltimaAulaInfo] = useState<{ 
    data_aula: string;
    id_professor?: string; // Opcional, se não for necessário 
    // total_pontos: number;
    atividades?: Array<{
      nome_atividade: string;
      pontuacao: number;
      completude: string;
      tentativas: number;
      observacoes?: string;
    }>;
    intercorrencias?: Array<{
      tipo: string;
      descricao: string;
      frequencia?: number;
      intensidade?: number;
    }>;
  } | null>(null);
  const [loadingUltimaAula, setLoadingUltimaAula] = useState(false);

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

  // Função para carregar informações da última aula
  const carregarUltimaAula = async () => {
    if (!params.id || typeof params.id !== 'string') return;

    try {
      setLoadingUltimaAula(true);
      const { data, error: aulaError } = await aulaService.buscarResumoUltimaAula(params.id);
      
      if (aulaError) {
        console.log('Nenhuma aula encontrada ou erro:', aulaError);
        setUltimaAulaInfo(null);
        return;
      }

      // Garantir que os arrays sempre existam
      if (data) {
        setUltimaAulaInfo({
          ...data,
          atividades: data.atividades || [],
          intercorrencias: data.intercorrencias || []
        });
      } else {
        setUltimaAulaInfo(null);
      }
    } catch (error) {
      console.error('Erro ao carregar última aula:', error);
      setUltimaAulaInfo(null);
    } finally {
      setLoadingUltimaAula(false);
    }
  };

  const handleToggleUltimaAula = () => {
    if (!ultimaAulaExpanded && !ultimaAulaInfo && !loadingUltimaAula) {
      carregarUltimaAula();
    }
    setUltimaAulaExpanded(!ultimaAulaExpanded);
  };

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

            {/* Seção da Última Aula */}
            <View style={styles.ultimaAulaContainer}>
              <TouchableOpacity 
                style={styles.ultimaAulaHeader} 
                onPress={handleToggleUltimaAula}
                activeOpacity={0.7}
              >
                <View style={styles.ultimaAulaHeaderContent}>
                  <IconSymbol name="book.fill" size={20} color="#6366f1" />
                  <Text style={styles.ultimaAulaTitle}>Última Aula</Text>
                </View>
                <IconSymbol 
                  name={ultimaAulaExpanded ? "chevron.up" : "chevron.down"} 
                  size={24} 
                  color="#6366f1" 
                />
              </TouchableOpacity>

              {ultimaAulaExpanded && (
                <View style={styles.ultimaAulaContent}>
                  {loadingUltimaAula ? (
                    <View style={styles.ultimaAulaLoading}>
                      <ActivityIndicator size="small" color="#6366f1" />
                      <Text style={styles.ultimaAulaLoadingText}>Carregando última aula...</Text>
                    </View>
                  ) : ultimaAulaInfo ? (
                    <View>
                      {/* Informações básicas da última aula */}
                      <View style={styles.ultimaAulaBasicInfo}>
                        <View style={styles.ultimaAulaDataContainer}>
                          <IconSymbol name="calendar" size={16} color="#6366f1" />
                          <Text style={styles.ultimaAulaData}>
                            {formatarData(ultimaAulaInfo.data_aula)}
                          </Text>
                        </View>
                        <View style={styles.ultimaAulaPontosContainer}>
                          <IconSymbol name="star.fill" size={16} color="#f59e0b" />
                          { /* 
                          <Text style={styles.ultimaAulaPontos}>
                            {ultimaAulaInfo.total_pontos} pontos
                          </Text> 
                          */ }
                        </View>
                      </View>

                      {/* Atividades desenvolvidas */}
                      {ultimaAulaInfo.atividades && ultimaAulaInfo.atividades.length > 0 && (
                        <View style={styles.ultimaAulaSection}>
                          <Text style={styles.ultimaAulaSectionTitle}>Atividades Desenvolvidas</Text>
                          {ultimaAulaInfo.atividades.map((atividade, index) => (
                            <View key={index} style={styles.atividadeItem}>
                              <View style={styles.atividadeHeader}>
                                <IconSymbol name="checkmark.circle.fill" size={16} color="#10b981" />
                                <Text style={styles.atividadeNome}>{atividade.nome_atividade}</Text>
                              </View>
                              <View style={styles.atividadeInfo}>
                                <View style={styles.atividadePontosContainer}>
                                  <Text style={styles.atividadePontos}>{atividade.pontuacao}</Text>
                                  <Text style={styles.atividadePontosLabel}>pts</Text>
                                </View>
                                <Text style={styles.atividadeCompletude}>
                                  Completude: {atividade.completude}
                                </Text>
                                {atividade.tentativas > 0 && (
                                  <Text style={styles.atividadeTentativas}>
                                    Tentativas: {atividade.tentativas}
                                  </Text>
                                )}
                                {atividade.observacoes && (
                                  <Text style={styles.atividadeObservacoes}>
                                    {atividade.observacoes}
                                  </Text>
                                )}
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Intercorrências registradas */}
                      {ultimaAulaInfo.intercorrencias && ultimaAulaInfo.intercorrencias.length > 0 && (
                        <View style={styles.ultimaAulaSection}>
                          <Text style={styles.ultimaAulaSectionTitle}>Intercorrências Registradas</Text>
                          {ultimaAulaInfo.intercorrencias.map((intercorrencia, index) => (
                            <View key={index} style={styles.intercorrenciaItem}>
                              <View style={styles.intercorrenciaHeader}>
                                <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#f59e0b" />
                                <Text style={styles.intercorrenciaTipo}>{intercorrencia.tipo}</Text>
                              </View>
                              <Text style={styles.intercorrenciaDescricao}>
                                {intercorrencia.descricao}
                              </Text>
                              {(intercorrencia.frequencia !== undefined || intercorrencia.intensidade !== undefined) && (
                                <View style={styles.intercorrenciaDetalhes}>
                                  {intercorrencia.frequencia !== undefined && (
                                    <Text style={styles.intercorrenciaDetalhe}>
                                      Frequência: {intercorrencia.frequencia}
                                    </Text>
                                  )}
                                  {intercorrencia.intensidade !== undefined && (
                                    <Text style={styles.intercorrenciaDetalhe}>
                                      Intensidade: {intercorrencia.intensidade}
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Caso não tenha atividades nem intercorrências */}
                      {(!ultimaAulaInfo.atividades || ultimaAulaInfo.atividades.length === 0) && 
                       (!ultimaAulaInfo.intercorrencias || ultimaAulaInfo.intercorrencias.length === 0) && (
                        <View style={styles.ultimaAulaSemDetalhes}>
                          <IconSymbol name="info.circle" size={16} color="#9ca3af" />
                          <Text style={styles.ultimaAulaSemDetalhesText}>
                            Nenhuma atividade ou intercorrência foi registrada nesta aula
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.ultimaAulaSemDados}>
                      <IconSymbol name="exclamationmark.circle" size={16} color="#9ca3af" />
                      <Text style={styles.ultimaAulaSemDadosText}>
                        Nenhuma aula registrada ainda
                      </Text>
                    </View>
                  )}
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

            {/* Part Educação Física */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Participação em Educação Física</Text>
              <Text style={styles.infoValue}>{aprendiz.part_ed_fisica}</Text>
            </View>

            {/* Envolvimento em Exercícios Físicos */}
            { aprendiz.envolvimento_exer_fis && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Envolvimento em Exercícios Físicos</Text>
                <Text style={styles.infoValue}>{aprendiz.envolvimento_exer_fis}</Text>
              </View>
            )}

            {/* Interesses */}
            {aprendiz.interesses && aprendiz.interesses.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Interesses</Text>
                <View style={styles.tagsContainer}>
                  {aprendiz.interesses.map((interesse, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{interesse}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

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

      {/* Espaço entre informações e botão nova aula */}
      <View style={{ height: 16 }} />

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
