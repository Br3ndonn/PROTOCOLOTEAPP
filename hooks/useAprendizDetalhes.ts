import { useState, useEffect, useCallback } from 'react';
import { AprendizDisplay, aprendizService, mapAprendizToDisplay } from '@/services/AprendizService';
import { Alert } from 'react-native';

export const useAprendizDetalhes = (id: string | string[]) => {
  const [aprendiz, setAprendiz] = useState<AprendizDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAprendiz = useCallback(async () => {
    if (!id || Array.isArray(id)) {
      setError('ID do aprendiz não encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: dbError } = await aprendizService.buscarPorId(id);
      
      if (dbError) {
        console.error('Erro ao carregar aprendiz:', dbError);
        setError('Erro ao carregar dados do aprendiz');
        Alert.alert('Erro', 'Não foi possível carregar os dados do aprendiz');
        return;
      }

      if (data) {
        setAprendiz(mapAprendizToDisplay(data));
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setError('Erro inesperado ao carregar dados');
      Alert.alert('Erro', 'Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarAprendiz();
  }, [carregarAprendiz]);

  return { 
    aprendiz, 
    loading, 
    error, 
    recarregar: carregarAprendiz 
  };
};
