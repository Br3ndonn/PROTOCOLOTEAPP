export enum Qualidade {
  Bom = 'Bom',
  Regular = 'Regular',
  Ruim = 'Ruim',
  Pessimo = 'Pessimo'
};

export interface AprendizData {
  id_aprendiz: string;
  nome: string;
  data_nascimento: string;
  diagnostico: boolean;
  created_at?: string;
  updated_at?: string;
  idade_diagnostico?: number;
  irmaos?: boolean;
  qualidades?: string[];
  caracteristica_compr_vida?: string[];
  medicamentos?: string[];
  qualidade_sono?: Qualidade;
  alimentacao?: Qualidade;
  part_ed_fisica?: string;
  envolvimento_exer_fis?: string;
  interesses?: string[];
  objetivo_curto_prazo?: string[];
  objetivo_longo_prazo?: string[];
}

export interface AprendizDisplay {
  id: string;
  nome: string;
  data_nascimento: string;
  diagnostico: boolean;
  idade_diagnostico?: number;
  irmaos?: boolean;
  qualidades?: string[];
  caracteristica_compr_vida?: string[];
  medicamentos?: string[];
  qualidade_sono?: string;
  alimentacao?: string;
  part_ed_fisica?: string;
  envolvimento_exer_fis?: string;
  interesses?: string[];
  objetivo_curto_prazo?: string[];
  objetivo_longo_prazo?: string[];
}

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
  alimentacao: aprendiz.alimentacao,
  part_ed_fisica: aprendiz.part_ed_fisica,
  envolvimento_exer_fis: aprendiz.envolvimento_exer_fis,
  interesses: aprendiz.interesses,
  objetivo_curto_prazo: aprendiz.objetivo_curto_prazo,
  objetivo_longo_prazo: aprendiz.objetivo_longo_prazo
});

// Agora o serviço recebe o client por parâmetro
class AprendizService {
  private db: any;

  constructor(dbClient: any) {
    this.db = dbClient;
  }

  async buscarTodos(): Promise<{ data: AprendizData[] | null; error: any }> {
    try {
      const { data, error } = await this.db
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

  async buscarPorId(id: string): Promise<{ data: AprendizData | null; error: any }> {
    try {
      const { data, error } = await this.db
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
          alimentacao,
          part_ed_fisica,
          envolvimento_exer_fis,
          interesses,
          objetivo_curto_prazo,
          objetivo_longo_prazo
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

  async criar(dados: Omit<AprendizData, 'id_aprendiz' | 'created_at' | 'updated_at'>): Promise<{ data: AprendizData | null; error: any }> {
    try {
      const { data, error } = await this.db
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

  async atualizar(id: string, dados: Partial<Omit<AprendizData, 'id_aprendiz' | 'created_at' | 'updated_at'>>): Promise<{ data: AprendizData | null; error: any }> {
    try {
      const { data, error } = await this.db
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

  async deletar(id: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await this.db
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

// Exemplo de uso:
import { supabase } from '../utils/supabase';
export const aprendizService = new AprendizService(supabase);