import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protocolo TEA</Text>
      
      {/* Botão Começar */}
      <View style={styles.startContainer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/LoginScreen')}
        >
          <Text style={styles.startText}>Começar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.menuContainer}>
        {/* Botão Alunos */}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/Alunos')}
        >
          <Text style={styles.menuText}>Alunos</Text>
        </TouchableOpacity>

        {/* Botão Cronograma */}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/Cronograma')}
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
  startContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  startText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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