#!/usr/bin/env node

/**
 * Real MCP Protocol Demo
 * Demonstrates actual Model Context Protocol implementation with external servers
 */

const { Enhanced } = require('./index.js');

async function demonstrateRealMCPFeatures() {
  console.log('🚀 Real MCP (Model Context Protocol) Integration Demo\n');
  console.log('This demo shows how to use actual MCP protocol with external servers\n');
  
  try {
    // Step 1: Initialize Real MCP
    console.log('1️⃣ Initializing Real MCP Client...');
    const initResult = await Enhanced.initializeMCP({
      useRealMCP: true, // Enable real MCP protocol
      timeout: 30000,
      retryAttempts: 3,
      transports: {
        default: 'sse',
        allowInsecure: false
      }
    });
    
    if (initResult.success) {
      console.log('✅ Real MCP initialized successfully');
      console.log(`   🔌 Protocol: ${initResult.protocol || 'MCP/1.0'}`);
      console.log(`   📊 External connections: ${(initResult.clients || []).join(', ') || 'None'}`);
      console.log(`   🖥️  Local servers: ${(initResult.localServers || []).join(', ') || 'None'}`);
      console.log(`   🚚 Available transports: ${(initResult.transports || []).join(', ')}`);
      console.log(`   🎯 Using Real MCP: ${initResult.usingRealMCP}`);
    } else {
      console.log('❌ Real MCP initialization failed:', initResult.error);
      console.log('💡 Falling back to mock implementation for demo purposes');
      
      // Fallback to mock for demo
      await Enhanced.initializeMCP({ useRealMCP: false });
    }
    console.log();

    // Step 2: Try to connect to external MCP server (if configured)
    console.log('2️⃣ Connecting to external MCP servers...');
    try {
      await Enhanced.addMCPServer({
        name: 'demo-analysis-server',
        url: process.env.MCP_DEMO_SERVER_URL || 'http://localhost:3000/mcp',
        transport: 'sse',
        auth: {
          type: 'api-key',
          apiKey: process.env.MCP_DEMO_API_KEY || 'demo-key'
        }
      });
      console.log('✅ Connected to demo analysis server');
    } catch (error) {
      console.log('⚠️  Demo server not available:', error.message);
      console.log('💡 Configure MCP_DEMO_SERVER_URL to connect to real MCP server');
    }
    console.log();

    // Step 3: Get device insights with Real MCP
    console.log('3️⃣ Getting device insights with Real MCP...');
    const insights = await Enhanced.getDeviceInsights({
      preferredProviders: ['demo-analysis-server', 'windows-device-server'],
      includeOSSpecific: true
    });
    
    if (insights.success) {
      console.log('✅ Device insights retrieved successfully');
      console.log(`   🖥️  Platform: ${insights.deviceInfo.platform}`);
      console.log(`   🧠 Using Real MCP: ${insights.usingRealMCP}`);
      console.log(`   🔌 MCP Enabled: ${insights.mcpEnabled}`);
      
      if (insights.providers) {
        console.log('   📊 Connection Status:');
        if (insights.providers.externalConnections) {
          Object.entries(insights.providers.externalConnections).forEach(([name, status]) => {
            console.log(`      🌐 ${name}: ${status.connected ? '✅ Connected' : '❌ Disconnected'}`);
            if (status.connected && status.serverInfo) {
              console.log(`         📝 ${status.serverInfo.name} v${status.serverInfo.version}`);
            }
          });
        }
        if (insights.providers.localServers) {
          Object.entries(insights.providers.localServers).forEach(([name, status]) => {
            console.log(`      🖥️  ${name}: ${status.connected ? '✅ Connected' : '❌ Disconnected'}`);
          });
        }
      }
      
      console.log('\n   💡 AI Insights:');
      console.log(`      ${insights.insights}`);
    } else {
      console.log('❌ Failed to get insights:', insights.error);
    }
    console.log();

    // Step 4: Demonstrate MCP Tools (if available)
    console.log('4️⃣ Exploring available MCP tools...');
    try {
      // This would work with real MCP servers that expose tools
      console.log('📋 Available MCP tools:');
      console.log('   (Tools would be listed here from connected MCP servers)');
      console.log('   Example tools: analyze-device, optimize-performance, security-scan');
    } catch (error) {
      console.log('ℹ️  No MCP tools available:', error.message);
    }
    console.log();

    // Step 5: MCP Protocol Information
    console.log('5️⃣ MCP Protocol Details:');
    console.log('✅ Transport Protocols:');
    console.log('   🌐 SSE (Server-Sent Events) - React Native compatible');
    console.log('   📡 HTTP/HTTPS - For REST-like interactions');
    console.log('   🚫 STDIO - Not supported in React Native');
    console.log();
    
    console.log('✅ MCP Features:');
    console.log('   🔧 Tools - Call functions on MCP servers');
    console.log('   📚 Resources - Access server-provided data');
    console.log('   💬 Prompts - Use server-provided prompt templates');
    console.log('   🔄 Real-time - Subscribe to server updates');
    console.log();

    // Step 6: Environment Configuration Guide
    console.log('6️⃣ Environment Configuration:');
    console.log('🔧 To use real MCP servers, set these environment variables:');
    console.log('   MCP_DEMO_SERVER_URL=http://your-mcp-server:3000/mcp');
    console.log('   MCP_DEMO_API_KEY=your-api-key');
    console.log('   MCP_AI_SERVER_URL=http://ai-mcp-server:3000/mcp');
    console.log('   MCP_AI_SERVER_TOKEN=your-bearer-token');
    console.log();

    console.log('🎉 Real MCP Demo completed successfully!');
    console.log('\n📖 Next Steps:');
    console.log('   1. Set up external MCP servers');
    console.log('   2. Configure environment variables');
    console.log('   3. Enable Real MCP in your app with useRealMCP: true');
    console.log('   4. Explore MCP tools and resources');
    console.log('   5. Build amazing AI-powered device experiences!');

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
  demonstrateRealMCPFeatures().catch(console.error);
}

module.exports = { demonstrateRealMCPFeatures };