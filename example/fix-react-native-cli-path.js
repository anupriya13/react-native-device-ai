#!/usr/bin/env node
/**
 * Fix for React Native CLI path resolution issues
 * 
 * This script fixes the MSB1009 error where MSBuild can't find the project file
 * due to path duplication issues in React Native CLI 0.79
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🔧 Fixing React Native CLI Path Resolution Issues...\n');

/**
 * Step 1: Validate and fix react-native.config.js paths
 */
function fixReactNativeConfig() {
  console.log('1️⃣  Fixing react-native.config.js path configuration...');
  
  const configPath = 'react-native.config.js';
  
  // Create a corrected configuration with absolute paths
  const fixedConfig = `const path = require('path');

module.exports = {
  // Dependencies configuration
  dependencies: {
    'react-native-device-ai': {
      platforms: {
        windows: {
          sourceDir: '../windows',
          solutionFile: 'ReactNativeDeviceAi.sln',
          projectFile: 'ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj',
        },
      },
    },
  },
  
  // Project configuration - corrected paths to prevent duplication
  project: {
    windows: {
      sourceDir: './windows',  // Use relative path to prevent duplication
      solutionFile: 'ReactNativeDeviceAiExample.sln',
      projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
      experimentalNuGetDependency: false,
      useWinUI3: false,
      // Additional properties for better CLI detection
      projectName: 'ReactNativeDeviceAiExample',
      projectGuid: '{2AB167A1-C158-4721-B131-093D7987CEA9}',
      projectLang: 'cpp',
    },
  },
  
  // Platform configuration
  platforms: {
    windows: {
      npmPackageName: 'react-native-windows',
    },
  },
  
  // Assets configuration
  assets: ['./assets/'],
};`;

  fs.writeFileSync(configPath, fixedConfig);
  console.log('   ✅ Fixed react-native.config.js with corrected paths\n');
}

/**
 * Step 2: Create a wrapper script that fixes CLI path issues
 */
function createCliWrapper() {
  console.log('2️⃣  Creating CLI wrapper to fix path resolution...');
  
  const wrapperScript = `#!/usr/bin/env node
/**
 * React Native CLI wrapper that fixes path resolution issues
 */

const { spawn } = require('child_process');
const path = require('path');

// Get the current working directory
const cwd = process.cwd();
const windowsDir = path.join(cwd, 'windows');
const solutionFile = path.join(windowsDir, 'ReactNativeDeviceAiExample.sln');
const projectFile = path.join(windowsDir, 'ReactNativeDeviceAiExample', 'ReactNativeDeviceAiExample.vcxproj');

console.log('🚀 Starting React Native Windows app with path fix...');
console.log('📁 Working directory:', cwd);
console.log('🏗️  Solution file:', solutionFile);
console.log('📄 Project file:', projectFile);

// Start Metro bundler first
console.log('\\n📦 Starting Metro bundler...');
const metro = spawn('npx', ['react-native', 'start'], {
  stdio: 'pipe',
  shell: true
});

let metroReady = false;

metro.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Metro') || output.includes('Welcome')) {
    if (!metroReady) {
      console.log('✅ Metro bundler is ready');
      metroReady = true;
      setTimeout(startWindowsBuild, 3000);
    }
  }
});

metro.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('error') || output.includes('ERROR')) {
    console.error('Metro error:', output);
  }
});

function startWindowsBuild() {
  console.log('\\n🔨 Starting Windows build with corrected paths...');
  
  // Use explicit paths to avoid CLI path resolution issues
  const args = [
    'react-native', 'run-windows',
    '--no-autolink',
    '--no-packager',  // Metro is already running
    '--sln', \`"\${path.relative(cwd, solutionFile)}"\`,
    '--proj', \`"\${path.relative(cwd, projectFile)}"\`,
    '--arch', 'x64',
    '--logging'
  ];
  
  console.log('🎯 Command:', 'npx', args.join(' '));
  
  const rnWindows = spawn('npx', args, {
    stdio: 'inherit',
    shell: true,
    cwd: cwd
  });
  
  rnWindows.on('exit', (code) => {
    if (code === 0) {
      console.log('\\n✅ Windows app built and launched successfully!');
    } else {
      console.log(\`\\n❌ Build failed with exit code \${code}\`);
      console.log('💡 Try using the direct build approach instead:');
      console.log('   npm run windows-direct');
    }
    
    // Clean up Metro
    metro.kill();
  });
  
  rnWindows.on('error', (err) => {
    console.log('\\n❌ CLI error:', err.message);
    console.log('💡 Falling back to direct build approach...');
    metro.kill();
    
    // Fallback to MSBuild directly
    fallbackToBuild();
  });
}

function fallbackToBuild() {
  console.log('\\n🔄 Using MSBuild fallback...');
  
  const { spawn } = require('child_process');
  
  const msbuild = spawn('msbuild', [
    'ReactNativeDeviceAiExample.sln',
    '/p:Configuration=Debug',
    '/p:Platform=x64',
    '/verbosity:normal'
  ], {
    cwd: windowsDir,
    stdio: 'inherit',
    shell: true
  });
  
  msbuild.on('exit', (code) => {
    if (code === 0) {
      console.log('\\n✅ MSBuild completed successfully!');
      console.log('💡 The app package should be available in:');
      console.log('   windows/ReactNativeDeviceAiExample.Package/AppPackages/');
    } else {
      console.log(\`\\n❌ MSBuild failed with exit code \${code}\`);
    }
  });
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping services...');
  if (metro && !metro.killed) {
    metro.kill();
  }
  process.exit();
});

process.on('SIGTERM', () => {
  if (metro && !metro.killed) {
    metro.kill();
  }
  process.exit();
});
`;

  fs.writeFileSync('run-windows-fixed.js', wrapperScript);
  console.log('   ✅ Created CLI wrapper script: run-windows-fixed.js\n');
}

