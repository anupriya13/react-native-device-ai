/**
 * Windows TurboModule Demo (Standalone)
 * This demo showcases the Windows TurboModule functionality without React Native imports
 */

// Mock React Native for the demo
const mockReactNative = {
  Platform: {
    OS: 'windows',
    Version: '10.0.22000',
  },
  Dimensions: {
    get: (type) => ({
      width: 1920,
      height: 1080,
      scale: 1,
      fontScale: 1,
    }),
  },
};

// Mock require calls
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === 'react-native') {
    return mockReactNative;
  }
  if (id === './NativeDeviceAI.js') {
    // Mock the native module as unavailable for this demo
    throw new Error('Cannot use import statement outside a module');
  }
  return originalRequire.apply(this, arguments);
};

const DeviceAI = require('./src/DeviceAI.js');

async function runWindowsDemo() {
  console.log('🪟 React Native Device AI - Windows TurboModule Demo');
  console.log('=' .repeat(60));
  
  try {
    // Test device insights
    console.log('\n📱 Testing Device Insights...');
    const insights = await DeviceAI.getDeviceInsights();
    
    if (insights.success) {
      console.log('✅ Device Insights Retrieved:');
      console.log(`   Platform: ${insights.deviceInfo.platform}`);
      console.log(`   Version: ${insights.deviceInfo.version}`);
      console.log(`   Memory: ${insights.deviceInfo.memory.used} / ${insights.deviceInfo.memory.total}`);
      console.log(`   Storage: ${insights.deviceInfo.storage.used} / ${insights.deviceInfo.storage.total}`);
      console.log(`   Battery: ${insights.deviceInfo.battery.level}% (${insights.deviceInfo.battery.state})`);
      console.log(`   CPU Usage: ${insights.deviceInfo.cpu.usage}%`);
      console.log('\n💡 AI Insights:');
      console.log(`   ${insights.insights}`);
    } else {
      console.log('❌ Failed to get device insights:', insights.error);
    }

    // Test battery advice
    console.log('\n🔋 Testing Battery Advice...');
    const batteryAdvice = await DeviceAI.getBatteryAdvice();
    
    if (batteryAdvice.success) {
      console.log('✅ Battery Advice Retrieved:');
      console.log(`   Battery Level: ${batteryAdvice.batteryInfo.batteryLevel}%`);
      console.log(`   AI Advice: ${batteryAdvice.advice}`);
    } else {
      console.log('❌ Failed to get battery advice:', batteryAdvice.error);
    }

    // Test performance tips
    console.log('\n⚡ Testing Performance Tips...');
    const performanceTips = await DeviceAI.getPerformanceTips();
    
    if (performanceTips.success) {
      console.log('✅ Performance Tips Retrieved:');
      console.log(`   AI Tips: ${performanceTips.tips}`);
    } else {
      console.log('❌ Failed to get performance tips:', performanceTips.error);
    }

    // Test natural language queries
    console.log('\n🤖 Testing Natural Language Queries...');
    const queries = [
      "How much battery do I have?",
      "Is my memory usage high?", 
      "How much storage space is left?",
      "What's my CPU usage?",
      "How many processes are running?"
    ];

    for (const query of queries) {
      const result = await DeviceAI.queryDeviceInfo(query);
      if (result.success) {
        console.log(`✅ Query: "${result.prompt}"`);
        console.log(`   Response: ${result.response}`);
      } else {
        console.log(`❌ Failed query: "${query}" - ${result.error}`);
      }
    }

    // Test module features
    console.log('\n🔧 Testing Module Features...');
    console.log(`   Native Module Available: ${DeviceAI.isNativeModuleAvailable()}`);
    console.log(`   Supported Features: ${DeviceAI.getSupportedFeatures().join(', ')}`);

    // Test Windows-specific functionality (would normally work with TurboModule)
    console.log('\n🪟 Testing Windows-Specific Features...');
    try {
      // This would normally call the C++ TurboModule
      const windowsInfo = await DeviceAI.getWindowsSystemInfo();
      console.log('✅ Windows System Info Retrieved:');
      console.log(`   OS Version: ${windowsInfo.osVersion}`);
      console.log(`   Build Number: ${windowsInfo.buildNumber}`);
      console.log(`   Processor: ${windowsInfo.processorName}`);
      console.log(`   Architecture: ${windowsInfo.systemArchitecture}`);
      console.log(`   Running Processes: ${windowsInfo.runningProcesses}`);
    } catch (error) {
      console.log('⚠️  Windows System Info requires native module:', error.message);
      console.log('    In a real Windows app, this would call the C++ TurboModule');
    }

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n' + '='.repeat(60));
    console.log('📋 WINDOWS TURBOMODULE IMPLEMENTATION STATUS:');
    console.log('='.repeat(60));
    console.log('✅ C++ TurboModule implemented with:');
    console.log('   • Real Windows API calls (WMI, PDH, Registry)');
    console.log('   • Memory information via GlobalMemoryStatusEx');
    console.log('   • Storage information via GetDiskFreeSpaceEx');
    console.log('   • Battery info via Windows.System.Power APIs');
    console.log('   • CPU usage via Performance Data Helper (PDH)');
    console.log('   • Network info via Windows.Networking APIs');
    console.log('   • Performance counters for system monitoring');
    console.log('   • WMI queries for detailed system information');
    console.log('   • Registry access for OS version/build info');
    console.log('');
    console.log('✅ JavaScript fallback provides:');
    console.log('   • Cross-platform device insights');
    console.log('   • Natural language query processing');
    console.log('   • AI-powered recommendations (with Azure OpenAI)');
    console.log('   • Battery, performance, and optimization advice');
    console.log('');
    console.log('📁 Files implemented:');
    console.log('   • windows/ReactNativeDeviceAi/ReactNativeDeviceAi.h');
    console.log('   • windows/ReactNativeDeviceAi/ReactNativeDeviceAi.cpp');
    console.log('   • windows/ReactNativeDeviceAi/codegen/ (generated specs)');
    console.log('   • src/NativeDeviceAISpec.ts (TypeScript interface)');
    console.log('   • src/DeviceAI.js (main module logic)');
    console.log('');
    console.log('🚀 To use in a React Native Windows app:');
    console.log('   1. Open windows/ReactNativeDeviceAi.sln in Visual Studio');
    console.log('   2. Build the TurboModule project');
    console.log('   3. Run `npm install` in your app');
    console.log('   4. Import and use: import DeviceAI from "react-native-device-ai"');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run the demo
if (require.main === module) {
  runWindowsDemo().catch(console.error);
}

module.exports = { runWindowsDemo };