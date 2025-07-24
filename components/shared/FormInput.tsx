import { styles } from '@/styles/LoginScreenStyles';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  error, 
  style,
  ...props 
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
