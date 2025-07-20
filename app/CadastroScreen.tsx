import { signUpWithEmail } from '@/components/Auth';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [eSupervisor, setESupervisor] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return;
    }

    if (!password) {
      Alert.alert('Erro', 'Senha é obrigatória');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'Senhas não coincidem');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await signUpWithEmail(email, password, nome, eSupervisor);

      if (error) {
        Alert.alert('Erro no Cadastro', error.message || 'Erro desconhecido');
        return;
      }

      if (data?.user) {
        Alert.alert(
          'Sucesso!',
          'Conta criada com sucesso! Verifique seu email para confirmar a conta.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/LoginScreen')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Erro inesperado no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper title="Criar Conta">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: 30,
              color: '#1f2937'
            }}>
              Cadastro de Professor
            </Text>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5, fontWeight: '500', color: '#374151' }}>
                Nome Completo
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#ffffff'
                }}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome completo"
                autoCapitalize="words"
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5, fontWeight: '500', color: '#374151' }}>
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#ffffff'
                }}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ marginBottom: 5, fontWeight: '500', color: '#374151' }}>
                Senha
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#ffffff'
                }}
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ marginBottom: 5, fontWeight: '500', color: '#374151' }}>
                Confirmar Senha
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#ffffff'
                }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Digite a senha novamente"
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            {/* { Campo de Supervisor }
            <View style={{ marginBottom: 25 }}>
              <Text style={{ marginBottom: 10, fontWeight: '500', color: '#374151' }}>
                Tipo de Usuário
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  backgroundColor: '#ffffff'
                }}
                onPress={() => setESupervisor(!eSupervisor)}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: eSupervisor ? '#6366f1' : '#d1d5db',
                  borderRadius: 4,
                  marginRight: 10,
                  backgroundColor: eSupervisor ? '#6366f1' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {eSupervisor && (
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                  )}
                </View>
                <Text style={{ color: '#374151', fontSize: 16 }}>
                  Sou supervisor
                </Text>
              </TouchableOpacity>
              <Text style={{ 
                marginTop: 5, 
                fontSize: 12, 
                color: '#6b7280',
                fontStyle: 'italic' 
              }}>
                {eSupervisor 
                  ? 'Você terá acesso a funcionalidades de supervisão' 
                  : 'Você será registrado como professor regular'
                }
              </Text>
            </View>*/}

            <TouchableOpacity
              style={{
                backgroundColor: loading ? '#9ca3af' : '#6366f1',
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 15
              }}
              onPress={handleCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Criar Conta
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => router.back()}
            >
              <Text style={{ color: '#6366f1', fontSize: 16 }}>
                Já tem uma conta? Fazer login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
