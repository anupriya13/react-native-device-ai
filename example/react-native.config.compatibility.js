
// React Native Windows Feature Flags Configuration Override
// This configuration helps resolve compatibility issues with React Native 0.79.0

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
      sourceDir: './windows',
      solutionFile: 'ReactNativeDeviceAiExample.sln',
      projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
      experimentalNuGetDependency: false,
      useWinUI3: false,
      projectName: 'ReactNativeDeviceAiExample',
      projectGuid: '{2AB167A1-C158-4721-B131-093D7987CEA9}',
      projectLang: 'cpp',
      // Feature flags compatibility settings
      codegenConfig: {
        featureFlags: {
          // Override problematic feature flags
          useEditTextStockAndroidFocusBehavior: false,
          useTextInputCursorBlinkingAPI: false,
          enableTextInputOnKeyPressForDirectManipulation: false
        }
      }
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
  
  // Codegen configuration for compatibility
  codegenConfig: {
    windows: {
      namespace: "ReactNativeDeviceAiExampleCodegen",
      outputDirectory: "windows/ReactNativeDeviceAiExample/codegen",
      separateDataTypes: true,
      // Compatibility settings
      featureFlags: {
        useEditTextStockAndroidFocusBehavior: false,
        useTextInputCursorBlinkingAPI: false,
        enableTextInputOnKeyPressForDirectManipulation: false
      }
    }
  }
};
