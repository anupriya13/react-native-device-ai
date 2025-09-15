const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Debugging React Native CLI Windows Detection ===');

// Check if this looks like a React Native project
console.log('\n1. Checking if package.json has react-native dependency:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('   react-native:', packageJson.dependencies['react-native']);
console.log('   react-native-windows:', packageJson.dependencies['react-native-windows']);

// Check if react-native.config.js exists and is valid
console.log('\n2. Checking react-native.config.js:');
try {
  const config = require('./react-native.config.js');
  console.log('   Config loaded successfully');
  console.log('   Windows project config:', JSON.stringify(config.project?.windows, null, 4));
  console.log('   Windows dependency config:', JSON.stringify(config.dependencies?.['react-native-device-ai']?.platforms?.windows, null, 4));
} catch (e) {
  console.log('   Error loading config:', e.message);
}

// Check if Windows files exist
console.log('\n3. Checking Windows project files:');
const windowsDir = 'windows';
const slnFile = path.join(windowsDir, 'ReactNativeDeviceAiExample.sln');
const projFile = path.join(windowsDir, 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj');

console.log('   Windows directory exists:', fs.existsSync(windowsDir));
console.log('   Solution file exists:', fs.existsSync(slnFile));
console.log('   Project file exists:', fs.existsSync(projFile));

// Check if app.json exists
console.log('\n4. Checking app.json:');
console.log('   app.json exists:', fs.existsSync('app.json'));
if (fs.existsSync('app.json')) {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  console.log('   app.json content:', JSON.stringify(appJson, null, 4));
}

// Try to load React Native CLI config
console.log('\n5. Checking React Native CLI config:');
try {
  const result = execSync('npx @react-native-community/cli config', { encoding: 'utf8' });
  const config = JSON.parse(result);
  console.log('   CLI config project:', JSON.stringify(config.project, null, 4));
  console.log('   CLI config platforms:', JSON.stringify(config.platforms, null, 4));
} catch (e) {
  console.log('   Error getting CLI config:', e.message);
}