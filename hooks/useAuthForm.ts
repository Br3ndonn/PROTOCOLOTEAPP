import { signInWithEmail, signUpWithEmail } from '@/components/Auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

interface AuthFormData {
  email: string;
  password: string;
  nomeCompleto?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

export function useAuthForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    nomeCompleto: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const updateField = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setFormData({ email: '', password: '', nomeCompleto: '' });
  };

  const toggleMode = () => {
    setIsSignUp(prev => !prev);
    clearForm();
  };

  const validateForm = (): AuthResult => {
    if (!formData.email || !formData.password) {
      return { success: false, error: 'Por favor, preencha todos os campos' };
    }

    if (isSignUp && !formData.nomeCompleto?.trim()) {
      return { success: false, error: 'Por favor, preencha seu nome completo' };
    }

    if (formData.password.length < 6) {
      return { success: false, error: 'A senha deve ter pelo menos 6 caracteres' };
    }

    return { success: true };
  };

  const handleLogin = async (): Promise<void> => {
    const validation = validateForm();
    if (!validation.success) {
      Alert.alert('Erro', validation.error);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signInWithEmail(formData.email, formData.password);
      
      if (error) {
        Alert.alert('Erro no Login', error.message);
      } else {
        router.replace('/Alunos');
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

  const handleSignUp = async (): Promise<void> => {
    const validation = validateForm();
    if (!validation.success) {
      Alert.alert('Erro', validation.error);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUpWithEmail(
        formData.email, 
        formData.password, 
        formData.nomeCompleto!.trim(), 
        false
      );
      
      if (error) {
        Alert.alert('Erro no Cadastro', error.message);
      } else {
        clearForm();
        setIsSignUp(false);
        router.replace('/Alunos');
        setTimeout(() => {
          Alert.alert(
            'Cadastro Realizado', 
            `Bem-vindo(a), ${formData.nomeCompleto}! Por favor, verifique seu email para confirmar a conta.`
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

  const handleForgotPassword = (): void => {
    Alert.alert(
      'Recuperar Senha',
      'Digite seu email para receber instruções de recuperação',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: () => {
            if (!formData.email) {
              Alert.alert('Erro', 'Por favor, digite seu email primeiro');
              return;
            }
            Alert.alert('Email Enviado', 'Verifique sua caixa de entrada');
          }
        }
      ]
    );
  };

  return {
    formData,
    loading,
    isSignUp,
    updateField,
    toggleMode,
    handleLogin,
    handleSignUp,
    handleForgotPassword
  };
}
