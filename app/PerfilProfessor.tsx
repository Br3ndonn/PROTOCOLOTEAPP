import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/PerfilProfessorSyles';

export default function PerfilProfessorScreen() {
  const { user, professor, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair do aplicativo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/LoginScreen');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  if (!user || !professor) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Usuário não encontrado</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.replace('/LoginScreen')}
          >
            <Text style={styles.loginButtonText}>Ir para Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Perfil Card */}
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

      {/* Informações Adicionais */}
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

      {/* Ações */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#ffffff" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Versão do App */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Protocolo TEA v1.0.0</Text>
      </View>
    </ScrollView>
  );
}


