/**
 * Windows TurboModule Demo
 * This demo showcases the Windows TurboModule functionality
 */

const DeviceAI = require('./src/DeviceAI.js');

// Mock Windows Platform for demo
const mockWindowsPlatform = {
  OS: 'windows',
  Version: '10.0.22000',
};

// Simulate React Native on Windows
jest.mock('react-native', () => ({
  Platform: mockWindowsPlatform,
  Dimensions: {
    get: (type) => ({
      width: 1920,
      height: 1080,
      scale: 1,
      fontScale: 1,
    }),
  },
}));

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
    console.log('\nNote: This demo shows JavaScript fallback functionality.');
    console.log('In a real React Native Windows app, the C++ TurboModule would provide:');
    console.log('  • Real-time WMI queries');
    console.log('  • Performance counters');
    console.log('  • Enhanced system information');
    console.log('  • Native Windows API integration');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run the demo
if (require.main === module) {
  runWindowsDemo().catch(console.error);
}

module.exports = { runWindowsDemo };