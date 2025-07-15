import { supabase } from '../utils/supabase';

export interface AprendizData {
  id_aprendiz: string;
  nome: string;
  data_nascimento: string;
  diagnostico: boolean;
  created_at?: string;
  updated_at?: string;
  // Campos adicionais para informações complementares
  idade_diagnostico?: number;
  irmaos?: boolean;
  qualidades?: string[];
  caracteristica_compr_vida?: string[];
  medicamentos?: string[];
  qualidade_sono?: string;
  alimentacao?: string;
}

// Tipo helper para compatibilidade com componentes que usam 'id'
export interface AprendizDisplay {
  id: string; // Mapeado de id_aprendiz
  nome: string;
  data_nascimento: string;
  diagnostico: boolean;
  // Campos adicionais para informações complementares
  idade_diagnostico?: number;
  irmaos?: boolean;
  qualidades?: string[];
  caracteristica_compr_vida?: string[];
  medicamentos?: string[];
  qualidade_sono?: string;
  alimentacao?: string;
}

// Função helper para converter AprendizData para AprendizDisplay
export const mapAprendizToDisplay = (aprendiz: AprendizData): AprendizDisplay => ({
  id: aprendiz.id_aprendiz,
  nome: aprendiz.nome,
  data_nascimento: aprendiz.data_nascimento,
  diagnostico: aprendiz.diagnostico,
  idade_diagnostico: aprendiz.idade_diagnostico,
  irmaos: aprendiz.irmaos,
  qualidades: aprendiz.qualidades,
  caracteristica_compr_vida: aprendiz.caracteristica_compr_vida,
  medicamentos: aprendiz.medicamentos,
  qualidade_sono: aprendiz.qualidade_sono,
  alimentacao: aprendiz.alimentacao
});

class AprendizService {
  // Buscar todos os aprendizes
  async buscarTodos(): Promise<{ data: AprendizData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Aprendiz')
        .select('id_aprendiz, nome, data_nascimento, diagnostico')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar aprendizes:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar aprendizes:', error);
      return { data: null, error };
    }
  }

  // Buscar aprendiz por ID
  async buscarPorId(id: string): Promise<{ data: AprendizData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Aprendiz')
        .select(`
          id_aprendiz, 
          nome, 
          data_nascimento, 
          diagnostico,
          idade_diagnostico,
          irmaos,
          qualidades,
          caracteristica_compr_vida,
          medicamentos,
          qualidade_sono,
          alimentacao
        `)
        .eq('id_aprendiz', id)
        .single();

      if (error) {
        console.error('Erro ao buscar aprendiz por ID:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar aprendiz:', error);
      return { data: null, error };
    }
  }

  // Criar novo aprendiz
  async criar(dados: Omit<AprendizData, 'id_aprendiz' | 'created_at' | 'updated_at'>): Promise<{ data: AprendizData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Aprendiz')
        .insert([dados])
        .select('id_aprendiz, nome, data_nascimento, diagnostico')
        .single();

      if (error) {
        console.error('Erro ao criar aprendiz:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao criar aprendiz:', error);
      return { data: null, error };
    }
  }

  // Atualizar aprendiz
  async atualizar(id: string, dados: Partial<Omit<AprendizData, 'id_aprendiz' | 'created_at' | 'updated_at'>>): Promise<{ data: AprendizData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Aprendiz')
        .update(dados)
        .eq('id_aprendiz', id)
        .select('id_aprendiz, nome, data_nascimento, diagnostico')
        .single();

      if (error) {
        console.error('Erro ao atualizar aprendiz:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao atualizar aprendiz:', error);
      return { data: null, error };
    }
  }

  // Deletar aprendiz
  async deletar(id: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from('Aprendiz')
        .delete()
        .eq('id_aprendiz', id);

      if (error) {
        console.error('Erro ao deletar aprendiz:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Erro inesperado ao deletar aprendiz:', error);
      return { success: false, error };
    }
  }
}

export const aprendizService = new AprendizService();
