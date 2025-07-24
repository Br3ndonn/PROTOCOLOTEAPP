import { AuthActions } from '@/components/auth/AuthActions';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { useAuthForm } from '@/hooks/useAuthForm';
import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/LoginScreenStyles';

export default function LoginScreen() {
  const {
    formData,
    loading,
    isSignUp,
    updateField,
    toggleMode,
    handleLogin,
    handleSignUp,
    handleForgotPassword
  } = useAuthForm();

  return (
    <View style={styles.screen}>
      <View style={styles.loginContainer}>
        <AuthHeader isSignUp={isSignUp} />
        
        <AuthForm
          email={formData.email}
          password={formData.password}
          nomeCompleto={formData.nomeCompleto || ''}
          isSignUp={isSignUp}
          loading={loading}
          onEmailChange={(value) => updateField('email', value)}
          onPasswordChange={(value) => updateField('password', value)}
          onNomeCompletoChange={(value) => updateField('nomeCompleto', value)}
        />
        
        <AuthActions
          isSignUp={isSignUp}
          loading={loading}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onToggleMode={toggleMode}
          onForgotPassword={handleForgotPassword}
        />
      </View>
    </View>
  );
}