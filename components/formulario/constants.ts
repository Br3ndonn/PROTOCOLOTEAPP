import { AtividadeDisponivel, CompletudeOption, IntercorrenciaData, TentativaData } from './types';

// Lista de atividades disponíveis (simulando dados do plano de intervenção)
export const ATIVIDADES_DISPONIVEIS: AtividadeDisponivel[] = [
  { id: '1', nome: 'Natação Livre', codigo: 'NL-001' },
  { id: '2', nome: 'Exercícios Respiratórios', codigo: 'ER-002' },
  { id: '3', nome: 'Coordenação Motora', codigo: 'CM-003' },
  { id: '4', nome: 'Relaxamento Aquático', codigo: 'RA-004' },
  { id: '5', nome: 'Flutuação Assistida', codigo: 'FA-005' },
  { id: '6', nome: 'Propulsão Básica', codigo: 'PB-006' },
  { id: '7', nome: 'Imersão Gradual', codigo: 'IG-007' },
  { id: '8', nome: 'Socialização Aquática', codigo: 'SA-008' }
];

export const COMPLETUDE_OPTIONS: CompletudeOption[] = [
  'Não Realizou', 'Poucas', 'Metade', 'Quase Tudo', 'Tudo'
];

// Dados das tentativas padrão
export const TENTATIVAS_PADRAO: TentativaData[] = [
  { id: '1', nome: '1ª Tentativa', pontuacao: 0 },
  { id: '2', nome: '2ª Tentativa', pontuacao: 0 },
  { id: '3', nome: '3ª Tentativa', pontuacao: 0 },
  { id: '4', nome: 'Penúltima Tentativa', pontuacao: 0 },
  { id: '5', nome: 'Última Tentativa', pontuacao: 0 }
];

// Intercorrências padrão
export const INTERCORRENCIAS_PADRAO: IntercorrenciaData[] = [
  { id: '1', nome: 'Fuga/esquiva', selecionada: false, frequencia: 1, intensidade: 1 },
  { id: '2', nome: 'Birra/choro', selecionada: false, frequencia: 1, intensidade: 1 },
  { id: '3', nome: 'Destruição', selecionada: false, frequencia: 1, intensidade: 1 },
  { id: '4', nome: 'Autolesivo', selecionada: false, frequencia: 1, intensidade: 1 },
  { id: '5', nome: 'Agressividade', selecionada: false, frequencia: 1, intensidade: 1 },
  { id: '6', nome: 'Sonolento/disperso', selecionada: false, frequencia: 1, intensidade: 1 },
  { id: '7', nome: 'Estereotipia física ou vocal', selecionada: false, frequencia: 1, intensidade: 1 },
  { id: '8', nome: 'Recusa contato físico ou instrucional', selecionada: false, frequencia: 1, intensidade: 1 }
];
