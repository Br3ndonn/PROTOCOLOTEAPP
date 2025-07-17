import { supabase } from '../utils/supabase';

// Enum para completude (deve corresponder ao enum no banco)
export enum Completude {
  NAO_REALIZOU = 'Não realizou',
  POUCAS = 'Poucas',
  METADE = 'Metade',
  QUASE_TUDO = 'Quase Tudo',
  TUDO = 'Tudo'
}

// Mapeamento reverso para exibição
export const COMPLETUDE_REVERSE_MAPPING: Record<Completude, string> = {
  [Completude.NAO_REALIZOU]: 'Não Realizou',
  [Completude.POUCAS]: 'Poucas',
  [Completude.METADE]: 'Metade',
  [Completude.QUASE_TUDO]: 'Quase Tudo',
  [Completude.TUDO]: 'Tudo'
};

export interface ProgressoAtividadeData {
  id_progresso_atividade?: number;
  id_aula: number;
  id_planejamento_atividades: number;
  tentativas_realizadas: number;
  soma_notas: number;
  completude: Completude;
  observacoes?: string;
  created_at?: string;
}

export interface CriarProgressoAtividadeInput {
  id_planejamento_atividades: number;
  tentativas_realizadas: number;
  soma_notas: number;
  completude: Completude;
  observacoes?: string;
}

class ProgressoAtividadeService {
  // Criar registro de progresso (sem id_aula ainda)
  async criarRegistroTemporario(dados: CriarProgressoAtividadeInput): Promise<{ data: CriarProgressoAtividadeInput; error: any }> {
    try {
      // Validações básicas
      if (!dados.id_planejamento_atividades) {
        return { data: dados, error: 'ID do planejamento de atividades é obrigatório' };
      }

      if (dados.tentativas_realizadas < 0) {
        return { data: dados, error: 'Tentativas realizadas deve ser um valor positivo' };
      }

      if (dados.soma_notas < 0) {
        return { data: dados, error: 'Soma das notas deve ser um valor positivo' };
      }

      console.log('Registro de atividade salvo temporariamente:', dados);
      return { data: dados, error: null };
    } catch (error) {
      console.error('Erro ao criar registro temporário:', error);
      return { data: dados, error };
    }
  }

  // Salvar progresso no banco (quando tiver id_aula)
  async salvar(id_aula: number, dados: CriarProgressoAtividadeInput): Promise<{ data: ProgressoAtividadeData | null; error: any }> {
    try {
      const progressoData = {
        id_aula,
        id_planejamento_atividades: dados.id_planejamento_atividades,
        tentativas_realizadas: dados.tentativas_realizadas,
        soma_notas: dados.soma_notas,
        completude: dados.completude,
        observacoes: dados.observacoes
      };

      console.log('Salvando progresso de atividade:', progressoData);

      const { data, error } = await supabase
        .from('Progresso_atividades')
        .insert([progressoData])
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao salvar progresso de atividade:', error);
        return { data: null, error };
      }

      console.log('Progresso de atividade salvo com sucesso:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao salvar progresso:', error);
      return { data: null, error };
    }
  }

  // Salvar múltiplos progressos de atividades
  async salvarMultiplos(id_aula: number, atividades: CriarProgressoAtividadeInput[]): Promise<{ data: ProgressoAtividadeData[] | null; error: any }> {
    try {
      if (!atividades || atividades.length === 0) {
        return { data: [], error: null };
      }

      const progressosData = atividades.map(atividade => ({
        id_aula,
        id_planejamento_atividades: atividade.id_planejamento_atividades,
        tentativas_realizadas: atividade.tentativas_realizadas,
        soma_notas: atividade.soma_notas,
        completude: atividade.completude,
        observacoes: atividade.observacoes
      }));

      console.log('Salvando múltiplos progressos de atividades:', progressosData);

      const { data, error } = await supabase
        .from('Progresso_atividades')
        .insert(progressosData)
        .select('*');

      if (error) {
        console.error('Erro ao salvar múltiplos progressos:', error);
        return { data: null, error };
      }

      console.log('Múltiplos progressos salvos com sucesso:', data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao salvar múltiplos progressos:', error);
      return { data: null, error };
    }
  }

  // Buscar progressos por aula
  async buscarPorAula(id_aula: number): Promise<{ data: ProgressoAtividadeData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Progresso_atividades')
        .select('*')
        .eq('id_aula', id_aula)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar progressos por aula:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar progressos:', error);
      return { data: null, error };
    }
  }

  // Buscar progressos com detalhes das atividades
  async buscarComDetalhes(id_aula: number): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Progresso_atividades')
        .select(`
          *,
          Planejamento_atividades (
            id_atividade,
            observacoes,
            created_at
          )
        `)
        .eq('id_aula', id_aula)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar progressos com detalhes:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar progressos com detalhes:', error);
      return { data: null, error };
    }
  }

  // Atualizar progresso existente
  async atualizar(id_progresso: number, dados: Partial<CriarProgressoAtividadeInput>): Promise<{ data: ProgressoAtividadeData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Progresso_atividades')
        .update(dados)
        .eq('id_progresso_atividade', id_progresso)
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao atualizar progresso:', error);
        return { data: null, error };
      }

      console.log('Progresso atualizado com sucesso:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao atualizar progresso:', error);
      return { data: null, error };
    }
  }

  // Deletar progresso
  async deletar(id_progresso: number): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from('Progresso_atividades')
        .delete()
        .eq('id_progresso_atividade', id_progresso);

      if (error) {
        console.error('Erro ao deletar progresso:', error);
        return { success: false, error };
      }

      console.log('Progresso deletado com sucesso');
      return { success: true, error: null };
    } catch (error) {
      console.error('Erro inesperado ao deletar progresso:', error);
      return { success: false, error };
    }
  }
}

export const progressoAtividadeService = new ProgressoAtividadeService();
