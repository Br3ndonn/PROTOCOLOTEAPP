import { AtividadeData, COMPLETUDE_MAPPING } from '../components/formulario/types';
import { CriarProgressoAtividadeInput } from '../services/ProgressoAtividadeService';

/**
 * Converte dados de atividade do formulário para o formato do banco de dados
 */
export const converterAtividadeParaBanco = (atividade: AtividadeData): CriarProgressoAtividadeInput | null => {
  // Verificar se a atividade tem dados essenciais
  if (!atividade.id_planejamento_atividades) {
    console.warn('Atividade sem ID de planejamento:', atividade);
    return null;
  }

  // Converter completude do formulário para enum do banco
  const completudeEnum = COMPLETUDE_MAPPING[atividade.completude];
  if (!completudeEnum) {
    console.warn('Completude inválida:', atividade.completude);
    return null;
  }

  // Calcular tentativas realizadas (número de tentativas com pontuação > 0)
  const tentativasRealizadas = atividade.tentativas?.filter(t => t.pontuacao > 0).length || 0;

  // Calcular soma das notas
  const somaNotas = atividade.tentativas?.reduce((soma, tentativa) => soma + tentativa.pontuacao, 0) || 0;

  // Preparar observações (combinar observações da atividade e intercorrências se houver)
  let observacoes = atividade.observacoes_atividade || '';

  if (atividade.houveIntercorrencia && atividade.intercorrencias?.length > 0) {
    const intercorrenciasSelecionadas = atividade.intercorrencias
      .filter(i => i.selecionada)
      .map(i => `${i.nome} (Freq: ${i.frequencia}, Int: ${i.intensidade})`)
      .join('; ');

    if (intercorrenciasSelecionadas) {
      observacoes = observacoes 
        ? `${observacoes}\n\nIntercorrências: ${intercorrenciasSelecionadas}`
        : `Intercorrências: ${intercorrenciasSelecionadas}`;
    }
  }

  return {
    id_planejamento_atividades: atividade.id_planejamento_atividades,
    tentativas_realizadas: tentativasRealizadas,
    soma_notas: somaNotas,
    completude: completudeEnum,
    observacoes: observacoes.trim() || undefined
  };
};

/**
 * Converte múltiplas atividades do formulário para o formato do banco
 */
export const converterAtividadesParaBanco = (atividades: AtividadeData[]): CriarProgressoAtividadeInput[] => {
  return atividades
    .map(converterAtividadeParaBanco)
    .filter((atividade): atividade is CriarProgressoAtividadeInput => atividade !== null);
};

/**
 * Valida se uma atividade está pronta para ser salva
 */
export const validarAtividadeParaSalvar = (atividade: AtividadeData): { valid: boolean; error?: string } => {
  if (!atividade.id_planejamento_atividades) {
    return { valid: false, error: 'Atividade deve ser selecionada' };
  }

  if (!atividade.completude || !(atividade.completude in COMPLETUDE_MAPPING)) {
    return { valid: false, error: 'Completude deve ser selecionada' };
  }

  if (!COMPLETUDE_MAPPING[atividade.completude]) {
    return { valid: false, error: 'Completude inválida' };
  }

  // Verificar se tem pelo menos uma tentativa se a completude não for "Não Realizou"
  if (atividade.completude !== 'Não Realizou') {
    const tentativasComPontuacao = atividade.tentativas?.filter(t => t.pontuacao > 0).length || 0;
    if (tentativasComPontuacao === 0) {
      return { valid: false, error: 'Deve haver pelo menos uma tentativa com pontuação para esta completude' };
    }
  }

  return { valid: true };
};

/**
 * Valida múltiplas atividades
 */
export const validarAtividadesParaSalvar = (atividades: AtividadeData[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  atividades.forEach((atividade, index) => {
    const { valid, error } = validarAtividadeParaSalvar(atividade);
    if (!valid && error) {
      errors.push(`Atividade ${index + 1} (${atividade.atividade}): ${error}`);
    }
  });

  return { valid: errors.length === 0, errors };
};

/**
 * Calcula estatísticas das atividades
 */
export const calcularEstatisticasAtividades = (atividades: AtividadeData[]) => {
  if (atividades.length === 0) {
    return {
      totalAtividades: 0,
      atividadesSalvas: 0,
      totalTentativas: 0,
      totalPontos: 0,
      mediaPontos: 0,
      distribuicaoCompletude: {}
    };
  }

  const atividadesSalvas = atividades.filter(a => a.salva).length;
  const totalTentativas = atividades.reduce((sum, a) => 
    sum + (a.tentativas?.filter(t => t.pontuacao > 0).length || 0), 0);
  const totalPontos = atividades.reduce((sum, a) => 
    sum + (a.tentativas?.reduce((tSum, t) => tSum + t.pontuacao, 0) || 0), 0);
  const mediaPontos = atividades.length > 0 ? totalPontos / atividades.length : 0;

  const distribuicaoCompletude = atividades.reduce((dist, a) => {
    if (a.completude && a.completude in COMPLETUDE_MAPPING) {
      dist[a.completude] = (dist[a.completude] || 0) + 1;
    }
    return dist;
  }, {} as Record<string, number>);

  return {
    totalAtividades: atividades.length,
    atividadesSalvas,
    totalTentativas,
    totalPontos,
    mediaPontos: Math.round(mediaPontos * 100) / 100,
    distribuicaoCompletude
  };
};
