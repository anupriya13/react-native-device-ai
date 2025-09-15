const path = require('path');

module.exports = {
  // Dependencies configuration
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
  
  // Project configuration - follows Microsoft's React Native Windows documentation
  project: {
    windows: {
      sourceDir: 'windows',
      solutionFile: 'ReactNativeDeviceAiExample.sln',
      projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
      experimentalNuGetDependency: false,
      useWinUI3: false,
      // Additional properties for better CLI detection
      projectName: 'ReactNativeDeviceAiExample',
      projectGuid: '{2AB167A1-C158-4721-B131-093D7987CEA9}',
      projectLang: 'cpp',
    },
  },
  
  // Platform configuration
  platforms: {
    windows: {
      npmPackageName: 'react-native-windows',
    },
  },
  
  // Assets configuration
  assets: ['./assets/'],
};