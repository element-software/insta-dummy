// metro.config.cts – explicit CommonJS TypeScript.
// Metro loads this via `await import()` (Node.js ESM); Node.js treats .cts as
// CJS regardless, so require() is available and expo/metro-config resolves via
// the file system rather than requiring an ESM exports-map entry.

const expoMetroConfig: typeof import('expo/metro-config') = require('expo/metro-config');
const nativewindMetro: typeof import('nativewind/metro') = require('nativewind/metro');
const path: typeof import('path') = require('path');

const projectRoot: string = __dirname;
const workspaceRoot: string = path.resolve(projectRoot, '../..');

const config = expoMetroConfig.getDefaultConfig(projectRoot);

// Monorepo: watch all workspace files
config.watchFolders = [workspaceRoot];

// Monorepo: resolve from both local and root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = nativewindMetro.withNativeWind(config, { input: './global.css' });
