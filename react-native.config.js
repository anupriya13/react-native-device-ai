/**
 * React Native configuration for DeviceAI TurboModule
 * Configures the native module for proper auto-linking and platform support
 */

module.exports = {
  dependencies: {
    'react-native-device-ai': {
      platforms: {
        android: {
          sourceDir: '../android',
          packageImportPath: 'import io.anupriya13.deviceai.DeviceAIPackage;',
        },
        ios: {
          sourceDir: '../ios',
          podspecPath: '../ios/DeviceAI.podspec',
        },
        windows: {
          sourceDir: '../windows',
          solutionFile: 'DeviceAI.sln',
          projects: [
            {
              projectFile: 'DeviceAIFabric/DeviceAIFabric.vcxproj',
              directDependency: true,
            },
          ],
        },
      },
    },
  },
  commands: [
    {
      name: 'init-windows',
      description: 'Initialize Windows project for DeviceAI',
      func: () => {
        console.log('Initializing Windows DeviceAI TurboModule...');
        // This would typically run windows initialization scripts
      },
    },
  ],
};