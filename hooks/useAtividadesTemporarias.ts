import { useState, useCallback } from 'react';
import { CriarProgressoAtividadeInput, Completude, progressoAtividadeService } from '../services/ProgressoAtividadeService';

export interface AtividadeTemporaria extends CriarProgressoAtividadeInput {
  id_temporario: string; // ID temporário para controle local
  nome_atividade?: string; // Nome da atividade para exibição
}

export const useAtividadesTemporarias = () => {
  const [atividades, setAtividades] = useState<AtividadeTemporaria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adicionar nova atividade temporária
  const adicionarAtividade = useCallback((atividade: Omit<AtividadeTemporaria, 'id_temporario'>) => {
    const novaAtividade: AtividadeTemporaria = {
      ...atividade,
      id_temporario: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };

    setAtividades(prev => [...prev, novaAtividade]);
    setError(null);

    console.log('Atividade adicionada temporariamente:', novaAtividade);
    return novaAtividade.id_temporario;
  }, []);

  // Atualizar atividade existente
  const atualizarAtividade = useCallback((id_temporario: string, dadosAtualizados: Partial<AtividadeTemporaria>) => {
    setAtividades(prev => 
      prev.map(ativ => 
        ativ.id_temporario === id_temporario 
          ? { ...ativ, ...dadosAtualizados }
          : ativ
      )
    );
    setError(null);
  }, []);

  // Remover atividade
  const removerAtividade = useCallback((id_temporario: string) => {
    setAtividades(prev => prev.filter(ativ => ativ.id_temporario !== id_temporario));
    setError(null);
  }, []);

  // Limpar todas as atividades
  const limparAtividades = useCallback(() => {
    setAtividades([]);
    setError(null);
  }, []);

  // Validar atividade
  const validarAtividade = useCallback((atividade: AtividadeTemporaria): string | null => {
    if (!atividade.id_planejamento_atividades) {
      return 'Atividade deve ser selecionada';
    }

    if (atividade.tentativas_realizadas < 0) {
      return 'Tentativas realizadas deve ser um valor positivo';
    }

    if (atividade.soma_notas < 0) {
      return 'Soma das notas deve ser um valor positivo';
    }

    if (!Object.values(Completude).includes(atividade.completude)) {
      return 'Completude deve ser uma opção válida';
    }

    return null;
  }, []);

  // Validar todas as atividades
  const validarTodasAtividades = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (atividades.length === 0) {
      return { valid: true, errors: [] }; // Pode não ter atividades
    }

    atividades.forEach((atividade, index) => {
      const erro = validarAtividade(atividade);
      if (erro) {
        errors.push(`Atividade ${index + 1}: ${erro}`);
      }
    });

    return { valid: errors.length === 0, errors };
  }, [atividades, validarAtividade]);

  // Preparar dados para salvamento (remover campos temporários)
  const prepararParaSalvamento = useCallback((): CriarProgressoAtividadeInput[] => {
    return atividades.map(({ id_temporario, nome_atividade, ...atividade }) => atividade);
  }, [atividades]);

  // Salvar atividade individual (validação local)
  const salvarAtividadeLocal = useCallback(async (atividade: Omit<AtividadeTemporaria, 'id_temporario'>) => {
    setLoading(true);
    setError(null);

    try {
      // Usar o serviço para validar (sem salvar no banco)
      const { data, error } = await progressoAtividadeService.criarRegistroTemporario(atividade);

      if (error) {
        setError(error);
        return { success: false, id_temporario: null };
      }

      const id_temporario = adicionarAtividade(atividade);
      return { success: true, id_temporario };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, id_temporario: null };
    } finally {
      setLoading(false);
    }
  }, [adicionarAtividade]);

  // Obter estatísticas das atividades
  const obterEstatisticas = useCallback(() => {
    if (atividades.length === 0) {
      return {
        total: 0,
        totalTentativas: 0,
        totalNotas: 0,
        mediaNotas: 0,
        distribuicaoCompletude: {}
      };
    }

    const totalTentativas = atividades.reduce((sum, ativ) => sum + ativ.tentativas_realizadas, 0);
    const totalNotas = atividades.reduce((sum, ativ) => sum + ativ.soma_notas, 0);
    const mediaNotas = totalNotas / atividades.length;

    const distribuicaoCompletude = atividades.reduce((dist, ativ) => {
      dist[ativ.completude] = (dist[ativ.completude] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    return {
      total: atividades.length,
      totalTentativas,
      totalNotas,
      mediaNotas: Math.round(mediaNotas * 100) / 100,
      distribuicaoCompletude
    };
  }, [atividades]);

  return {
    atividades,
    loading,
    error,
    adicionarAtividade,
    atualizarAtividade,
    removerAtividade,
    limparAtividades,
    validarAtividade,
    validarTodasAtividades,
    prepararParaSalvamento,
    salvarAtividadeLocal,
    obterEstatisticas,
    setError
  };
};
