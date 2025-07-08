const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configurações para resolver problemas com AsyncStorage e Supabase
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-sqlite-storage': false,
};

// Resolver problemas com polyfills
config.resolver.platforms = ['ios', 'android', 'web', 'native'];

module.exports = config;
