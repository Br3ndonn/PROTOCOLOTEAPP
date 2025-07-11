export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  code?: string;
}

export class ErrorHandler {
  private static errorMessages: Record<string, string> = {
    // Erros de autenticação
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
    'User not found': 'Usuário não encontrado',
    'Password reset request failed': 'Falha ao solicitar redefinição de senha',
    'Signup not allowed': 'Cadastro não permitido',
    'Email already registered': 'Este email já está cadastrado',
    
    // Erros de validação
    'Invalid email': 'Email inválido',
    'Password too short': 'Senha deve ter pelo menos 6 caracteres',
    'Weak password': 'Senha muito fraca. Use letras, números e símbolos',
    
    // Erros de rede
    'Network request failed': 'Erro de conexão. Verifique sua internet',
    'Timeout': 'Tempo limite excedido. Tente novamente',
    
    // Erros de permissão
    'Insufficient permissions': 'Permissões insuficientes',
    'Access denied': 'Acesso negado',
    
    // Erro padrão
    'Unknown error': 'Erro inesperado. Tente novamente'
  };

  /**
   * Processa um erro e retorna uma mensagem amigável
   */
  static handleError(error: unknown): AppError {
    if (error instanceof Error) {
      return this.processKnownError(error);
    }

    if (typeof error === 'string') {
      return this.createAppError(ErrorType.UNKNOWN, error);
    }

    if (typeof error === 'object' && error !== null) {
      return this.processObjectError(error);
    }

    return this.createAppError(ErrorType.UNKNOWN, 'Erro inesperado');
  }

  /**
   * Processa erros conhecidos (instâncias de Error)
   */
  private static processKnownError(error: Error): AppError {
    const message = error.message.toLowerCase();

    // Erros de autenticação
    if (this.isAuthenticationError(message)) {
      return this.createAppError(
        ErrorType.AUTHENTICATION,
        this.getTranslatedMessage(error.message),
        error
      );
    }

    // Erros de validação
    if (this.isValidationError(message)) {
      return this.createAppError(
        ErrorType.VALIDATION,
        this.getTranslatedMessage(error.message),
        error
      );
    }

    // Erros de rede
    if (this.isNetworkError(message)) {
      return this.createAppError(
        ErrorType.NETWORK,
        this.getTranslatedMessage(error.message),
        error
      );
    }

    // Erros de permissão
    if (this.isPermissionError(message)) {
      return this.createAppError(
        ErrorType.PERMISSION,
        this.getTranslatedMessage(error.message),
        error
      );
    }

    return this.createAppError(
      ErrorType.UNKNOWN,
      this.getTranslatedMessage(error.message),
      error
    );
  }

  /**
   * Processa erros que são objetos
   */
  private static processObjectError(error: any): AppError {
    // Erro do Supabase
    if (error.message) {
      return this.processKnownError(new Error(error.message));
    }

    // Erro de resposta HTTP
    if (error.status || error.statusCode) {
      const status = error.status || error.statusCode;
      return this.createAppError(
        this.getErrorTypeByStatus(status),
        this.getMessageByStatus(status),
        error
      );
    }

    return this.createAppError(ErrorType.UNKNOWN, 'Erro inesperado', error);
  }

  /**
   * Cria um objeto AppError
   */
  private static createAppError(
    type: ErrorType,
    message: string,
    originalError?: unknown,
    code?: string
  ): AppError {
    return {
      type,
      message,
      originalError,
      code
    };
  }

  /**
   * Obtém mensagem traduzida ou retorna a original
   */
  private static getTranslatedMessage(message: string): string {
    return this.errorMessages[message] || message || 'Erro inesperado';
  }

  /**
   * Verifica se é erro de autenticação
   */
  private static isAuthenticationError(message: string): boolean {
    const authErrors = [
      'invalid login credentials',
      'email not confirmed',
      'user not found',
      'signup not allowed',
      'email already registered',
      'password reset request failed'
    ];
    
    return authErrors.some(error => message.includes(error));
  }

  /**
   * Verifica se é erro de validação
   */
  private static isValidationError(message: string): boolean {
    const validationErrors = [
      'invalid email',
      'password too short',
      'weak password',
      'required',
      'validation'
    ];
    
    return validationErrors.some(error => message.includes(error));
  }

  /**
   * Verifica se é erro de rede
   */
  private static isNetworkError(message: string): boolean {
    const networkErrors = [
      'network',
      'timeout',
      'connection',
      'fetch'
    ];
    
    return networkErrors.some(error => message.includes(error));
  }

  /**
   * Verifica se é erro de permissão
   */
  private static isPermissionError(message: string): boolean {
    const permissionErrors = [
      'insufficient permissions',
      'access denied',
      'unauthorized',
      'forbidden'
    ];
    
    return permissionErrors.some(error => message.includes(error));
  }

  /**
   * Obtém tipo de erro baseado no status HTTP
   */
  private static getErrorTypeByStatus(status: number): ErrorType {
    if (status === 401 || status === 403) return ErrorType.PERMISSION;
    if (status >= 400 && status < 500) return ErrorType.VALIDATION;
    if (status >= 500) return ErrorType.NETWORK;
    return ErrorType.UNKNOWN;
  }

  /**
   * Obtém mensagem baseada no status HTTP
   */
  private static getMessageByStatus(status: number): string {
    const statusMessages: Record<number, string> = {
      400: 'Requisição inválida',
      401: 'Não autorizado. Faça login novamente',
      403: 'Acesso negado',
      404: 'Recurso não encontrado',
      422: 'Dados inválidos',
      429: 'Muitas tentativas. Tente novamente mais tarde',
      500: 'Erro interno do servidor',
      502: 'Serviço indisponível',
      503: 'Serviço temporariamente indisponível'
    };

    return statusMessages[status] || 'Erro inesperado';
  }

  /**
   * Log do erro (para desenvolvimento/monitoramento)
   */
  static logError(error: AppError, context?: string): void {
    const logMessage = `[${error.type}] ${context ? `${context}: ` : ''}${error.message}`;
    
    if (error.type === ErrorType.UNKNOWN || error.type === ErrorType.NETWORK) {
      console.error(logMessage, error.originalError);
    } else {
      console.warn(logMessage);
    }
  }

  /**
   * Verifica se o erro é de um tipo específico
   */
  static isErrorType(error: AppError, type: ErrorType): boolean {
    return error.type === type;
  }

  /**
   * Obtém apenas a mensagem de erro de forma simplificada
   */
  static getErrorMessage(error: unknown): string {
    const appError = this.handleError(error);
    return appError.message;
  }
}

// Função utilitária para uso rápido
export function handleError(error: unknown): string {
  return ErrorHandler.getErrorMessage(error);
}

// Função para logging de erros
export function logError(error: unknown, context?: string): void {
  const appError = ErrorHandler.handleError(error);
  ErrorHandler.logError(appError, context);
}