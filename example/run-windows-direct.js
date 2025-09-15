#!/usr/bin/env node
/**
 * Direct build runner that bypasses React Native CLI entirely
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting React Native Device AI Example (Direct Build)\n');

let metroStarted = false;
let buildCompleted = false;

// Step 1: Start Metro bundler
console.log('📦 Starting Metro bundler...');
const metro = spawn('npx', ['react-native', 'start', '--reset-cache'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

metro.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Metro') || output.includes('Welcome')) {
    if (!metroStarted) {
      console.log('✅ Metro bundler started successfully\n');
      metroStarted = true;
      
      // Wait a bit, then start build
      setTimeout(startBuild, 3000);
    }
  }
  // Optionally show metro output
  // process.stdout.write(output);
});

metro.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('error') || output.includes('Error')) {
    console.error('Metro error:', output);
  }
});

function startBuild() {
  console.log('🔨 Building Windows app with MSBuild...');
  
  const windowsDir = path.resolve(__dirname, 'windows');
  const solutionFile = 'ReactNativeDeviceAiExample.sln';
  
  const buildArgs = [
    solutionFile,
    '/p:Configuration=Debug',
    '/p:Platform=x64',
    '/p:AppxBundle=Never',
    '/p:UseBundle=false',
    '/verbosity:normal',
    '/maxcpucount:1'  // Single CPU to avoid conflicts
  ];
  
  const msbuild = spawn('msbuild', buildArgs, {
    cwd: windowsDir,
    stdio: 'inherit',
    shell: true
  });
  
  msbuild.on('exit', (code) => {
    buildCompleted = true;
    
    if (code === 0) {
      console.log('\n✅ Build successful!');
      console.log('🎯 Looking for built app...');
      
      // Try to launch the app
      setTimeout(launchApp, 2000);
    } else {
      console.log(`\n❌ Build failed with exit code ${code}`);
      console.log('💡 Try opening the solution in Visual Studio for detailed error info');
      cleanup();
    }
  });
  
  msbuild.on('error', (err) => {
    console.log('\n❌ MSBuild error:', err.message);
    console.log('💡 Make sure you have:');
    console.log('   - Visual Studio 2019/2022 with C++ development tools');
    console.log('   - Windows 10/11 SDK');
    console.log('   - MSBuild in your PATH');
    cleanup();
  });
}

function launchApp() {
  const fs = require('fs');
  console.log('🚀 Attempting to launch app...');
  
  // Look for the built package
  const packageDir = path.resolve(__dirname, 'windows', 'ReactNativeDeviceAiExample.Package');
  const appPackagesDir = path.join(packageDir, 'AppPackages');
  
  if (fs.existsSync(appPackagesDir)) {
    console.log('📦 Package built successfully!');
    console.log(`📁 Package location: ${appPackagesDir}`);
    console.log('💡 To install and run:');
    console.log('   1. Navigate to the AppPackages folder');
    console.log('   2. Right-click on the .msix file');
    console.log('   3. Select "Install" or use Add-AppxPackage in PowerShell');
  } else {
    // Try to find executable directly
    const binDir = path.resolve(__dirname, 'windows', 'x64', 'Debug');
    console.log(`🔍 Looking for executable in ${binDir}`);
    
    if (fs.existsSync(binDir)) {
      const files = fs.readdirSync(binDir);
      const exeFiles = files.filter(f => f.endsWith('.exe'));
      
      if (exeFiles.length > 0) {
        console.log(`🎯 Found executable: ${exeFiles[0]}`);
        console.log('💡 The app was built successfully!');
      }
    }
  }
}

function cleanup() {
  console.log('\n🛑 Cleaning up...');
  if (metro && !metro.killed) {
    metro.kill('SIGTERM');
  }
  process.exit();
}

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Timeout after 10 minutes
setTimeout(() => {
  if (!buildCompleted) {
    console.log('\n⏰ Build timeout after 10 minutes');
    cleanup();
  }
}, 600000);
