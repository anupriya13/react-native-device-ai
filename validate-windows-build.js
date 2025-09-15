#!/usr/bin/env node

/**
 * Windows Build Validation Script
 * 
 * This script validates the Windows build configuration for ReactNativeDeviceAiExample.sln
 * and identifies potential build issues before compilation.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Windows Build Configuration...\n');

const checks = [];

// 1. Check if critical files exist
const criticalFiles = [
  'example/windows/ReactNativeDeviceAiExample.sln',
  'example/windows/ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
  'windows/ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj',
  'windows/ReactNativeDeviceAi/ReactNativeDeviceAi.cpp',
  'windows/ReactNativeDeviceAi/ReactNativeDeviceAi.h',
  'windows/ReactNativeDeviceAi/codegen/NativeDeviceAISpecSpec.g.h',
  'src/NativeDeviceAISpec.ts'
];

criticalFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({
    name: `File exists: ${file}`,
    status: exists ? 'PASS' : 'FAIL',
    issue: exists ? null : `Missing critical file: ${file}`
  });
});

// 2. Check for deprecated API usage
const cppFile = 'windows/ReactNativeDeviceAi/ReactNativeDeviceAi.cpp';
if (fs.existsSync(cppFile)) {
  const cppContent = fs.readFileSync(cppFile, 'utf8');
  
  // Check for deprecated APIs
  const deprecatedAPIs = ['GetVersionExW', 'WINRT_CanUnloadNow', 'WINRT_GetActivationFactory'];
  const foundDeprecated = deprecatedAPIs.filter(api => cppContent.includes(api));
  
  checks.push({
    name: 'No deprecated Windows APIs',
    status: foundDeprecated.length === 0 ? 'PASS' : 'FAIL',
    issue: foundDeprecated.length > 0 ? `Found deprecated APIs: ${foundDeprecated.join(', ')}` : null
  });
  
  // Check for modern APIs
  const modernAPIs = ['RtlGetVersion', 'PowerManager', 'GetSystemPowerStatus'];
  const foundModern = modernAPIs.filter(api => cppContent.includes(api));
  
  checks.push({
    name: 'Uses modern Windows APIs',
    status: foundModern.length >= 2 ? 'PASS' : 'WARN',
    issue: foundModern.length < 2 ? `Limited modern API usage: ${foundModern.join(', ')}` : null
  });
}

// 3. Check project file configuration
const vcxprojFile = 'windows/ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj';
if (fs.existsSync(vcxprojFile)) {
  const vcxprojContent = fs.readFileSync(vcxprojFile, 'utf8');
  
  // Check for WinRT DLL configuration (should be removed)
  const hasWinRTDLL = vcxprojContent.includes('_WINRT_DLL');
  checks.push({
    name: 'No WinRT DLL configuration',
    status: !hasWinRTDLL ? 'PASS' : 'FAIL',
    issue: hasWinRTDLL ? 'Project still configured as WinRT DLL (should be removed)' : null
  });
  
  // Check for codegen files inclusion
  const hasCodegen = vcxprojContent.includes('NativeDeviceAISpecSpec.g.h');
  checks.push({
    name: 'Codegen files included',
    status: hasCodegen ? 'PASS' : 'FAIL',
    issue: !hasCodegen ? 'Codegen header files not included in project' : null
  });
  
  // Check for module.g.cpp (should NOT be included)
  const hasModuleGCpp = vcxprojContent.includes('module.g.cpp');
  checks.push({
    name: 'No module.g.cpp reference',
    status: !hasModuleGCpp ? 'PASS' : 'FAIL',
    issue: hasModuleGCpp ? 'module.g.cpp should not be referenced in project file' : null
  });
}

// 4. Check autolink files
const autolinkFiles = [
  'example/windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.cpp',
  'example/windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.h'
];

autolinkFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({
    name: `Autolink file exists: ${path.basename(file)}`,
    status: exists ? 'PASS' : 'WARN',
    issue: exists ? null : `${file} missing - run autolink on Windows`
  });
});

// 5. Check package.json for infinite loop
const examplePackage = 'example/package.json';
if (fs.existsSync(examplePackage)) {
  const packageContent = JSON.parse(fs.readFileSync(examplePackage, 'utf8'));
  const hasInstallLoop = packageContent.scripts && packageContent.scripts.install;
  
  checks.push({
    name: 'No infinite install loop',
    status: !hasInstallLoop ? 'PASS' : 'FAIL',
    issue: hasInstallLoop ? 'Remove "install" script from example/package.json to prevent infinite loop' : null
  });
}

// 6. Check dependencies
const rootPackage = 'package.json';
if (fs.existsSync(rootPackage)) {
  const packageContent = JSON.parse(fs.readFileSync(rootPackage, 'utf8'));
  const hasBabelCLI = packageContent.devDependencies && packageContent.devDependencies['@babel/cli'];
  
  checks.push({
    name: 'Babel CLI available',
    status: hasBabelCLI ? 'PASS' : 'FAIL',
    issue: !hasBabelCLI ? 'Missing @babel/cli in devDependencies' : null
  });
}

// Output results
console.log('📋 Build Validation Results:\n');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

checks.forEach(check => {
  const icon = check.status === 'PASS' ? '✅' : 
               check.status === 'FAIL' ? '❌' : '⚠️ ';
  
  console.log(`${icon} ${check.name}`);
  if (check.issue) {
    console.log(`   ${check.issue}`);
  }
  
  if (check.status === 'PASS') passCount++;
  else if (check.status === 'FAIL') failCount++;
  else warnCount++;
});

console.log(`\n📊 Summary: ${passCount} passed, ${failCount} failed, ${warnCount} warnings\n`);

// Recommendations
if (failCount > 0 || warnCount > 0) {
  console.log('🔧 Recommendations:');
  
  if (failCount > 0) {
    console.log('1. Fix all FAILED checks before attempting Windows build');
  }
  
  if (warnCount > 0) {
    console.log('2. Address WARNING items for optimal build experience');
  }
  
  console.log('3. Ensure you\'re on a Windows machine with Visual Studio 2022');
  console.log('4. Run "npm install" in example directory (not yarn)');
  console.log('5. Build the solution: npm run windows');
  console.log('\n📖 See EXAMPLE_APP_FIXES.md for detailed troubleshooting');
} else {
  console.log('🎉 All checks passed! The Windows build should compile successfully.');
  console.log('\n🚀 To build and run:');
  console.log('   cd example');
  console.log('   npm install');
  console.log('   npm run windows');
}

process.exit(failCount > 0 ? 1 : 0);