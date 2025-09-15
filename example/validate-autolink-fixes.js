#!/usr/bin/env node

/**
 * Simple autolink validation script
 * Verifies that the autolink configuration fixes are properly applied
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Autolink Fixes...');
console.log('=====================================\n');

const checks = [];

// Check 1: AutolinkedNativeModules.g.cpp has proper ReactNativeDeviceAi registration
try {
  const cppPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.cpp');
  const cppContent = fs.readFileSync(cppPath, 'utf8');
  
  if (cppContent.includes('winrt::ReactNativeDeviceAi::ReactPackageProvider()')) {
    checks.push({ name: 'AutolinkedNativeModules.g.cpp registration', status: '✅ PASS' });
  } else {
    checks.push({ name: 'AutolinkedNativeModules.g.cpp registration', status: '❌ FAIL' });
  }
  
  if (cppContent.includes('#include <winrt/ReactNativeDeviceAi.h>')) {
    checks.push({ name: 'AutolinkedNativeModules.g.cpp includes', status: '✅ PASS' });
  } else {
    checks.push({ name: 'AutolinkedNativeModules.g.cpp includes', status: '❌ FAIL' });
  }
} catch (error) {
  checks.push({ name: 'AutolinkedNativeModules.g.cpp file', status: '❌ MISSING' });
}

// Check 2: AutolinkedNativeModules.g.props has correct project reference
try {
  const propsPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.props');
  const propsContent = fs.readFileSync(propsPath, 'utf8');
  
  if (propsContent.includes('..\\..\\..\\windows\\ReactNativeDeviceAi\\ReactNativeDeviceAi.vcxproj')) {
    checks.push({ name: 'AutolinkedNativeModules.g.props path', status: '✅ PASS' });
  } else {
    checks.push({ name: 'AutolinkedNativeModules.g.props path', status: '❌ FAIL' });
  }
  
  if (propsContent.includes('{8D427E1F-1E62-4E19-BB90-8CFDB762014D}')) {
    checks.push({ name: 'AutolinkedNativeModules.g.props GUID', status: '✅ PASS' });
  } else {
    checks.push({ name: 'AutolinkedNativeModules.g.props GUID', status: '❌ FAIL' });
  }
} catch (error) {
  checks.push({ name: 'AutolinkedNativeModules.g.props file', status: '❌ MISSING' });
}

// Check 3: react-native.config.js has correct Windows configuration
try {
  const configPath = path.join(__dirname, 'react-native.config.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('sourceDir: \'windows\'')) {
    checks.push({ name: 'react-native.config.js sourceDir', status: '✅ PASS' });
  } else {
    checks.push({ name: 'react-native.config.js sourceDir', status: '❌ FAIL' });
  }
  
  if (configContent.includes('ReactNativeDeviceAiExample.sln')) {
    checks.push({ name: 'react-native.config.js solutionFile', status: '✅ PASS' });
  } else {
    checks.push({ name: 'react-native.config.js solutionFile', status: '❌ FAIL' });
  }
} catch (error) {
  checks.push({ name: 'react-native.config.js file', status: '❌ MISSING' });
}

// Check 4: Dependency project exists
try {
  const depProjectPath = path.join(__dirname, '..', 'windows', 'ReactNativeDeviceAi', 'ReactNativeDeviceAi.vcxproj');
  if (fs.existsSync(depProjectPath)) {
    checks.push({ name: 'ReactNativeDeviceAi dependency project', status: '✅ PASS' });
  } else {
    checks.push({ name: 'ReactNativeDeviceAi dependency project', status: '❌ MISSING' });
  }
} catch (error) {
  checks.push({ name: 'ReactNativeDeviceAi dependency project', status: '❌ ERROR' });
}

// Display results
console.log('Autolink Configuration Checks:');
console.log('==============================');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
});

const passed = checks.filter(check => check.status.includes('✅')).length;
const failed = checks.filter(check => check.status.includes('❌')).length;

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All autolink fixes are properly configured!');
  console.log('\n💡 Next steps:');
  console.log('   1. On Windows: npm run windows-manual');
  console.log('   2. Or open windows\\ReactNativeDeviceAiExample.sln in Visual Studio');
  console.log('   3. Build in Debug x64 configuration');
  process.exit(0);
} else {
  console.log('❌ Some autolink configuration issues detected.');
  console.log('   Please check the files mentioned above.');
  process.exit(1);
}