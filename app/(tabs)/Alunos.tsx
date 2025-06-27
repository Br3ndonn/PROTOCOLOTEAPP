import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Interface para definir o tipo de dados do aluno
interface Aluno {
  id: string;
  nome: string;
  idade: number;
  horario: string;
  protocolo: string;
  status: 'ativo' | 'inativo';
}

export default function AlunosScreen() {
  // Estado para armazenar a lista de alunos
  const [alunos, setAlunos] = useState<Aluno[]>([
    {
      id: '1',
      nome: 'Ana Silva',
      idade: 8,
      horario: 'SEG - QUA - SEX',
      protocolo: 'TEA-001',
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'João Santos',
      idade: 7,
      horario: 'TER  - QUI - SAB',
      protocolo: 'TEA-002',
      status: 'ativo'
    },
    {
      id: '3',
      nome: 'Maria Oliveira',
      idade: 9,
      horario: 'TER - QUI - SAB',
      protocolo: 'TEA-003',
      status: 'inativo'
    },
    {
      id: '4',
      nome: 'Pedro Costa',
      idade: 6,
      horario: 'SEG - QUA - QUI',
      protocolo: 'TEA-004',
      status: 'ativo'
    },
    {
      id: '5',
      nome: 'Sofia Lima',
      idade: 8,
      horario: 'TER - QUI - SAB',
      protocolo: 'TEA-005',
      status: 'ativo'
    }
  ]);

  // Estado para o filtro de busca
  const [searchText, setSearchText] = useState('');

  // Função para filtrar alunos baseado na busca
  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    aluno.horario.toLowerCase().includes(searchText.toLowerCase()) ||
    aluno.protocolo.toLowerCase().includes(searchText.toLowerCase())
  );

  // Função para navegar para detalhes do aluno
  const handleAlunoPress = (aluno: Aluno) => {
    router.push({
      pathname: '/AlunoDetalhes',
      params: {
        id: aluno.id,
        nome: aluno.nome,
        idade: aluno.idade.toString(),
        horario: aluno.horario,
        protocolo: aluno.protocolo,
        status: aluno.status,
      }
    });
  };

  // Componente para renderizar cada item da lista
  const renderAlunoItem = ({ item }: { item: Aluno }) => (
    <TouchableOpacity style={styles.alunoCard} activeOpacity={0.7}>
      <View style={styles.alunoHeader}>
        <View style={styles.alunoInfo}>
          <View style={styles.alunoAvatar}>
            <IconSymbol name="figure.child" size={24} color="#6366f1" />
          </View>
          <View style={styles.alunoDetails}>
            <TouchableOpacity onPress={() => handleAlunoPress(item)}>
              <Text style={styles.alunoNome}>{item.nome}</Text>
            </TouchableOpacity>
            <Text style={styles.alunoTurma}>{item.horario}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'ativo' ? '#10b981' : '#ef4444' }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.alunoFooter}>
        <View style={styles.alunoMeta}>
          <Text style={styles.alunoIdade}>Idade: {item.idade} anos</Text>
          <Text style={styles.alunoProtocolo}>Protocolo: {item.protocolo}</Text>
        </View>
        <TouchableOpacity onPress={() => handleAlunoPress(item)}>
          <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Alunos</Text>
        <Text style={styles.subtitle}>Protocolo TEA</Text>
      </View>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar aluno, turma ou protocolo..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Contador de alunos */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredAlunos.length} {filteredAlunos.length === 1 ? 'aluno encontrado' : 'alunos encontrados'}
        </Text>
      </View>

      {/* Lista de alunos */}
      <FlatList
        data={filteredAlunos}
        keyExtractor={(item) => item.id}
        renderItem={renderAlunoItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  countContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  alunoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alunoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alunoAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoDetails: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 2,
    textDecorationLine: 'underline',
  },
  alunoTurma: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  alunoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  alunoMeta: {
    flex: 1,
  },
  alunoIdade: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  alunoProtocolo: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
});