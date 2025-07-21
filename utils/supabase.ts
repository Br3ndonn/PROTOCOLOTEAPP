import { EnvironmentDetector } from '@/utils/environment';
import { StorageFactory } from '@/utils/storageFactory';
import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

export class SupabaseConfig {
  static createConfig(storage: any): SupabaseClientOptions<'public'> {
    const env = EnvironmentDetector.getEnvironmentInfo();

    return {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: env.isWebEnv,
        storage: storage,
        storageKey: 'supabase-auth-token',
        flowType: env.isWebEnv ? 'implicit' : 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': env.isRN ? 'react-native' : 'web',
          'X-Environment': env.isRN ? 'mobile' : 'web'
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    };
  }
}

// Validar variáveis de ambiente
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente Supabase não encontradas!');
  throw new Error('Missing Supabase environment variables');
}

// Criar storage
let storage: any = null;
if (typeof window !== 'undefined') {
  storage = StorageFactory.createStorage();
}
// Criar configuração
const config = SupabaseConfig.createConfig(storage);

// Criar e exportar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, config);

// Debug
if (__DEV__) {
  console.log('✅ Cliente Supabase criado:', !!supabase);
  console.log('✅ Auth disponível:', !!supabase.auth);
}
