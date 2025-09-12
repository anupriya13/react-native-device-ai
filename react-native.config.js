const project = (() => {
  const path = require('path');
  try {
    // Configure platform-specific projects using react-native-test-app
    const { configureProjects } = require('react-native-test-app');
    return configureProjects({
      android: {
        sourceDir: path.join('example', 'android'), // Android project directory
      },
      ios: {
        sourceDir: 'example/ios', // iOS project directory
      },
      windows: {
        sourceDir: path.join('example', 'windows'), // Windows project directory
        solutionFile: path.join('example', 'windows', 'DeviceAIExample.sln'), // Windows solution file
      },
    });
  } catch (e) {
    // Return undefined if react-native-test-app is not available
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    // Help rn-cli find and autolink this library
    'react-native-device-ai': {
      root: __dirname, // Root directory of the library
    },
  },
  dependency: {
    platforms: {
      windows: {
        sourceDir: 'windows', // Windows implementation directory
        solutionFile: 'ReactNativeDeviceAI.sln', // Windows solution file
        projects: [
          {
            projectFile: 'ReactNativeDeviceAI/ReactNativeDeviceAI.vcxproj', // Windows project file
            directDependency: true, // Mark as a direct dependency
          },
        ],
      },
    },
  },
  ...(project ? { project } : undefined), // Include project configuration if available
};