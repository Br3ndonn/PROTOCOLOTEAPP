import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const App = () => {
  const [aprendiz, setAprendiz] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [local, setLocal] = useState('');
  const [atividade, setAtividade] = useState('');
  const [meta, setMeta] = useState('');
  const [data, setData] = useState('');
  const [completude, setCompletude] = useState('');

  const tentativas = ['1ª', '2ª', '3ª', 'Penúltima', 'Última'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        FOLHA DE REGISTRO DE DESEMPENHO EM ABA NA ED. FÍSICA ESPECIAL
      </Text>

      {/* Dados Iniciais */}
      <View style={styles.section}>
        <Input label="Aprendiz" value={aprendiz} setValue={setAprendiz} />
        <Input label="Responsável" value={responsavel} setValue={setResponsavel} />
        <Input label="Data / Horário" value={data} setValue={setData} />
        <Input label="Local" value={local} setValue={setLocal} />
        <Input label="Atividade (cód.)" value={atividade} setValue={setAtividade} />
        <Input label="Meta" value={meta} setValue={setMeta} />
      </View>

      {/* Completude do Planejado */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Completude do Planejado</Text>
        <View style={styles.row}>
          {['Não Realizou', 'Poucas', 'Metade', 'Quase Tudo', 'Tudo'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.option,
                completude === opt && { backgroundColor: '#007bff' }
              ]}
              onPress={() => setCompletude(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tabelas de Tentativas */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Desempenho nas Tentativas</Text>
        <ScrollView horizontal>
          {tentativas.map((tentativa) => (
            <View key={tentativa} style={styles.tentativa}>
              <Text style={styles.tentativaTitle}>{tentativa} Tentativa</Text>
              {[8, 10, 2, 4, 0].map((nota, idx) => (
                <View key={idx} style={styles.cell}>
                  <Text style={styles.cellText}>{nota}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Somatório */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Somatório da Pontuação</Text>
        <TextInput style={styles.input} placeholder="Digite o somatório" />
      </View>
    </ScrollView>
  );
};

type InputProps = {
  label: string;
  value: string;
  setValue: (text: string) => void;
};

const Input: React.FC<InputProps> = ({ label, value, setValue }) => (
  <View style={styles.inputContainer}>
    <Text>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={setValue}
      placeholder={label}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#005baa',
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 8,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  optionText: {
    fontSize: 12,
  },
  tentativa: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  tentativaTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 6,
    width: 40,
    alignItems: 'center',
    marginBottom: 4,
  },
  cellText: {
    fontSize: 12,
  },
});

export default App;
