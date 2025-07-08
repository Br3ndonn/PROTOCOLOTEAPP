import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <ScreenWrapper title="Página não encontrada" showBackButton={false}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Esta tela não existe.</ThemedText>
        <Link href="/LoginScreen" style={styles.link}>
          <ThemedText type="link">Voltar para o início</ThemedText>
        </Link>
      </ThemedView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
