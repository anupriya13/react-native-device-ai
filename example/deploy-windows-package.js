#!/usr/bin/env node
/**
 * Package deployment runner for Windows
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('📦 Deploying Windows package...');

try {
  const windowsDir = path.resolve(__dirname, 'windows');
  const packageDir = path.join(windowsDir, 'ReactNativeDeviceAiExample.Package');
  
  if (fs.existsSync(packageDir)) {
    console.log('🎯 Found package directory, using Add-AppxPackage...');
    
    // Look for .msix or .appx files
    const files = fs.readdirSync(path.join(packageDir, 'AppPackages'));
    console.log('📋 Available packages:', files);
    
    // You can add PowerShell deployment logic here
    console.log('💡 To deploy manually, run:');
    console.log('   Add-AppxPackage -Path "path/to/package.msix" -ForceApplicationShutdown');
  } else {
    console.log('❌ Package directory not found. Build the solution first.');
  }
} catch (error) {
  console.log('❌ Deployment error:', error.message);
}