/**
 * Step 3: Create a simpler alternative that bypasses CLI entirely
 */
function createSimpleAlternative() {
  console.log('3️⃣  Creating simple alternative that bypasses CLI...');
  
  const simpleScript = `#!/usr/bin/env node
/**
 * Simple Windows runner that completely bypasses React Native CLI
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Simple Windows App Runner\\n');

// Check prerequisites
function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  const windowsDir = path.join(__dirname, 'windows');
  const solutionFile = path.join(windowsDir, 'ReactNativeDeviceAiExample.sln');
  
  if (!fs.existsSync(solutionFile)) {
    console.log('❌ Windows solution file not found');
    console.log('💡 Make sure you have run Windows initialization');
    process.exit(1);
  }
  
  try {
    execSync('msbuild /?', { stdio: 'pipe' });
    console.log('✅ MSBuild is available');
  } catch (error) {
    console.log('❌ MSBuild not found in PATH');
    console.log('💡 Install Visual Studio Build Tools or use Developer Command Prompt');
    process.exit(1);
  }
  
  console.log('✅ Prerequisites check passed\\n');
}

// Start Metro
function startMetro() {
  return new Promise((resolve) => {
    console.log('📦 Starting Metro bundler...');
    
    const metro = spawn('npx', ['react-native', 'start'], {
      stdio: 'pipe',
      shell: true
    });
    
    metro.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Metro') || output.includes('Welcome')) {
        console.log('✅ Metro bundler started\\n');
        resolve(metro);
      }
    });
    
    metro.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('error')) {
        console.error('Metro error:', output);
      }
    });
  });
}

// Build with MSBuild
function buildApp() {
  return new Promise((resolve, reject) => {
    console.log('🔨 Building Windows app...');
    
    const windowsDir = path.join(__dirname, 'windows');
    
    const msbuild = spawn('msbuild', [
      'ReactNativeDeviceAiExample.sln',
      '/p:Configuration=Debug',
      '/p:Platform=x64',
      '/p:AppxBundle=Never',
      '/verbosity:minimal',
      '/m:1'
    ], {
      cwd: windowsDir,
      stdio: 'inherit',
      shell: true
    });
    
    msbuild.on('exit', (code) => {
      if (code === 0) {
        console.log('\\n✅ Build completed successfully!');
        resolve();
      } else {
        console.log(\`\\n❌ Build failed with exit code \${code}\`);
        reject(new Error(\`Build failed with code \${code}\`));
      }
    });
    
    msbuild.on('error', (err) => {
      console.log('\\n❌ Build error:', err.message);
      reject(err);
    });
  });
}

// Main execution
async function main() {
  try {
    checkPrerequisites();
    
    const metro = await startMetro();
    
    // Wait for Metro to fully start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await buildApp();
    
    console.log('\\n🎉 App built successfully!');
    console.log('💡 To run:');
    console.log('   1. Check windows/ReactNativeDeviceAiExample.Package/AppPackages/');
    console.log('   2. Install the .msix package');
    console.log('   3. Or run from Visual Studio');
    
    // Keep Metro running
    console.log('\\n📦 Metro bundler will continue running...');
    console.log('🛑 Press Ctrl+C to stop');
    
  } catch (error) {
    console.log('\\n❌ Failed:', error.message);
    console.log('💡 Try opening the solution in Visual Studio instead');
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping...');
  process.exit();
});

if (require.main === module) {
  main();
}
`;

  fs.writeFileSync('run-windows-simple.js', simpleScript);
  console.log('   ✅ Created simple runner script: run-windows-simple.js\n');
}

