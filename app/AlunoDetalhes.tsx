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
    // Navegar diretamente para o formulário
    router.push('/Formulario');
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        </View>
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

