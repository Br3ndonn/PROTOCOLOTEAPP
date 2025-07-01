import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles/AlunoDetalhesStyles';
// Interface para os parâmetros recebidos da navegação
interface AlunoParams {
  id: string;
  nome: string;
  idade: string;
  horario: string;
  protocolo: string;
  status: string;
}

export default function AlunoDetalhesScreen() {
  // Recebe os parâmetros da navegação
  const params = useLocalSearchParams();

  const handleNovaAula = () => {
    // Navegar diretamente para o formulário
    router.push('/Formulario');
  };

  const handleVoltar = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
          <IconSymbol name="chevron.left" size={24} color="#6366f1" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card principal do aluno */}
        <View style={styles.alunoCard}>
          <View style={styles.alunoHeader}>
            <View style={styles.alunoAvatar}>
              <IconSymbol name="figure.child" size={32} color="#6366f1" />
            </View>
            <View style={styles.alunoInfo}>
              <Text style={styles.alunoNome}>{params.nome}</Text>
              <Text style={styles.alunoIdade}>{params.idade} anos</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: params.status === 'ativo' ? '#10b981' : '#ef4444' }
            ]}>
              <Text style={styles.statusText}>{params.status}</Text>
            </View>
          </View>
        </View>

        {/* Informações detalhadas */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <IconSymbol name="calendar" size={20} color="#6366f1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>{params.horario}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <IconSymbol name="doc.text" size={20} color="#6366f1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Protocolo</Text>
              <Text style={styles.infoValue}>{params.protocolo}</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas rápidas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Aulas Realizadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>Progresso</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Esta Semana</Text>
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
    </SafeAreaView>
  );
}

