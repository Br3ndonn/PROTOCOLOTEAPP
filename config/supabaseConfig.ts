import { EnvironmentDetector } from '@/utils/environment';
import { StorageAdapter } from '@/utils/storageFactory';

export class SupabaseConfig {
  static createConfig(storage: StorageAdapter) {
    const isWeb = EnvironmentDetector.isWeb();
    const isRN = EnvironmentDetector.isReactNative();

    return {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: isWeb,
        storage: storage,
        storageKey: 'supabase-auth-token',
        flowType: 'implicit'
      },
      global: {
        headers: {
          'X-Client-Info': isRN ? 'react-native' : 'web'
        }
      }
    };
  }
}