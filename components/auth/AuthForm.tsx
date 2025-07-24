import { FormInput } from '@/components/shared/FormInput';
import React from 'react';
import { View } from 'react-native';

interface AuthFormProps {
  email: string;
  password: string;
  nomeCompleto: string;
  isSignUp: boolean;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNomeCompletoChange: (value: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  nomeCompleto,
  isSignUp,
  loading,
  onEmailChange,
  onPasswordChange,
  onNomeCompletoChange
}) => {
  return (
    <View>
      {isSignUp && (
        <FormInput
          label="Nome Completo"
          value={nomeCompleto}
          onChangeText={onNomeCompletoChange}
          placeholder="Digite seu nome completo"
          autoCapitalize="words"
          editable={!loading}
        />
      )}
      
      <FormInput
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <FormInput
        label="Senha"
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Digite sua senha"
        secureTextEntry
        editable={!loading}
      />
    </View>
  );
};
