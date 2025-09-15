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
  
  // Project configuration - corrected paths to prevent duplication
  project: {
    windows: {
      sourceDir: './windows',  // Use relative path to prevent duplication
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