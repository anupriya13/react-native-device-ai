#!/usr/bin/env node

/**
 * MCP Integration Demo
 * Demonstrates Model Context Protocol features in react-native-device-ai
 */

const { Enhanced, MCPClient } = require('./index.js');

async function demonstrateMCPFeatures() {
  console.log('🚀 MCP (Model Context Protocol) Integration Demo\n');
  
  try {
    // Step 1: Initialize MCP
    console.log('1️⃣ Initializing MCP Client...');
    const initResult = await Enhanced.initializeMCP({
      timeout: 30000,
      retryAttempts: 3,
      enableFallback: true
    });
    
    if (initResult.success) {
      console.log('✅ MCP initialized successfully');
      console.log(`   📊 Available providers: ${initResult.providers.join(', ')}`);
      console.log(`   🔌 Available data sources: ${initResult.dataSources.join(', ')}\n`);
    } else {
      console.log('❌ MCP initialization failed:', initResult.error);
      return;
    }

    // Step 2: Add custom AI provider
    console.log('2️⃣ Adding custom AI provider...');
    await Enhanced.addMCPServer({
      name: 'demo-ai-provider',
      type: 'ai-provider',
      endpoint: 'https://api.demo-ai.com',
      auth: {
        apiKey: 'demo-key-12345',
        type: 'api-key'
      }
    });
    console.log('✅ Demo AI provider added\n');

    // Step 3: Get device insights with multi-provider support
    console.log('3️⃣ Getting device insights with MCP...');
    const insights = await Enhanced.getDeviceInsights({
      preferredProviders: ['azure-openai', 'openai', 'demo-ai-provider'],
      dataSources: ['system-monitor', 'battery-monitor']
    });
    
    if (insights.success) {
      console.log('✅ Device insights generated');
      console.log(`   🤖 AI Insights: ${insights.insights}`);
      console.log(`   📱 Device Platform: ${insights.deviceInfo.platform}`);
      console.log(`   🔋 Battery Level: ${insights.deviceInfo.battery?.level || 'Unknown'}%`);
      console.log(`   💾 Memory Usage: ${insights.deviceInfo.memory?.usedPercentage || 'Unknown'}%`);
      console.log(`   🌐 MCP Enabled: ${insights.mcpEnabled}`);
      
      if (insights.deviceInfo.mcpData) {
        console.log(`   📊 MCP Data Sources: ${Object.keys(insights.deviceInfo.mcpData).join(', ')}`);
      }
      console.log();
    }

    // Step 4: Battery advice with provider failover
    console.log('4️⃣ Getting battery advice with provider failover...');
    const batteryAdvice = await Enhanced.getBatteryAdvice({
      preferredProviders: ['anthropic', 'openai', 'azure-openai'] // Will fail over to available providers
    });
    
    if (batteryAdvice.success) {
      console.log('✅ Battery advice generated');
      console.log(`   🔋 Advice: ${batteryAdvice.advice}`);
      console.log(`   💡 Tips: ${batteryAdvice.tips.slice(0, 2).join(', ')}`);
      console.log();
    }

    // Step 5: Performance tips with enhanced data collection
    console.log('5️⃣ Getting performance tips with enhanced data collection...');
    const performanceTips = await Enhanced.getPerformanceTips({
      dataSources: ['system-monitor', 'network-monitor'],
      preferredProviders: ['demo-ai-provider', 'azure-openai']
    });
    
    if (performanceTips.success) {
      console.log('✅ Performance tips generated');
      console.log(`   ⚡ Tips: ${performanceTips.tips}`);
      console.log(`   📈 Recommendations: ${performanceTips.recommendations.slice(0, 2).join(', ')}`);
      console.log();
    }

    // Step 6: Natural language queries with MCP
    console.log('6️⃣ Testing natural language queries with MCP...');
    
    const queries = [
      "How much battery do I have?",
      "Is my device running slow?",
      "What's my memory usage?",
      "Should I be concerned about performance?"
    ];

    for (const query of queries) {
      const response = await Enhanced.queryDeviceInfo(query, {
        preferredProviders: ['demo-ai-provider'],
        includeContext: true
      });
      
      if (response.success) {
        console.log(`   ❓ Q: ${query}`);
        console.log(`   💬 A: ${response.response}`);
      }
    }
    console.log();

    // Step 7: MCP status and monitoring
    console.log('7️⃣ Checking MCP status...');
    const status = Enhanced.getMCPStatus();
    
    console.log('✅ MCP Status:');
    console.log(`   🔌 Enabled: ${status.enabled}`);
    console.log(`   🤖 AI Providers: ${Object.keys(status.providers || {}).length}`);
    console.log(`   📊 Data Sources: ${Object.keys(status.dataSources || {}).length}`);
    
    if (status.providers) {
      console.log('\n   📋 Provider Details:');
      Object.entries(status.providers).forEach(([name, info]) => {
        console.log(`     • ${name}: ${info.connected ? '🟢 Connected' : '🔴 Disconnected'}`);
        console.log(`       Capabilities: ${info.capabilities?.join(', ') || 'Unknown'}`);
      });
    }
    console.log();

    // Step 8: Demonstrate concurrent requests
    console.log('8️⃣ Testing concurrent requests...');
    const concurrentStart = Date.now();
    
    const concurrentRequests = [
      Enhanced.getDeviceInsights({ preferredProviders: ['demo-ai-provider'] }),
      Enhanced.getBatteryAdvice({ preferredProviders: ['demo-ai-provider'] }),
      Enhanced.getPerformanceTips({ preferredProviders: ['demo-ai-provider'] }),
      Enhanced.queryDeviceInfo("How is my device doing overall?", { preferredProviders: ['demo-ai-provider'] })
    ];
    
    const concurrentResults = await Promise.all(concurrentRequests);
    const concurrentTime = Date.now() - concurrentStart;
    
    const successCount = concurrentResults.filter(r => r.success).length;
    console.log(`✅ Concurrent requests completed in ${concurrentTime}ms`);
    console.log(`   📊 Success rate: ${successCount}/${concurrentResults.length} (${Math.round(successCount/concurrentResults.length*100)}%)`);
    console.log();

    // Step 9: Demonstrate cost optimization
    console.log('9️⃣ Demonstrating cost optimization...');
    
    // Simulate different provider costs
    const costOptimizedOptions = {
      preferredProviders: ['local-llm', 'azure-openai', 'openai', 'anthropic'] // Cheapest first
    };
    
    const performanceOptimizedOptions = {
      preferredProviders: ['azure-openai', 'openai', 'anthropic', 'local-llm'] // Fastest first
    };
    
    console.log('   💰 Cost-optimized query (cheapest providers first)...');
    const costQuery = await Enhanced.queryDeviceInfo(
      "Give me a quick device status", 
      costOptimizedOptions
    );
    
    console.log('   ⚡ Performance-optimized query (fastest providers first)...');
    const perfQuery = await Enhanced.queryDeviceInfo(
      "Provide detailed device analysis", 
      performanceOptimizedOptions
    );
    
    if (costQuery.success && perfQuery.success) {
      console.log('✅ Both optimization strategies worked');
      console.log(`   💰 Cost-optimized response: ${costQuery.response}`);
      console.log(`   ⚡ Performance-optimized response: ${perfQuery.response}`);
    }
    console.log();

    // Step 10: Supported features
    console.log('🔟 Supported features with MCP:');
    const features = Enhanced.getSupportedFeatures();
    features.forEach(feature => {
      const icon = feature.includes('mcp') ? '🔌' : feature.includes('ai') ? '🤖' : '📱';
      console.log(`   ${icon} ${feature}`);
    });
    console.log();

    // Step 11: Error handling demonstration
    console.log('1️⃣1️⃣ Testing error handling...');
    
    try {
      // Try to use non-existent provider
      await Enhanced.getDeviceInsights({
        preferredProviders: ['non-existent-provider']
      });
    } catch (error) {
      console.log('✅ Error handling working correctly');
      console.log(`   ⚠️ Graceful fallback activated: ${error.message.substring(0, 50)}...`);
    }
    console.log();

    // Step 12: Performance metrics
    console.log('1️⃣2️⃣ Performance metrics:');
    
    // Test response times
    const perfTests = [
      { name: 'Device Insights', fn: () => Enhanced.getDeviceInsights() },
      { name: 'Battery Advice', fn: () => Enhanced.getBatteryAdvice() },
      { name: 'Performance Tips', fn: () => Enhanced.getPerformanceTips() },
      { name: 'Natural Query', fn: () => Enhanced.queryDeviceInfo("Battery level?") }
    ];
    
    for (const test of perfTests) {
      const start = Date.now();
      const result = await test.fn();
      const duration = Date.now() - start;
      
      console.log(`   ⏱️ ${test.name}: ${duration}ms ${result.success ? '✅' : '❌'}`);
    }
    console.log();

    console.log('🎉 MCP Integration Demo Complete!\n');
    
    console.log('📖 Key Benefits Demonstrated:');
    console.log('   🔄 Multi-provider AI failover');
    console.log('   📊 Enhanced device data collection');
    console.log('   💬 Natural language query processing');
    console.log('   ⚡ Concurrent request handling');
    console.log('   💰 Cost optimization strategies');
    console.log('   🛡️ Robust error handling');
    console.log('   📈 Performance monitoring');
    console.log();
    
    console.log('🚀 Next Steps:');
    console.log('   1. Configure real AI provider credentials');
    console.log('   2. Add enterprise data sources');
    console.log('   3. Implement cost optimization logic');
    console.log('   4. Set up monitoring and alerting');
    console.log('   5. Read MCP_INTEGRATION_GUIDE.md for detailed usage');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up MCP resources...');
    await Enhanced.cleanup();
    console.log('✅ Cleanup complete');
  }
}

// Run demo if called directly
if (require.main === module) {
  demonstrateMCPFeatures().catch(console.error);
}

module.exports = { demonstrateMCPFeatures };