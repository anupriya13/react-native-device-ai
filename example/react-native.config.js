module.exports = {
  dependencies: {
    'react-native-device-ai': {
      platforms: {
        windows: {
          sourceDir: '../windows',
          solutionFile: 'DeviceAIFabric.sln',
          projectFile: 'DeviceAIFabric.vcxproj',
        },
      },
    },
  },
  project: {
    windows: {
      sourceDir: 'windows',
      solutionFile: 'ReactNativeDeviceAiExample.sln',
      projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
    },
  },
};