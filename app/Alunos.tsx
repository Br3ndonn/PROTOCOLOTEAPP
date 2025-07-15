import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { aprendizService } from '@/services/AprendizService';
import { styles } from '@/styles/AlunosStyles';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Interface simplificada para exibição na lista
interface AlunoDisplay {
  id: string;
  nome: string;
}

export default function AlunosScreen() {
  const { user, loading } = useAuthNavigation();
  const isAuthenticated = !!user;
  
  // Estados para a lista de alunos
  const [alunos, setAlunos] = useState<AlunoDisplay[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para o filtro de busca
  const [searchText, setSearchText] = useState('');

  // Carregar aprendizes do banco de dados
  const carregarAprendizes = async () => {
    try {
      setLoadingData(true);
      setError(null);
      
      const { data, error: dbError } = await aprendizService.buscarTodos();
      
      if (dbError) {
        console.error('Erro ao carregar aprendizes:', dbError);
        setError('Erro ao carregar dados dos aprendizes');
        Alert.alert('Erro', 'Não foi possível carregar os aprendizes');
        return;
      }

      if (data) {
        // Mapear dados do banco para o formato de exibição
        const alunosFormatados: AlunoDisplay[] = data.map(aprendiz => ({
          id: aprendiz.id_aprendiz,
          nome: aprendiz.nome
        }));
        
        setAlunos(alunosFormatados);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setError('Erro inesperado ao carregar dados');
      Alert.alert('Erro', 'Erro inesperado ao carregar dados');
    } finally {
      setLoadingData(false);
    }
  };

  // Carregar dados quando o usuário estiver autenticado
  useEffect(() => {
    if (user) {
      carregarAprendizes();
    }
  }, [user]);

  // Função para filtrar alunos baseado na busca
  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  // Função para navegar para detalhes do aluno
  const handleAlunoPress = (aluno: AlunoDisplay) => {
    router.push({
      pathname: '/AlunoDetalhes',
      params: {
        id: aluno.id,
        nome: aluno.nome
      }
    });
  };

  // Componente para renderizar cada item da lista
  const renderAlunoItem = ({ item }: { item: AlunoDisplay }) => (
    <TouchableOpacity style={styles.alunoCard} activeOpacity={0.7} onPress={() => handleAlunoPress(item)}>
      <View style={styles.alunoHeader}>
        <View style={styles.alunoInfo}>
          <View style={styles.alunoAvatar}>
            <IconSymbol name="figure.child" size={24} color="#6366f1" />
          </View>
          <View style={styles.alunoDetails}>
            <Text style={styles.alunoNome}>{item.nome}</Text>
            <Text style={styles.alunoTurma}>Clique para ver detalhes</Text>
          </View>
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
          placeholder="Buscar aluno..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Loading indicator */}
      {loadingData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>Carregando alunos...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Text style={{ color: '#ef4444', marginBottom: 20 }}>{error}</Text>
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#6366f1', 
              paddingHorizontal: 20, 
              paddingVertical: 10, 
              borderRadius: 8 
            }}
            onPress={carregarAprendizes}
          >
            <Text style={{ color: 'white' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <IconSymbol name="person.3" size={48} color="#d1d5db" />
                <Text style={{ marginTop: 10, color: '#6b7280', fontSize: 16 }}>
                  {searchText ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
                </Text>
              </View>
            )}
          />
        </>
      )}

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

