import { supabase } from '../utils/supabase';

export interface AtividadeData {
  id_atividade: number;
  sigla: string;
  numero: string;
  nome: string;
}

export interface PlanejamentoAtividadeData {
  id_planejamento_atividade: number; // Corrigido para singular
  id_atividade: number;
  id_planejamento_intervencao: number;
  recompensa: string;
  etapas: string[];
  obj_secundario: string;
  num_repeticoes: number;
  // Dados da atividade (JOIN) - Supabase retorna como array
  Atividades?: AtividadeData[];
}

export interface AtividadeParaSelecao {
  id: string;
  sigla: string;
  numero: string;
  nome: string;
  displayText: string; // Formato: "sigla - numero - nome"
}

class PlanejamentoAtividadesService {
  // Buscar atividades do planejamento por ID do planejamento de intervenção
  async buscarAtividadesPorPlanejamento(
    idPlanejamentoIntervencao: number
  ): Promise<{ data: PlanejamentoAtividadeData[] | null; error: any }> {
    try {
      console.log('Buscando atividades para planejamento:', idPlanejamentoIntervencao);

      const { data, error } = await supabase
        .from('Planejamento_atividades')
        .select(`
          id_planejamento_atividade,
          id_atividade,
          id_planejamento_intervencao,
          recompensa,
          etapas,
          obj_secundario,
          num_repeticoes,
          Atividades!inner (
            id_atividade,
            sigla,
            numero,
            nome
          )
        `)
        .eq('id_planejamento_intervencao', idPlanejamentoIntervencao);

      if (error) {
        console.error('Erro ao buscar atividades do planejamento:', error);
        return { data: null, error };
      }

      console.log(`Encontradas ${data?.length || 0} atividades no planejamento`);
      console.log('Dados retornados:', JSON.stringify(data, null, 2));
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar atividades do planejamento:', error);
      return { data: null, error };
    }
  }

  // Método alternativo: buscar atividades por aprendiz com consultas separadas
  async buscarAtividadesPorAprendizAlternativo(
    idAprendiz: string
  ): Promise<{ data: AtividadeParaSelecao[] | null; error: any }> {
    try {
      console.log('Buscando atividades para aprendiz (método alternativo):', idAprendiz);

      // 1. Buscar planejamento de intervenção
      const { data: planejamentos, error: errorPlanejamento } = await supabase
        .from('Planejamento_intervencao')
        .select('id_planejamento_intervencao')
        .eq('id_aprendiz', idAprendiz);

      if (errorPlanejamento || !planejamentos || planejamentos.length === 0) {
        console.log('Nenhum planejamento encontrado para o aprendiz');
        return { data: [], error: errorPlanejamento };
      }

      const planejamento = planejamentos[0];

      // 2. Buscar atividades do planejamento (sem JOIN)
      const { data: planejamentoAtividades, error: errorPlanejamentoAtividades } = await supabase
        .from('Planejamento_atividades')
        .select('id_planejamento_atividade, id_atividade')
        .eq('id_planejamento_intervencao', planejamento.id_planejamento_intervencao);

      if (errorPlanejamentoAtividades || !planejamentoAtividades) {
        console.error('Erro ao buscar atividades do planejamento:', errorPlanejamentoAtividades);
        return { data: null, error: errorPlanejamentoAtividades };
      }

      console.log(`Encontradas ${planejamentoAtividades.length} atividades no planejamento`);

      if (planejamentoAtividades.length === 0) {
        return { data: [], error: null };
      }

      // 3. Buscar detalhes das atividades
      const idsAtividades = planejamentoAtividades.map(item => item.id_atividade);
      
      const { data: atividades, error: errorAtividades } = await supabase
        .from('Atividades')
        .select('id_atividade, sigla, numero, nome')
        .in('id_atividade', idsAtividades);

      if (errorAtividades || !atividades) {
        console.error('Erro ao buscar detalhes das atividades:', errorAtividades);
        return { data: null, error: errorAtividades };
      }

      console.log(`Encontrados detalhes de ${atividades.length} atividades`);

      // 4. Combinar dados
      const atividadesParaSelecao: AtividadeParaSelecao[] = planejamentoAtividades
        .map(planAtiv => {
          const atividade = atividades.find(atv => atv.id_atividade === planAtiv.id_atividade);
          if (!atividade) {
            console.warn(`Atividade ${planAtiv.id_atividade} não encontrada na tabela Atividades`);
            return null;
          }
          
          return {
            id: planAtiv.id_planejamento_atividade.toString(),
            sigla: atividade.sigla,
            numero: atividade.numero,
            nome: atividade.nome,
            displayText: `${atividade.sigla} - ${atividade.numero} - ${atividade.nome}`
          };
        })
        .filter(item => item !== null) as AtividadeParaSelecao[];

      console.log(`Retornando ${atividadesParaSelecao.length} atividades para seleção`);
      return { data: atividadesParaSelecao, error: null };

    } catch (error) {
      console.error('Erro inesperado no método alternativo:', error);
      return { data: null, error };
    }
  }

