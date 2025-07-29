import { useState, useCallback } from 'react';
import { aulaService } from '@/services/AulaService';

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

export const useUltimaAula = () => {
  const [ultimaAulaInfo, setUltimaAulaInfo] = useState<UltimaAulaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const carregarUltimaAula = useCallback(async (aprendizId: string) => {
    if (!aprendizId) return;

    try {
      setLoading(true);
      const { data, error: aulaError } = await aulaService.buscarResumoUltimaAula(aprendizId);
      
      if (aulaError) {
        console.log('Nenhuma aula encontrada ou erro:', aulaError);
        setUltimaAulaInfo(null);
        return;
      }

      if (data) {
        setUltimaAulaInfo({
          ...data,
          atividades: data.atividades || [],
          intercorrencias: data.intercorrencias || []
        });
      } else {
        setUltimaAulaInfo(null);
      }
    } catch (error) {
      console.error('Erro ao carregar última aula:', error);
      setUltimaAulaInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleExpanded = useCallback((aprendizId: string) => {
    if (!expanded && !ultimaAulaInfo && !loading) {
      carregarUltimaAula(aprendizId);
    }
    setExpanded(!expanded);
  }, [expanded, ultimaAulaInfo, loading, carregarUltimaAula]);

  return {
    ultimaAulaInfo,
    loading,
    expanded,
    carregarUltimaAula,
    toggleExpanded
  };
};
