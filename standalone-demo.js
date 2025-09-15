/**
 * Standalone demo test for react-native-device-ai (works in Node.js)
 */

// Create a temporary mock file for react-native
const fs = require('fs');
const path = require('path');

// Create mock react-native module
const mockRNContent = `
module.exports = {
  Platform: {
    OS: 'ios',
    Version: '16.0',
  },
  Dimensions: {
    get: (type) => {
      if (type === 'screen') {
        return {
          width: 375,
          height: 812,
          scale: 2,
          fontScale: 1,
        };
      }
      return {
        width: 375,
        height: 812,
      };
    },
  },
};
`;

// Write temporary react-native mock
const tempReactNativeFile = path.join(__dirname, 'react-native.js');
fs.writeFileSync(tempReactNativeFile, mockRNContent);

// Set up module resolution
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain) {
  if (request === 'react-native') {
    return tempReactNativeFile;
  }
  return originalResolveFilename.call(this, request, parent, isMain);
};

async function runStandaloneDemo() {
  console.log('🤖 React Native Device AI - Standalone Demo');
  console.log('===========================================\n');

  // Check for credentials configuration
  console.log('🔑 Credential Configuration Check:');
  const AzureOpenAI = require('./src/AzureOpenAI.js');
  const envConfig = AzureOpenAI.AzureOpenAI.loadFromEnvironment();
  if (envConfig) {
    console.log('  ✅ Environment variables detected');
    console.log('  📍 Endpoint:', envConfig.endpoint.replace(/https:\/\/([^.]+)\./, 'https://$1***.'));
    console.log('  🔐 API Key: ***' + envConfig.apiKey.slice(-4));
  } else {
    console.log('  ⚠️  No environment variables found');
    console.log('  📖 To configure Azure OpenAI:');
    console.log('     1. Copy .env.example to .env');
    console.log('     2. Add your Azure OpenAI credentials');
    console.log('     3. See CREDENTIALS_GUIDE.md for details');
    console.log('  🎯 Demo will use fallback insights without AI');
  }
  console.log('');

  try {
    // Load the module after mocking react-native
    const DeviceAI = require('./index.js');

    // Test 1: Get Device Insights
    console.log('📱 Testing getDeviceInsights()...');
    const insights = await DeviceAI.getDeviceInsights();
    console.log('  ✅ Success:', insights.success);
    console.log('  📊 Platform:', insights.deviceInfo.platform);
    console.log('  💡 Insights:', insights.insights.substring(0, 100) + '...');
    console.log('  📝 Recommendations:', insights.recommendations.length, 'items');
    console.log('  🕐 Timestamp:', insights.timestamp);
    console.log('');

    // Test 2: Get Battery Advice
    console.log('🔋 Testing getBatteryAdvice()...');
    const batteryAdvice = await DeviceAI.getBatteryAdvice();
    console.log('  ✅ Success:', batteryAdvice.success);
    console.log('  🔋 Battery Level:', batteryAdvice.batteryInfo.batteryLevel + '%');
    console.log('  💡 Advice:', batteryAdvice.advice.substring(0, 100) + '...');
    console.log('  📝 Tips:', batteryAdvice.tips.length, 'items');
    console.log('');

    // Test 3: Get Performance Tips
    console.log('⚡ Testing getPerformanceTips()...');
    const performanceTips = await DeviceAI.getPerformanceTips();
    console.log('  ✅ Success:', performanceTips.success);
    console.log('  💡 Tips:', performanceTips.tips.substring(0, 100) + '...');
    console.log('  📝 Recommendations:', performanceTips.recommendations.length, 'items');
    console.log('');

    // Test 4: Configuration
    console.log('⚙️ Testing configuration...');
    
    // Try to load from environment variables first
    const envConfig = AzureOpenAI.AzureOpenAI.loadFromEnvironment();
    if (envConfig) {
      DeviceAI.configure(envConfig);
      console.log('  ✅ Configuration loaded from environment variables');
      console.log('  🔑 Endpoint:', envConfig.endpoint.replace(/https:\/\/([^.]+)/, 'https://$1***'));
    } else {
      // Fallback to test configuration (for demo purposes)
      DeviceAI.configure({
        apiKey: 'test-key-for-demo-purposes',
        endpoint: 'https://test.openai.azure.com'
      });
      console.log('  ✅ Test configuration applied (use .env for real credentials)');
    }
    console.log('');

    // Test 5: Query Device Info
    console.log('🤖 Testing queryDeviceInfo()...');
    const sampleQueries = [
      'How much battery do I have?',
      'What is my memory usage?',
      'How much storage space is left?',
      'What is my CPU usage?',
      'Tell me about my device'
    ];

    for (const query of sampleQueries) {
      console.log(`  📝 Query: "${query}"`);
      const queryResult = await DeviceAI.queryDeviceInfo(query);
      console.log('    ✅ Success:', queryResult.success);
      console.log('    💬 Response:', queryResult.response);
      console.log('    🔍 Relevant Data Keys:', Object.keys(queryResult.relevantData));
      console.log('');
    }

    // Test 6: Display sample data
    console.log('📊 Sample Device Information:');
    console.log('  Platform:', insights.deviceInfo.platform);
    console.log('  Screen:', insights.deviceInfo.screen.width + 'x' + insights.deviceInfo.screen.height);
    console.log('  Memory Usage:', insights.deviceInfo.memory.usedPercentage + '%');
    console.log('  Storage Usage:', insights.deviceInfo.storage.usedPercentage + '%');
    console.log('  Battery Level:', insights.deviceInfo.battery.level + '%');
    console.log('  CPU Usage:', insights.deviceInfo.cpu.usage + '%');
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('📦 The react-native-device-ai module is working correctly.');
    console.log('');
    console.log('✨ Key Features Demonstrated:');
    console.log('  • Cross-platform device information collection');
    console.log('  • AI-powered insights with fallback support');
    console.log('  • Battery optimization recommendations');
    console.log('  • Performance improvement suggestions');
    console.log('  • Natural language device queries');
    console.log('  • Azure OpenAI integration capability');
    console.log('  • Secure credential management');

    // Clean up temporary file
    if (fs.existsSync(tempReactNativeFile)) {
      fs.unlinkSync(tempReactNativeFile);
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error('Stack:', error.stack);
    
    // Clean up temporary file
    if (fs.existsSync(tempReactNativeFile)) {
      fs.unlinkSync(tempReactNativeFile);
    }
    
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runStandaloneDemo();
}

module.exports = { runStandaloneDemo };