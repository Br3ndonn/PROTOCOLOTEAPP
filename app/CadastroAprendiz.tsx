import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/CadastroAprendizStyles';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Tipos para o formulário
type Sexo = 'masculino' | 'feminino' | 'outro';

interface FormDataAprendiz {
  nome: string;
  dataNascimento: string;
  sexo: Sexo;
  diagnostico: boolean;
  idadeDiagnostico: string;
  irmaos: boolean;
  qualidades: string[];
  carComprVida: string[];
  medicamentos: string[];
  qualiSono: string;
  alimentacao: string;
  partEdFisica: string;
  envivolExerFis: string;
  interesses: string[];
  objCurtoPrazo: string[];
  objLongoPrazo: string[];
  responsavelId: string;
}

const CadastroAprendizScreen = () => {
  const [formData, setFormData] = useState<FormDataAprendiz>({
    nome: '',
    dataNascimento: '',
    sexo: 'masculino',
    diagnostico: false,
    idadeDiagnostico: '',
    irmaos: false,
    qualidades: [],
    carComprVida: [],
    medicamentos: [],
    qualiSono: '',
    alimentacao: '',
    partEdFisica: '',
    envivolExerFis: '',
    interesses: [],
    objCurtoPrazo: [],
    objLongoPrazo: [],
    responsavelId: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Estados para campos de array
  const [novaQualidade, setNovaQualidade] = useState('');
  const [novaCaracteristica, setNovaCaracteristica] = useState('');
  const [novoMedicamento, setNovoMedicamento] = useState('');
  const [novoInteresse, setNovoInteresse] = useState('');
  const [novoObjCurto, setNovoObjCurto] = useState('');
  const [novoObjLongo, setNovoObjLongo] = useState('');

  const updateFormData = (field: keyof FormDataAprendiz, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]); // Limpar erros ao editar
  };

  const adicionarItem = (
    novoItem: string,
    setNovoItem: (value: string) => void,
    campo: keyof FormDataAprendiz
  ) => {
    if (novoItem.trim()) {
      const itemsAtuais = formData[campo] as string[];
      updateFormData(campo, [...itemsAtuais, novoItem.trim()]);
      setNovoItem('');
    }
  };

  const removerItem = (index: number, campo: keyof FormDataAprendiz) => {
    const itemsAtuais = formData[campo] as string[];
    const novosItems = itemsAtuais.filter((_, i) => i !== index);
    updateFormData(campo, novosItems);
  };

  const validarFormulario = (): string[] => {
    const erros: string[] = [];

    if (!formData.nome.trim()) {
      erros.push('Nome é obrigatório');
    }

    if (!formData.dataNascimento.trim()) {
      erros.push('Data de nascimento é obrigatória');
    } else {
      // Validar formato da data (DD/MM/AAAA)
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(formData.dataNascimento)) {
        erros.push('Data deve estar no formato DD/MM/AAAA');
      }
    }

    if (formData.diagnostico && !formData.idadeDiagnostico.trim()) {
      erros.push('Idade do diagnóstico é obrigatória quando há diagnóstico');
    }

    if (formData.idadeDiagnostico.trim()) {
      const idade = parseInt(formData.idadeDiagnostico);
      if (isNaN(idade) || idade < 0 || idade > 18) {
        erros.push('Idade do diagnóstico deve ser um número entre 0 e 18');
      }
    }

    return erros;
  };

  const handleSalvar = async () => {
    const errosValidacao = validarFormulario();
    
    if (errosValidacao.length > 0) {
      setErrors(errosValidacao);
      Alert.alert('Dados inválidos', errosValidacao.join('\n'));
      return;
    }

    setLoading(true);

    try {
      // TODO: Implementar salvamento no Supabase
      console.log('Dados do aprendiz:', formData);
      
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Sucesso!',
        'Aprendiz cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
      console.error('Erro ao salvar aprendiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    Alert.alert(
      'Limpar formulário',
      'Tem certeza que deseja limpar todos os dados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            setFormData({
              nome: '',
              dataNascimento: '',
              sexo: 'masculino',
              diagnostico: false,
              idadeDiagnostico: '',
              irmaos: false,
              qualidades: [],
              carComprVida: [],
              medicamentos: [],
              qualiSono: '',
              alimentacao: '',
              partEdFisica: '',
              envivolExerFis: '',
              interesses: [],
              objCurtoPrazo: [],
              objLongoPrazo: [],
              responsavelId: ''
            });
            setErrors([]);
          }
        }
      ]
    );
  };

  const renderArrayField = (
    titulo: string,
    items: string[],
    novoItem: string,
    setNovoItem: (value: string) => void,
    campo: keyof FormDataAprendiz,
    placeholder: string
  ) => (
    <View style={styles.arrayFieldContainer}>
      <Text style={styles.arrayFieldTitle}>{titulo}</Text>
      
      {/* Input para adicionar novo item */}
      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.addItemInput}
          placeholder={placeholder}
          value={novoItem}
          onChangeText={setNovoItem}
          onSubmitEditing={() => adicionarItem(novoItem, setNovoItem, campo)}
        />
        <TouchableOpacity
          style={styles.addItemButton}
          onPress={() => adicionarItem(novoItem, setNovoItem, campo)}
        >
          <IconSymbol name="plus" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Lista de itens */}
      {items.map((item, index) => (
        <View key={index} style={styles.arrayItem}>
          <Text style={styles.arrayItemText}>{item}</Text>
          <TouchableOpacity
            style={styles.removeItemButton}
            onPress={() => removerItem(index, campo)}
          >
            <IconSymbol name="trash" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <ScreenWrapper 
      title="Cadastro de Aprendiz"
      showBackButton={true}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Erros de validação */}
          {errors.length > 0 && (
            <View style={styles.errorContainer}>
              {errors.map((error, index) => (
                <Text key={index} style={styles.errorText}>• {error}</Text>
              ))}
            </View>
          )}

          {/* Dados Básicos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados Básicos</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(text) => updateFormData('nome', text)}
                placeholder="Digite o nome completo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Nascimento *</Text>
              <TextInput
                style={styles.input}
                value={formData.dataNascimento}
                onChangeText={(text) => updateFormData('dataNascimento', text)}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.radioContainer}>
                {(['masculino', 'feminino', 'outro'] as Sexo[]).map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={styles.radioOption}
                    onPress={() => updateFormData('sexo', opcao)}
                  >
                    <View style={[
                      styles.radioCircle,
                      formData.sexo === opcao && styles.radioSelected
                    ]} />
                    <Text style={styles.radioText}>
                      {opcao.charAt(0).toUpperCase() + opcao.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Diagnóstico */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnóstico</Text>
            
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Possui diagnóstico formal?</Text>
              <Switch
                value={formData.diagnostico}
                onValueChange={(value) => updateFormData('diagnostico', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={formData.diagnostico ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            {formData.diagnostico && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Idade do Diagnóstico *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.idadeDiagnostico}
                  onChangeText={(text) => updateFormData('idadeDiagnostico', text)}
                  placeholder="Digite a idade"
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>

          {/* Família */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Família</Text>
            
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Possui irmãos?</Text>
              <Switch
                value={formData.irmaos}
                onValueChange={(value) => updateFormData('irmaos', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={formData.irmaos ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Características */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características</Text>
            
            {renderArrayField(
              'Qualidades',
              formData.qualidades,
              novaQualidade,
              setNovaQualidade,
              'qualidades',
              'Digite uma qualidade'
            )}

            {renderArrayField(
              'Características que comprometem a vida',
              formData.carComprVida,
              novaCaracteristica,
              setNovaCaracteristica,
              'carComprVida',
              'Digite uma característica'
            )}
          </View>

          {/* Saúde */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saúde</Text>
            
            {renderArrayField(
              'Medicamentos',
              formData.medicamentos,
              novoMedicamento,
              setNovoMedicamento,
              'medicamentos',
              'Digite um medicamento'
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Qualidade do Sono</Text>
              <TextInput
                style={styles.textArea}
                value={formData.qualiSono}
                onChangeText={(text) => updateFormData('qualiSono', text)}
                placeholder="Descreva a qualidade do sono"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Alimentação</Text>
              <TextInput
                style={styles.textArea}
                value={formData.alimentacao}
                onChangeText={(text) => updateFormData('alimentacao', text)}
                placeholder="Descreva os hábitos alimentares"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Atividade Física */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Atividade Física</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Participação em Educação Física</Text>
              <TextInput
                style={styles.textArea}
                value={formData.partEdFisica}
                onChangeText={(text) => updateFormData('partEdFisica', text)}
                placeholder="Como participa das aulas de educação física?"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Envolvimento em Exercícios Físicos</Text>
              <TextInput
                style={styles.textArea}
                value={formData.envivolExerFis}
                onChangeText={(text) => updateFormData('envivolExerFis', text)}
                placeholder="Pratica exercícios físicos? Quais?"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Interesses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interesses</Text>
            
            {renderArrayField(
              'Interesses e Hobbies',
              formData.interesses,
              novoInteresse,
              setNovoInteresse,
              'interesses',
              'Digite um interesse'
            )}
          </View>

          {/* Objetivos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objetivos</Text>
            
            {renderArrayField(
              'Objetivos de Curto Prazo',
              formData.objCurtoPrazo,
              novoObjCurto,
              setNovoObjCurto,
              'objCurtoPrazo',
              'Digite um objetivo de curto prazo'
            )}

            {renderArrayField(
              'Objetivos de Longo Prazo',
              formData.objLongoPrazo,
              novoObjLongo,
              setNovoObjLongo,
              'objLongoPrazo',
              'Digite um objetivo de longo prazo'
            )}
          </View>

          {/* Responsável */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsável</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ID do Responsável</Text>
              <TextInput
                style={styles.input}
                value={formData.responsavelId}
                onChangeText={(text) => updateFormData('responsavelId', text)}
                placeholder="ID do responsável (opcional)"
              />
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleLimpar}
              disabled={loading}
            >
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSalvar}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default CadastroAprendizScreen;
