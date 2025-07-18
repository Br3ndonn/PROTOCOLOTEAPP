import React, { createContext, ReactNode, useContext } from 'react';
import { useIntercorrenciasTemporarias } from '../hooks/useIntercorrenciasTemporarias';

interface IntercorrenciasContextType {
  intercorrencias: any[];
  loading: boolean;
  error: string | null;
  adicionarIntercorrencia: (intercorrencia: any) => string;
  atualizarIntercorrencia: (id_temporario: string, dadosAtualizados: any) => void;
  removerIntercorrencia: (id_temporario: string) => void;
  limparIntercorrencias: () => void;
  validarIntercorrencia: (intercorrencia: any) => string | null;
  validarTodasIntercorrencias: () => { valid: boolean; errors: string[] };
  prepararParaSalvamento: (id_aula: number) => any[];
  salvarIntercorrenciaLocal: (intercorrencia: any) => Promise<any>;
  salvarNoBanco: (id_aula: number) => Promise<{ success: boolean; error: any }>;
  obterEstatisticas: () => any;
  setError: (error: string | null) => void;
}

const IntercorrenciasContext = createContext<IntercorrenciasContextType | undefined>(undefined);

export function IntercorrenciasProvider({ children }: { children: ReactNode }) {
  const hookData = useIntercorrenciasTemporarias();

  return (
    <IntercorrenciasContext.Provider value={hookData}>
      {children}
    </IntercorrenciasContext.Provider>
  );
}

export function useIntercorrenciasContext() {
  const context = useContext(IntercorrenciasContext);
  if (context === undefined) {
    throw new Error('useIntercorrenciasContext deve ser usado dentro de um IntercorrenciasProvider');
  }
  return context;
}
