const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Make Metro resolve .web.js files before .js files on web platform
config.resolver.platforms = ['web', 'android', 'ios', 'native'];

// Block react-native-maps on web entirely
const originalResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: `${__dirname}/src/components/MapViewWrapper.web.js`,
      type: 'sourceFile',
    };
  }
  if (originalResolver) {
    return originalResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;