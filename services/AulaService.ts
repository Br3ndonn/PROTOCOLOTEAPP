import { supabase } from '../utils/supabase';
import { CriarProgressoAtividadeInput, progressoAtividadeService } from './ProgressoAtividadeService';

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
  atividades?: CriarProgressoAtividadeInput[]; // Array de atividades realizadas na aula
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

      // Se há atividades para salvar, salva após criar a aula
      if (dados.atividades && dados.atividades.length > 0) {
        console.log('Salvando atividades da aula:', dados.atividades);
        const { error: atividadesError } = await progressoAtividadeService.salvarMultiplos(
          data.id_aula,
          dados.atividades
        );

        if (atividadesError) {
          console.error('Erro ao salvar atividades, mas aula foi criada:', atividadesError);
          // Aula já foi criada, retorna sucesso mas com aviso
          return { 
            data, 
            error: { 
              message: 'Aula criada mas houve erro ao salvar algumas atividades',
              originalError: atividadesError
            }
          };
        }
      }

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

  // Adicionar atividades a uma aula existente
  async adicionarAtividades(id_aula: number, atividades: CriarProgressoAtividadeInput[]): Promise<{ success: boolean; error: any }> {
    try {
      if (!atividades || atividades.length === 0) {
        return { success: true, error: null };
      }

      const { data, error } = await progressoAtividadeService.salvarMultiplos(id_aula, atividades);

      if (error) {
        console.error('Erro ao adicionar atividades à aula:', error);
        return { success: false, error };
      }

      console.log('Atividades adicionadas com sucesso à aula:', data);
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro inesperado ao adicionar atividades:', error);
      return { success: false, error };
    }
  }

  // Buscar aula com suas atividades/progressos
  async buscarComAtividades(id_aula: number): Promise<{ data: any | null; error: any }> {
    try {
      // Buscar dados da aula
      const { data: aulaData, error: aulaError } = await this.buscarPorId(id_aula);
      
      if (aulaError || !aulaData) {
        return { data: null, error: aulaError || 'Aula não encontrada' };
      }

      // Buscar atividades/progressos da aula
      const { data: progressos, error: progressosError } = await progressoAtividadeService.buscarComDetalhes(id_aula);

      if (progressosError) {
        console.error('Erro ao buscar progressos da aula:', progressosError);
        // Retorna aula mesmo sem progressos
        return { 
          data: { ...aulaData, atividades: [] }, 
          error: null 
        };
      }

      return { 
        data: { 
          ...aulaData, 
          atividades: progressos || [] 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Erro inesperado ao buscar aula com atividades:', error);
      return { data: null, error };
    }
  }
}

export const aulaService = new AulaService();
