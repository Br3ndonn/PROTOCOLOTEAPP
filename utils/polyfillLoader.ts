import { EnvironmentDetector } from './environment';

export class PolyfillLoader {
  static loadReactNativePolyfills(): void {
    if (EnvironmentDetector.isReactNative() && !EnvironmentDetector.hasWindow()) {
      try {
        require('react-native-url-polyfill/auto');
      } catch (error) {
        console.warn('URL polyfill não disponível:', error);
      }
    }
  }
}