/**
 * Step 4: Update package.json with the new scripts
 */
function updatePackageJson() {
  console.log('4️⃣  Updating package.json scripts...');
  
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the new scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'windows-fixed': 'node run-windows-fixed.js',
    'windows-simple': 'node run-windows-simple.js',
    'windows-cli': 'npx react-native run-windows --no-autolink --logging',
    'fix-cli-paths': 'node fix-react-native-cli-path.js'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('   ✅ Updated package.json with new scripts\n');
}

/**
 * Step 5: Test the CLI configuration
 */
function testConfiguration() {
  console.log('5️⃣  Testing CLI configuration...');
  
  try {
    // Test CLI detection
    const result = execSync('npx @react-native-community/cli config --platform windows', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const config = JSON.parse(result);
    
    if (config.project && config.project.windows) {
      console.log('   ✅ CLI can detect Windows project configuration');
      const winConfig = config.project.windows;
      console.log('   📁 Source directory:', winConfig.sourceDir);
      console.log('   🏗️  Solution file:', winConfig.solutionFile);
      console.log('   📄 Project file:', winConfig.projectFile);
    } else {
      console.log('   ⚠️  CLI still showing null for Windows project');
      console.log('   💡 Using bypass scripts instead');
    }
    
  } catch (error) {
    console.log('   ⚠️  CLI configuration test failed');
    console.log('   💡 Bypass scripts are ready as alternative');
  }
  
  console.log('\n');
}

/**
 * Show usage instructions
 */
function showUsage() {
  console.log('6️⃣  Usage Instructions:\n');
  console.log('🎯 Try these approaches in order:\n');
  console.log('1. **Simple approach (Recommended)**:');
  console.log('   npm run windows-simple\n');
  console.log('2. **Fixed CLI approach**:');
  console.log('   npm run windows-fixed\n');
  console.log('3. **Direct CLI (might still fail)**:');
  console.log('   npm run windows-cli\n');
  console.log('4. **Existing alternatives**:');
  console.log('   npm run windows-direct');
  console.log('   npm run build-windows-only\n');
  console.log('5. **Visual Studio (always works)**:');
  console.log('   - Open windows/ReactNativeDeviceAiExample.sln');
  console.log('   - Set ReactNativeDeviceAiExample.Package as startup project');
  console.log('   - Press F5 to build and run\n');
  console.log('📚 Each approach has different advantages:');
  console.log('   - Simple: Fast, reliable, minimal output');
  console.log('   - Fixed CLI: Uses React Native CLI with path corrections');
  console.log('   - Visual Studio: Full debugging capabilities\n');
}

// Main execution
async function main() {
  console.log('🎯 Fixing React Native CLI Path Resolution\n');
  
  try {
    fixReactNativeConfig();
    createCliWrapper();
    createSimpleAlternative();
    updatePackageJson();
    testConfiguration();
    showUsage();
    
    console.log('✅ CLI Path Fix Complete!\n');
    console.log('🚀 Quick start: npm run windows-simple');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.log('\n💡 You can still use Visual Studio to build the project manually');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };