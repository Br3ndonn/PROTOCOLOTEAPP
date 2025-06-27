import { View, Text, StyleSheet } from 'react-native';

export default function CronogramaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cronograma de Aulas</Text>
      {/* Conteúdo da tela de cronograma aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});