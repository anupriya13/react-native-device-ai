#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Windows Example Build Configuration...\n');

let passed = 0;
let failed = 0;
let warnings = 0;

function checkPass(description, condition) {
  if (condition) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
}

function checkWarning(description, condition) {
  if (condition) {
    console.log(`⚠️  ${description}`);
    warnings++;
  }
}

// Check 1: Solution file exists
const solutionPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample.sln');
checkPass('Solution file exists', fs.existsSync(solutionPath));

// Check 2: Main project file exists
const mainProjectPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'ReactNativeDeviceAiExample.vcxproj');
checkPass('Main project file exists', fs.existsSync(mainProjectPath));

// Check 3: TurboModule project is referenced
if (fs.existsSync(solutionPath)) {
  const solutionContent = fs.readFileSync(solutionPath, 'utf8');
  checkPass('ReactNativeDeviceAi project referenced in solution', 
    solutionContent.includes('ReactNativeDeviceAi\\ReactNativeDeviceAi.vcxproj'));
  checkPass('ReactNativeDeviceAi project GUID is correct', 
    solutionContent.includes('{8D427E1F-1E62-4E19-BB90-8CFDB762014D}'));
}

// Check 4: Autolinked files exist
const autolinkedH = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.h');
const autolinkedCpp = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.cpp');
const autolinkedProps = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.props');
const autolinkedTargets = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'AutolinkedNativeModules.g.targets');

checkPass('AutolinkedNativeModules.g.h exists', fs.existsSync(autolinkedH));
checkPass('AutolinkedNativeModules.g.cpp exists', fs.existsSync(autolinkedCpp));
checkPass('AutolinkedNativeModules.g.props exists', fs.existsSync(autolinkedProps));
checkPass('AutolinkedNativeModules.g.targets exists', fs.existsSync(autolinkedTargets));

// Check 5: Autolinked files have correct content
if (fs.existsSync(autolinkedCpp)) {
  const autolinkedContent = fs.readFileSync(autolinkedCpp, 'utf8');
  checkPass('AutolinkedNativeModules.g.cpp references ReactNativeDeviceAi', 
    autolinkedContent.includes('ReactNativeDeviceAi::ReactPackageProvider'));
  checkPass('AutolinkedNativeModules.g.cpp has proper includes', 
    autolinkedContent.includes('winrt/ReactNativeDeviceAi.h'));
}

// Check 6: React Native config has correct references
const configPath = path.join(__dirname, 'react-native.config.js');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  checkPass('react-native.config.js references correct solution file', 
    configContent.includes('ReactNativeDeviceAi.sln'));
  checkPass('react-native.config.js references correct project file', 
    configContent.includes('ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj'));
}

// Check 7: TurboModule source exists
const turboModulePath = path.join(__dirname, '..', 'windows', 'ReactNativeDeviceAi', 'ReactNativeDeviceAi.cpp');
const turboModuleProject = path.join(__dirname, '..', 'windows', 'ReactNativeDeviceAi', 'ReactNativeDeviceAi.vcxproj');
checkPass('TurboModule source file exists', fs.existsSync(turboModulePath));
checkPass('TurboModule project file exists', fs.existsSync(turboModuleProject));

// Check 8: Project dependencies
if (fs.existsSync(mainProjectPath)) {
  const projectContent = fs.readFileSync(mainProjectPath, 'utf8');
  checkPass('Main project imports autolinked props', 
    projectContent.includes('AutolinkedNativeModules.g.props'));
  checkPass('Main project imports autolinked targets', 
    projectContent.includes('AutolinkedNativeModules.g.targets'));
}

// Check 9: Package.json has required dependencies
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  checkPass('react-native-windows dependency exists', 
    packageContent.dependencies && packageContent.dependencies['react-native-windows']);
  checkPass('react-native dependency exists', 
    packageContent.dependencies && packageContent.dependencies['react-native']);
}

// Check 10: Codegen files exist
const codegenPath = path.join(__dirname, '..', 'windows', 'ReactNativeDeviceAi', 'codegen');
const codegenSpecPath = path.join(codegenPath, 'NativeDeviceAISpecSpec.g.h');
checkPass('Codegen directory exists', fs.existsSync(codegenPath));
if (fs.existsSync(codegenPath)) {
  checkPass('Codegen spec file exists', fs.existsSync(codegenSpecPath));
}

// Check for potential issues
if (fs.existsSync(turboModulePath)) {
  const turboModuleContent = fs.readFileSync(turboModulePath, 'utf8');
  checkWarning('TurboModule uses deprecated GetVersionExW', 
    turboModuleContent.includes('GetVersionExW'));
  checkWarning('TurboModule has WinRT exports that might cause linker errors', 
    turboModuleContent.includes('WINRT_CanUnloadNow') || turboModuleContent.includes('WINRT_GetActivationFactory'));
}

console.log('\n📊 Summary:');
console.log(`   ${passed} passed, ${failed} failed, ${warnings} warnings`);

if (failed === 0 && warnings === 0) {
  console.log('🎉 All checks passed! The Windows example build should compile successfully.');
} else if (failed === 0) {
  console.log('⚠️  All critical checks passed, but there are warnings to address.');
} else {
  console.log('❌ Some critical checks failed. The build may not succeed.');
}

process.exit(failed > 0 ? 1 : 0);