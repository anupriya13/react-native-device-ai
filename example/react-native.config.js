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
};