#!/usr/bin/env node
/**
 * Ultimate fix for React Native Windows CLI detection issues
 * 
 * This script provides multiple approaches to overcome the 
 * "Couldn't determine Windows app config" error in React Native 0.79
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🔧 Ultimate Windows CLI Detection Fix\n');

/**
 * Approach 1: Force CLI detection with explicit paths
 */
function forceCliDetection() {
  console.log('1️⃣  Attempting to force CLI detection...');
  
  try {
    // Try with explicit solution and project file paths
    const result = execSync(`npx react-native run-windows --no-autolink --sln "windows\\ReactNativeDeviceAiExample.sln" --proj "windows\\ReactNativeDeviceAiExample\\ReactNativeDeviceAiExample.vcxproj" --logging`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('   ✅ CLI detection forced successfully!');
    return true;
  } catch (error) {
    console.log('   ❌ CLI detection still failing');
    console.log('   Error:', error.message.split('\\n')[0]);
    return false;
  }
}

/**
 * Approach 2: Use react-native-windows-init if needed
 */
function tryWindowsInit() {
  console.log('\\n2️⃣  Checking if Windows initialization is needed...');
  
  const packageJsonPath = path.join('windows', 'ReactNativeDeviceAiExample', 'ReactNativeDeviceAiExample.vcxproj');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('   ⚠️  Project file missing, attempting re-initialization...');
    
    try {
      execSync('npx react-native init-windows --template cpp-lib --overwrite', {
        stdio: 'inherit'
      });
      console.log('   ✅ Windows project re-initialized');
      return true;
    } catch (error) {
      console.log('   ❌ Re-initialization failed');
      return false;
    }
  } else {
    console.log('   ✅ Windows project files exist');
    return true;
  }
}

/**
 * Approach 3: Direct Metro + MSBuild approach
 */
function useDirectBuild() {
  console.log('\\n3️⃣  Setting up direct build approach...');
  
  const directRunner = `#!/usr/bin/env node
/**
 * Direct build runner that bypasses React Native CLI entirely
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting React Native Device AI Example (Direct Build)\\n');

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
      console.log('✅ Metro bundler started successfully\\n');
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
      console.log('\\n✅ Build successful!');
      console.log('🎯 Looking for built app...');
      
      // Try to launch the app
      setTimeout(launchApp, 2000);
    } else {
      console.log(\`\\n❌ Build failed with exit code \${code}\`);
      console.log('💡 Try opening the solution in Visual Studio for detailed error info');
      cleanup();
    }
  });
  
  msbuild.on('error', (err) => {
    console.log('\\n❌ MSBuild error:', err.message);
    console.log('💡 Make sure you have:');
    console.log('   - Visual Studio 2019/2022 with C++ development tools');
    console.log('   - Windows 10/11 SDK');
    console.log('   - MSBuild in your PATH');
    cleanup();
  });
}

function launchApp() {
  console.log('🚀 Attempting to launch app...');
  
  // Look for the built package
  const packageDir = path.resolve(__dirname, 'windows', 'ReactNativeDeviceAiExample.Package');
  const appPackagesDir = path.join(packageDir, 'AppPackages');
  
  if (fs.existsSync(appPackagesDir)) {
    console.log('📦 Package built successfully!');
    console.log(\`📁 Package location: \${appPackagesDir}\`);
    console.log('💡 To install and run:');
    console.log('   1. Navigate to the AppPackages folder');
    console.log('   2. Right-click on the .msix file');
    console.log('   3. Select "Install" or use Add-AppxPackage in PowerShell');
  } else {
    // Try to find executable directly
    const binDir = path.resolve(__dirname, 'windows', 'x64', 'Debug');
    console.log(\`🔍 Looking for executable in \${binDir}\`);
    
    if (fs.existsSync(binDir)) {
      const files = fs.readdirSync(binDir);
      const exeFiles = files.filter(f => f.endsWith('.exe'));
      
      if (exeFiles.length > 0) {
        console.log(\`🎯 Found executable: \${exeFiles[0]}\`);
        console.log('💡 The app was built successfully!');
      }
    }
  }
}

function cleanup() {
  console.log('\\n🛑 Cleaning up...');
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
    console.log('\\n⏰ Build timeout after 10 minutes');
    cleanup();
  }
}, 600000);
`;

  fs.writeFileSync('run-windows-direct.js', directRunner);
  console.log('   ✅ Created enhanced direct runner script');
  
  // Also create a simple MSBuild only script
  const msbuildOnly = `#!/usr/bin/env node
/**
 * MSBuild-only runner for when you just want to build
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Building with MSBuild only...\\n');

try {
  const windowsDir = path.resolve(__dirname, 'windows');
  
  console.log('📁 Working directory:', windowsDir);
  console.log('🏗️  Starting build...');
  
  execSync('msbuild ReactNativeDeviceAiExample.sln /p:Configuration=Debug /p:Platform=x64 /verbosity:normal', {
    cwd: windowsDir,
    stdio: 'inherit'
  });
  
  console.log('\\n✅ Build completed successfully!');
  console.log('💡 To run the app:');
  console.log('   - Check windows/x64/Debug/ for executable');
  console.log('   - Or install package from AppPackages folder');
  
} catch (error) {
  console.log('\\n❌ Build failed');
  console.log('Error:', error.message);
  process.exit(1);
}
`;

  fs.writeFileSync('build-windows-only.js', msbuildOnly);
  console.log('   ✅ Created MSBuild-only script');
}

