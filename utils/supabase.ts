import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Importar polyfill apenas em runtime
if (typeof window !== 'undefined') {
  require('react-native-url-polyfill/auto');
}

const supabaseUrl = 'https://pcqoudbrejaezyxiftuj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcW91ZGJyZWphZXp5eGlmdHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODM1OTUsImV4cCI6MjA2Njk1OTU5NX0.HhFwB5BDEX4OTdYY_eXP7zuyZL-vn2xrTNNbatz3jRc';

// Verificar se estamos em um ambiente React Native válido
const isReactNativeEnvironment = () => {
  try {
    return typeof window !== 'undefined' && Platform.OS !== undefined;
  } catch {
    return false;
  }
};

let supabaseInstance: SupabaseClient | null = null;

// Função para inicializar o Supabase apenas quando necessário
const initializeSupabase = () => {
  if (!supabaseInstance) {
    const config: any = {
      auth: {
        detectSessionInUrl: false,
      },
    };

    // Adicionar configurações específicas do React Native apenas se estivermos no ambiente correto
    if (isReactNativeEnvironment()) {
      config.auth.storage = AsyncStorage;
      config.auth.autoRefreshToken = true;
      config.auth.persistSession = true;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, config);
  }
  return supabaseInstance;
};

// Getter que inicializa sob demanda
export const getSupabase = () => {
  return initializeSupabase();
};

// Para compatibilidade com código existente
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const instance = initializeSupabase();
    return instance[prop as keyof SupabaseClient];
  }
});
