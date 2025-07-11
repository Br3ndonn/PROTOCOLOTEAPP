export class EnvironmentDetector {
  static isReactNative(): boolean {
    try {
      // Verificar se window existe (indica ambiente web)
      if (typeof window !== 'undefined') {
        return false;
      }
      
      // Verificar se React Native está disponível
      const RN = require('react-native');
      return RN && RN.Platform && typeof RN.Platform.OS === 'string';
    } catch {
      return false;
    }
  }

  static hasWindow(): boolean {
    try {
      return typeof window !== 'undefined' && window !== null;
    } catch {
      return false;
    }
  }

  static isWeb(): boolean {
    try {
      return typeof window !== 'undefined' && 
             typeof document !== 'undefined' && 
             typeof navigator !== 'undefined';
    } catch {
      return false;
    }
  }

  static hasLocalStorage(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch {
      return false;
    }
  }

  static getEnvironmentInfo() {
    return {
      isRN: this.isReactNative(),
      isWebEnv: this.isWeb(),
      hasWindow: this.hasWindow(),
      hasLocalStorage: this.hasLocalStorage()
    };
  }
}