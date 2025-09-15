#!/usr/bin/env node

/**
 * Interactive OS-Specific MCP Demo
 * Demonstrates platform-aware device intelligence with real OS APIs
 */

const { Enhanced } = require('./src/EnhancedDeviceAI.js');
const { Platform } = require('react-native');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  console.log(colorize(title.toUpperCase(), 'cyan'));
  console.log('='.repeat(60));
}

function printSubHeader(title) {
  console.log(colorize(`\n📋 ${title}`, 'yellow'));
  console.log('-'.repeat(40));
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demonstrateOSSpecificMCP() {
  printHeader('🚀 OS-Specific MCP Server Demo');
  
  console.log(colorize('Welcome to the Revolutionary OS-Native Device Intelligence Demo!', 'green'));
  console.log(colorize(`Current Platform: ${Platform.OS}`, 'blue'));
  console.log('\nThis demo showcases how react-native-device-ai provides deep,');
  console.log('platform-specific insights using native OS APIs through MCP servers.\n');

  await sleep(2000);

  // Step 1: Initialize MCP with OS-specific servers
  printSubHeader('Step 1: Initialize MCP with OS-Specific Servers');
  
  console.log('Initializing MCP client with OS-specific servers...');
  const enhanced = new Enhanced();
  
  try {
    const mcpResult = await enhanced.initializeMCP();
    
    if (mcpResult.success) {
      console.log(colorize('✅ MCP initialization successful!', 'green'));
      console.log(`📊 Available AI Providers: ${mcpResult.providers.length}`);
      console.log(`🔌 Data Sources: ${mcpResult.dataSources.length}`);
      
      // Show OS-specific server
      const osSpecificServers = mcpResult.dataSources.filter(source => 
        source.includes('windows-device-server') || 
        source.includes('android-device-server') || 
        source.includes('ios-device-server')
      );
      
      if (osSpecificServers.length > 0) {
        console.log(colorize(`🎯 OS-Specific Server: ${osSpecificServers[0]}`, 'magenta'));
      } else {
        console.log(colorize(`⚠️  No OS-specific server for platform: ${Platform.OS}`, 'yellow'));
      }
    } else {
      console.log(colorize('❌ MCP initialization failed:', 'red'), mcpResult.error);
      return;
    }
  } catch (error) {
    console.log(colorize('❌ Error during MCP initialization:', 'red'), error.message);
    return;
  }

  await sleep(3000);

  // Step 2: Collect OS-specific device data
  printSubHeader('Step 2: Collect OS-Specific Device Data');
  
  console.log('Collecting comprehensive device data with OS-specific insights...');
  
  try {
    const deviceInsights = await enhanced.getDeviceInsights({
      includeOSSpecific: true,
      preferredProviders: ['azure-openai', 'openai', 'anthropic']
    });
    
    if (deviceInsights.success) {
      console.log(colorize('✅ Device data collection successful!', 'green'));
      
      // Show basic device info
      console.log(`\n${colorize('📱 Basic Device Info:', 'blue')}`);
      console.log(`  Platform: ${deviceInsights.deviceInfo.platform || 'Unknown'}`);
      console.log(`  Version: ${deviceInsights.deviceInfo.version || 'Unknown'}`);
      
      // Show MCP data
      if (deviceInsights.deviceInfo.mcpData) {
        console.log(`\n${colorize('🔌 MCP Data Sources:', 'blue')}`);
        const mcpSources = Object.keys(deviceInsights.deviceInfo.mcpData);
        mcpSources.forEach(source => {
          console.log(`  ✓ ${source}`);
        });
      }
      
      // Show OS-specific data
      if (deviceInsights.deviceInfo.osSpecificData) {
        console.log(`\n${colorize('🎯 OS-Specific Data:', 'magenta')}`);
        const osData = deviceInsights.deviceInfo.osSpecificData;
        
        if (osData.available) {
          console.log(`  ✓ Platform: ${osData.platform}`);
          console.log(`  ✓ Server: ${osData.serverName}`);
          console.log(`  ✓ Data Collection Time: ${osData.timestamp}`);
          
          // Show platform-specific details
          if (osData.data) {
            switch (osData.platform) {
              case 'windows':
                console.log(`  ${colorize('🪟 Windows-Specific Features:', 'cyan')}`);
                if (osData.data.windowsSystemInfo) {
                  console.log(`    • OS Version: ${osData.data.windowsSystemInfo.osVersion}`);
                  console.log(`    • Build Number: ${osData.data.windowsSystemInfo.buildNumber}`);
                }
                if (osData.data.wmiData) {
                  console.log(`    • WMI Data: Available`);
                  console.log(`    • Computer: ${osData.data.wmiData.computerSystem}`);
                  console.log(`    • Processor: ${osData.data.wmiData.processor}`);
                }
                break;
                
              case 'android':
                console.log(`  ${colorize('🤖 Android-Specific Features:', 'cyan')}`);
                if (osData.data.systemInfo) {
                  console.log(`    • Manufacturer: ${osData.data.systemInfo.manufacturer}`);
                  console.log(`    • Model: ${osData.data.systemInfo.model}`);
                  console.log(`    • Android Version: ${osData.data.systemInfo.androidVersion}`);
                }
                if (osData.data.sensorData) {
                  console.log(`    • Sensor Data: Available`);
                  console.log(`    • Accelerometer: (${osData.data.sensorData.accelerometer.x.toFixed(2)}, ${osData.data.sensorData.accelerometer.y.toFixed(2)}, ${osData.data.sensorData.accelerometer.z.toFixed(2)})`);
                }
                break;
                
              case 'ios':
                console.log(`  ${colorize('📱 iOS-Specific Features:', 'cyan')}`);
                if (osData.data.systemInfo) {
                  console.log(`    • iOS Version: ${osData.data.systemInfo.systemVersion}`);
                  console.log(`    • Model: ${osData.data.systemInfo.model}`);
                }
                if (osData.data.motionData) {
                  console.log(`    • Core Motion: Available`);
                  console.log(`    • Device Attitude: (${osData.data.motionData.deviceMotion.attitude.roll.toFixed(2)}, ${osData.data.motionData.deviceMotion.attitude.pitch.toFixed(2)}, ${osData.data.motionData.deviceMotion.attitude.yaw.toFixed(2)})`);
                }
                break;
            }
          }
        } else {
          console.log(`  ❌ OS-specific data not available: ${osData.reason}`);
        }
      }
      
    } else {
      console.log(colorize('❌ Device data collection failed:', 'red'), deviceInsights.error);
      return;
    }
  } catch (error) {
    console.log(colorize('❌ Error during device data collection:', 'red'), error.message);
    return;
  }

  await sleep(3000);

  // Step 3: Demonstrate OS-specific natural language queries
  printSubHeader('Step 3: OS-Specific Natural Language Queries');
  
  const platformQueries = {
    windows: [
      "What Windows features are optimized on my system?",
      "How does my Windows performance compare to typical systems?",
      "Are there any Windows-specific optimizations I should enable?"
    ],
    android: [
      "How are my Android sensors performing?",
      "What Android-specific battery optimizations do you recommend?",
      "Is my Android device configured optimally?"
    ],
    ios: [
      "How is my iOS device's motion tracking accuracy?",
      "What iOS-specific features can improve my device performance?",
      "Should I enable any iOS power management features?"
    ],
    default: [
      "What can you tell me about my device?",
      "How is my device performing overall?",
      "What optimizations do you recommend for my device?"
    ]
  };
  
  const queries = platformQueries[Platform.OS] || platformQueries.default;
  
  console.log(`Testing ${colorize('platform-aware', 'magenta')} natural language queries for ${colorize(Platform.OS, 'blue')}...`);
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    console.log(`\n${colorize(`🗣️  Query ${i + 1}:`, 'yellow')} "${query}"`);
    console.log('🤖 AI Response: Processing...');
    
    try {
      const response = await enhanced.queryDeviceInfo(query, {
        includeOSSpecific: true,
        preferredProviders: ['azure-openai', 'openai']
      });
      
      if (response.success) {
        console.log(colorize('✅ Response generated successfully!', 'green'));
        console.log(`💬 AI says: "${response.response}"`);
      } else {
        console.log(colorize('❌ Query failed:', 'red'), response.error);
      }
    } catch (error) {
      console.log(colorize('❌ Error during query:', 'red'), error.message);
    }
    
    await sleep(2000);
  }

  await sleep(2000);

  // Step 4: Show MCP status and capabilities
  printSubHeader('Step 4: MCP Server Status and Capabilities');
  
  console.log('Checking MCP server status and capabilities...');
  
  const mcpStatus = enhanced.getMCPStatus();
  
  console.log(`\n${colorize('📊 MCP Status Overview:', 'blue')}`);
  console.log(`  MCP Enabled: ${mcpStatus.enabled ? colorize('✅ Yes', 'green') : colorize('❌ No', 'red')}`);
  
  if (mcpStatus.enabled) {
    console.log(`\n${colorize('🤖 AI Providers:', 'blue')}`);
    Object.entries(mcpStatus.providers).forEach(([name, provider]) => {
      if (provider.type === 'ai-provider') {
        const status = provider.connected ? colorize('🟢 Connected', 'green') : colorize('🔴 Disconnected', 'red');
        console.log(`  ${name}: ${status}`);
        console.log(`    Capabilities: ${provider.capabilities.join(', ')}`);
      }
    });
    
    console.log(`\n${colorize('📡 Data Sources:', 'blue')}`);
    Object.entries(mcpStatus.providers).forEach(([name, provider]) => {
      if (provider.type === 'data-source') {
        const status = provider.connected ? colorize('🟢 Connected', 'green') : colorize('🔴 Disconnected', 'red');
        console.log(`  ${name}: ${status}`);
        console.log(`    Capabilities: ${provider.capabilities.join(', ')}`);
        
        // Highlight OS-specific servers
        if (name.includes('windows-device-server') || name.includes('android-device-server') || name.includes('ios-device-server')) {
          console.log(`    ${colorize('🎯 OS-Specific Server', 'magenta')}`);
        }
      }
    });
  }

  await sleep(2000);

  // Final summary
  printSubHeader('🎉 Demo Complete - Summary');
  
  console.log(colorize('Congratulations! You\'ve experienced OS-specific MCP functionality.', 'green'));
  console.log('\n📈 Key Benefits Demonstrated:');
  console.log(`  ✅ ${colorize('Native OS Integration:', 'cyan')} Direct access to platform-specific APIs`);
  console.log(`  ✅ ${colorize('Enhanced Data Collection:', 'cyan')} Richer device insights than generic solutions`);
  console.log(`  ✅ ${colorize('Platform-Aware AI:', 'cyan')} AI responses tailored to your specific OS`);
  console.log(`  ✅ ${colorize('Unified API:', 'cyan')} Simple interface across all platforms`);
  console.log(`  ✅ ${colorize('Multi-Provider Support:', 'cyan')} Automatic failover between AI services`);
  
  console.log('\n🚀 Next Steps:');
  console.log('  • Integrate OS-specific insights into your React Native app');
  console.log('  • Explore platform-specific capabilities for your use case');
  console.log('  • Configure multiple AI providers for optimal cost and performance');
  console.log('  • Implement real-time device monitoring with OS-native APIs');
  
  console.log(`\n${colorize('📚 Learn More:', 'yellow')}`);
  console.log('  • Read OS_SPECIFIC_MCP_GUIDE.md for detailed documentation');
  console.log('  • Check MCP_INTEGRATION_GUIDE.md for general MCP usage');
  console.log('  • Run tests with: npm test -- __tests__/os-specific-mcp.test.js');
  
  console.log('\n' + '='.repeat(60));
  console.log(colorize('🎯 OS-SPECIFIC MCP DEMO COMPLETE', 'cyan'));
  console.log('='.repeat(60) + '\n');
}

// Cleanup function
async function cleanup(enhanced) {
  try {
    if (enhanced && enhanced.cleanup) {
      await enhanced.cleanup();
      console.log(colorize('🧹 Cleanup completed', 'green'));
    }
  } catch (error) {
    console.log(colorize('⚠️  Cleanup warning:', 'yellow'), error.message);
  }
}

// Main execution
async function main() {
  let enhanced;
  
  try {
    await demonstrateOSSpecificMCP();
  } catch (error) {
    console.error(colorize('💥 Demo failed with error:', 'red'), error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await cleanup(enhanced);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log(colorize('\n👋 Demo interrupted - cleaning up...', 'yellow'));
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(colorize('💥 Unhandled rejection:', 'red'), reason);
  process.exit(1);
});

// Run the demo
if (require.main === module) {
  main();
}

module.exports = { demonstrateOSSpecificMCP };