/**
 * Approach 4: Create comprehensive troubleshooting guide
 */
function createTroubleshootingGuide() {
  console.log('\\n4️⃣  Creating troubleshooting guide...');
  
  const guide = `# Windows App Config Detection - Troubleshooting Guide

## Problem
React Native CLI showing: "Couldn't determine Windows app config"

## Root Cause
This error occurs when React Native CLI cannot detect the Windows project configuration, typically due to:
1. Missing or incorrect react-native.config.js
2. Incomplete Windows project initialization
3. React Native 0.79 CLI detection bugs
4. Missing Visual Studio components

## Solutions (Try in Order)

### Solution 1: Use Bypass Scripts
\`\`\`bash
# Try the direct build approach (recommended)
npm run windows-direct

# Or MSBuild only
npm run build-windows-only
\`\`\`

### Solution 2: Force CLI with Explicit Paths
\`\`\`bash
npx react-native run-windows --no-autolink \\
  --sln "windows\\ReactNativeDeviceAiExample.sln" \\
  --proj "windows\\ReactNativeDeviceAiExample\\ReactNativeDeviceAiExample.vcxproj"
\`\`\`

### Solution 3: Visual Studio Direct
1. Open \`windows/ReactNativeDeviceAiExample.sln\` in Visual Studio
2. Set \`ReactNativeDeviceAiExample.Package\` as startup project
3. Select Debug | x64 configuration
4. Press F5 to build and run

### Solution 4: Re-initialize Windows Project
\`\`\`bash
# Backup current windows folder
mv windows windows-backup

# Re-initialize
npx react-native init-windows --template cpp-lib --overwrite

# Restore custom modifications if any
\`\`\`

### Solution 5: Manual Package Installation
1. Build the solution in Visual Studio
2. Navigate to \`windows/ReactNativeDeviceAiExample.Package/AppPackages/\`
3. Find the .msix or .appx file
4. Right-click and select "Install"

## Verification
After successful build, you should see:
- ✅ Metro bundler running on port 8081
- ✅ Windows app launching
- ✅ React Native Device AI module accessible

## Prerequisites
Ensure you have:
- Visual Studio 2019/2022 with C++ development tools
- Windows 10/11 SDK (latest version)
- MSBuild in your system PATH
- Node.js and npm properly configured

## Common Issues

### "MSBuild not found"
- Install Visual Studio Build Tools
- Add MSBuild to your PATH
- Use Visual Studio Developer Command Prompt

### "Windows SDK not found"
- Install Windows 10/11 SDK via Visual Studio Installer
- Ensure latest version is selected

### "Package deployment failed"
- Enable Developer Mode in Windows Settings
- Run PowerShell as Administrator
- Clear existing app installations

## Support
If all solutions fail, this may be a React Native 0.79 Windows CLI bug.
Consider using Visual Studio IDE directly or downgrading to React Native 0.72.
`;

  fs.writeFileSync('WINDOWS_CLI_TROUBLESHOOTING.md', guide);
  console.log('   ✅ Created comprehensive troubleshooting guide');
}

/**
 * Update package.json with all the new scripts
 */
function updatePackageScripts() {
  console.log('\\n5️⃣  Updating package.json scripts...');
  
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    'windows-direct': 'node run-windows-direct.js',
    'build-windows-only': 'node build-windows-only.js',
    'windows-force': 'npx react-native run-windows --no-autolink --sln "windows\\\\ReactNativeDeviceAiExample.sln" --proj "windows\\\\ReactNativeDeviceAiExample\\\\ReactNativeDeviceAiExample.vcxproj"',
    'windows-troubleshoot': 'node ultimate-windows-fix.js',
    'fix-windows-cli': 'node ultimate-windows-fix.js'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('   ✅ Updated package.json with bypass scripts');
}

/**
 * Main execution
 */
async function main() {
  console.log('🎯 Fixing "Couldn\'t determine Windows app config" error\n');
  
  // Try the direct CLI approach first
  const cliWorked = forceCliDetection();
  
  if (!cliWorked) {
    console.log('\\n📝 CLI approach failed, setting up alternatives...');
    
    // Set up alternative approaches
    useDirectBuild();
    createTroubleshootingGuide();
    updatePackageScripts();
    
    console.log('\\n✅ Alternative solutions configured!');
    console.log('\\n🚀 Quick Start Options:');
    console.log('   1. npm run windows-direct     (Recommended)');
    console.log('   2. npm run build-windows-only (Build only)');
    console.log('   3. Open Visual Studio and build manually');
    console.log('\\n📚 See WINDOWS_CLI_TROUBLESHOOTING.md for detailed guide');
  } else {
    console.log('\\n✅ CLI detection working! You can use:');
    console.log('   npx react-native run-windows --no-autolink');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };