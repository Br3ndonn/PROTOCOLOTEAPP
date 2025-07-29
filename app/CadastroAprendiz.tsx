import React, { useState } from 'react';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Qualidade } from '@/services/AprendizService';
import { styles } from '@/styles/CadastroAprendizStyles';
import { router } from 'expo-router';
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
import { Picker } from '@react-native-picker/picker';
enum Sexo {
  Masculino = 'Masculino',
  Feminino = 'Feminino',
  Outro = 'Outro'
}

enum Parentesco {
  Pai = 'Pai',
  Mãe = 'Mãe',
  Avô = 'Avô',
  Avó = 'Avó',
  Tio = 'Tio',
  Tia = 'Tia',
  Irmão = 'Irmão',
  Irmã = 'Irmã',
  Outro = 'Outro'
}

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
  qualiSono: Qualidade;
  alimentacao: Qualidade;
  partEdFisica: string;
  envivolExerFis: string;
  interesses: string[];
  objCurtoPrazo: string[];
  objLongoPrazo: string[];
  responsavelId: string;
  responsavelNome: string;
  responsavelParentesco: Parentesco;
  responsavelEmail?: string;
  responsavelTelefone?: string;
}

const CadastroAprendizScreen = () => {
  const [formData, setFormData] = useState<FormDataAprendiz>({
    nome: '',
    dataNascimento: '',
    sexo: Sexo.Masculino,
    diagnostico: false,
    idadeDiagnostico: '',
    irmaos: false,
    qualidades: [],
    carComprVida: [],
    medicamentos: [],
    qualiSono: Qualidade.Regular,
    alimentacao: Qualidade.Regular,
    partEdFisica: '',
    envivolExerFis: '',
    interesses: [],
    objCurtoPrazo: [],
    objLongoPrazo: [],
    responsavelId: '',
    responsavelNome: '',
    responsavelParentesco: Parentesco.Pai,
    responsavelEmail: '',
    responsavelTelefone: ''
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
      const novosItems = [...itemsAtuais, novoItem.trim()];
      updateFormData(campo, novosItems);
      setNovoItem('');
      if (campo === 'qualidades') {
        console.log('Qualidades atualizadas:', novosItems);
      }
    }
  };

  const removerItem = (index: number, campo: keyof FormDataAprendiz) => {
    const itemsAtuais = formData[campo] as string[];
    const novosItems = itemsAtuais.filter((_, i) => i !== index);
    updateFormData(campo, novosItems);
    if (campo === 'qualidades') {
      console.log('Qualidades após remoção:', novosItems);
    }
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
              sexo: Sexo.Masculino,
              diagnostico: false,
              idadeDiagnostico: '',
              irmaos: false,
              qualidades: [],
              carComprVida: [],
              medicamentos: [],
              qualiSono: Qualidade.Regular,
              alimentacao: Qualidade.Regular,
              partEdFisica: '',
              envivolExerFis: '',
              interesses: [],
              objCurtoPrazo: [],
              objLongoPrazo: [],
              responsavelId: '',
              responsavelNome: '',
              responsavelParentesco: Parentesco.Pai,
              responsavelEmail: '',
              responsavelTelefone: ''
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

      {/* Lista de itens com botão de excluir */}
      {items.map((item, index) => (
        <View key={index} style={styles.arrayItem}>
          <Text style={styles.arrayItemText}>{item}</Text>
          <TouchableOpacity
            style={styles.removeItemButton}
            onPress={() => removerItem(index, campo)}
          >
            <IconSymbol name="trash" size={18} color="#FF3B30" />
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
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
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
                onChangeText={(text: string) => updateFormData('nome', text)}
                placeholder="Digite o nome completo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de Nascimento *</Text>
              <TextInput
                style={styles.input}
                value={formData.dataNascimento}
                onChangeText={(text: string) => updateFormData('dataNascimento', text)}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.radioContainer}>
                {[Sexo.Masculino, Sexo.Feminino, Sexo.Outro].map((opcao) => (
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
                      {opcao}
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
                onValueChange={(value: boolean) => updateFormData('diagnostico', value)}
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
                  onChangeText={(text: string) => updateFormData('idadeDiagnostico', text)}
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
                onValueChange={(value: boolean) => updateFormData('irmaos', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={formData.irmaos ? '#007AFF' : '#f4f3f4'}
              />
            </View>

   {/* Cadastro de Responsável */}
   <View style={styles.inputContainer}>
     <Text style={styles.label}>Nome do Responsável</Text>
     <TextInput
       style={styles.input}
       value={formData.responsavelNome}
       onChangeText={(text: string) => updateFormData('responsavelNome', text)}
       placeholder="Digite o nome do responsável"
     />
   </View>
   <View style={styles.inputContainer}>
     <Text style={styles.label}>Parentesco</Text>
     <View style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, backgroundColor: '#f1f5f9' }}>
       <Picker
         selectedValue={formData.responsavelParentesco}
         onValueChange={(itemValue: Parentesco) => updateFormData('responsavelParentesco', itemValue)}
         style={{ height: 48, width: '100%' }}
       >
         {Object.values(Parentesco).map((opcao) => (
           <Picker.Item key={opcao} label={opcao} value={opcao} />
         ))}
       </Picker>
     </View>
   </View>
   <View style={styles.inputContainer}>
     <Text style={styles.label}>Email do Responsável (opcional)</Text>
     <TextInput
       style={styles.input}
       value={formData.responsavelEmail}
       onChangeText={(text: string) => updateFormData('responsavelEmail', text)}
       placeholder="Email do responsável"
       keyboardType="email-address"
     />
   </View>
   <View style={styles.inputContainer}>
     <Text style={styles.label}>Telefone do Responsável (opcional)</Text>
     <TextInput
       style={styles.input}
       value={formData.responsavelTelefone}
       onChangeText={(text: string) => updateFormData('responsavelTelefone', text)}
       placeholder="Telefone do responsável"
       keyboardType="phone-pad"
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
              <View style={styles.radioContainer}>
                {Object.values(Qualidade).map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={styles.radioOption}
                    onPress={() => updateFormData('qualiSono', opcao)}
                  >
                    <View style={[
                      styles.radioCircle,
                      formData.qualiSono === opcao && styles.radioSelected
                    ]} />
                    <Text style={styles.radioText}>{opcao}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Alimentação</Text>
              <View style={styles.radioContainer}>
                {Object.values(Qualidade).map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={styles.radioOption}
                    onPress={() => updateFormData('alimentacao', opcao)}
                  >
                    <View style={[
                      styles.radioCircle,
                      formData.alimentacao === opcao && styles.radioSelected
                    ]} />
                    <Text style={styles.radioText}>{opcao}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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
                onChangeText={(text: string) => updateFormData('partEdFisica', text)}
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