  // Buscar atividades por aprendiz (via planejamento de intervenção)
  async buscarAtividadesPorAprendiz(
    idAprendiz: string
  ): Promise<{ data: AtividadeParaSelecao[] | null; error: any }> {
    try {
      console.log('Buscando atividades para aprendiz:', idAprendiz);

      // Primeiro, buscar o planejamento de intervenção do aprendiz
      const { data: planejamentos, error: errorPlanejamento } = await supabase
        .from('Planejamento_intervencao')
        .select('id_planejamento_intervencao')
        .eq('id_aprendiz', idAprendiz);

      if (errorPlanejamento) {
        console.error('Erro ao buscar planejamento de intervenção:', errorPlanejamento);
        return { data: null, error: errorPlanejamento };
      }

      if (!planejamentos || planejamentos.length === 0) {
        console.log('Nenhum planejamento de intervenção encontrado para o aprendiz');
        return { data: [], error: null };
      }

      // Usar o primeiro planejamento encontrado (assumindo um planejamento ativo por aprendiz)
      const planejamento = planejamentos[0];
      
      // Buscar as atividades do planejamento
      const { data: atividadesPlanejamento, error: errorAtividades } = 
        await this.buscarAtividadesPorPlanejamento(planejamento.id_planejamento_intervencao);

      if (errorAtividades || !atividadesPlanejamento) {
        console.error('Erro ao buscar atividades do planejamento:', errorAtividades);
        return { data: null, error: errorAtividades };
      }

      // Transformar dados para o formato de seleção
      const atividadesParaSelecao: AtividadeParaSelecao[] = atividadesPlanejamento
        .filter(item => item.Atividades && item.Atividades.length > 0) // Garantir que tem dados da atividade
        .map(item => {
          const atividade = item.Atividades![0]; // Pegar o primeiro item do array
          return {
            id: item.id_planejamento_atividade.toString(),
            sigla: atividade.sigla,
            numero: atividade.numero,
            nome: atividade.nome,
            displayText: `${atividade.sigla} - ${atividade.numero} - ${atividade.nome}`
          };
        });

      console.log(`Retornando ${atividadesParaSelecao.length} atividades para seleção`);
      
      // Se o JOIN não retornou dados (mas havia atividades), tentar método alternativo
      if (atividadesParaSelecao.length === 0 && atividadesPlanejamento.length > 0) {
        console.log('JOIN não retornou dados das atividades, tentando método alternativo...');
        return await this.buscarAtividadesPorAprendizAlternativo(idAprendiz);
      }
      
      return { data: atividadesParaSelecao, error: null };

    } catch (error) {
      console.error('Erro inesperado ao buscar atividades por aprendiz:', error);
      return { data: null, error };
    }
  }

  // Buscar detalhes de uma atividade específica do planejamento
  async buscarDetalhesAtividade(
    idPlanejamentoAtividade: number
  ): Promise<{ data: PlanejamentoAtividadeData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Planejamento_atividades')
        .select(`
          id_planejamento_atividade,
          id_atividade,
          id_planejamento_intervencao,
          recompensa,
          etapas,
          obj_secundario,
          num_repeticoes,
          Atividades (
            id_atividade,
            sigla,
            numero,
            nome
          )
        `)
        .eq('id_planejamento_atividade', idPlanejamentoAtividade)
        .single();

      if (error) {
        console.error('Erro ao buscar detalhes da atividade:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao buscar detalhes da atividade:', error);
      return { data: null, error };
    }
  }

  // Criar nova atividade no planejamento
  async criarAtividadePlanejamento(
    dados: Omit<PlanejamentoAtividadeData, 'id_planejamento_atividade' | 'Atividades'>
  ): Promise<{ data: PlanejamentoAtividadeData | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('Planejamento_atividades')
        .insert([dados])
        .select(`
          id_planejamento_atividade,
          id_atividade,
          id_planejamento_intervencao,
          recompensa,
          etapas,
          obj_secundario,
          num_repeticoes
        `)
        .single();

      if (error) {
        console.error('Erro ao criar atividade no planejamento:', error);
        return { data: null, error };
      }

      console.log('Atividade criada no planejamento:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Erro inesperado ao criar atividade no planejamento:', error);
      return { data: null, error };
    }
  }
}

export const planejamentoAtividadesService = new PlanejamentoAtividadesService();
