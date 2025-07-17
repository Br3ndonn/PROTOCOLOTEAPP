// Interfaces para tipagem do formulário
import { Completude } from '../../services/ProgressoAtividadeService';

export interface FormData {
  aprendiz: string;
  local: string;
  observacoes: string;
}

export interface AtividadeData {
  id: string;
  atividade: string;
  meta: string; // Campo mantido por compatibilidade, mas não é mais obrigatório
  completude: CompletudeOption;
  somatorio: string;
  tentativas: TentativaData[];
  houveIntercorrencia: boolean;
  intercorrencias: IntercorrenciaData[];
  minimizada: boolean;
  salva: boolean;
  // Novos campos para integração com banco
  id_planejamento_atividades?: number;
  tentativas_realizadas?: number;
  soma_notas?: number;
  completude_enum?: Completude;
  observacoes_atividade?: string;
}

export interface TentativaData {
  id: string;
  nome: string;
  pontuacao: number;
}

export interface IntercorrenciaData {
  id: string;
  nome: string;
  selecionada: boolean;
  frequencia: number;
  intensidade: number;
}

export interface AtividadeDisponivel {
  id: string;
  nome: string;
  codigo: string;
  id_planejamento_atividades?: number; // ID para relacionar com o banco
}

export type CompletudeOption = 'Não Realizou' | 'Poucas' | 'Metade' | 'Quase Tudo' | 'Tudo' | '';

// Mapeamento entre opções do formulário e enum do banco
export const COMPLETUDE_MAPPING: Record<CompletudeOption, Completude | null> = {
  'Não Realizou': Completude.NAO_REALIZOU,
  'Poucas': Completude.POUCAS,
  'Metade': Completude.METADE,
  'Quase Tudo': Completude.QUASE_TUDO,
  'Tudo': Completude.TUDO,
  '': null
};

// Mapeamento reverso para exibição
export const COMPLETUDE_REVERSE_MAPPING: Record<Completude, CompletudeOption> = {
  [Completude.NAO_REALIZOU]: 'Não Realizou',
  [Completude.POUCAS]: 'Poucas',
  [Completude.METADE]: 'Metade',
  [Completude.QUASE_TUDO]: 'Quase Tudo',
  [Completude.TUDO]: 'Tudo'
};
