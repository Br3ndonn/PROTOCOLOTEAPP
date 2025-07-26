import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles/PerfilProfessorSyles';

interface Professor {
  email?: string;
  e_supervisor?: boolean;
  id_professor?: string;
}

interface AccountInfoProps {
  professor: Professor;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ professor }) => {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.sectionTitle}>Informações da Conta</Text>
      
      <View style={styles.infoItem}>
        <View style={styles.infoItemLeft}>
          <IconSymbol name="envelope" size={20} color="#6b7280" />
          <Text style={styles.infoLabel}>Email</Text>
        </View>
        <Text style={styles.infoValue}>{professor.email || 'Não informado'}</Text>
      </View>

      <View style={styles.infoItem}>
        <View style={styles.infoItemLeft}>
          <IconSymbol name="person.badge.key" size={20} color="#6b7280" />
          <Text style={styles.infoLabel}>Tipo de Usuário</Text>
        </View>
        <Text style={styles.infoValue}>
          {professor.e_supervisor ? 'Supervisor' : 'Professor'}
        </Text>
      </View>

      <View style={styles.infoItem}>
        <View style={styles.infoItemLeft}>
          <IconSymbol name="person.circle" size={20} color="#6b7280" />
          <Text style={styles.infoLabel}>ID do Professor</Text>
        </View>
        <Text style={styles.infoValue}>
          {professor.id_professor ? professor.id_professor.slice(0, 8) + '...' : 'Não informado'}
        </Text>
      </View>
    </View>
  );
};
