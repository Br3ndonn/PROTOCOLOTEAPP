import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles/PerfilProfessorSyles';

interface AppVersionProps {
  version?: string;
}

export const AppVersion: React.FC<AppVersionProps> = ({ version = 'Protocolo TEA v1.0.0' }) => {
  return (
    <View style={styles.versionContainer}>
      <Text style={styles.versionText}>{version}</Text>
    </View>
  );
};
