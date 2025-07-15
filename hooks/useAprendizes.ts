import { useEffect, useState } from 'react';
import { AprendizData, AprendizDisplay, aprendizService, mapAprendizToDisplay } from '../services/AprendizService';

export function useAprendizes() {
  const [aprendizes, setAprendizes] = useState<AprendizData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAprendizes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: dbError } = await aprendizService.buscarTodos();
      
      if (dbError) {
        setError('Erro ao carregar aprendizes');
        console.error('Erro ao carregar aprendizes:', dbError);
      } else {
        setAprendizes(data || []);
      }
    } catch (err) {
      setError('Erro inesperado ao carregar aprendizes');
      console.error('Erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAprendizes();
  }, []);

  const refetch = () => {
    carregarAprendizes();
  };

  return { 
    aprendizes, 
    loading, 
    error, 
    refetch 
  };
}

export function useAprendiz(id: string) {
  const [aprendiz, setAprendiz] = useState<AprendizDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAprendiz = async () => {
    if (!id) {
      setError('ID do aprendiz é obrigatório');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: dbError } = await aprendizService.buscarPorId(id);
      
      if (dbError) {
        setError('Erro ao carregar aprendiz');
        console.error('Erro ao carregar aprendiz:', dbError);
      } else if (data) {
        setAprendiz(mapAprendizToDisplay(data));
      }
    } catch (err) {
      setError('Erro inesperado ao carregar aprendiz');
      console.error('Erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAprendiz();
  }, [id]);

  const refetch = () => {
    carregarAprendiz();
  };

  return { 
    aprendiz, 
    loading, 
    error, 
    refetch 
  };
}
