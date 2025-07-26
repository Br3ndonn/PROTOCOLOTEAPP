import { supabase } from '../utils/supabase';

export interface RegistroIntercorrenciaInput {
  id_intercorrencia: number;
  id_progresso_atividade: number; // Mudança: agora aponta para Progresso_atividades
  frequencia: number; // Agora obrigatório (smallint NOT NULL)
  intensidade: number; // Agora obrigatório (smallint NOT NULL)
}

export interface RegistroIntercorrenciaOutput extends RegistroIntercorrenciaInput {
  id_registro_intercorrencia: number; // Chave primária auto-incremento
}

class RegistroIntercorrenciaService {
  /**
   * Busca registros de intercorrência por ID do progresso da atividade
   * @param id_progresso_atividade ID do progresso da atividade
   * @returns Promise com registros encontrados ou erro
   */
  async buscarPorProgresso(id_progresso_atividade: number): Promise<{ data: RegistroIntercorrenciaOutput[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Registro_intercorrencia')
        .select(`
          id_registro_intercorrencia,
          id_intercorrencia,
          id_progresso_atividade,
          frequencia,
          intensidade
        `)
        .eq('id_progresso_atividade', id_progresso_atividade);

      return { data: data || [], error };
    } catch (error) {
      return { data: null, error };
    }
  }  /**
   * Insere múltiplos registros de intercorrência
   * @param registros Array de registros a serem inseridos
   * @returns Promise com dados inseridos ou erro
   */
  async inserirMultiplos(
    registros: RegistroIntercorrenciaInput[]
  ): Promise<{ data: RegistroIntercorrenciaOutput[] | null; error: Error | null }> {
    try {
      console.log('=== INÍCIO DO REGISTRO INTERCORRÊNCIA SERVICE ===');
      console.log('Dados recebidos para inserção:', registros);
      
      // Validação
      const isValid = registros.every(reg => 
        reg.id_intercorrencia > 0 && 
        reg.id_progresso_atividade > 0 &&
        reg.frequencia >= 1 && reg.frequencia <= 4 &&
        reg.intensidade >= 1 && reg.intensidade <= 4
      );
      
      if (!isValid) {
        console.error('❌ Dados inválidos encontrados nos registros');
        const error = new Error('Dados de intercorrência inválidos. Verifique se todos os campos estão preenchidos corretamente.');
        return { data: null, error };
      }

      console.log('✅ Validação dos dados concluída com sucesso');

      const { data, error } = await supabase
        .from('Registro_intercorrencia')
        .insert(registros)
        .select();

      if (error) {
        console.error('Erro no Supabase ao inserir na tabela Registro_intercorrencia:', error);
        console.error('Detalhes do erro:', JSON.stringify(error, null, 2));
        console.error('=== ERRO CRÍTICO NO REGISTRO INTERCORRÊNCIA SERVICE ===');
        console.error('Erro ao inserir registros na tabela Registro_intercorrencia:', error);
        console.error('Stack trace:', error.stack || 'N/A');
        console.error('=======================================================');
        throw error;
      }

      console.log('✅ Registros inseridos com sucesso no banco de dados');
      console.log('Dados retornados pelo Supabase:', data);
      console.log('=== FIM DO REGISTRO INTERCORRÊNCIA SERVICE ===');

      return { data: data as RegistroIntercorrenciaOutput[], error: null };
    } catch (error) {
      console.error('=== ERRO CRÍTICO NO REGISTRO INTERCORRÊNCIA SERVICE ===');
      console.error('Erro ao inserir registros na tabela Registro_intercorrencia:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      console.error('=======================================================');
      
      const errorObj = error instanceof Error ? error : new Error(String(error));
      return { data: null, error: errorObj };
    }
  }

  /**
   * Busca registros de intercorrência com detalhes das intercorrências por progresso
   * @param id_progresso_atividade ID do progresso da atividade
   * @returns Promise com registros e detalhes das intercorrências
   */
  async buscarComDetalhes(id_progresso_atividade: number): Promise<{ data: any[] | null; error: any }> {
    try {
      console.log('=== DEBUG: Buscando registros de intercorrência ===');
      console.log('ID do progresso da atividade:', id_progresso_atividade);
      
      const { data, error } = await supabase
        .from('Registro_intercorrencia')
        .select(`
          id_registro_intercorrencia,
          id_progresso_atividade,
          frequencia,
          intensidade,
          Intercorrencia (
            id_intercorrencia,
            sigla,
            nome
          )
        `)
        .eq('id_progresso_atividade', id_progresso_atividade);

      console.log('Resultado da query com relacionamento:', data);
      console.log('Erro da query com relacionamento:', error);

      if (error) {
        console.error('Erro ao buscar registros com detalhes:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar registros com detalhes:', error);
      return { data: null, error };
    }
  }
}

export const registroIntercorrenciaService = new RegistroIntercorrenciaService();