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
  atividade: string;
  meta: string;
  completude: CompletudeOption;
  somatorio: string;
  observacoes: string;
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

export default function FormularioScreen() {
  // Estados do formulário
  const [formData, setFormData] = useState<FormData>({
    aprendiz: '',
    responsavel: '',
    data: '',
    local: '',
    atividade: '',
    meta: '',
    completude: '',
    somatorio: '',
    observacoes: ''
  });

  // Dados das tentativas
  const [tentativas, setTentativas] = useState<TentativaData[]>([
    { id: '1', nome: '1ª Tentativa', pontuacao: 0 },
    { id: '2', nome: '2ª Tentativa', pontuacao: 0 },
    { id: '3', nome: '3ª Tentativa', pontuacao: 0 },
    { id: '4', nome: 'Penúltima Tentativa', pontuacao: 0 },
    { id: '5', nome: 'Última Tentativa', pontuacao: 0 }
  ]);

  // Estados para intercorrências
  const [houveIntercorrencia, setHouveIntercorrencia] = useState(false);
  const [intercorrencias, setIntercorrencias] = useState<IntercorrenciaData[]>(
    [
      { id: '1', nome: 'Fuga/esquiva', selecionada: false, frequencia: 1, intensidade: 1 },
      { id: '2', nome: 'Birra/choro', selecionada: false, frequencia: 1, intensidade: 1 },
      { id: '3', nome: 'Destruição', selecionada: false, frequencia: 1, intensidade: 1 },
      { id: '4', nome: 'Autolesivo', selecionada: false, frequencia: 1, intensidade: 1 },
      { id: '5', nome: 'Agressividade', selecionada: false, frequencia: 1, intensidade: 1 },
      { id: '6', nome: 'Sonolento/disperso', selecionada: false, frequencia: 1, intensidade: 1 },
      { id: '7', nome: 'Estereotipia física ou vocal', selecionada: false, frequencia: 1, intensidade: 1 },
      { id: '8', nome: 'Recusa contato físico ou instrucional', selecionada: false, frequencia: 1, intensidade: 1 }
    ]
  );

  const completudeOptions: CompletudeOption[] = [
    'Não Realizou', 'Poucas', 'Metade', 'Quase Tudo', 'Tudo'
  ];

  // Função para atualizar campos do formulário
  const updateFormData = (field: keyof FormData, value: string | CompletudeOption) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para atualizar pontuação de uma tentativa
  const updatePontuacao = (tentativaId: string, value: number) => {
    setTentativas(prev => prev.map(tentativa => 
      tentativa.id === tentativaId 
        ? { ...tentativa, pontuacao: value }
        : tentativa
    ));
  };

  // Função para atualizar intercorrência
  const updateIntercorrencia = (intercorrenciaId: string, field: 'selecionada' | 'frequencia' | 'intensidade', value: boolean | number) => {
    setIntercorrencias(prev => prev.map(intercorrencia => 
      intercorrencia.id === intercorrenciaId 
        ? { ...intercorrencia, [field]: value }
        : intercorrencia
    ));
  };

  // Calcular somatório total
  const calcularSomatorio = () => {
    const total = tentativas.reduce((acc, tentativa) => 
      acc + tentativa.pontuacao, 0
    );
    updateFormData('somatorio', total.toString());
  };

  // Recalcular somatório automaticamente quando as tentativas mudarem
  useEffect(() => {
    const total = tentativas.reduce((acc, tentativa) => 
      acc + tentativa.pontuacao, 0
    );
    setFormData(prev => ({ ...prev, somatorio: total.toString() }));
  }, [tentativas]);

  // Função para salvar o formulário
  const handleSalvar = () => {
    // Validação básica
    if (!formData.aprendiz || !formData.responsavel || !formData.data) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios (Aprendiz, Responsável e Data)');
      return;
    }

    Alert.alert(
      'Formulário Salvo',
      'Os dados foram salvos com sucesso!',
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
              atividade: '',
              meta: '',
              completude: '',
              somatorio: '',
              observacoes: ''
            });
            setTentativas(prev => prev.map(t => ({ ...t, pontuacao: 0 })));
            setHouveIntercorrencia(false);
            setIntercorrencias(prev => prev.map(i => ({ 
              ...i, 
              selecionada: false, 
              frequencia: 1, 
              intensidade: 1 
            })));
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
          
          <FormInput
            label="Atividade (cód.)"
            value={formData.atividade}
            onChangeText={(text) => updateFormData('atividade', text)}
            placeholder="Código da atividade"
          />
          
          <FormInput
            label="Meta"
            value={formData.meta}
            onChangeText={(text) => updateFormData('meta', text)}
            placeholder="Meta estabelecida"
            multiline
          />
        </View>

        {/* Completude do Planejado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completude do Planejado</Text>
          <View style={styles.optionsContainer}>
            {completudeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  formData.completude === option && styles.optionSelected
                ]}
                onPress={() => updateFormData('completude', option)}
              >
                <Text style={[
                  styles.optionText,
                  formData.completude === option && styles.optionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Desempenho nas Tentativas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desempenho nas Tentativas</Text>
          <Text style={styles.sectionSubtitle}>
            Selecione a pontuação para cada tentativa
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tentativasContainer}>
            {tentativas.map((tentativa) => (
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
                      onPress={() => updatePontuacao(tentativa.id, 8)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
                      onPress={() => updatePontuacao(tentativa.id, 10)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
                      onPress={() => updatePontuacao(tentativa.id, 2)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
                      onPress={() => updatePontuacao(tentativa.id, 4)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
                    onPress={() => updatePontuacao(tentativa.id, 0)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intercorrências</Text>
          <Text style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
            Estado: {houveIntercorrencia ? 'SIM' : 'NÃO'}
          </Text>
          
          {/* Checkbox principal */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => {
              console.log('Checkbox clicado! Estado atual:', houveIntercorrencia);
              setHouveIntercorrencia(!houveIntercorrencia);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, houveIntercorrencia && styles.checkboxChecked]}>
              {houveIntercorrencia && (
                <IconSymbol name="checkmark" size={16} color="#ffffff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Houve intercorrência durante a atividade?</Text>
          </TouchableOpacity>

          {/* Lista de intercorrências (visível apenas se houver intercorrência) */}
          {houveIntercorrencia && (
            <View style={styles.intercorrenciasContainer}>
              <Text style={styles.sectionSubtitle}>
                Selecione as intercorrências ocorridas e defina frequência e intensidade (1-4):
              </Text>
              
              {intercorrencias.map((intercorrencia) => (
                <View key={intercorrencia.id} style={styles.intercorrenciaItem}>
                  {/* Radio button e nome */}
                  <TouchableOpacity 
                    style={styles.radioContainer}
                    onPress={() => updateIntercorrencia(intercorrencia.id, 'selecionada', !intercorrencia.selecionada)}
                  >
                    <View style={[styles.radio, intercorrencia.selecionada && styles.radioSelected]}>
                      {intercorrencia.selecionada && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.intercorrenciaNome}>{intercorrencia.nome}</Text>
                  </TouchableOpacity>

                  {/* Campos de frequência e intensidade (visíveis apenas se selecionado) */}
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
                              onPress={() => updateIntercorrencia(intercorrencia.id, 'frequencia', nivel)}
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
                              onPress={() => updateIntercorrencia(intercorrencia.id, 'intensidade', nivel)}
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Somatório da Pontuação</Text>
          <View style={styles.somatorioContainer}>
            <TouchableOpacity style={styles.calcularButton} onPress={calcularSomatorio}>
              <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
              <Text style={styles.calcularButtonText}>Calcular</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.somatorioInput}
              value={formData.somatorio}
              onChangeText={(text) => updateFormData('somatorio', text)}
              placeholder="Total"
              keyboardType="numeric"
              editable={false}
            />
          </View>
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
            <Text style={styles.salvarButtonText}>Salvar</Text>
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
