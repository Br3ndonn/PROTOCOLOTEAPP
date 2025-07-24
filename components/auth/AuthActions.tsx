import { Button } from '@/components/shared/Button';
import { styles } from '@/styles/LoginScreenStyles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AuthActionsProps {
  isSignUp: boolean;
  loading: boolean;
  onLogin: () => void;
  onSignUp: () => void;
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const AuthActions: React.FC<AuthActionsProps> = ({
  isSignUp,
  loading,
  onLogin,
  onSignUp,
  onToggleMode,
  onForgotPassword
}) => {
  const router = useRouter();

  return (
    <View>
      <Button
        title={isSignUp ? 'Cadastrar' : 'Entrar'}
        variant="primary"
        loading={loading}
        onPress={isSignUp ? onSignUp : onLogin}
      />

      {!isSignUp && (
        <TouchableOpacity onPress={onForgotPassword} disabled={loading}>
          <Text style={styles.linkText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      )}

      <View style={styles.divider}>
        <Text style={styles.dividerText}>ou</Text>
      </View>

      <Button
        title={isSignUp ? 'Já tem uma conta? Entrar' : 'Criar Conta'}
        variant="secondary"
        loading={loading}
        onPress={onToggleMode}
      />

      {!isSignUp && (
        <TouchableOpacity
          style={{ marginTop: 15, alignItems: 'center' }}
          onPress={() => router.push('/CadastroScreen')}
          disabled={loading}
        >
          <Text style={[styles.linkText, { fontSize: 14 }]}>
            Ou cadastre-se em uma tela dedicada
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
