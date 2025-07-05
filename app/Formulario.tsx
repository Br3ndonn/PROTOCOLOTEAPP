import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles/FormularioStyles';
// Interfaces para tipagem
interface FormData {
  aprendiz: string;
  responsavel: string;
  data: string;
  local: string;
  observacoes: string;
}

interface AtividadeData {
  id: string;
  atividade: string;
  meta: string;
  completude: CompletudeOption;
  somatorio: string;
  tentativas: TentativaData[];
  houveIntercorrencia: boolean;
  intercorrencias: IntercorrenciaData[];
  minimizada: boolean;
  salva: boolean;
}

interface TentativaData {
  id: string;
  nome: string;
  pontuacao: number;
}

interface IntercorrenciaData {
  id: string;
  nome: string;
  selecionada: boolean;
  frequencia: number;
  intensidade: number;
}

type CompletudeOption = 'Não Realizou' | 'Poucas' | 'Metade' | 'Quase Tudo' | 'Tudo' | '';

// Lista de atividades disponíveis (simulando dados do plano de intervenção)
const ATIVIDADES_DISPONIVEIS = [
  { id: '1', nome: 'Natação Livre', codigo: 'NL-001' },
  { id: '2', nome: 'Exercícios Respiratórios', codigo: 'ER-002' },
  { id: '3', nome: 'Coordenação Motora', codigo: 'CM-003' },
  { id: '4', nome: 'Relaxamento Aquático', codigo: 'RA-004' },
  { id: '5', nome: 'Flutuação Assistida', codigo: 'FA-005' },
  { id: '6', nome: 'Propulsão Básica', codigo: 'PB-006' },
  { id: '7', nome: 'Imersão Gradual', codigo: 'IG-007' },
  { id: '8', nome: 'Socialização Aquática', codigo: 'SA-008' }
];

