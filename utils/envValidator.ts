export class EnvironmentValidator {
  private static readonly REQUIRED_ENV_VARS = {
    EXPO_PUBLIC_SUPABASE_URL: 'sua_url',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: 'sua_chave'
  };

  static validateEnvironment(): { url: string; key: string } {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    this.logEnvironmentStatus(supabaseUrl, supabaseAnonKey);

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logMissingVariables();
      throw new Error('Missing Supabase environment variables. Please check your .env file.');
    }

    return { url: supabaseUrl, key: supabaseAnonKey };
  }

  private static logEnvironmentStatus(url?: string, key?: string): void {
    if (__DEV__) {
      console.log('🔍 Debug Supabase:');
      console.log('URL:', url ? '✅ Definida' : '❌ Não definida');
      console.log('Key:', key ? '✅ Definida' : '❌ Não definida');
    }
  }

  private static logMissingVariables(): void {
    if (__DEV__) {
      console.error('❌ Variáveis de ambiente não encontradas!');
      console.log('Arquivo .env deve estar na raiz do projeto com:');
      Object.entries(this.REQUIRED_ENV_VARS).forEach(([key, example]) => {
        console.log(`${key}=${example}`);
      });
    }
  }
}