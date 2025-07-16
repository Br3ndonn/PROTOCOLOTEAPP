// Interfaces para tipagem do formulário
export interface FormData {
  aprendiz: string;
  local: string;
  observacoes: string;
}

export interface AtividadeData {
  id: string;
  atividade: string;
  meta: string;
  completude: CompletudeOption;
  somatorio: string;
  tentativas: TentativaData[];
  houveIntercorrencia: boolean;
  intercorrencias: IntercorrenciaData[];
  minimizada: boolean;
  salva: boolean;
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
}

export type CompletudeOption = 'Não Realizou' | 'Poucas' | 'Metade' | 'Quase Tudo' | 'Tudo' | '';
