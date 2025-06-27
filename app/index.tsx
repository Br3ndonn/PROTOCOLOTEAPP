import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Definindo os tipos para as rotas de navegação
type RootStackParamList = {
  Alunos: undefined;
  Cronograma: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Alunos'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escola de Natação</Text>
      
      <View style={styles.menuContainer}>
        {/* Botão Alunos */}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Alunos')}
        >
          <Text style={styles.menuText}>Alunos</Text>
        </TouchableOpacity>

        {/* Botão Cronograma */}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Cronograma')}
        >
          <Text style={styles.menuText}>Cronograma</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
    marginVertical: 30,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#0097a7',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3, // para Android (sombra)
    shadowColor: '#000', // para iOS
    shadowOffset: { width: 0, height: 2 }, // para iOS
    shadowOpacity: 0.3, // para iOS
    shadowRadius: 3, // para iOS
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});