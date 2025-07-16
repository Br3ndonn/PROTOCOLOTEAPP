import { supabase } from '../utils/supabase';

export interface PlanejamentoIntervencaoData {
  id_planejamento_intervencao: number;
  id_professor: string;
  data_inicio: string;
  id_aprendiz: string;
}

class PlanejamentoIntervencaoService {
  // Criar novo planejamento
  async criar(dados: Omit<PlanejamentoIntervencaoData, 'id_planejamento_intervencao'>): Promise<{ data: PlanejamentoIntervencaoData | null; error: any }> {
    try {
      console.log('Criando planejamento com dados:', dados);
      
      const { data, error } = await supabase
        .from('Planejamento_intervencao')
        .insert([dados])
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao criar planejamento:', error);
        return { data: null, error };
      }

      console.log('Planejamento criado:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao criar planejamento:', error);
      return { data: null, error };
    }
  }

  // Buscar planejamento por professor e aprendiz
  async buscarPorProfessorEAprendiz(id_professor: string, id_aprendiz: string): Promise<{ data: PlanejamentoIntervencaoData | null; error: any }> {
    try {
      console.log('Buscando planejamento para professor:', id_professor, 'e aprendiz:', id_aprendiz);
      
      const { data, error } = await supabase
        .from('Planejamento_intervencao')
        .select('*')
        .eq('id_professor', id_professor)
        .eq('id_aprendiz', id_aprendiz)
        .order('data_inicio', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar planejamento:', error);
        return { data: null, error };
      }

      console.log('Planejamento encontrado:', data);
      return { data: data || null, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar planejamento:', error);
      return { data: null, error };
    }
  }

  // Buscar ou criar planejamento
  async buscarOuCriar(id_professor: string, id_aprendiz: string): Promise<{ data: PlanejamentoIntervencaoData | null; error: any }> {
    try {
      // Primeiro, tentar buscar planejamento existente
      const { data: planejamentoExistente, error: errorBusca } = await this.buscarPorProfessorEAprendiz(id_professor, id_aprendiz);
      
      if (errorBusca) {
        return { data: null, error: errorBusca };
      }

      if (planejamentoExistente) {
        console.log('Usando planejamento existente:', planejamentoExistente);
        return { data: planejamentoExistente, error: null };
      }

      // Se não existir, criar novo
      console.log('Criando novo planejamento...');
      const dadosNovoPlanejamento = {
        id_professor,
        id_aprendiz,
        data_inicio: new Date().toISOString()
      };

      const { data: novoPlanejamento, error: errorCriacao } = await this.criar(dadosNovoPlanejamento);

      if (errorCriacao) {
        console.error('Erro ao criar novo planejamento:', errorCriacao);
        return { data: null, error: errorCriacao };
      }

      return { data: novoPlanejamento, error: null };
    } catch (error) {
      console.error('Erro ao buscar ou criar planejamento:', error);
      return { data: null, error };
    }
  }

  // Buscar planejamentos por professor
  async buscarPorProfessor(id_professor: string): Promise<{ data: PlanejamentoIntervencaoData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Planejamento_intervencao')
        .select('*')
        .eq('id_professor', id_professor)
        .order('data_inicio', { ascending: false });

      if (error) {
        console.error('Erro ao buscar planejamentos:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar planejamentos:', error);
      return { data: null, error };
    }
  }
}

export const planejamentoIntervencaoService = new PlanejamentoIntervencaoService();
