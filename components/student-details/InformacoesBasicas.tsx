import React from 'react';
import { View, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AprendizDisplay } from '@/services/AprendizService';
import { styles } from '@/styles/AlunoDetalhesStyles';

interface InformacoesBasicasProps {
  aprendiz: AprendizDisplay;
}

export const InformacoesBasicas: React.FC<InformacoesBasicasProps> = ({ aprendiz }) => {
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <>
      {/* Card principal do aluno */}
      <View style={styles.alunoCard}>
        <View style={styles.alunoHeader}>
          <View style={styles.alunoAvatar}>
            <IconSymbol name="figure.child" size={32} color="#6366f1" />
          </View>
          <View style={styles.alunoInfo}>
            <Text style={styles.alunoNome}>{aprendiz.nome}</Text>
            <Text style={styles.alunoIdade}>
              Data de Nascimento: {formatarData(aprendiz.data_nascimento)}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: aprendiz.diagnostico ? '#10b981' : '#f59e0b' }
          ]}>
            <Text style={styles.statusText}>
              {aprendiz.diagnostico ? 'Diagnóstico' : 'Sem Diagnóstico'}
            </Text>
          </View>
        </View>
      </View>

      {/* Informações detalhadas */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações</Text>
        
        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <IconSymbol name="person.fill" size={20} color="#6366f1" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nome Completo</Text>
            <Text style={styles.infoValue}>{aprendiz.nome}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <IconSymbol name="calendar" size={20} color="#6366f1" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Data de Nascimento</Text>
            <Text style={styles.infoValue}>{formatarData(aprendiz.data_nascimento)}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <IconSymbol name="doc.text" size={20} color="#6366f1" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Status do Diagnóstico</Text>
            <Text style={[
              styles.infoValue,
              { color: aprendiz.diagnostico ? '#10b981' : '#f59e0b' }
            ]}>
              {aprendiz.diagnostico ? 'Diagnóstico confirmado' : 'Aguardando diagnóstico'}
            </Text>
          </View>
        </View>

        {aprendiz.idade_diagnostico && (
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <IconSymbol name="clock" size={20} color="#6366f1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Idade do Diagnóstico</Text>
              <Text style={styles.infoValue}>{aprendiz.idade_diagnostico} anos</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
