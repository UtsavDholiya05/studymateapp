const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.resolver.assetExts.push("env");
  
  // Fix for whatwg-fetch resolution
  config.resolver.extraNodeModules = {
    'whatwg-fetch': require.resolve('whatwg-fetch'),
  };
  
  return config;
})();