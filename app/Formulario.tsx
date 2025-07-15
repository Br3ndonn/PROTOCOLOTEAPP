import BotoesAcao from '@/components/formulario/BotoesAcao';
import { COMPLETUDE_OPTIONS, INTERCORRENCIAS_PADRAO, TENTATIVAS_PADRAO } from '@/components/formulario/constants';
import DadosIniciais from '@/components/formulario/DadosIniciais';
import GerenciadorAtividades from '@/components/formulario/GerenciadorAtividades';
import ObservacoesSection from '@/components/formulario/ObservacoesSection';
import { AtividadeData, FormData } from '@/components/formulario/types';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { aprendizService } from '@/services/AprendizService';
import { styles } from '@/styles/FormularioStyles';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View
} from 'react-native';

export default function FormularioScreen() {
  const params = useLocalSearchParams();
  
  // Estados do formulário principal
  const [formData, setFormData] = useState<FormData>({
    aprendiz: '',
    responsavel: '',
    data: '',
    local: '',
    observacoes: ''
  });

  // Estados para atividades
  const [atividades, setAtividades] = useState<AtividadeData[]>([]);
  const [mostrarCombobox, setMostrarCombobox] = useState(false);
  const [loadingAprendiz, setLoadingAprendiz] = useState(false);

  // Carregar dados do aprendiz se ID foi passado via parâmetros
  const carregarDadosAprendiz = async (aprendizId: string) => {
    try {
      setLoadingAprendiz(true);
      const { data, error } = await aprendizService.buscarPorId(aprendizId);
      
      if (error) {
        console.error('Erro ao carregar dados do aprendiz:', error);
        Alert.alert('Aviso', 'Não foi possível carregar os dados do aprendiz');
        return;
      }

      if (data) {
        setFormData(prev => ({
          ...prev,
          aprendiz: data.nome
        }));
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar aprendiz:', error);
      Alert.alert('Erro', 'Erro inesperado ao carregar dados do aprendiz');
    } finally {
      setLoadingAprendiz(false);
    }
  };

  // Effect para carregar dados do aprendiz quando houver ID nos parâmetros
  useEffect(() => {
    if (params.aprendizId && typeof params.aprendizId === 'string') {
      carregarDadosAprendiz(params.aprendizId);
    }
  }, [params.aprendizId]);

  // Função para adicionar nova atividade
  const adicionarNovaAtividade = (atividadeSelecionada: string) => {
    const novaAtividade: AtividadeData = {
      id: Date.now().toString(),
      atividade: atividadeSelecionada,
      meta: '',
      completude: '',
      somatorio: '0',
      tentativas: [...TENTATIVAS_PADRAO],
      houveIntercorrencia: false,
      intercorrencias: [...INTERCORRENCIAS_PADRAO],
      minimizada: false,
      salva: false
    };
    
    setAtividades([...atividades, novaAtividade]);
    setMostrarCombobox(false);
  };

  // Função para atualizar dados de uma atividade
  const updateAtividadeData = (atividadeId: string, field: keyof AtividadeData, value: any) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === atividadeId 
        ? { ...atividade, [field]: value }
        : atividade
    ));
  };

  // Função para atualizar pontuação de uma tentativa em uma atividade
  const updateAtividadePontuacao = (atividadeId: string, tentativaId: string, value: number) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === atividadeId 
        ? {
            ...atividade,
            tentativas: atividade.tentativas.map(tentativa =>
              tentativa.id === tentativaId 
                ? { ...tentativa, pontuacao: value }
                : tentativa
            )
          }
        : atividade
    ));
  };

  // Função para atualizar intercorrência de uma atividade
  const updateAtividadeIntercorrencia = (atividadeId: string, intercorrenciaId: string, field: 'selecionada' | 'frequencia' | 'intensidade', value: boolean | number) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === atividadeId 
        ? {
            ...atividade,
            intercorrencias: atividade.intercorrencias.map(intercorrencia => 
              intercorrencia.id === intercorrenciaId 
                ? { ...intercorrencia, [field]: value }
                : intercorrencia
            )
          }
        : atividade
    ));
  };

  // Função para salvar uma atividade
  const salvarAtividade = (atividadeId: string) => {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) return;

    if (!atividade.meta) {
      Alert.alert('Erro', 'Por favor, preencha a meta da atividade');
      return;
    }

    setAtividades(prev => prev.map(a => 
      a.id === atividadeId 
        ? { ...a, salva: true, minimizada: true }
        : a
    ));

    Alert.alert('Sucesso', 'Atividade salva com sucesso!');
  };

  // Função para alternar minimização de uma atividade
  const toggleMinimizarAtividade = (atividadeId: string) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === atividadeId 
        ? { ...atividade, minimizada: !atividade.minimizada }
        : atividade
    ));
  };

  // Calcular somatório de uma atividade
  const calcularSomatorioAtividade = (atividadeId: string) => {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) return;

    const total = atividade.tentativas.reduce((acc, tentativa) => 
      acc + tentativa.pontuacao, 0
    );
    
    updateAtividadeData(atividadeId, 'somatorio', total.toString());
  };

  // Recalcular somatório automaticamente para cada atividade
  useEffect(() => {
    atividades.forEach(atividade => {
      const total = atividade.tentativas.reduce((acc, tentativa) => 
        acc + tentativa.pontuacao, 0
      );
      if (total.toString() !== atividade.somatorio) {
        updateAtividadeData(atividade.id, 'somatorio', total.toString());
      }
    });
  }, [atividades]);

  // Função para atualizar campos do formulário principal
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para salvar o formulário
  const handleSalvar = () => {
    // Validação básica
    if (!formData.aprendiz || !formData.responsavel || !formData.data) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios (Aprendiz, Responsável e Data)');
      return;
    }

    // Verificar se há pelo menos uma atividade salva
    const atividadesSalvas = atividades.filter(a => a.salva);
    if (atividadesSalvas.length === 0) {
      Alert.alert('Erro', 'Por favor, adicione e salve pelo menos uma atividade');
      return;
    }

    Alert.alert(
      'Formulário Salvo',
      `Aula salva com sucesso! Total de atividades: ${atividadesSalvas.length}`,
      [{ text: 'OK' }]
    );
  };

  // Função para limpar formulário
  const handleLimpar = () => {
    Alert.alert(
      'Limpar Formulário',
      'Tem certeza que deseja limpar todos os dados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: () => {
            setFormData({
              aprendiz: '',
              responsavel: '',
              data: '',
              local: '',
              observacoes: ''
            });
            setAtividades([]);
            setMostrarCombobox(false);
          }
        }
      ]
    );
  };

  // Função para desfazer uma atividade (voltar ao estado não salvo)
  const desfazerAtividade = (atividadeId: string) => {
    Alert.alert(
      'Desfazer Atividade',
      'Tem certeza que deseja desfazer o salvamento desta atividade? Ela voltará ao estado editável.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Desfazer', 
          style: 'default',
          onPress: () => {
            setAtividades(prev => prev.map(atividade => 
              atividade.id === atividadeId 
                ? { ...atividade, salva: false, minimizada: false }
                : atividade
            ));
          }
        }
      ]
    );
  };

  // Função para excluir uma atividade
  const excluirAtividade = (atividadeId: string) => {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) return;

    Alert.alert(
      'Excluir Atividade',
      `Tem certeza que deseja excluir a atividade "${atividade.atividade}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setAtividades(prev => prev.filter(a => a.id !== atividadeId));
            Alert.alert('Sucesso', 'Atividade excluída com sucesso!');
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper 
      title="Formulário de Avaliação"
      subtitle="Folha de Registro de Desempenho"
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol name="doc.text" size={32} color="#6366f1" />
          <Text style={styles.title}>
            Folha de Registro de Desempenho{'\n'}ABA na Ed. Física Especial
          </Text>
        </View>

        {/* Dados Iniciais */}
        <DadosIniciais 
          formData={formData}
          onUpdateFormData={updateFormData}
          aprendizPreenchidoAutomaticamente={!!params.aprendizId}
          loadingAprendiz={loadingAprendiz}
        />

        {/* Gerenciador de Atividades */}
        <GerenciadorAtividades
          atividades={atividades}
          mostrarCombobox={mostrarCombobox}
          completudeOptions={COMPLETUDE_OPTIONS}
          onNovaAtividade={() => setMostrarCombobox(true)}
          onSelecionarAtividade={adicionarNovaAtividade}
          onCancelarCombobox={() => setMostrarCombobox(false)}
          onUpdateData={updateAtividadeData}
          onUpdatePontuacao={updateAtividadePontuacao}
          onUpdateIntercorrencia={updateAtividadeIntercorrencia}
          onSalvar={salvarAtividade}
          onToggleMinimizar={toggleMinimizarAtividade}
          onCalcularSomatorio={calcularSomatorioAtividade}
          onDesfazer={desfazerAtividade}
          onExcluir={excluirAtividade}
        />

        {/* Observações */}
        <ObservacoesSection
          observacoes={formData.observacoes}
          onChangeObservacoes={(text) => updateFormData('observacoes', text)}
        />

        {/* Botões de Ação */}
        <BotoesAcao
          onSalvar={handleSalvar}
          onLimpar={handleLimpar}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
