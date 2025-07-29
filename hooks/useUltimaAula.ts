import { useState, useCallback } from 'react';
import { requisicaoService } from '@/api/requisicao';

interface UltimaAulaInfo {
  id_aula: number;
  id_planejamento_intervencao: number;
  data_aula: string;
  atividades: Array<{
    nome_atividade: string;
    pontuacao: number;
    completude: string;
    tentativas: number;
    observacoes?: string;
  }>;
  intercorrencias: Array<{
    id_progresso_atividade: number;
    frequencia: number;
    intensidade: number;
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
      console.log('Carregando última aula para aprendiz:', aprendizId);
      
      const { data, error } = await requisicaoService.get(`/aula/ultima/${aprendizId}`);
      
      if (error) {
        console.log('Erro ao buscar última aula:', error);
        setUltimaAulaInfo(null);
        return;
      }

      if (data) {
        console.log('Dados da última aula recebidos:', data);
        setUltimaAulaInfo(data);
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
