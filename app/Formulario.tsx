import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    color: '#1e293b',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  optionSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  tentativasContainer: {
    marginTop: 8,
  },
  tentativaCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    backgroundColor: '#ffffff',
    width: 160,
    alignItems: 'center',
  },
  pontuacaoGrid: {
    width: '100%',
    marginBottom: 12,
  },
  pontuacaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pontuacaoButton: {
    width: 60,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pontuacaoButtonFull: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pontuacaoButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pontuacaoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  pontuacaoTextSelected: {
    color: '#ffffff',
  },
  tentativaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  pontuacaoSelecionada: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    width: '100%',
  },
  pontuacaoSelecionadaLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  pontuacaoSelecionadaValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  somatorioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calcularButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  calcularButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  somatorioInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    color: '#6366f1',
  },
  observacoesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#ffffff',
    height: 100,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 32,
  },
  limparButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  limparButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
  },
  salvarButton: {
    flex: 2,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  salvarButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
