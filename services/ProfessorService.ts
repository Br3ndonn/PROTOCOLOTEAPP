// services/ProfessorService.ts
import { supabase } from '../utils/supabase';

export interface ProfessorData {
  id_professor: string; // UUID do usuário
  nome: string;         // Display name
  email: string;        // Email do usuário
  e_supervisor: boolean; // Se é supervisor ou não
}

class ProfessorService {
  // Criar novo professor
  async criar(dadosProfessor: Omit<ProfessorData, 'created_at' | 'updated_at'>): Promise<{ data: ProfessorData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Professor')
        .insert([dadosProfessor])
        .select('id_professor, nome, email, e_supervisor')
        .single();

      if (error) {
        console.error('Erro ao criar professor:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao criar professor:', error);
      return { data: null, error };
    }
  }

  // Buscar professor por ID
  async buscarPorId(id: string): Promise<{ data: ProfessorData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Professor')
        .select('id_professor, nome, email, e_supervisor')
        .eq('id_professor', id)
        .single();

      if (error) {
        console.error('Erro ao buscar professor por ID:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar professor:', error);
      return { data: null, error };
    }
  }

  // Atualizar professor
  async atualizar(id: string, dados: Partial<Omit<ProfessorData, 'id_professor'>>): Promise<{ data: ProfessorData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Professor')
        .update(dados)
        .eq('id_professor', id)
        .select('id_professor, nome, email, e_supervisor')
        .single();

      if (error) {
        console.error('Erro ao atualizar professor:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao atualizar professor:', error);
      return { data: null, error };
    }
  }

  // Verificar se professor existe
  async existe(id: string): Promise<{ exists: boolean; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Professor')
        .select('id_professor')
        .eq('id_professor', id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao verificar existência do professor:', error);
        return { exists: false, error };
      }

      return { exists: !!data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao verificar professor:', error);
      return { exists: false, error };
    }
  }
}

export const professorService = new ProfessorService();