import { IconSymbol } from '@/components/ui/IconSymbol';
import { AprendizData, aprendizService } from '@/services/AprendizService';
import { styles } from '@/styles/FormularioStyles';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SeletorAprendizProps {
  valorSelecionado: string;
  onSelecionar: (nome: string) => void;
}

const SeletorAprendiz: React.FC<SeletorAprendizProps> = ({
  valorSelecionado,
  onSelecionar
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [aprendizes, setAprendizes] = useState<AprendizData[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoizar função de carregamento para evitar loops
  const carregarAprendizes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await aprendizService.buscarTodos();
      
      if (error) {
        console.error('Erro ao carregar aprendizes:', error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de aprendizes');
        return;
      }

      setAprendizes(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      Alert.alert('Erro', 'Erro inesperado ao carregar aprendizes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (modalVisible) {
      carregarAprendizes();
    }
  }, [modalVisible, carregarAprendizes]);

  const selecionarAprendiz = (aprendiz: AprendizData) => {
    onSelecionar(aprendiz.nome);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.inputContainer,
          { 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingVertical: 12
          }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          { fontSize: 16, color: valorSelecionado ? '#1f2937' : '#9ca3af' }
        ]}>
          {valorSelecionado || 'Selecionar aprendiz'}
        </Text>
        <IconSymbol name="chevron.down" size={16} color="#9ca3af" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
          {/* Header do Modal */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb'
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937' }}>
              Selecionar Aprendiz
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSymbol name="xmark" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Lista de Aprendizes */}
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={{ marginTop: 10, color: '#6b7280' }}>
                Carregando aprendizes...
              </Text>
            </View>
          ) : (
            <FlatList
              data={aprendizes}
              keyExtractor={(item) => item.id_aprendiz}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    // boxShadow para web, mantendo o estilo do shadow*
                    boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
                    elevation: 2
                  }}
                  onPress={() => selecionarAprendiz(item)}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#e0e7ff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}>
                    <IconSymbol name="figure.child" size={20} color="#6366f1" />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: 4
                    }}>
                      {item.nome}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#6b7280'
                    }}>
                      {item.diagnostico ? 'Com diagnóstico' : 'Sem diagnóstico'}
                    </Text>
                  </View>

                  <IconSymbol name="chevron.right" size={16} color="#9ca3af" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginTop: 100
                }}>
                  <IconSymbol name="person.3" size={48} color="#d1d5db" />
                  <Text style={{ 
                    marginTop: 10, 
                    color: '#6b7280', 
                    fontSize: 16,
                    textAlign: 'center'
                  }}>
                    Nenhum aprendiz cadastrado
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </>
  );
};

export default SeletorAprendiz;
