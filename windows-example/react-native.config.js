module.exports = {
  dependencies: {
    // Link react-native-device-ai to the parent directory
    'react-native-device-ai': {
      root: '../', // Parent directory contains the library
    },
  },
  dependency: {
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
};