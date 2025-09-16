const project = (() => {
  const path = require('path');
  try {
    const { configureProjects } = require('react-native-test-app');
    return configureProjects({
      android: {
        sourceDir: path.join('example', 'android'),
      },
      ios: {
        sourceDir: 'example/ios',
      },
      windows: {
        sourceDir: path.join('example', 'windows'),
        solutionFile: path.join('example', 'windows', 'ReactNativeDeviceAiExample.sln'),
      },
    });
  } catch (e) {
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    // Help rn-cli find and autolink this library
    'react-native-device-ai': {
      root: __dirname,
    },
  },
  dependency: {
    platforms: {
      windows: {
        sourceDir: 'windows',
        solutionFile: 'ReactNativeDeviceAi.sln',
        projects: [
          {
            projectFile: 'ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj',
            directDependency: true,
          },
        ],
      },
    },
  },
  ...(project ? { project } : undefined),
};
