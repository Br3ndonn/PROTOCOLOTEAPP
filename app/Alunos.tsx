import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { styles } from '@/styles/AlunosStyles';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
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
  const { user, loading } = useAuthNavigation();
  const isAuthenticated = !!user;
  
  // Estados para a lista de alunos
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

  // Não renderizar nada enquanto verifica autenticação
  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <ScreenWrapper 
      title="Lista de Alunos"
      subtitle="Protocolo TEA"
      showBackButton={false} // Não mostrar botão de voltar na tab principal
    >
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

      {/* Botão flutuante para adicionar novo aprendiz */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => {
          console.log('Navegando para CadastroAprendiz...');
          router.push('/CadastroAprendiz' as any);
        }}
      >
        <IconSymbol name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

