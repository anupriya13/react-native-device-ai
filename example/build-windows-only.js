#!/usr/bin/env node
/**
 * MSBuild-only runner for when you just want to build
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Building with MSBuild only...\n');

try {
  const windowsDir = path.resolve(__dirname, 'windows');
  
  console.log('📁 Working directory:', windowsDir);
  console.log('🏗️  Starting build...');
  
  execSync('msbuild ReactNativeDeviceAiExample.sln /p:Configuration=Debug /p:Platform=x64 /verbosity:normal', {
    cwd: windowsDir,
    stdio: 'inherit'
  });
  
  console.log('\n✅ Build completed successfully!');
  console.log('💡 To run the app:');
  console.log('   - Check windows/x64/Debug/ for executable');
  console.log('   - Or install package from AppPackages folder');
  
} catch (error) {
  console.log('\n❌ Build failed');
  console.log('Error:', error.message);
  process.exit(1);
}