export default function FormularioScreen() {
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

  // Dados das tentativas padrão
  const tentativasPadrao: TentativaData[] = [
    { id: '1', nome: '1ª Tentativa', pontuacao: 0 },
    { id: '2', nome: '2ª Tentativa', pontuacao: 0 },
    { id: '3', nome: '3ª Tentativa', pontuacao: 0 },
    { id: '4', nome: 'Penúltima Tentativa', pontuacao: 0 },
    { id: '5', nome: 'Última Tentativa', pontuacao: 0 }
  ];

  // Intercorrências padrão
  const intercorrenciasPadrao: IntercorrenciaData[] = [
    { id: '1', nome: 'Fuga/esquiva', selecionada: false, frequencia: 1, intensidade: 1 },
    { id: '2', nome: 'Birra/choro', selecionada: false, frequencia: 1, intensidade: 1 },
    { id: '3', nome: 'Destruição', selecionada: false, frequencia: 1, intensidade: 1 },
    { id: '4', nome: 'Autolesivo', selecionada: false, frequencia: 1, intensidade: 1 },
    { id: '5', nome: 'Agressividade', selecionada: false, frequencia: 1, intensidade: 1 },
    { id: '6', nome: 'Sonolento/disperso', selecionada: false, frequencia: 1, intensidade: 1 },
    { id: '7', nome: 'Estereotipia física ou vocal', selecionada: false, frequencia: 1, intensidade: 1 },
    { id: '8', nome: 'Recusa contato físico ou instrucional', selecionada: false, frequencia: 1, intensidade: 1 }
  ];

  const completudeOptions: CompletudeOption[] = [
    'Não Realizou', 'Poucas', 'Metade', 'Quase Tudo', 'Tudo'
  ];

  // Função para adicionar nova atividade
  const adicionarNovaAtividade = (atividadeSelecionada: string) => {
    const novaAtividade: AtividadeData = {
      id: Date.now().toString(),
      atividade: atividadeSelecionada,
      meta: '',
      completude: '',
      somatorio: '0',
      tentativas: [...tentativasPadrao],
      houveIntercorrencia: false,
      intercorrencias: [...intercorrenciasPadrao],
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol name="doc.text" size={32} color="#6366f1" />
          <Text style={styles.title}>
            Folha de Registro de Desempenho{'\n'}ABA na Ed. Física Especial
          </Text>
        </View>

        {/* Dados Iniciais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Iniciais</Text>
          
          <FormInput
            label="Aprendiz *"
            value={formData.aprendiz}
            onChangeText={(text) => updateFormData('aprendiz', text)}
            placeholder="Nome do aprendiz"
          />
          
          <FormInput
            label="Responsável *"
            value={formData.responsavel}
            onChangeText={(text) => updateFormData('responsavel', text)}
            placeholder="Nome do responsável"
          />
          
          <FormInput
            label="Data / Horário *"
            value={formData.data}
            onChangeText={(text) => updateFormData('data', text)}
            placeholder="DD/MM/AAAA - HH:MM"
          />
          
          <FormInput
            label="Local"
            value={formData.local}
            onChangeText={(text) => updateFormData('local', text)}
            placeholder="Local da atividade"
          />
        </View>

        {/* Botão Nova Atividade */}
        <View style={styles.section}>
          <View style={styles.novaAtividadeHeader}>
            <Text style={styles.sectionTitle}>Atividades da Aula</Text>
            <TouchableOpacity 
              style={styles.novaAtividadeButton}
              onPress={() => setMostrarCombobox(true)}
            >
              <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
              <Text style={styles.novaAtividadeButtonText}>Nova Atividade</Text>
            </TouchableOpacity>
          </View>

          {/* Combobox para seleção de atividade */}
          {mostrarCombobox && (
            <View style={styles.comboboxContainer}>
              <Text style={styles.comboboxLabel}>Selecione uma atividade do plano de intervenção:</Text>
              <ScrollView style={styles.comboboxScroll} showsVerticalScrollIndicator={false}>
                {ATIVIDADES_DISPONIVEIS.map((atividade) => (
                  <TouchableOpacity
                    key={atividade.id}
                    style={styles.comboboxItem}
                    onPress={() => adicionarNovaAtividade(`${atividade.codigo} - ${atividade.nome}`)}
                  >
                    <Text style={styles.comboboxItemCodigo}>{atividade.codigo}</Text>
                    <Text style={styles.comboboxItemNome}>{atividade.nome}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={styles.cancelarComboboxButton}
                onPress={() => setMostrarCombobox(false)}
              >
                <Text style={styles.cancelarComboboxText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de atividades adicionadas */}
          {atividades.map((atividade) => (
            <AtividadeContainer 
              key={atividade.id}
              atividade={atividade}
              onUpdateData={updateAtividadeData}
              onUpdatePontuacao={updateAtividadePontuacao}
              onUpdateIntercorrencia={updateAtividadeIntercorrencia}
              onSalvar={salvarAtividade}
              onToggleMinimizar={toggleMinimizarAtividade}
              onCalcularSomatorio={calcularSomatorioAtividade}
              onDesfazer={desfazerAtividade}
              onExcluir={excluirAtividade}
              completudeOptions={completudeOptions}
            />
          ))}
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações Adicionais</Text>
          <TextInput
            style={styles.observacoesInput}
            value={formData.observacoes}
            onChangeText={(text) => updateFormData('observacoes', text)}
            placeholder="Adicione observações sobre o desempenho, comportamento ou outros aspectos relevantes..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.limparButton} onPress={handleLimpar}>
            <IconSymbol name="chevron.left" size={20} color="#ef4444" />
            <Text style={styles.limparButtonText}>Limpar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.salvarButton} onPress={handleSalvar}>
            <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
            <Text style={styles.salvarButtonText}>Salvar Aula</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente de Input Reutilizável
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false,
  keyboardType = 'default'
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      keyboardType={keyboardType}
    />
  </View>
);

// Componente AtividadeContainer
interface AtividadeContainerProps {
  atividade: AtividadeData;
  onUpdateData: (atividadeId: string, field: keyof AtividadeData, value: any) => void;
  onUpdatePontuacao: (atividadeId: string, tentativaId: string, value: number) => void;
  onUpdateIntercorrencia: (atividadeId: string, intercorrenciaId: string, field: 'selecionada' | 'frequencia' | 'intensidade', value: boolean | number) => void;
  onSalvar: (atividadeId: string) => void;
  onToggleMinimizar: (atividadeId: string) => void;
  onCalcularSomatorio: (atividadeId: string) => void;
  onDesfazer: (atividadeId: string) => void;
  onExcluir: (atividadeId: string) => void;
  completudeOptions: CompletudeOption[];
}

const AtividadeContainer: React.FC<AtividadeContainerProps> = ({
  atividade,
  onUpdateData,
  onUpdatePontuacao,
  onUpdateIntercorrencia,
  onSalvar,
  onToggleMinimizar,
  onCalcularSomatorio,
  onDesfazer,
  onExcluir,
  completudeOptions
}) => {
  return (
    <View style={[
      styles.atividadeContainer,
      atividade.salva && styles.atividadeContainerSalva
    ]}>
      {/* Header da atividade */}
      <TouchableOpacity 
        style={styles.atividadeHeader}
        onPress={() => onToggleMinimizar(atividade.id)}
      >
        <View style={styles.atividadeHeaderContent}>
          <Text style={styles.atividadeTitle}>{atividade.atividade}</Text>
          <View style={styles.atividadeStatus}>
            {atividade.salva && (
              <View style={styles.statusSalva}>
                <IconSymbol name="checkmark.circle.fill" size={16} color="#10b981" />
                <Text style={styles.statusSalvaText}>Salva</Text>
              </View>
            )}
            <IconSymbol 
              name={atividade.minimizada ? "chevron.down" : "chevron.up"} 
              size={20} 
              color="#6b7280" 
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Conteúdo da atividade (visível apenas se não estiver minimizada) */}
      {!atividade.minimizada && (
        <View style={styles.atividadeContent}>
          {/* Meta */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Meta *</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={atividade.meta}
              onChangeText={(text) => onUpdateData(atividade.id, 'meta', text)}
              placeholder="Meta estabelecida para esta atividade"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Completude do Planejado */}
          <View style={styles.completudeSection}>
            <Text style={styles.completudeTitle}>Completude do Planejado</Text>
            <View style={styles.optionsContainer}>
              {completudeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    atividade.completude === option && styles.optionSelected
                  ]}
                  onPress={() => onUpdateData(atividade.id, 'completude', option)}
                >
                  <Text style={[
                    styles.optionText,
                    atividade.completude === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Desempenho nas Tentativas */}
          <View style={styles.tentativasSection}>
            <Text style={styles.tentativasTitle}>Desempenho nas Tentativas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tentativasContainer}>
              {atividade.tentativas.map((tentativa) => (
                <View key={tentativa.id} style={styles.tentativaCard}>
                  {/* Grid de pontuações */}
                  <View style={styles.pontuacaoGrid}>
                    {/* Linha superior: 8 e 10 */}
                    <View style={styles.pontuacaoRow}>
                      <TouchableOpacity
                        style={[
                          styles.pontuacaoButton,
                          tentativa.pontuacao === 8 && styles.pontuacaoButtonSelected
                        ]}
                        onPress={() => onUpdatePontuacao(atividade.id, tentativa.id, 8)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.pontuacaoText,
                          tentativa.pontuacao === 8 && styles.pontuacaoTextSelected
                        ]}>8</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.pontuacaoButton,
                          tentativa.pontuacao === 10 && styles.pontuacaoButtonSelected
                        ]}
                        onPress={() => onUpdatePontuacao(atividade.id, tentativa.id, 10)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.pontuacaoText,
                          tentativa.pontuacao === 10 && styles.pontuacaoTextSelected
                        ]}>10</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Linha inferior: 2 e 4 */}
                    <View style={styles.pontuacaoRow}>
                      <TouchableOpacity
                        style={[
                          styles.pontuacaoButton,
                          tentativa.pontuacao === 2 && styles.pontuacaoButtonSelected
                        ]}
                        onPress={() => onUpdatePontuacao(atividade.id, tentativa.id, 2)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.pontuacaoText,
                          tentativa.pontuacao === 2 && styles.pontuacaoTextSelected
                        ]}>2</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.pontuacaoButton,
                          tentativa.pontuacao === 4 && styles.pontuacaoButtonSelected
                        ]}
                        onPress={() => onUpdatePontuacao(atividade.id, tentativa.id, 4)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.pontuacaoText,
                          tentativa.pontuacao === 4 && styles.pontuacaoTextSelected
                        ]}>4</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Botão 0 ocupando toda a largura */}
                    <TouchableOpacity
                      style={[
                        styles.pontuacaoButtonFull,
                        tentativa.pontuacao === 0 && styles.pontuacaoButtonSelected
                      ]}
                      onPress={() => onUpdatePontuacao(atividade.id, tentativa.id, 0)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.pontuacaoText,
                        tentativa.pontuacao === 0 && styles.pontuacaoTextSelected
                      ]}>0</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Label da tentativa */}
                  <Text style={styles.tentativaTitle}>{tentativa.nome}</Text>

                  {/* Pontuação selecionada */}
                  <View style={styles.pontuacaoSelecionada}>
                    <Text style={styles.pontuacaoSelecionadaLabel}>Pontuação</Text>
                    <Text style={styles.pontuacaoSelecionadaValue}>{tentativa.pontuacao}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Intercorrências */}
          <View style={styles.intercorrenciasSection}>
            <Text style={styles.intercorrenciasTitle}>Intercorrências</Text>
            
            {/* Checkbox principal */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => onUpdateData(atividade.id, 'houveIntercorrencia', !atividade.houveIntercorrencia)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, atividade.houveIntercorrencia && styles.checkboxChecked]}>
                {atividade.houveIntercorrencia && (
                  <IconSymbol name="checkmark" size={16} color="#ffffff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Houve intercorrência durante a atividade?</Text>
            </TouchableOpacity>

            {/* Lista de intercorrências */}
            {atividade.houveIntercorrencia && (
              <View style={styles.intercorrenciasContainer}>
                <Text style={styles.sectionSubtitle}>
                  Selecione as intercorrências e defina frequência e intensidade (1-4):
                </Text>
                
                {atividade.intercorrencias.map((intercorrencia) => (
                  <View key={intercorrencia.id} style={styles.intercorrenciaItem}>
                    {/* Radio button e nome */}
                    <TouchableOpacity 
                      style={styles.radioContainer}
                      onPress={() => onUpdateIntercorrencia(atividade.id, intercorrencia.id, 'selecionada', !intercorrencia.selecionada)}
                    >
                      <View style={[styles.radio, intercorrencia.selecionada && styles.radioSelected]}>
                        {intercorrencia.selecionada && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.intercorrenciaNome}>{intercorrencia.nome}</Text>
                    </TouchableOpacity>

                    {/* Campos de frequência e intensidade */}
                    {intercorrencia.selecionada && (
                      <View style={styles.frequenciaIntensidadeContainer}>
                        {/* Frequência */}
                        <View style={styles.nivelContainer}>
                          <Text style={styles.nivelLabel}>Frequência</Text>
                          <View style={styles.nivelBotoes}>
                            {[1, 2, 3, 4].map((nivel) => (
                              <TouchableOpacity
                                key={nivel}
                                style={[
                                  styles.nivelBotao,
                                  intercorrencia.frequencia === nivel && styles.nivelBotaoSelected
                                ]}
                                onPress={() => onUpdateIntercorrencia(atividade.id, intercorrencia.id, 'frequencia', nivel)}
                              >
                                <Text style={[
                                  styles.nivelTexto,
                                  intercorrencia.frequencia === nivel && styles.nivelTextoSelected
                                ]}>
                                  {nivel}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>

                        {/* Intensidade */}
                        <View style={styles.nivelContainer}>
                          <Text style={styles.nivelLabel}>Intensidade</Text>
                          <View style={styles.nivelBotoes}>
                            {[1, 2, 3, 4].map((nivel) => (
                              <TouchableOpacity
                                key={nivel}
                                style={[
                                  styles.nivelBotao,
                                  intercorrencia.intensidade === nivel && styles.nivelBotaoSelected
                                ]}
                                onPress={() => onUpdateIntercorrencia(atividade.id, intercorrencia.id, 'intensidade', nivel)}
                              >
                                <Text style={[
                                  styles.nivelTexto,
                                  intercorrencia.intensidade === nivel && styles.nivelTextoSelected
                                ]}>
                                  {nivel}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Somatório */}
          <View style={styles.somatorioSection}>
            <Text style={styles.somatorioTitle}>Somatório da Pontuação</Text>
            <View style={styles.somatorioContainer}>
              <TouchableOpacity 
                style={styles.calcularButton} 
                onPress={() => onCalcularSomatorio(atividade.id)}
              >
                <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
                <Text style={styles.calcularButtonText}>Calcular</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.somatorioInput}
                value={atividade.somatorio}
                onChangeText={(text) => onUpdateData(atividade.id, 'somatorio', text)}
                placeholder="Total"
                keyboardType="numeric"
                editable={false}
              />
            </View>
          </View>

          {/* Botão Salvar Atividade */}
          {!atividade.salva && (
            <TouchableOpacity 
              style={styles.salvarAtividadeButton}
              onPress={() => onSalvar(atividade.id)}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color="#ffffff" />
              <Text style={styles.salvarAtividadeButtonText}>Salvar Atividade</Text>
            </TouchableOpacity>
          )}

          {/* Ações adicionais: Desfazer e Excluir */}
          {atividade.salva && (
            <View style={styles.acoesAdicionaisContainer}>
              <TouchableOpacity 
                style={styles.desfazerButton}
                onPress={() => onDesfazer(atividade.id)}
              >
                <IconSymbol name="arrow.uturn.left" size={20} color="#ffffff" />
                <Text style={styles.desfazerButtonText}>Desfazer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.excluirButton}
                onPress={() => onExcluir(atividade.id)}
              >
                <IconSymbol name="trash" size={20} color="#ffffff" />
                <Text style={styles.excluirButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
