import { supabase } from '../utils/supabase';

export interface AulaData {
  id_aula: number;
  id_professor: string;
  data_aula: string;
  id_planejamento_intervencao: number;
}

export interface CriarAulaInput {
  id_professor: string;
  id_planejamento_intervencao: number;
  data_aula?: string; // Opcional, se não fornecido usa data atual
  observacoes?: string;
  local?: string;
  responsavel?: string;
  atividades?: any[]; // Array de atividades realizadas na aula
}

class AulaService {
  // Criar nova aula
  async criar(dados: CriarAulaInput): Promise<{ data: AulaData | null; error: any }> {
    try {
      const aulaData = {
        id_professor: dados.id_professor,
        id_planejamento_intervencao: dados.id_planejamento_intervencao,
        data_aula: dados.data_aula || new Date().toISOString()
      };

      console.log('Criando aula com dados:', aulaData);
      console.log('Dados adicionais (para futura implementação):', {
        observacoes: dados.observacoes,
        local: dados.local,
        responsavel: dados.responsavel,
        atividades: dados.atividades
      });

      const { data, error } = await supabase
        .from('Aula')
        .insert([aulaData])
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao criar aula:', error);
        return { data: null, error };
      }

      console.log('Aula criada com sucesso:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao criar aula:', error);
      return { data: null, error };
    }
  }

  // Buscar aulas por professor
  async buscarPorProfessor(id_professor: string): Promise<{ data: AulaData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Aula')
        .select('*')
        .eq('id_professor', id_professor)
        .order('data_aula', { ascending: false });

      if (error) {
        console.error('Erro ao buscar aulas:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar aulas:', error);
      return { data: null, error };
    }
  }

  // Buscar aula por ID
  async buscarPorId(id_aula: number): Promise<{ data: AulaData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Aula')
        .select('*')
        .eq('id_aula', id_aula)
        .single();

      if (error) {
        console.error('Erro ao buscar aula por ID:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar aula:', error);
      return { data: null, error };
    }
  }

  // Buscar aulas com detalhes (JOIN com planejamento)
  async buscarComDetalhes(id_professor: string): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Aula')
        .select(`
          *,
          Planejamento_intervencao (
            id_aprendiz,
            data_inicio
          )
        `)
        .eq('id_professor', id_professor)
        .order('data_aula', { ascending: false });

      if (error) {
        console.error('Erro ao buscar aulas com detalhes:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar aulas com detalhes:', error);
      return { data: null, error };
    }
  }

  // Contar aulas por professor
  async contarPorProfessor(id_professor: string): Promise<{ count: number; error: any }> {
    try {
      const { count, error } = await supabase
        .from('Aula')
        .select('*', { count: 'exact', head: true })
        .eq('id_professor', id_professor);

      if (error) {
        console.error('Erro ao contar aulas:', error);
        return { count: 0, error };
      }

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Erro inesperado ao contar aulas:', error);
      return { count: 0, error };
    }
  }
}

export const aulaService = new AulaService();
