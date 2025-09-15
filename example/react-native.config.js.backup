const path = require('path');

module.exports = {
  dependencies: {
    'react-native-device-ai': {
      platforms: {
        windows: {
          sourceDir: '../windows',
          solutionFile: 'ReactNativeDeviceAi.sln',
          projectFile: 'ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj',
        },
      },
    },
  },
  project: {
    windows: {
      sourceDir: path.resolve(__dirname, 'windows'),
      solutionFile: 'ReactNativeDeviceAiExample.sln',
      projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
      experimentalNuGetDependency: false,
      useWinUI3: false,
    },
  },
};