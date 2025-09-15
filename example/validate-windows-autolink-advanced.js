#!/usr/bin/env node

// Enhanced Windows Build Validation Script
const fs = require('fs');
const path = require('path');

console.log('🔍 Enhanced Windows Build Configuration Validation...');

const checks = [
  {
    name: 'Solution file exists',
    test: () => fs.existsSync('windows/ReactNativeDeviceAiExample.sln')
  },
  {
    name: 'Project file exists', 
    test: () => fs.existsSync('windows/ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj')
  },
  {
    name: 'AutolinkedNativeModules.g.props exists',
    test: () => fs.existsSync('windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.props')
  },
  {
    name: 'AutolinkedNativeModules.g.targets exists',
    test: () => fs.existsSync('windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.targets')
  },
  {
    name: 'AutolinkedNativeModules.g.cpp exists',
    test: () => fs.existsSync('windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.cpp')
  },
  {
    name: 'AutolinkedNativeModules.g.h exists',
    test: () => fs.existsSync('windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.h')
  },
  {
    name: 'Dependency project exists',
    test: () => fs.existsSync('../windows/ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj')
  },
  {
    name: 'react-native dependency in package.json',
    test: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.dependencies && pkg.dependencies['react-native'];
    }
  },
  {
    name: 'react-native-windows dependency in package.json',
    test: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.dependencies && pkg.dependencies['react-native-windows'];
    }
  },
  {
    name: 'react-native.config.js exists',
    test: () => fs.existsSync('react-native.config.js')
  },
  {
    name: 'Project has ReactNativeDeviceAi reference',
    test: () => {
      const content = fs.readFileSync('windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.props', 'utf8');
      return content.includes('{8D427E1F-1E62-4E19-BB90-8CFDB762014D}');
    }
  },
  {
    name: 'Project file has optimized autolink imports',
    test: () => {
      const content = fs.readFileSync('windows/ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj', 'utf8');
      return content.includes('DisableAutolinkedNativeModules');
    }
  }
];

let passed = 0;
let failed = 0;
let warnings = 0;

checks.forEach((check, index) => {
  try {
    const result = check.test();
    if (result) {
      console.log(`✅ ${index + 1}. ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${index + 1}. ${check.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`⚠️ ${index + 1}. ${check.name} - Warning: ${error.message}`);
    warnings++;
  }
});

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed, ${warnings} warnings`);

if (failed === 0) {
  console.log('🎉 All critical checks passed! The Windows project should build successfully.');
  console.log('\n🚀 To build the project:');
  console.log('  npm run windows');
  console.log('\n💡 This configuration bypasses the CLI autolink detection issues.');
  console.log('   You may see "NoWindowsConfig" warnings, but they can be safely ignored.');
} else {
  console.log('⚠️ Some checks failed. Please review the errors above.');
  console.log('\n🔧 To fix issues, run:');
  console.log('  node fix-windows-autolink-advanced.js');
}
