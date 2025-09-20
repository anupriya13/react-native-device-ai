#!/usr/bin/env node

/**
 * Post-install script to fix React Native Windows metro resolution issues
 * Creates missing generic fallback files that delegate to platform-specific implementations
 */

const fs = require('fs');
const path = require('path');

const rnPath = './node_modules/react-native';

console.log('🔧 Fixing React Native Windows metro resolution...');

// List of known missing files that need generic fallbacks
const missingFiles = [
  // Core components
  {
    path: 'Libraries/Image/Image.js',
    fallback: 'android'
  },
  {
    path: 'Libraries/Utilities/BackHandler.js', 
    fallback: 'android'
  },
  {
    path: 'Libraries/Utilities/Platform.js',
    fallback: 'android'
  },
  {
    path: 'Libraries/StyleSheet/PlatformColorValueTypes.js',
    fallback: 'android'
  },
  {
    path: 'Libraries/Network/RCTNetworking.js',
    fallback: 'android'
  },
  // Nested dependencies
  {
    path: 'Libraries/Components/AccessibilityInfo/legacySendAccessibilityEvent.js',
    fallback: 'android'
  },
  {
    path: 'Libraries/Alert/RCTAlertManager.js',
    fallback: 'ios', // Alert is iOS-specific, but create a stub
    isStub: true
  },
  {
    path: 'Libraries/NativeComponent/BaseViewConfig.js',
    fallback: 'android'
  }
];

let fixedCount = 0;

missingFiles.forEach(({path: filePath, fallback, isStub = false}) => {
  const fullPath = path.join(rnPath, filePath);
  const fileName = path.basename(filePath, '.js');
  const fallbackPath = path.join(rnPath, path.dirname(filePath), `${fileName}.${fallback}.js`);
  
  // Skip if file already exists
  if (fs.existsSync(fullPath)) {
    return;
  }
  
  // Check if fallback exists
  if (!isStub && !fs.existsSync(fallbackPath)) {
    console.warn(`⚠️  Fallback file not found: ${fallbackPath}`);
    return;
  }
  
  let content;
  if (isStub) {
    // Create a stub implementation for platform-specific components
    content = `/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

// Stub implementation for Windows/generic platforms
// This component is platform-specific and not available on all platforms
const ${fileName} = {
  // Add minimal interface to prevent crashes
};

export default ${fileName};
`;
  } else {
    // Create fallback that delegates to platform-specific implementation
    content = `/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

// Generic fallback for Windows/other platforms
// Uses ${fallback} implementation as it's more platform-agnostic
export {default} from './${fileName}.${fallback}';
`;
  }
  
  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: ${filePath} -> ${fileName}.${fallback}`);
  fixedCount++;
});

console.log(`🎉 Fixed ${fixedCount} React Native resolution issues for Windows.`);

if (fixedCount > 0) {
  console.log('\n💡 Note: These files are created in node_modules and will need to be');
  console.log('   recreated if you run npm install. Consider adding this script to');
  console.log('   your package.json postinstall to automate the fix.');
}