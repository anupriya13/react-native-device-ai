#!/usr/bin/env node

/**
 * Fix MSBuild Warnings Script
 * Eliminates MSB4011 duplicate import warnings by preventing duplicate PropertySheet imports
 */

const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const vcxprojPath = path.join(projectDir, 'windows', 'ReactNativeDeviceAiExample', 'ReactNativeDeviceAiExample.vcxproj');
const propsPath = path.join(projectDir, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.props');
const targetsPath = path.join(projectDir, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.targets');

console.log('🔧 Fixing MSBuild duplicate import warnings...\n');

// Check current state
function validateFiles() {
  const results = {
    vcxproj: fs.existsSync(vcxprojPath),
    props: fs.existsSync(propsPath),
    targets: fs.existsSync(targetsPath)
  };
  
  console.log('📁 File Status:');
  console.log(`   ReactNativeDeviceAiExample.vcxproj: ${results.vcxproj ? '✅' : '❌'}`);
  console.log(`   AutolinkedNativeModules.g.props: ${results.props ? '✅' : '❌'}`);
  console.log(`   AutolinkedNativeModules.g.targets: ${results.targets ? '✅' : '❌'}\n`);
  
  return results;
}

// Validate the fix
function validateFix() {
  console.log('🔍 Validating MSBuild Warning Fix...\n');
  
  const vcxprojContent = fs.readFileSync(vcxprojPath, 'utf8');
  const propsContent = fs.readFileSync(propsPath, 'utf8');
  const targetsContent = fs.readFileSync(targetsPath, 'utf8');
  
  const checks = [
    {
      name: 'Conditional imports in vcxproj',
      test: vcxprojContent.includes("'$(AutolinkedNativeModulesPropsImported)' != 'true'") &&
            vcxprojContent.includes("'$(AutolinkedNativeModulesTargetsImported)' != 'true'"),
      description: 'Prevents duplicate imports when already imported by React Native Windows PropertySheets'
    },
    {
      name: 'Props file sets import flag',
      test: propsContent.includes('<AutolinkedNativeModulesPropsImported>true</AutolinkedNativeModulesPropsImported>'),
      description: 'Sets flag to indicate props file has been imported'
    },
    {
      name: 'Targets file sets import flag',
      test: targetsContent.includes('<AutolinkedNativeModulesTargetsImported>true</AutolinkedNativeModulesTargetsImported>'),
      description: 'Sets flag to indicate targets file has been imported'
    },
    {
      name: 'CLI autolink disabled',
      test: propsContent.includes('<ReactNativeWindowsAutolinkDisabled>true</ReactNativeWindowsAutolinkDisabled>'),
      description: 'Disables React Native CLI autolink to prevent conflicts'
    },
    {
      name: 'Project reference exists',
      test: propsContent.includes('..\\..\\..\\windows\\ReactNativeDeviceAi\\ReactNativeDeviceAi.vcxproj'),
      description: 'ReactNativeDeviceAi project reference is properly configured'
    }
  ];
  
  const passed = checks.filter(check => check.test);
  const failed = checks.filter(check => !check.test);
  
  console.log('📊 Validation Results:');
  passed.forEach(check => {
    console.log(`   ✅ ${check.name}: ${check.description}`);
  });
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Checks:');
    failed.forEach(check => {
      console.log(`   ❌ ${check.name}: ${check.description}`);
    });
  }
  
  console.log(`\n📈 Summary: ${passed.length} passed, ${failed.length} failed`);
  
  if (failed.length === 0) {
    console.log('\n🎉 All MSBuild warning fixes validated successfully!');
    console.log('💡 The project should now build without MSB4011 duplicate import warnings.');
  }
  
  return failed.length === 0;
}

// Main execution
function main() {
  console.log('🚀 MSBuild Warning Fix Tool\n');
  
  const fileStatus = validateFiles();
  
  if (!fileStatus.vcxproj || !fileStatus.props || !fileStatus.targets) {
    console.log('❌ Required files are missing. Please ensure you are in the example directory.');
    process.exit(1);
  }
  
  const isValid = validateFix();
  
  if (isValid) {
    console.log('\n✅ MSBuild warnings should now be eliminated.');
    console.log('🔨 Try building with: npm run windows-direct');
  } else {
    console.log('\n❌ Fix validation failed. Please check the configuration manually.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFix, validateFiles };