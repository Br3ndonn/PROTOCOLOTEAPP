import BotoesAcao from '@/components/formulario/BotoesAcao';
import { INTERCORRENCIAS_PADRAO, TENTATIVAS_PADRAO } from '@/components/formulario/constants';
import DadosIniciais from '@/components/formulario/DadosIniciais';
import GerenciadorAtividades from '@/components/formulario/GerenciadorAtividades';
import ObservacoesSection from '@/components/formulario/ObservacoesSection';
import { AtividadeData, FormData } from '@/components/formulario/types';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { aprendizService } from '@/services/AprendizService';
import { aulaService } from '@/services/AulaService';
import { AtividadeParaSelecao } from '@/services/PlanejamentoAtividadesService';
import { planejamentoIntervencaoService } from '@/services/PlanejamentoIntervencaoService';
import { progressoAtividadeService } from '@/services/ProgressoAtividadeService';
import { RegistroIntercorrenciaInput, registroIntercorrenciaService } from '@/services/RegistroIntercorrenciaService';
import { styles } from '@/styles/FormularioStyles';
import { converterAtividadesComMapeamento, validarAtividadeParaSalvar } from '@/utils/atividadeConverter';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View
} from 'react-native';

export default function FormularioScreen() {
  const params = useLocalSearchParams();
  const { professor } = useAuth();
  
  // Estados do formulário principal
  const [formData, setFormData] = useState<FormData>({
    aprendiz: '',
    local: '',
    observacoes: ''
  });

  // Estados para atividades
  const [atividades, setAtividades] = useState<AtividadeData[]>([]);
  const [mostrarCombobox, setMostrarCombobox] = useState(false);
  const [loadingAprendiz, setLoadingAprendiz] = useState(false);
  const [aprendizId, setAprendizId] = useState<string | null>(null);

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
        setAprendizId(aprendizId);
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
  const adicionarNovaAtividade = (atividadeSelecionada: AtividadeParaSelecao) => {
    const novaAtividade: AtividadeData = {
      id: Date.now().toString(),
      atividade: atividadeSelecionada.displayText,
      meta: '', // Mantém o campo mas não é obrigatório
      completude: '',
      somatorio: '0',
      tentativas: [...TENTATIVAS_PADRAO],
      houveIntercorrencia: false,
      intercorrencias: [...INTERCORRENCIAS_PADRAO],
      minimizada: false,
      salva: false,
      // Adicionar o ID do planejamento de atividades
      id_planejamento_atividades: parseInt(atividadeSelecionada.id)
    };
    
    setAtividades([...atividades, novaAtividade]);
    setMostrarCombobox(false);
  };

  // Função para atualizar dados de uma atividade
  const updateAtividadeData = useCallback((atividadeId: string, field: keyof AtividadeData, value: any) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === atividadeId 
        ? { ...atividade, [field]: value }
        : atividade
    ));
  }, []);

  // Função para atualizar pontuação de uma tentativa em uma atividade
  const updateAtividadePontuacao = useCallback((atividadeId: string, tentativaId: string, value: number) => {
    setAtividades(prev => prev.map(atividade => {
      if (atividade.id === atividadeId) {
        // Atualizar a tentativa
        const tentativasAtualizadas = atividade.tentativas.map(tentativa =>
          tentativa.id === tentativaId 
            ? { ...tentativa, pontuacao: value }
            : tentativa
        );
        
        // Calcular novo somatório automaticamente
        const novoSomatorio = tentativasAtualizadas.reduce((acc, tentativa) => 
          acc + tentativa.pontuacao, 0
        );
        
        return {
          ...atividade,
          tentativas: tentativasAtualizadas,
          somatorio: novoSomatorio.toString()
        };
      }
      return atividade;
    }));
  }, []);

  // Função para validar e marcar atividade como pronta para salvar
  const salvarAtividade = useCallback((atividadeId: string) => {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) return;

    // Validar se a atividade está pronta para ser salva
    const { valid, error } = validarAtividadeParaSalvar(atividade);
    if (!valid) {
      Alert.alert('Erro de Validação', error || 'Dados da atividade são inválidos');
      return;
    }

    // Marcar como salva (pronta para salvar) e minimizar
    setAtividades(prev => prev.map(a => 
      a.id === atividadeId 
        ? { ...a, salva: true, minimizada: true }
        : a
    ));

    Alert.alert('Sucesso', 'Atividade validada e pronta para salvar!');
  }, [atividades]);

  // Função para alternar minimização de uma atividade
  const toggleMinimizarAtividade = useCallback((atividadeId: string) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === atividadeId 
        ? { ...atividade, minimizada: !atividade.minimizada }
        : atividade
    ));
  }, []);

  // Calcular somatório de uma atividade
  const calcularSomatorioAtividade = useCallback((atividadeId: string) => {
    const atividade = atividades.find(a => a.id === atividadeId);
    if (!atividade) return;

    const total = atividade.tentativas.reduce((acc, tentativa) => 
      acc + tentativa.pontuacao, 0
    );
    
    updateAtividadeData(atividadeId, 'somatorio', total.toString());
  }, [atividades, updateAtividadeData]);

  // Função para desfazer atividade (remover flag salva)
  const desfazerAtividade = useCallback((atividadeId: string) => {
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
  }, []);

  // Função para excluir atividade
  const excluirAtividade = useCallback((atividadeId: string) => {
    setAtividades(prev => {
      const atividade = prev.find(a => a.id === atividadeId);
      if (!atividade) return prev;

      Alert.alert(
        'Excluir Atividade',
        `Tem certeza que deseja excluir a atividade "${atividade.atividade}"? Esta ação não pode ser desfeita.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Excluir', 
            style: 'destructive',
            onPress: () => {
              setAtividades(current => current.filter(a => a.id !== atividadeId));
              Alert.alert('Sucesso', 'Atividade excluída com sucesso!');
            }
          }
        ]
      );
      
      return prev; // Retorna o estado atual se não confirmar a exclusão
    });
  }, []);

  // Função para atualizar campos do formulário principal
  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Função para nova atividade
  const handleNovaAtividade = useCallback(() => {
    setMostrarCombobox(true);
  }, []);

  // Função para cancelar combobox
  const handleCancelarCombobox = useCallback(() => {
    setMostrarCombobox(false);
  }, []);

  // Função para salvar o formulário
  const handleSalvar = async () => {
    // Validação básica
    if (!formData.aprendiz) {
      Alert.alert('Erro', 'Por favor, preencha o campo obrigatório (Aprendiz)');
      return;
    }

    // Verificar se há pelo menos uma atividade marcada como salva
    const atividadesProntasParaSalvar = atividades.filter(a => a.salva);
    if (atividadesProntasParaSalvar.length === 0) {
      Alert.alert('Erro', 'Por favor, adicione e valide pelo menos uma atividade');
      return;
    }

    // Validar se o professor está autenticado
    if (!professor) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
      return;
    }

    // Validar se temos o ID do aprendiz
    if (!aprendizId) {
      Alert.alert('Erro', 'ID do aprendiz não encontrado. Selecione um aprendiz válido.');
      return;
    }

    try {
      // Mostrar loading
      Alert.alert('Salvando...', 'Registrando aula no sistema...');

      // **ETAPA 1: Buscar ou criar planejamento de intervenção**
      console.log('=== ETAPA 1: Buscando/criando planejamento de intervenção ===');
      const { data: planejamento, error: errorPlanejamento } = 
        await planejamentoIntervencaoService.buscarOuCriar(
          professor.id_professor,
          aprendizId
        );

      if (errorPlanejamento || !planejamento) {
        console.error('Erro ao buscar/criar planejamento:', errorPlanejamento);
        Alert.alert('Erro', 'Não foi possível criar o planejamento de intervenção');
        return;
      }
      console.log('✅ Planejamento criado/encontrado:', planejamento.id_planejamento_intervencao);

      // **ETAPA 2: Criar aula (primeira inserção)**
      console.log('=== ETAPA 2: Criando aula ===');
      const { data: aula, error: errorAula } = await aulaService.criar({
        id_professor: professor.id_professor,
        data_aula: new Date().toISOString(),
        id_planejamento_intervencao: planejamento.id_planejamento_intervencao,
        observacoes: formData.observacoes,
        local: formData.local,
        responsavel: professor.nome
      });

      if (errorAula || !aula) {
        console.error('Erro ao criar aula:', errorAula);
        Alert.alert('Erro', 'Não foi possível salvar a aula no sistema');
        return;
      }
      console.log('✅ Aula criada com ID:', aula.id_aula);

      // **ETAPA 3: Salvar Progresso_atividades usando o id_aula**
      console.log('=== ETAPA 3: Salvando progresso das atividades ===');
      const dadosAtividades = converterAtividadesComMapeamento(atividadesProntasParaSalvar);
      
      // Extrair apenas os dados necessários (sem idTemporario) para o serviço
      const atividadesParaSalvar = dadosAtividades.map(({ idTemporario, ...atividade }) => atividade);

      const { data: progressosAtividades, error: errorProgressos } = 
        await progressoAtividadeService.salvarMultiplos(aula.id_aula, atividadesParaSalvar);

      if (errorProgressos || !progressosAtividades) {
        console.error('Erro ao salvar progresso das atividades:', errorProgressos);
        Alert.alert('Erro', 'Não foi possível salvar as atividades no sistema');
        return;
      }
      console.log('✅ Atividades salvas. Total:', progressosAtividades.length);

      // **ETAPA 4: Criar mapeamento de IDs temporários para IDs reais de progresso**
      console.log('=== ETAPA 4: Criando mapeamento de IDs ===');
      const mapeamentoIds: { [key: string]: number } = {};
      
      dadosAtividades.forEach((atividadeConvertida, index) => {
        const progressoSalvo = progressosAtividades[index];
        if (progressoSalvo && progressoSalvo.id_progresso_atividade) {
          mapeamentoIds[atividadeConvertida.idTemporario] = progressoSalvo.id_progresso_atividade;
        }
      });
      console.log('✅ Mapeamento criado:', mapeamentoIds);

      // **ETAPA 5: Salvar Registro_intercorrencia usando os id_progresso_atividade**
      console.log('=== ETAPA 5: Coletando e salvando intercorrências ===');
      const intercorrenciasParaSalvar: RegistroIntercorrenciaInput[] = [];

      // Intercorrências das atividades (vinculadas a cada atividade específica)
      atividadesProntasParaSalvar.forEach(atividade => {
        if (atividade.intercorrencias && atividade.intercorrencias.length > 0) {
          atividade.intercorrencias.forEach(interc => {
            if (interc.selecionada && interc.frequencia && interc.intensidade) {
              const idProgressoAtividade = mapeamentoIds[atividade.id];
              if (idProgressoAtividade) {
                intercorrenciasParaSalvar.push({
                  id_progresso_atividade: idProgressoAtividade,
                  id_intercorrencia: parseInt(interc.id, 10),
                  frequencia: interc.frequencia,
                  intensidade: interc.intensidade
                });
              }
            }
          });
        }
      });

      if (intercorrenciasParaSalvar.length > 0) {
        console.log('Salvando', intercorrenciasParaSalvar.length, 'intercorrências...');
        const { data, error } = await registroIntercorrenciaService.inserirMultiplos(intercorrenciasParaSalvar);
        if (error) {
          console.error('Erro ao salvar intercorrências:', error);
          Alert.alert('Aviso', 'Aula salva, mas houve erro ao salvar algumas intercorrências.');
        } else {
          console.log('✅ Intercorrências salvas com sucesso:', data?.length);
        }
      } else {
        console.log('ℹ️ Nenhuma intercorrência para salvar');
      }

      // **ETAPA 6: Sucesso final**
      console.log('=== SALVAMENTO CONCLUÍDO COM SUCESSO ===');
      const dataAtual = new Date().toLocaleString('pt-BR');
      
      Alert.alert(
        'Sucesso!',
        `Aula registrada com sucesso!\n\nTotal de atividades: ${atividadesProntasParaSalvar.length}\nTotal de intercorrências: ${intercorrenciasParaSalvar.length}\nData: ${dataAtual}\nAprendiz: ${formData.aprendiz}`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Opcional: limpar formulário após salvar
              // handleLimpar();
            }
          }
        ]
      );

      console.log('📊 Resumo do salvamento:', {
        aulaId: aula.id_aula,
        planejamentoId: planejamento.id_planejamento_intervencao,
        totalAtividades: atividadesProntasParaSalvar.length,
        totalIntercorrencias: intercorrenciasParaSalvar.length,
        mapeamentoIds
      });

    } catch (error) {
      console.error('Erro inesperado ao salvar aula:', error);
      Alert.alert('Erro', 'Erro inesperado ao salvar a aula. Tente novamente.');
    }
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
          aprendizId={aprendizId || undefined}
          onNovaAtividade={handleNovaAtividade}
          onSelecionarAtividade={adicionarNovaAtividade}
          onCancelarCombobox={handleCancelarCombobox}
          onUpdateData={updateAtividadeData}
          onUpdatePontuacao={updateAtividadePontuacao}
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
