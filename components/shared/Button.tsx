import { styles } from '@/styles/LoginScreenStyles';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  loading = false,
  disabled,
  style,
  ...props 
}) => {
  const isDisabled = disabled || loading;
  
  const buttonStyle = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    isDisabled && styles.buttonDisabled,
    style
  ];

  const textStyle = variant === 'primary' ? styles.buttonText : styles.secondaryButtonText;

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={isDisabled}
      {...props}
    >
      <Text style={textStyle}>
        {loading ? 'Aguarde...' : title}
      </Text>
    </TouchableOpacity>
  );
};
