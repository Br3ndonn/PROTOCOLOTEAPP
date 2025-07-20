import { supabase } from '../utils/supabase';

export interface RegistroIntercorrenciaInput {
  id_intercorrencia: number;
  id_aula: number;
  frequencia?: number;
  intensidade?: number;
}

export interface RegistroIntercorrenciaOutput extends RegistroIntercorrenciaInput {
  id_registro_intercorrencia: number; // Chave primária auto-incremento
}

class RegistroIntercorrenciaService {
  /**
   * Busca registros de intercorrência por ID da aula
   * @param id_aula ID da aula
   * @returns Promise com registros encontrados ou erro
   */
  async buscarPorAula(id_aula: number): Promise<{ data: RegistroIntercorrenciaOutput[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Registro_intercorrencia')
        .select(`
          id_registro_intercorrencia,
          id_intercorrencia,
          id_aula,
          frequencia,
          intensidade
        `)
        .eq('id_aula', id_aula);

      if (error) {
        console.error('Erro ao buscar registros de intercorrência por aula:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar registros de intercorrência:', error);
      return { data: null, error };
    }
  }

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

      // Validação - remove id_registro_intercorrencia pois é auto-incremento
      const isValid = registros.every(reg => 
        reg.id_intercorrencia > 0 && 
        reg.id_aula > 0
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

  /**
   * Busca registros de intercorrência com detalhes das intercorrências
   * @param id_aula ID da aula
   * @returns Promise com registros e detalhes das intercorrências
   */
  async buscarComDetalhes(id_aula: number): Promise<{ data: any[] | null; error: any }> {
    try {
      // Primeiro, vamos tentar buscar apenas os registros básicos para debug
      console.log('=== DEBUG: Buscando registros de intercorrência ===');
      console.log('ID da aula:', id_aula);
      
      const { data: registrosBasicos, error: erroBasico } = await supabase
        .from('Registro_intercorrencia')
        .select('*')
        .eq('id_aula', id_aula);

      console.log('Registros básicos encontrados:', registrosBasicos);
      console.log('Erro básico:', erroBasico);

      if (erroBasico) {
        console.error('Erro ao buscar registros básicos:', erroBasico);
        return { data: null, error: erroBasico };
      }

      // Se não há registros, retorna array vazio
      if (!registrosBasicos || registrosBasicos.length === 0) {
        console.log('Nenhum registro de intercorrência encontrado para esta aula');
        return { data: [], error: null };
      }

      // Agora vamos tentar a query com JOIN usando as colunas corretas
      console.log('Tentando query com relacionamento...');
      const { data, error } = await supabase
        .from('Registro_intercorrencia')
        .select(`
          id_registro_intercorrencia,
          id_aula,
          frequencia,
          intensidade,
          Intercorrencia (
            id_intercorrencia,
            sigla,
            nome
          )
        `)
        .eq('id_aula', id_aula);

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