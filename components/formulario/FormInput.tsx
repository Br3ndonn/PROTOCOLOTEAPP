import { styles } from '@/styles/FormularioStyles';
import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false,
  keyboardType = 'default',
  required = false
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>
      {label}{required && ' *'}
    </Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      keyboardType={keyboardType}
    />
  </View>
);

export default FormInput;
