import { AtividadeData } from '../components/formulario/types';
import { IntercorrenciaTemporaria } from '../hooks/useIntercorrenciasTemporarias';
import { RegistroIntercorrenciaInput } from '../services/RegistroIntercorrenciaService';

interface IntercorrenciaBanco {
  nome: string;
  id_intercorrencia: number;
}

/**
 * Converte intercorrências selecionadas no formulário para o formato do banco de dados
 * @param atividades Lista de atividades com intercorrencias do formulário
 * @param intercorrenciasBanco Lista de intercorrências existentes no banco
 * @param id_aula ID da aula relacionada
 * @returns Array de registros no formato para inserção no banco
 * @throws {Error} Se id_aula for inválido ou se houver intercorrência não mapeada
 */
export function prepararRegistrosIntercorrencia(
  atividades: AtividadeData[],
  intercorrenciasBanco: IntercorrenciaBanco[],
  id_aula: number
): RegistroIntercorrenciaInput[] {
  if (!id_aula || id_aula <= 0) {
    throw new Error('ID da aula inválido');
  }

  return atividades.flatMap(atividade => 
    atividade.intercorrencias
      .filter(i => i.selecionada)
      .map(i => {
        const intercBanco = intercorrenciasBanco.find(b => b.nome === i.nome);
        if (!intercBanco) {
          console.warn(`Intercorrência não mapeada: ${i.nome}`);
          return null;
        }
        
        return {
          id_intercorrencia: intercBanco.id_intercorrencia,
          id_aula,
          frequencia: i.frequencia,
          intensidade: i.intensidade
        };
      })
      .filter(Boolean) as RegistroIntercorrenciaInput[]
  );
}

// Função para converter dados de intercorrência do banco para o formato da aplicação
export const converterIntercorrenciaDoBanco = (dados: any) => {
  if (!dados) return null;

  return {
    id: dados.id,
    id_aula: dados.id_aula,
    id_intercorrencia: dados.id_intercorrencia,
    frequencia: dados.frequencia,
    intensidade: dados.intensidade,
    observacoes: dados.observacoes || '',
    created_at: dados.created_at,
    // Dados relacionados da intercorrência se incluídos
    nome_intercorrencia: dados.intercorrencia?.nome || dados.nome_intercorrencia,
    descricao_intercorrencia: dados.intercorrencia?.descricao || dados.descricao_intercorrencia
  };
};

// Função para converter dados de intercorrência da aplicação para o formato do banco
export const converterIntercorrenciaParaBanco = (dados: any) => {
  if (!dados) return null;

  return {
    id_aula: dados.id_aula,
    id_intercorrencia: dados.id_intercorrencia,
    frequencia: dados.frequencia,
    intensidade: dados.intensidade,
    observacoes: dados.observacoes || null
  };
};

// Converter intercorrência temporária para registro de banco
export const converterTemporariaParaBanco = (
  intercorrencia: IntercorrenciaTemporaria, 
  id_aula: number
): RegistroIntercorrenciaInput => {
  return {
    id_aula,
    id_intercorrencia: intercorrencia.id_intercorrencia,
    frequencia: intercorrencia.frequencia,
    intensidade: intercorrencia.intensidade
  };
};

// Converter múltiplas intercorrências temporárias para banco
export const converterMultiplasTemporariasParaBanco = (
  intercorrencias: IntercorrenciaTemporaria[], 
  id_aula: number
): RegistroIntercorrenciaInput[] => {
  return intercorrencias.map(intercorrencia => 
    converterTemporariaParaBanco(intercorrencia, id_aula)
  );
};

// Criar intercorrência temporária a partir de dados básicos
export const criarIntercorrenciaTemporaria = (dados: {
  id_intercorrencia: number;
  frequencia: number;
  intensidade: number;
  nome_intercorrencia?: string;
}): Omit<IntercorrenciaTemporaria, 'id_temporario'> => {
  return {
    id_intercorrencia: dados.id_intercorrencia,
    frequencia: dados.frequencia,
    intensidade: dados.intensidade,
    nome_intercorrencia: dados.nome_intercorrencia
  };
};

// Validar dados de intercorrência
export const validarDadosIntercorrencia = (dados: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!dados.id_intercorrencia || dados.id_intercorrencia <= 0) {
    errors.push('ID da intercorrência é obrigatório');
  }

  if (!dados.frequencia || dados.frequencia < 1 || dados.frequencia > 4) {
    errors.push('Frequência deve estar entre 1 e 4');
  }

  if (!dados.intensidade || dados.intensidade < 1 || dados.intensidade > 4) {
    errors.push('Intensidade deve estar entre 1 e 4');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Formatar intercorrência para exibição
export const formatarIntercorrenciaParaExibicao = (intercorrencia: IntercorrenciaTemporaria) => {
  const frequenciaTexto = ['', 'Baixa', 'Média', 'Alta', 'Muito Alta'][intercorrencia.frequencia ?? 0] || 'N/A';
  const intensidadeTexto = ['', 'Leve', 'Moderada', 'Forte', 'Muito Forte'][intercorrencia.intensidade ?? 0] || 'N/A';

  return {
    nome: intercorrencia.nome_intercorrencia || 'Intercorrência sem nome',
    frequencia: `${intercorrencia.frequencia} - ${frequenciaTexto}`,
    intensidade: `${intercorrencia.intensidade} - ${intensidadeTexto}`
  };
};