// The react-native-one-hand library lives outside the app directory and is wired in
// via a symlink in node_modules — Metro needs the tweaks below to bundle it.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const libraryRoot = path.resolve(projectRoot, '..', 'react-native-one-hand');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [libraryRoot];

// Resolve everything from the app's node_modules so there is exactly one copy of each
// dependency, and hide the library's own node_modules — Metro would otherwise pull a
// second @babel/runtime from the library's devDependencies and break bundling.
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.resolver.unstable_enableSymlinks = true;

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [
  new RegExp(`^${escapeForRegExp(path.join(libraryRoot, 'node_modules'))}${path.sep}.*$`),
];

module.exports = config;
