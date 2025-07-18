import { useCallback, useState } from 'react';
import { RegistroIntercorrenciaInput, registroIntercorrenciaService } from '../services/RegistroIntercorrenciaService';

export interface IntercorrenciaTemporaria extends Omit<RegistroIntercorrenciaInput, 'id_aula'> {
  id_temporario: string; // ID temporário para controle local
  nome_intercorrencia?: string; // Nome da intercorrência para exibição
}

export const useIntercorrenciasTemporarias = () => {
  const [intercorrencias, setIntercorrencias] = useState<IntercorrenciaTemporaria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adicionar nova intercorrência temporária
  const adicionarIntercorrencia = useCallback((intercorrencia: Omit<IntercorrenciaTemporaria, 'id_temporario'>) => {
    const novaIntercorrencia: IntercorrenciaTemporaria = {
      ...intercorrencia,
      id_temporario: `temp_interc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };

    setIntercorrencias(prev => [...prev, novaIntercorrencia]);
    setError(null);

    console.log('Intercorrência adicionada temporariamente:', novaIntercorrencia);
    return novaIntercorrencia.id_temporario;
  }, []);

  // Atualizar intercorrência existente
  const atualizarIntercorrencia = useCallback((id_temporario: string, dadosAtualizados: Partial<IntercorrenciaTemporaria>) => {
    setIntercorrencias(prev => 
      prev.map(interc => 
        interc.id_temporario === id_temporario 
          ? { ...interc, ...dadosAtualizados }
          : interc
      )
    );
    setError(null);
  }, []);

  // Remover intercorrência
  const removerIntercorrencia = useCallback((id_temporario: string) => {
    setIntercorrencias(prev => prev.filter(interc => interc.id_temporario !== id_temporario));
    setError(null);
  }, []);

  // Limpar todas as intercorrências
  const limparIntercorrencias = useCallback(() => {
    setIntercorrencias([]);
    setError(null);
  }, []);

  // Validar intercorrência
  const validarIntercorrencia = useCallback((intercorrencia: IntercorrenciaTemporaria): string | null => {
    if (!intercorrencia.id_intercorrencia || intercorrencia.id_intercorrencia <= 0) {
      return 'Intercorrência deve ser selecionada';
    }

    if (intercorrencia.frequencia < 1 || intercorrencia.frequencia > 4) {
      return 'Frequência deve estar entre 1 e 4';
    }

    if (intercorrencia.intensidade < 1 || intercorrencia.intensidade > 4) {
      return 'Intensidade deve estar entre 1 e 4';
    }

    return null;
  }, []);

  // Validar todas as intercorrências
  const validarTodasIntercorrencias = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (intercorrencias.length === 0) {
      return { valid: true, errors: [] }; // Pode não ter intercorrências
    }

    intercorrencias.forEach((intercorrencia, index) => {
      const erro = validarIntercorrencia(intercorrencia);
      if (erro) {
        errors.push(`Intercorrência ${index + 1}: ${erro}`);
      }
    });

    return { valid: errors.length === 0, errors };
  }, [intercorrencias, validarIntercorrencia]);

  // Preparar dados para salvamento (remover campos temporários e adicionar id_aula)
  const prepararParaSalvamento = useCallback((id_aula: number): RegistroIntercorrenciaInput[] => {
    console.log('=== LOG HOOK INTERCORRÊNCIAS TEMPORÁRIAS ===');
    console.log('Preparando intercorrências para salvamento');
    console.log('ID da aula recebido:', id_aula);
    console.log('Intercorrências temporárias a converter:', intercorrencias);

    const dadosPreparados = intercorrencias.map(({ id_temporario, nome_intercorrencia, ...intercorrencia }) => ({
      ...intercorrencia,
      id_aula
    }));

    console.log('Dados preparados para inserção na tabela Registro_intercorrencia:', dadosPreparados);
    console.log('Número de registros preparados:', dadosPreparados.length);
    console.log('==========================================');

    return dadosPreparados;
  }, [intercorrencias]);

  // Salvar intercorrência individual (validação local)
  const salvarIntercorrenciaLocal = useCallback(async (intercorrencia: Omit<IntercorrenciaTemporaria, 'id_temporario'>) => {
    setLoading(true);
    setError(null);

    try {
      // Validar localmente
      const intercorrenciaComId = { ...intercorrencia, id_temporario: 'temp' } as IntercorrenciaTemporaria;
      const erro = validarIntercorrencia(intercorrenciaComId);
      
      if (erro) {
        setError(erro);
        return { success: false, id_temporario: null };
      }

      const id_temporario = adicionarIntercorrencia(intercorrencia);
      return { success: true, id_temporario };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, id_temporario: null };
    } finally {
      setLoading(false);
    }
  }, [adicionarIntercorrencia, validarIntercorrencia]);

  // Salvar múltiplas intercorrências no banco
  const salvarNoBanco = useCallback(async (id_aula: number): Promise<{ success: boolean; error: any }> => {
    if (intercorrencias.length === 0) {
      return { success: true, error: null };
    }

    setLoading(true);
    try {
      const { valid, errors } = validarTodasIntercorrencias();
      if (!valid) {
        setError(errors.join('; '));
        return { success: false, error: errors.join('; ') };
      }

      const registros = prepararParaSalvamento(id_aula);
      const { data, error } = await registroIntercorrenciaService.inserirMultiplos(registros);

      if (error) {
        setError(error.message);
        return { success: false, error };
      }

      console.log('Intercorrências salvas no banco:', data);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [intercorrencias, validarTodasIntercorrencias, prepararParaSalvamento]);

  // Obter estatísticas das intercorrências
  const obterEstatisticas = useCallback(() => {
    if (intercorrencias.length === 0) {
      return {
        total: 0,
        frequenciaMedia: 0,
        intensidadeMedia: 0,
        distribuicaoFrequencia: {},
        distribuicaoIntensidade: {}
      };
    }

    const frequenciaMedia = intercorrencias.reduce((sum, i) => sum + i.frequencia, 0) / intercorrencias.length;
    const intensidadeMedia = intercorrencias.reduce((sum, i) => sum + i.intensidade, 0) / intercorrencias.length;

    const distribuicaoFrequencia = intercorrencias.reduce((dist, i) => {
      dist[i.frequencia] = (dist[i.frequencia] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    const distribuicaoIntensidade = intercorrencias.reduce((dist, i) => {
      dist[i.intensidade] = (dist[i.intensidade] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    return {
      total: intercorrencias.length,
      frequenciaMedia: Math.round(frequenciaMedia * 100) / 100,
      intensidadeMedia: Math.round(intensidadeMedia * 100) / 100,
      distribuicaoFrequencia,
      distribuicaoIntensidade
    };
  }, [intercorrencias]);

  return {
    intercorrencias,
    loading,
    error,
    adicionarIntercorrencia,
    atualizarIntercorrencia,
    removerIntercorrencia,
    limparIntercorrencias,
    validarIntercorrencia,
    validarTodasIntercorrencias,
    prepararParaSalvamento,
    salvarIntercorrenciaLocal,
    salvarNoBanco,
    obterEstatisticas,
    setError
  };
};
