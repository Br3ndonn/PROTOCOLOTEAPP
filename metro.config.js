const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolver problemas de polyfill
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web'
};

module.exports = config;