/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'bin' to assetExts to support TensorFlow.js model weights
// Add 'glb', 'gltf' for 3D models
config.resolver.assetExts.push('bin', 'glb', 'gltf');

// Mock react-native-fs for Expo Go
config.resolver.sourceExts.push('cjs');
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'react-native-fs': require.resolve('./src/mocks/react-native-fs.js'),
};

module.exports = config;
