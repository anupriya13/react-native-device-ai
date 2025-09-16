module.exports = {
  dependencies: {
    // Link react-native-device-ai to the parent directory
    'react-native-device-ai': {
      root: '../', // Parent directory contains the library
      platforms: {
        windows: {
          sourceDir: '../windows', // Windows implementation directory from parent
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
  },
  project: {
    windows: {
      sourceDir: './windows', // This project's Windows directory
      solutionFile: 'WindowsExample.sln',
    },
  },
};