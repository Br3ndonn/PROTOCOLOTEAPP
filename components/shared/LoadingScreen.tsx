import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconSymbol name="doc.text" size={64} color="#6366f1" />
        <Text style={styles.title}>Protocolo TEA</Text>
        <Text style={styles.subtitle}>Carregando...</Text>
        <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  loader: {
    marginTop: 16,
  },
});

export default LoadingScreen;
