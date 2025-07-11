import { EnvironmentDetector } from './environment';

export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export class StorageFactory {
  static createStorage(): StorageAdapter {
    const env = EnvironmentDetector.getEnvironmentInfo();
    
    if (__DEV__) {
      console.log('🔧 Ambiente detectado:', env);
    }

    // React Native Storage (PRIORITÁRIO)
    if (env.isRN) {
      const asyncStorage = this.createAsyncStorage();
      if (asyncStorage) {
        console.log('📱 Usando AsyncStorage (React Native)');
        return asyncStorage;
      }
    }

    // Web Storage (apenas se não for React Native)
    if (env.hasWindow && env.hasLocalStorage && !env.isRN) {
      console.log('🌐 Usando localStorage (Web)');
      return this.createWebStorage();
    }

    // Fallback Storage
    console.log('💾 Usando storage em memória (fallback)');
    return this.createMemoryStorage();
  }

  private static createAsyncStorage(): StorageAdapter | null {
    try {
      // Verificar se estamos em ambiente React Native
      if (typeof window !== 'undefined') {
        return null; // Não usar AsyncStorage no web
      }

      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        return {
          getItem: (key: string) => AsyncStorage.getItem(key),
          setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
          removeItem: (key: string) => AsyncStorage.removeItem(key),
          clear: () => AsyncStorage.clear(),
        };
      }
    } catch (error) {
      console.warn('AsyncStorage não disponível:', error);
    }
    return null;
  }

  private static createWebStorage(): StorageAdapter {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        return Promise.resolve();
      },
      clear: () => {
        localStorage.clear();
        return Promise.resolve();
      },
    };
  }

  private static createMemoryStorage(): StorageAdapter {
    const memoryStorage: { [key: string]: string } = {};
    
    return {
      getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
      setItem: (key: string, value: string) => {
        memoryStorage[key] = value;
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        delete memoryStorage[key];
        return Promise.resolve();
      },
      clear: () => {
        Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
        return Promise.resolve();
      },
    };
  }
}