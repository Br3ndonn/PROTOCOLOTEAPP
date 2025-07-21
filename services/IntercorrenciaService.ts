import { supabase } from '../utils/supabase';

export interface IntercorrenciaData {
  id_intercorrencia: number;
  sigla: string;
  nome: string;
  descricao?: string;
}

class IntercorrenciaService {
  /**
   * Busca todas as intercorrências ativas do banco
   */
  async buscarTodas(): Promise<{ data: IntercorrenciaData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Intercorrencia')
        .select('id_intercorrencia, sigla, nome, descricao')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar intercorrências:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar intercorrências:', error);
      return { data: null, error };
    }
  }

  async buscarPorId(id: number): Promise<{ data: IntercorrenciaData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Intercorrencia')
        .select('id_intercorrencia, sigla, nome, descricao')
        .eq('id_intercorrencia', id)
        .single();

      if (error) {
        console.error('Erro ao buscar intercorrência por ID:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar intercorrência:', error);
      return { data: null, error };
    }
  }
}

export const intercorrenciaService = new IntercorrenciaService();
