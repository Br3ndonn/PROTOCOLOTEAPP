import React from 'react';
import { View } from 'react-native';
import IntercorrenciasSection from './IntercorrenciasSection';

interface GerenciadorIntercorrenciasProps {
  aprendizId: string;
  atividadeId: string;
  disabled?: boolean;
  onIntercorrenciasChange?: (hasIntercorrencias: boolean) => void;
}

export const GerenciadorIntercorrencias: React.FC<GerenciadorIntercorrenciasProps> = ({ 
  aprendizId,
  atividadeId,
  disabled = false,
  onIntercorrenciasChange
}) => {
  if (disabled) {
    return null;
  }

  return (
    <View>
      <IntercorrenciasSection
        aprendizId={aprendizId}
        atividadeId={atividadeId}
        onIntercorrenciasChange={onIntercorrenciasChange}
      />
    </View>
  );
};

export default GerenciadorIntercorrencias;
