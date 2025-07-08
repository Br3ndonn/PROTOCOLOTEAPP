import { createClient } from '@supabase/supabase-js';

// Verificar se estamos em um ambiente React Native
const isReactNative = () => {
  try {
    // Verificar se estamos realmente no React Native, não apenas no Metro bundler
    if (typeof window !== 'undefined') {
      // Se window existe, provavelmente estamos na web
      return false;
    }
    
    // Tentar acessar o Platform do React Native
    const { Platform } = require('react-native');
    return Platform && typeof Platform.OS === 'string';
  } catch {
    return false;
  }
};

// Verificar se estamos em um ambiente com window
const hasWindow = () => {
  try {
    return typeof window !== 'undefined';
  } catch {
    return false;
  }
};

// Verificar se estamos em um ambiente web
const isWeb = () => {
  try {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  } catch {
    return false;
  }
};

// Função para criar um storage seguro
const createSafeStorage = () => {
  const envInfo = {
    isRN: isReactNative(),
    isWebEnv: isWeb(),
    hasWindow: hasWindow(),
    hasLocalStorage: typeof localStorage !== 'undefined'
  };
  
  console.log('� Ambiente detectado:', envInfo);

  // Se estivermos na web (com window e localStorage), usar localStorage
  if (envInfo.hasWindow && envInfo.hasLocalStorage && !envInfo.isRN) {
    console.log('🌐 Usando localStorage (Web)');
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
      removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
      clear: () => Promise.resolve(localStorage.clear()),
    };
  }

  // Se estivermos no React Native, tentar usar AsyncStorage
  if (envInfo.isRN) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        console.log('📱 Usando AsyncStorage (React Native)');
        return AsyncStorage;
      }
    } catch (error) {
      console.warn('AsyncStorage não disponível:', error);
    }
  }

  // Fallback para storage em memória (último recurso)
  console.log('💾 Usando storage em memória (fallback)');
  const memoryStorage: { [key: string]: string } = {};
  return {
    getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
    setItem: (key: string, value: string) => Promise.resolve(memoryStorage[key] = value),
    removeItem: (key: string) => Promise.resolve(delete memoryStorage[key]),
    clear: () => Promise.resolve(Object.keys(memoryStorage).forEach(key => delete memoryStorage[key])),
  };
};

// Criar instância do storage
const storage = createSafeStorage();

// Importar polyfill para React Native apenas se necessário
if (isReactNative() && !hasWindow()) {
  try {
    require('react-native-url-polyfill/auto');
  } catch (error) {
    console.warn('URL polyfill não disponível:', error);
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Debug das variáveis de ambiente (apenas em desenvolvimento)
if (__DEV__) {
  console.log('🔍 Debug Supabase:');
  console.log('URL:', supabaseUrl ? '✅ Definida' : '❌ Não definida');
  console.log('Key:', supabaseAnonKey ? '✅ Definida' : '❌ Não definida');
  console.log('Is React Native:', isReactNative());
  console.log('Is Web:', isWeb());
  console.log('Has Window:', hasWindow());
  console.log('Storage inicializado:', !!storage);
}

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase environment variables. Please check your .env file.';
  
  if (__DEV__) {
    console.error('❌ Variáveis de ambiente não encontradas!');
    console.log('Arquivo .env deve estar na raiz do projeto com:');
    console.log('EXPO_PUBLIC_SUPABASE_URL=sua_url');
    console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave');
  }
  
  throw new Error(errorMessage);
}

// Configuração do Supabase baseada no ambiente
const getSupabaseConfig = () => {
  const baseConfig = {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isWeb(), // Detectar sessão na URL apenas na web
    },
  };

  // Sempre usar nosso storage seguro
  return {
    ...baseConfig,
    auth: {
      ...baseConfig.auth,
      storage: storage,
    },
  };
};

// Criar uma única instância do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, getSupabaseConfig());

// Função para obter a instância (para compatibilidade)
export const getSupabase = () => supabase;
