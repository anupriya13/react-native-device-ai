#!/usr/bin/env node
/**
 * Fix for "Couldn't determine Windows app config" error in React Native CLI
 * 
 * This script addresses the issue where React Native CLI fails to detect
 * the Windows project configuration, resulting in the error:
 * "Couldn't get app solution information. Couldn't determine Windows app config"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing Windows App Config Detection Issue...\n');

/**
 * Step 1: Validate current project structure
 */
function validateProjectStructure() {
  console.log('1️⃣  Validating project structure...');
  
  const checks = [
    { file: 'package.json', desc: 'Package.json with React Native dependency' },
    { file: 'app.json', desc: 'App configuration file' },
    { file: 'react-native.config.js', desc: 'React Native configuration' },
    { file: 'windows/ReactNativeDeviceAiExample.sln', desc: 'Windows solution file' },
    { file: 'windows/ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj', desc: 'Windows project file' },
    { file: 'node_modules/react-native', desc: 'React Native module installed' },
    { file: 'node_modules/react-native-windows', desc: 'React Native Windows module installed' }
  ];

  let allValid = true;
  checks.forEach(check => {
    const exists = fs.existsSync(check.file);
    console.log(`   ${exists ? '✅' : '❌'} ${check.desc}`);
    if (!exists) allValid = false;
  });

  if (!allValid) {
    console.log('\n❌ Missing required files. Please run "npm install" first.');
    process.exit(1);
  }
  
  console.log('   ✅ All required files present\n');
}

/**
 * Step 2: Fix react-native.config.js for better CLI detection
 */
function fixReactNativeConfig() {
  console.log('2️⃣  Updating react-native.config.js for better CLI detection...');
  
  const configPath = 'react-native.config.js';
  const backupPath = 'react-native.config.js.backup';
  
  // Backup existing config
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupPath);
  }

  const enhancedConfig = `const path = require('path');

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
  
  // Project configuration - enhanced for CLI detection
  project: {
    windows: {
      sourceDir: path.resolve(__dirname, 'windows'),
      solutionFile: 'ReactNativeDeviceAiExample.sln',
      projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
      experimentalNuGetDependency: false,
      useWinUI3: false,
      // Additional properties to help CLI detection
      projectName: 'ReactNativeDeviceAiExample',
      projectGuid: '{416476D5-974A-4EE3-8B85-4E2CFAA0C094}',
      projectLang: 'cpp',
    },
  },
  
  // Explicit platform support
  platforms: {
    windows: {
      npmPackageName: 'react-native-windows',
    },
  },
  
  // Assets and additional config
  assets: ['./assets/'],
  
  // Commands configuration
  commands: require('./node_modules/react-native-windows/lib/commands').commands,
};`;

  fs.writeFileSync(configPath, enhancedConfig);
  console.log('   ✅ Enhanced react-native.config.js created\n');
}

/**
 * Step 3: Ensure proper app.json configuration
 */
function fixAppJson() {
  console.log('3️⃣  Updating app.json configuration...');
  
  const appJsonPath = 'app.json';
  let appJson = {};
  
  if (fs.existsSync(appJsonPath)) {
    appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  }
  
  // Enhanced app.json with Windows-specific configuration
  const enhancedAppJson = {
    name: 'ReactNativeDeviceAiExample',
    displayName: 'React Native Device AI Example',
    version: '1.0.0',
    // Windows-specific configuration
    windows: {
      project: {
        sourceDir: 'windows',
        solutionFile: 'ReactNativeDeviceAiExample.sln',
        projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj'
      }
    },
    ...appJson
  };
  
  fs.writeFileSync(appJsonPath, JSON.stringify(enhancedAppJson, null, 2));
  console.log('   ✅ Enhanced app.json created\n');
}

/**
 * Step 4: Create alternative run scripts that bypass CLI detection
 */
