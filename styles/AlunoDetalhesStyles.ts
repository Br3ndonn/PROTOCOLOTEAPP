import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  alunoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    // boxShadow para web, mantendo o estilo do shadow*
    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
    elevation: 2,
  },
  alunoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alunoAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  alunoIdade: {
    fontSize: 16,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 34, // Extra padding para safe area
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  novaAulaButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    // boxShadow para web, mantendo o estilo do shadow*
    boxShadow: '0px 4px 8px rgba(99,102,241,0.3)',
    elevation: 4,
  },
  novaAulaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },

  // Estilos das abas
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabAtiva: {
    backgroundColor: '#ffffff',
    // boxShadow para web, mantendo o estilo do shadow*
    boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  tabTextAtiva: {
    color: '#6366f1',
    fontWeight: '600',
  },

  // Estilos para tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4338ca',
  },

  // Estilos para subsecção
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },

  // Estilos para a seção da última aula
  ultimaAulaContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  ultimaAulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  ultimaAulaHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ultimaAulaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  ultimaAulaContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  ultimaAulaLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  ultimaAulaLoadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  ultimaAulaInfo: {
    paddingVertical: 12,
    gap: 12,
  },
  ultimaAulaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ultimaAulaLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  ultimaAulaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  ultimaAulaPontos: {
    color: '#059669',
    fontSize: 16,
  },
  ultimaAulaSemDados: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  ultimaAulaSemDadosText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },

  // Estilos para informações básicas da última aula
  ultimaAulaBasicInfo: {
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 16,
  },

  // Estilos para seções da última aula
  ultimaAulaSection: {
    marginBottom: 16,
  },
  ultimaAulaSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },

  // Estilos para atividades
  atividadeItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  atividadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  atividadeInfo: {
    flex: 1,
    marginRight: 12,
  },
  atividadeNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  atividadeCompletude: {
    fontSize: 12,
    color: '#6b7280',
  },
  atividadePontuacao: {
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  atividadePontos: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  atividadePontosLabel: {
    fontSize: 10,
    color: '#065f46',
    textTransform: 'uppercase',
  },
  atividadeDetalhes: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  atividadeDetail: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  atividadeObservacoes: {
    fontSize: 12,
    color: '#374151',
    fontStyle: 'italic',
    backgroundColor: '#f9fafb',
    padding: 6,
    borderRadius: 4,
  },

  // Estilos para intercorrências
  intercorrenciaItem: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  intercorrenciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  intercorrenciaTipo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  intercorrenciaDescricao: {
    fontSize: 13,
    color: '#78350f',
    marginBottom: 4,
  },
  intercorrenciaDetalhes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  intercorrenciaDetalhe: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
    backgroundColor: '#fcd34d',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intercorrenciaObservacoes: {
    fontSize: 12,
    color: '#78350f',
    fontStyle: 'italic',
    backgroundColor: '#fbbf24',
    padding: 6,
    borderRadius: 4,
    opacity: 0.8,
  },

  // Estilo para quando não há detalhes
  ultimaAulaSemDetalhes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  ultimaAulaSemDetalhesText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Estilos adicionais para componentes da última aula
  ultimaAulaDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ultimaAulaData: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  ultimaAulaPontosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  atividadePontosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  atividadeTentativas: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});
