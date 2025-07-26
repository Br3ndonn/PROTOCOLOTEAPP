import { EnvironmentDetector } from '@/utils/environment';
import { StorageAdapter } from '@/utils/storageFactory';
import type { SupabaseClientOptions } from '@supabase/supabase-js';

export class SupabaseConfig {
  static createConfig(storage: StorageAdapter): SupabaseClientOptions<'public'> {
    const isWeb = EnvironmentDetector.isWeb();
    const isRN = EnvironmentDetector.isReactNative();

    return {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: isWeb,
        storage: storage,
        storageKey: 'supabase-auth-token',
        flowType: isWeb ? 'implicit': 'pkce', // Dinamico conforme o ambiente
      },
      global: {
        headers: {
          'X-Client-Info': isRN ? 'react-native' : 'web'
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 10 // Limite de eventos por segundo
        }
      }
    };
  }
}