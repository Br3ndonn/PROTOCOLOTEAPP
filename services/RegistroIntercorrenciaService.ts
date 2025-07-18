import { supabase } from '../utils/supabase';

export interface RegistroIntercorrenciaInput {
  id_intercorrencia: number;
  id_aula: number;
  frequencia: number;
  intensidade: number;
}

export interface RegistroIntercorrenciaOutput extends RegistroIntercorrenciaInput {
  created_at?: string;
}

class RegistroIntercorrenciaService {
  /**
   * Insere múltiplos registros de intercorrência
   * @param registros Array de registros a serem inseridos
   * @returns Promise com dados inseridos ou erro
   */
  async inserirMultiplos(
    registros: RegistroIntercorrenciaInput[]
  ): Promise<{ data: RegistroIntercorrenciaOutput[] | null; error: Error | null }> {
    try {
      console.log('=== LOG REGISTRO INTERCORRÊNCIA SERVICE ===');
      console.log('Iniciando inserção de registros de intercorrência');
      console.log('Número de registros a inserir:', registros.length);
      console.log('Registros recebidos:', registros);

      if (!registros || registros.length === 0) {
        console.log('Nenhum registro para inserir, retornando array vazio');
        return { data: [], error: null };
      }

      // Validação
      const isValid = registros.every(reg => 
        reg.id_intercorrencia > 0 && 
        reg.id_aula > 0 &&
        reg.frequencia >= 0 &&
        reg.intensidade >= 0
      );

      console.log('Validação dos registros:', isValid);

      if (!isValid) {
        const erro = new Error('Dados de registro inválidos');
        console.error('Erro de validação:', erro.message);
        throw erro;
      }

      console.log(`Inserindo ${registros.length} registros de intercorrência na tabela Registro_intercorrencia`);
      console.log('Executando query no Supabase...');

      const { data, error } = await supabase
        .from('Registro_intercorrencia')
        .insert(registros)
        .select();

      console.log('Resultado da inserção no Supabase:');
      console.log('- Data retornada:', data);
      console.log('- Error:', error);

      if (error) {
        console.error('Erro no Supabase ao inserir na tabela Registro_intercorrencia:', error);
        console.error('Detalhes do erro:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('Inserção realizada com sucesso na tabela Registro_intercorrencia!');
      console.log('Número de registros inseridos:', data?.length || 0);
      console.log('Dados inseridos:', data);
      console.log('==========================================');

      return { data, error: null };
    } catch (error) {
      console.error('=== ERRO CRÍTICO NO REGISTRO INTERCORRÊNCIA SERVICE ===');
      console.error('Erro ao inserir registros na tabela Registro_intercorrencia:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      console.error('=======================================================');
      return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
    }
  }
}

export const registroIntercorrenciaService = new RegistroIntercorrenciaService();