function createAlternativeRunScripts() {
  console.log('4️⃣  Creating alternative run scripts...');
  
  // Create direct MSBuild runner
  const msbuildRunner = `#!/usr/bin/env node
/**
 * Direct MSBuild runner that bypasses React Native CLI detection issues
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Windows app with direct MSBuild...');

// First, start Metro bundler
console.log('📦 Starting Metro bundler...');
const metro = spawn('npx', ['react-native', 'start'], {
  stdio: 'pipe',
  shell: true
});

metro.stdout.on('data', (data) => {
  if (data.toString().includes('Metro')) {
    console.log('✅ Metro bundler started');
  }
});

// Wait a bit for Metro to start, then build and run
setTimeout(() => {
  console.log('🔨 Building Windows app...');
  
  const windowsDir = path.resolve(__dirname, 'windows');
  const solutionFile = 'ReactNativeDeviceAiExample.sln';
  
  // Use MSBuild directly
  const msbuild = spawn('msbuild', [
    solutionFile,
    '/p:Configuration=Debug',
    '/p:Platform=x64',
    '/p:AppxBundle=Never',
    '/p:UseBundle=false',
    '/verbosity:normal'
  ], {
    cwd: windowsDir,
    stdio: 'inherit',
    shell: true
  });
  
  msbuild.on('exit', (code) => {
    if (code === 0) {
      console.log('✅ Build successful! App should be starting...');
    } else {
      console.log(\`❌ Build failed with code \${code}\`);
      metro.kill();
    }
  });
  
  msbuild.on('error', (err) => {
    console.log('❌ MSBuild error:', err.message);
    console.log('💡 Make sure Visual Studio Build Tools are installed');
    metro.kill();
  });
  
}, 3000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\\n🛑 Stopping services...');
  metro.kill();
  process.exit();
});
`;

  const packageRunner = `#!/usr/bin/env node
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
`;

  fs.writeFileSync('run-windows-direct.js', msbuildRunner);
  fs.writeFileSync('deploy-windows-package.js', packageRunner);
  
  console.log('   ✅ Created run-windows-direct.js');
  console.log('   ✅ Created deploy-windows-package.js\n');
}

/**
 * Step 5: Update package.json scripts
 */
function updatePackageScripts() {
  console.log('5️⃣  Updating package.json scripts...');
  
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add new scripts that bypass CLI detection
  packageJson.scripts = {
    ...packageJson.scripts,
    'windows-direct': 'node run-windows-direct.js',
    'windows-package': 'node deploy-windows-package.js',
    'windows-msbuild': 'cd windows && msbuild ReactNativeDeviceAiExample.sln /p:Configuration=Debug /p:Platform=x64',
    'windows-bypass': 'npm run fix-windows-config && npm run windows-direct',
    'fix-windows-config': 'node fix-windows-app-config.js'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('   ✅ Updated package.json with bypass scripts\n');
}

/**
 * Step 6: Test the configuration
 */
function testConfiguration() {
  console.log('6️⃣  Testing configuration...');
  
  try {
    // Test React Native CLI config detection
    const configResult = execSync('npx @react-native-community/cli config --platform windows', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const config = JSON.parse(configResult);
    
    if (config.project && config.project.windows) {
      console.log('   ✅ React Native CLI can detect Windows project');
      console.log('   📁 Project config:', JSON.stringify(config.project.windows, null, 4));
    } else {
      console.log('   ⚠️  CLI still showing windows: null');
      console.log('   💡 Using bypass scripts instead');
    }
    
  } catch (error) {
    console.log('   ⚠️  CLI detection still has issues');
    console.log('   💡 Bypass scripts are available as alternative');
  }
  
  console.log('\n');
}

/**
 * Step 7: Provide usage instructions
 */
function showUsageInstructions() {
  console.log('7️⃣  Usage Instructions:');
  console.log('');
  console.log('🎯 Try these commands in order:');
  console.log('');
  console.log('1. Test React Native CLI (might still fail):');
  console.log('   npx react-native run-windows --no-autolink');
  console.log('');
  console.log('2. Use bypass script (recommended):');
  console.log('   npm run windows-bypass');
  console.log('');
  console.log('3. Use direct MSBuild:');
  console.log('   npm run windows-msbuild');
  console.log('');
  console.log('4. Manual deployment:');
  console.log('   npm run windows-package');
  console.log('');
  console.log('📝 If issues persist, the problem may be:');
  console.log('   - Visual Studio Build Tools not installed');
  console.log('   - Windows SDK missing');
  console.log('   - React Native 0.79 Windows CLI detection bug');
  console.log('');
  console.log('🔗 Alternative: Use Visual Studio IDE directly');
  console.log('   - Open windows/ReactNativeDeviceAiExample.sln');
  console.log('   - Set ReactNativeDeviceAiExample.Package as startup project');
  console.log('   - Build and run (F5)');
  console.log('');
}

// Main execution
async function main() {
  try {
    validateProjectStructure();
    fixReactNativeConfig();
    fixAppJson();
    createAlternativeRunScripts();
    updatePackageScripts();
    testConfiguration();
    showUsageInstructions();
    
    console.log('✅ Windows App Config Fix Complete!');
    console.log('');
    console.log('🚀 Quick start: npm run windows-bypass');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };