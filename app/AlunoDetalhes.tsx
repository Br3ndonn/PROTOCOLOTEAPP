import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

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
    Alert.alert(
      "Nova Aula",
      `Iniciar formulário de aula para ${params.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            // Navegar para a tela de formulário
            router.push('/formulario');
          }
        }
      ]
    );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  alunoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  alunoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alunoAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  alunoIdade: {
    fontSize: 16,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 34, // Extra padding para safe area
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  novaAulaButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  novaAulaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});
