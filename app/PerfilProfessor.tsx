import { AccountInfo } from '@/components/profile/AccountInfo';
import { AppVersion } from '@/components/profile/AppVersion';
import { ErrorState } from '@/components/profile/ErrorState';
import { LogoutButton } from '@/components/profile/LogoutButton';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import React from 'react';
import { ScrollView } from 'react-native';
import { styles } from '../styles/PerfilProfessorSyles';

export default function PerfilProfessorScreen() {
  const { user, professor } = useAuth();
  const { handleLogout } = useLogout();

  if (!user || !professor) {
    return <ErrorState />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader title="Meu Perfil" />
      <ProfileCard professor={professor} />
      <AccountInfo professor={professor} />
      <LogoutButton onLogout={handleLogout} />
      <AppVersion />
    </ScrollView>
  );
}


