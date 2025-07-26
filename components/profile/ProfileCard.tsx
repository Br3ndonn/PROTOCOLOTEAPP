import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles/PerfilProfessorSyles';

interface Professor {
  nome?: string;
  email?: string;
  e_supervisor?: boolean;
}

interface ProfileCardProps {
  professor: Professor;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ professor }) => {
  return (
    <View style={styles.profileCard}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {professor.nome ? professor.nome.charAt(0).toUpperCase() : 'P'}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <IconSymbol name="checkmark" size={12} color="#ffffff" />
        </View>
      </View>

      {/* Informações do Professor */}
      <View style={styles.profileInfo}>
        <Text style={styles.professorName}>{professor.nome || 'Nome não informado'}</Text>
        <Text style={styles.professorEmail}>{professor.email || 'Email não informado'}</Text>
        <View style={styles.roleContainer}>
          <IconSymbol 
            name={professor.e_supervisor ? "star.fill" : "person.fill"} 
            size={16} 
            color="#6366f1" 
          />
          <Text style={styles.roleText}>
            {professor.e_supervisor ? 'Supervisor' : 'Professor'}
          </Text>
        </View>
      </View>
    </View>
  );
};
