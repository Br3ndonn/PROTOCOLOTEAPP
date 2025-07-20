import { supabase } from '../utils/supabase';
import { CriarProgressoAtividadeInput, progressoAtividadeService } from './ProgressoAtividadeService';
import { RegistroIntercorrenciaInput, registroIntercorrenciaService } from './RegistroIntercorrenciaService';

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
  intercorrencias?: Omit<RegistroIntercorrenciaInput, 'id_aula'>[]; // Array de intercorrências registradas na aula
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

      // Se há intercorrências para salvar, salva após criar a aula
      if (dados.intercorrencias && dados.intercorrencias.length > 0) {
        console.log('=== LOG INTERCORRÊNCIAS - AULA SERVICE ===');
        console.log('Salvando intercorrências da aula:', dados.intercorrencias);
        console.log('ID da aula criada:', data.id_aula);
        
        // Adicionar id_aula às intercorrências
        const intercorrenciasComAula = dados.intercorrencias.map(interc => ({
          ...interc,
          id_aula: data.id_aula
        }));

        console.log('Intercorrências com ID da aula:', intercorrenciasComAula);

        const { data: resultadoIntercorrencias, error: intercorrenciasError } = await registroIntercorrenciaService.inserirMultiplos(
          intercorrenciasComAula
        );

        console.log('Resultado do salvamento de intercorrências:', resultadoIntercorrencias);
        console.log('Erro no salvamento de intercorrências:', intercorrenciasError);

        if (intercorrenciasError) {
          console.error('Erro ao salvar intercorrências, mas aula foi criada:', intercorrenciasError);
          // Aula já foi criada, retorna sucesso mas com aviso
          return { 
            data, 
            error: { 
              message: 'Aula criada mas houve erro ao salvar algumas intercorrências',
              originalError: intercorrenciasError
            }
          };
        }

        console.log('Intercorrências salvas com sucesso na tabela Registro_intercorrencia');
        console.log('=========================================');
      } else {
        console.log('=== LOG INTERCORRÊNCIAS - AULA SERVICE ===');
        console.log('Nenhuma intercorrência para salvar');
        console.log('=========================================');
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

  //buscar ultima aula
  async buscarUltimaAula(id_aprendiz: string): Promise<{data: AulaData | null; error: any}> {
    try {
      const { data, error } = await supabase
        .from('Aula')
        .select(`
          *,
          Planejamento_intervencao (
            id_aprendiz
          )
        `)
        .order('data_aula', { ascending: false })
        .limit(1)
        .eq('Planejamento_intervencao.id_aprendiz', id_aprendiz);

      if (error) {
        console.error('Erro ao buscar última aula:', error);
        return { data: null, error };
      }

      return { data: data[0] || null, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar última aula:', error);
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

  // Buscar aula com suas atividades e intercorrências
  async buscarComAtividadesEIntercorrencias(id_aula: number): Promise<{ data: any | null; error: any }> {
    try {
      // Buscar dados da aula
      const { data: aulaData, error: aulaError } = await this.buscarPorId(id_aula);
      
      if (aulaError || !aulaData) {
        return { data: null, error: aulaError || 'Aula não encontrada' };
      }

      // Buscar atividades/progressos da aula
      const { data: progressos, error: progressosError } = await progressoAtividadeService.buscarComDetalhes(id_aula);

      // Buscar intercorrências da aula
      const { data: intercorrencias, error: intercorrenciasError } = await registroIntercorrenciaService.buscarComDetalhes(id_aula);

      if (progressosError) {
        console.error('Erro ao buscar progressos da aula:', progressosError);
      }

      if (intercorrenciasError) {
        console.error('Erro ao buscar intercorrências da aula:', intercorrenciasError);
      }

      return { 
        data: { 
          ...aulaData, 
          atividades: progressos || [],
          intercorrencias: intercorrencias || []
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Erro inesperado ao buscar aula completa:', error);
      return { data: null, error };
    }
  }

  // Buscar resumo detalhado da última aula de um aprendiz
  async buscarResumoUltimaAula(id_aprendiz: string): Promise<{ 
    data: { 
      data_aula: string; 
      total_pontos: number;
      atividades: Array<{
        nome_atividade: string;
        pontuacao: number;
        completude: string;
        tentativas: number;
        observacoes?: string;
      }>;
      intercorrencias: Array<{
        tipo: string;
        descricao: string;
      }>;
    } | null; 
    error: any 
  }> {
    try {
      // Buscar a última aula do aprendiz
      const { data: ultimaAula, error: aulaError } = await this.buscarUltimaAula(id_aprendiz);

      if (aulaError || !ultimaAula) {
        return { data: null, error: aulaError || 'Nenhuma aula encontrada' };
      }

      // Buscar os progressos dessa aula com detalhes das atividades
      const { data: progressos, error: progressosError } = await progressoAtividadeService.buscarComDetalhes(ultimaAula.id_aula);

      // Buscar as intercorrências dessa aula com detalhes
      const { data: intercorrencias, error: intercorrenciasError } = await registroIntercorrenciaService.buscarComDetalhes(ultimaAula.id_aula);

      if (progressosError) {
        console.error('Erro ao buscar progressos da última aula:', progressosError);
      }

      if (intercorrenciasError) {
        console.error('Erro ao buscar intercorrências da última aula:', intercorrenciasError);
        // Se há erro nas intercorrências, ainda podemos mostrar as atividades
      }

      // Processar atividades
      const atividadesProcessadas = (progressos || []).map(progresso => ({
        nome_atividade: progresso.Planejamento_atividades?.Atividades?.nome || 'Atividade não identificada',
        pontuacao: progresso.soma_notas || 0,
        completude: progresso.completude || 'Não informado',
        tentativas: progresso.tentativas_realizadas || 0,
        observacoes: progresso.observacoes
      }));

      // Processar intercorrências - com tratamento de erro melhorado
      let intercorrenciasProcessadas: Array<{ tipo: string; descricao: string; frequencia?: number; intensidade?: number }> = [];
      if (!intercorrenciasError && intercorrencias && intercorrencias.length > 0) {
        intercorrenciasProcessadas = intercorrencias.map(interc => ({
          tipo: interc.Intercorrencia?.sigla || 'Sigla não identificada',
          descricao: interc.Intercorrencia?.nome || 'Nome não identificado',
          frequencia: interc.frequencia,
          intensidade: interc.intensidade
        }));
      } else if (intercorrenciasError) {
        console.warn('Intercorrências não puderam ser carregadas devido a erro no relacionamento');
      }

      // Calcular o total de pontos
      const totalPontos = atividadesProcessadas.reduce((total, atividade) => total + (atividade.pontuacao || 0), 0);

      return {
        data: {
          data_aula: ultimaAula.data_aula,
          total_pontos: totalPontos,
          atividades: atividadesProcessadas,
          intercorrencias: intercorrenciasProcessadas
        },
        error: null
      };
    } catch (error) {
      console.error('Erro inesperado ao buscar resumo da última aula:', error);
      return { data: null, error };
    }
  }
}

export const aulaService = new AulaService();
