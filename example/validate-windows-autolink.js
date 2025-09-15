#!/usr/bin/env node

// Windows Build Validation Script
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Windows Build Configuration...');

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
  }
];

let passed = 0;
let failed = 0;

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
    console.log(`❌ ${index + 1}. ${check.name} - Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All checks passed! The Windows project should build successfully.');
  console.log('\nTo build the project, run:');
  console.log('  npm run windows');
} else {
  console.log('⚠️ Some checks failed. Please review the errors above.');
}
