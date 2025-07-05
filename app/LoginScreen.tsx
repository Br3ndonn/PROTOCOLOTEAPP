import { signInWithEmail, signUpWithEmailAndRetry } from '@/components/Auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles/LoginScreenStyles';
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState(''); // Novo campo
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        Alert.alert('Erro no Login', error.message);
      } else {
        // Navegar diretamente para a página Alunos
        router.replace('/(tabs)/Alunos');
        // Mostrar um alert de sucesso sem bloquear a navegação
        setTimeout(() => {
          Alert.alert('Sucesso', 'Login realizado com sucesso!');
        }, 100);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha');
      return;
    }

    if (isSignUp && !nomeCompleto.trim()) {
      Alert.alert('Erro', 'Por favor, preencha seu nome completo');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUpWithEmailAndRetry(email, password, nomeCompleto.trim());
      
      if (error) {
        Alert.alert('Erro no Cadastro', error.message);
      } else {
        // Limpar campos
        setEmail('');
        setPassword('');
        setNomeCompleto('');
        setIsSignUp(false);
        // Navegar para a página Alunos
        router.replace('/(tabs)/Alunos');
        // Mostrar alert de sucesso sem bloquear a navegação
        setTimeout(() => {
          Alert.alert(
            'Cadastro Realizado', 
            `Bem-vindo(a), ${nomeCompleto}! Por favor, verifique seu email para confirmar a conta.`
          );
        }, 100);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
      console.error('Erro no handleSignUp:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Senha',
      'Digite seu email para receber instruções de recuperação',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: () => {
            if (!email) {
              Alert.alert('Erro', 'Por favor, digite seu email primeiro');
              return;
            }
            // Aqui você pode implementar a recuperação de senha
            Alert.alert('Email Enviado', 'Verifique sua caixa de entrada');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Protocolo TEA</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Criar Conta' : 'Fazer Login'}
          </Text>

          {/* Campo Nome Completo - apenas no cadastro */}
          {isSignUp && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
                placeholder="Digite seu nome completo"
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={isSignUp ? handleSignUp : handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Aguarde...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
            </Text>
          </TouchableOpacity>

          {!isSignUp && (
            <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
              <Text style={styles.linkText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <Text style={styles.dividerText}>ou</Text>
          </View>

          <TouchableOpacity
            style={[styles.secondaryButton, loading && styles.buttonDisabled]}
            onPress={() => {
              setIsSignUp(!isSignUp);
              // Limpar campos ao trocar de modo
              setEmail('');
              setPassword('');
              setNomeCompleto('');
            }}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              {isSignUp ? 'Já tem uma conta? Entrar' : 'Criar Conta'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}