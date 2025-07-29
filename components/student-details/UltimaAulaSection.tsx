import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { styles } from '@/styles/AlunoDetalhesStyles';

interface UltimaAulaInfo {
  data_aula: string;
  id_professor?: string;
  atividades?: Array<{
    nome_atividade: string;
    pontuacao: number;
    completude: string;
    tentativas: number;
    observacoes?: string;
  }>;
  intercorrencias?: Array<{
    tipo: string;
    descricao: string;
    frequencia?: number;
    intensidade?: number;
  }>;
}

interface UltimaAulaSectionProps {
  aprendizId: string;
  ultimaAulaInfo: UltimaAulaInfo | null;
  loading: boolean;
  expanded: boolean;
  onToggle: (aprendizId: string) => void;
}

export const UltimaAulaSection: React.FC<UltimaAulaSectionProps> = ({
  aprendizId,
  ultimaAulaInfo,
  loading,
  expanded,
  onToggle
}) => {
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <View style={styles.ultimaAulaContainer}>
      <TouchableOpacity 
        style={styles.ultimaAulaHeader} 
        onPress={() => onToggle(aprendizId)}
        activeOpacity={0.7}
      >
        <View style={styles.ultimaAulaHeaderContent}>
          <IconSymbol name="book.fill" size={20} color="#6366f1" />
          <Text style={styles.ultimaAulaTitle}>Última Aula</Text>
        </View>
        <IconSymbol 
          name={expanded ? "chevron.up" : "chevron.down"} 
          size={24} 
          color="#6366f1" 
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.ultimaAulaContent}>
          {loading ? (
            <View style={styles.ultimaAulaLoading}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.ultimaAulaLoadingText}>Carregando última aula...</Text>
            </View>
          ) : ultimaAulaInfo ? (
            <View>
              {/* Informações básicas da última aula */}
              <View style={styles.ultimaAulaBasicInfo}>
                <View style={styles.ultimaAulaDataContainer}>
                  <IconSymbol name="calendar" size={16} color="#6366f1" />
                  <Text style={styles.ultimaAulaData}>
                    {formatarData(ultimaAulaInfo.data_aula)}
                  </Text>
                </View>
                <View style={styles.ultimaAulaPontosContainer}>
                  <IconSymbol name="star.fill" size={16} color="#f59e0b" />
                </View>
              </View>

              {/* Atividades desenvolvidas */}
              {ultimaAulaInfo.atividades && ultimaAulaInfo.atividades.length > 0 && (
                <View style={styles.ultimaAulaSection}>
                  <Text style={styles.ultimaAulaSectionTitle}>Atividades Desenvolvidas</Text>
                  {ultimaAulaInfo.atividades.map((atividade, index) => (
                    <View key={index} style={styles.atividadeItem}>
                      <View style={styles.atividadeHeader}>
                        <IconSymbol name="checkmark.circle.fill" size={16} color="#10b981" />
                        <Text style={styles.atividadeNome}>{atividade.nome_atividade}</Text>
                      </View>
                      <View style={styles.atividadeInfo}>
                        <View style={styles.atividadePontosContainer}>
                          <Text style={styles.atividadePontos}>{atividade.pontuacao}</Text>
                          <Text style={styles.atividadePontosLabel}>pts</Text>
                        </View>
                        <Text style={styles.atividadeCompletude}>
                          Completude: {atividade.completude}
                        </Text>
                        {atividade.tentativas > 0 && (
                          <Text style={styles.atividadeTentativas}>
                            Tentativas: {atividade.tentativas}
                          </Text>
                        )}
                        {atividade.observacoes && (
                          <Text style={styles.atividadeObservacoes}>
                            {atividade.observacoes}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Intercorrências registradas */}
              {ultimaAulaInfo.intercorrencias && ultimaAulaInfo.intercorrencias.length > 0 && (
                <View style={styles.ultimaAulaSection}>
                  <Text style={styles.ultimaAulaSectionTitle}>Intercorrências Registradas</Text>
                  {ultimaAulaInfo.intercorrencias.map((intercorrencia, index) => (
                    <View key={index} style={styles.intercorrenciaItem}>
                      <View style={styles.intercorrenciaHeader}>
                        <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#f59e0b" />
                        <Text style={styles.intercorrenciaTipo}>{intercorrencia.tipo}</Text>
                      </View>
                      <Text style={styles.intercorrenciaDescricao}>
                        {intercorrencia.descricao}
                      </Text>
                      {(intercorrencia.frequencia !== undefined || intercorrencia.intensidade !== undefined) && (
                        <View style={styles.intercorrenciaDetalhes}>
                          {intercorrencia.frequencia !== undefined && (
                            <Text style={styles.intercorrenciaDetalhe}>
                              Frequência: {intercorrencia.frequencia}
                            </Text>
                          )}
                          {intercorrencia.intensidade !== undefined && (
                            <Text style={styles.intercorrenciaDetalhe}>
                              Intensidade: {intercorrencia.intensidade}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Caso não tenha atividades nem intercorrências */}
              {(!ultimaAulaInfo.atividades || ultimaAulaInfo.atividades.length === 0) && 
               (!ultimaAulaInfo.intercorrencias || ultimaAulaInfo.intercorrencias.length === 0) && (
                <View style={styles.ultimaAulaSemDetalhes}>
                  <IconSymbol name="info.circle" size={16} color="#9ca3af" />
                  <Text style={styles.ultimaAulaSemDetalhesText}>
                    Nenhuma atividade ou intercorrência foi registrada nesta aula
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.ultimaAulaSemDados}>
              <IconSymbol name="exclamationmark.circle" size={16} color="#9ca3af" />
              <Text style={styles.ultimaAulaSemDadosText}>
                Nenhuma aula registrada ainda
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
