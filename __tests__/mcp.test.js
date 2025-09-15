/**
 * Tests for MCP (Model Context Protocol) integration
 */

const MCPClient = require('../src/MCPClient');
const EnhancedDeviceAI = require('../src/EnhancedDeviceAI');

describe('MCP Integration Tests', () => {
  let mcpClient;
  let enhancedDeviceAI;

  beforeEach(() => {
    mcpClient = new MCPClient();
    enhancedDeviceAI = require('../src/EnhancedDeviceAI');
  });

  afterEach(async () => {
    if (mcpClient) {
      await mcpClient.disconnect();
    }
    if (enhancedDeviceAI) {
      await enhancedDeviceAI.cleanup();
    }
  });

  describe('MCPClient', () => {
    test('should initialize successfully', async () => {
      const result = await mcpClient.initialize();
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.providers)).toBe(true);
      expect(Array.isArray(result.dataSources)).toBe(true);
    });

    test('should connect to AI provider server', async () => {
      await mcpClient.initialize();
      
      const serverConfig = {
        name: 'test-ai-provider',
        type: 'ai-provider',
        endpoint: 'https://api.test-ai.com',
        auth: {
          apiKey: 'test-key-12345',
          type: 'api-key'
        }
      };

      const result = await mcpClient.connectServer(serverConfig);
      
      expect(result.success).toBe(true);
      expect(result.server).toBe('test-ai-provider');
    });

    test('should connect to data source server', async () => {
      await mcpClient.initialize();
      
      const serverConfig = {
        name: 'test-data-source',
        type: 'data-source',
        endpoint: 'local://test-data',
        auth: {
          type: 'none'
        }
      };

      const result = await mcpClient.connectServer(serverConfig);
      
      expect(result.success).toBe(true);
      expect(result.server).toBe('test-data-source');
    });

    test('should validate server configuration', async () => {
      await mcpClient.initialize();
      
      const invalidConfig = {
        name: 'test-server'
        // Missing required fields
      };

      const result = await mcpClient.connectServer(invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Server configuration must include');
    });

    test('should generate insights with AI provider failover', async () => {
      await mcpClient.initialize();
      
      // Connect multiple providers
      await mcpClient.connectServer({
        name: 'provider1',
        type: 'ai-provider',
        endpoint: 'https://api.provider1.com',
        auth: { apiKey: 'key1', type: 'api-key' }
      });

      await mcpClient.connectServer({
        name: 'provider2',
        type: 'ai-provider',
        endpoint: 'https://api.provider2.com',
        auth: { apiKey: 'key2', type: 'api-key' }
      });

      const deviceData = {
        platform: 'test',
        memory: { usedPercentage: 65 },
        battery: { level: 75 }
      };

      const result = await mcpClient.generateInsights(deviceData, 'general', ['provider1', 'provider2']);
      
      expect(result.success).toBe(true);
      expect(result.insights).toBeDefined();
      expect(result.provider).toBeDefined();
      expect(['provider1', 'provider2']).toContain(result.provider);
    });

    test('should collect device data from multiple sources', async () => {
      await mcpClient.initialize();
      
      const result = await mcpClient.collectDeviceData(['system-monitor', 'battery-monitor']);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data['system-monitor']).toBeDefined();
      expect(result.data['battery-monitor']).toBeDefined();
      expect(Array.isArray(result.sources)).toBe(true);
    });

    test('should get provider status', async () => {
      await mcpClient.initialize();
      
      await mcpClient.connectServer({
        name: 'test-provider',
        type: 'ai-provider',
        endpoint: 'https://api.test.com',
        auth: { apiKey: 'test-key', type: 'api-key' }
      });

      const status = mcpClient.getProviderStatus();
      
      expect(status).toBeDefined();
      expect(status['test-provider']).toBeDefined();
      expect(status['test-provider'].connected).toBe(true);
      expect(status['test-provider'].type).toBe('ai-provider');
      expect(Array.isArray(status['test-provider'].capabilities)).toBe(true);
    });

    test('should get data source status', async () => {
      await mcpClient.initialize();
      
      const status = mcpClient.getDataSourceStatus();
      
      expect(status).toBeDefined();
      expect(status['system-monitor']).toBeDefined();
      expect(status['system-monitor'].connected).toBe(true);
      expect(status['system-monitor'].type).toBe('data-source');
    });

    test('should handle disconnection gracefully', async () => {
      await mcpClient.initialize();
      
      await mcpClient.connectServer({
        name: 'disconnect-test',
        type: 'ai-provider',
        endpoint: 'https://api.test.com',
        auth: { apiKey: 'test-key', type: 'api-key' }
      });

      await mcpClient.disconnect();
      
      expect(mcpClient.isInitialized).toBe(false);
    });
  });

  describe('EnhancedDeviceAI', () => {
    test('should initialize MCP successfully', async () => {
      const result = await enhancedDeviceAI.initializeMCP();
      
      expect(result.success).toBe(true);
      expect(enhancedDeviceAI.mcpEnabled).toBe(true);
    });

    test('should get device insights with MCP', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const result = await enhancedDeviceAI.getDeviceInsights();
      
      expect(result.success).toBe(true);
      expect(result.deviceInfo).toBeDefined();
      expect(result.insights).toBeDefined();
      expect(result.mcpEnabled).toBe(true);
      expect(result.providers).toBeDefined();
    });

    test('should support preferred providers option', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const options = {
        preferredProviders: ['azure-openai', 'openai'],
        dataSources: ['system-monitor']
      };

      const result = await enhancedDeviceAI.getDeviceInsights(options);
      
      expect(result.success).toBe(true);
      expect(result.deviceInfo.mcpSources).toContain('system-monitor');
    });

    test('should get battery advice with MCP', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const result = await enhancedDeviceAI.getBatteryAdvice();
      
      expect(result.success).toBe(true);
      expect(result.batteryInfo).toBeDefined();
      expect(result.advice).toBeDefined();
      expect(result.mcpEnabled).toBe(true);
    });

    test('should get performance tips with MCP', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const result = await enhancedDeviceAI.getPerformanceTips();
      
      expect(result.success).toBe(true);
      expect(result.performanceInfo).toBeDefined();
      expect(result.tips).toBeDefined();
      expect(result.mcpEnabled).toBe(true);
    });

    test('should handle natural language queries with MCP', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const result = await enhancedDeviceAI.queryDeviceInfo("How much battery do I have?");
      
      expect(result.success).toBe(true);
      expect(result.query).toBe("How much battery do I have?");
      expect(result.response).toBeDefined();
      expect(result.mcpEnabled).toBe(true);
    });

    test('should support query options', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const options = {
        preferredProviders: ['anthropic'],
        includeContext: true
      };

      const result = await enhancedDeviceAI.queryDeviceInfo("What's my memory usage?", options);
      
      expect(result.success).toBe(true);
      expect(result.relevantData).toBeDefined();
    });

    test('should add MCP server dynamically', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const serverConfig = {
        name: 'dynamic-provider',
        type: 'ai-provider',
        endpoint: 'https://api.dynamic.com',
        auth: {
          apiKey: 'dynamic-key',
          type: 'bearer'
        }
      };

      const result = await enhancedDeviceAI.addMCPServer(serverConfig);
      
      expect(result.success).toBe(true);
      expect(result.server).toBe('dynamic-provider');
    });

    test('should get MCP status', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const status = enhancedDeviceAI.getMCPStatus();
      
      expect(status.enabled).toBe(true);
      expect(status.providers).toBeDefined();
      expect(status.dataSources).toBeDefined();
      expect(status.initialized).toBe(true);
    });

    test('should include MCP features in supported features', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      const features = enhancedDeviceAI.getSupportedFeatures();
      
      expect(features).toContain('mcp-multi-provider-ai');
      expect(features).toContain('mcp-enhanced-data-collection');
      expect(features).toContain('mcp-real-time-monitoring');
    });

    test('should fallback gracefully when MCP fails', async () => {
      // Don't initialize MCP
      const result = await enhancedDeviceAI.getDeviceInsights();
      
      expect(result.success).toBe(true);
      expect(result.deviceInfo).toBeDefined();
      expect(result.insights).toBeDefined();
      expect(result.mcpEnabled).toBe(false);
    });

    test('should maintain backward compatibility', async () => {
      // Test legacy configure method
      enhancedDeviceAI.configure({
        apiKey: 'test-azure-key',
        endpoint: 'https://test.openai.azure.com'
      });

      const result = await enhancedDeviceAI.getDeviceInsights();
      
      expect(result.success).toBe(true);
      expect(result.deviceInfo).toBeDefined();
    });

    test('should cleanup MCP resources', async () => {
      await enhancedDeviceAI.initializeMCP();
      expect(enhancedDeviceAI.mcpEnabled).toBe(true);
      
      await enhancedDeviceAI.cleanup();
      expect(enhancedDeviceAI.mcpEnabled).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle MCP initialization failure gracefully', async () => {
      // Force initialization failure
      const originalInitialize = mcpClient.initialize;
      mcpClient.initialize = jest.fn().mockRejectedValue(new Error('Initialization failed'));
      
      const result = await enhancedDeviceAI.initializeMCP();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Initialization failed');
      expect(enhancedDeviceAI.mcpEnabled).toBe(false);
      
      // Restore original method
      mcpClient.initialize = originalInitialize;
    });

    test('should handle AI provider failure with fallback', async () => {
      await mcpClient.initialize();
      
      // All providers will fail in mock implementation
      const deviceData = { platform: 'test' };
      
      try {
        await mcpClient.generateInsights(deviceData, 'general', ['non-existent-provider']);
      } catch (error) {
        expect(error.message).toContain('All AI providers failed');
      }
    });

    test('should handle data collection failure gracefully', async () => {
      await mcpClient.initialize();
      
      const result = await mcpClient.collectDeviceData(['non-existent-source']);
      
      expect(result.success).toBe(true); // Should succeed with available sources
      expect(Array.isArray(result.errors)).toBe(true);
    });

    test('should handle invalid server configuration', async () => {
      await mcpClient.initialize();
      
      const invalidConfig = {
        name: '',
        type: 'invalid-type',
        endpoint: 'not-a-url'
      };

      const result = await mcpClient.connectServer(invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Integration with Legacy API', () => {
    test('should export both legacy and enhanced APIs', () => {
      const DeviceAI = require('../index.js');
      
      expect(DeviceAI).toBeDefined(); // Legacy default export
      expect(DeviceAI.Enhanced).toBeDefined(); // Enhanced API
      expect(DeviceAI.MCPClient).toBeDefined(); // MCP Client
      expect(DeviceAI.Legacy).toBeDefined(); // Explicit legacy reference
    });

    test('should maintain legacy API compatibility', async () => {
      const DeviceAI = require('../index.js');
      
      // Test legacy API still works
      const result = await DeviceAI.getDeviceInsights();
      
      expect(result.success).toBe(true);
      expect(result.deviceInfo).toBeDefined();
      expect(result.mcpEnabled).toBeUndefined(); // Legacy API doesn't have MCP
    });

    test('should provide enhanced API access', async () => {
      const { Enhanced } = require('../index.js');
      
      await Enhanced.initializeMCP();
      const result = await Enhanced.getDeviceInsights();
      
      expect(result.success).toBe(true);
      expect(result.mcpEnabled).toBe(true); // Enhanced API has MCP
    });
  });

  describe('Real-world Scenarios', () => {
    test('should handle multi-provider AI scenario', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      // Simulate scenario with Azure OpenAI, OpenAI, and Anthropic
      await enhancedDeviceAI.addMCPServer({
        name: 'azure-test',
        type: 'ai-provider',
        endpoint: 'https://test.openai.azure.com',
        auth: { apiKey: 'azure-key', type: 'api-key' }
      });

      await enhancedDeviceAI.addMCPServer({
        name: 'openai-test',
        type: 'ai-provider',
        endpoint: 'https://api.openai.com',
        auth: { apiKey: 'openai-key', type: 'bearer' }
      });

      const options = {
        preferredProviders: ['azure-test', 'openai-test']
      };

      const result = await enhancedDeviceAI.getDeviceInsights(options);
      
      expect(result.success).toBe(true);
      expect(result.providers).toBeDefined();
    });

    test('should handle enterprise device management scenario', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      // Add enterprise data sources
      await enhancedDeviceAI.addMCPServer({
        name: 'enterprise-mdm',
        type: 'data-source',
        endpoint: 'https://mdm.company.com',
        auth: { apiKey: 'enterprise-key', type: 'bearer' }
      });

      const options = {
        dataSources: ['enterprise-mdm', 'system-monitor']
      };

      const result = await enhancedDeviceAI.getDeviceInsights(options);
      
      expect(result.success).toBe(true);
      expect(result.deviceInfo.mcpData).toBeDefined();
    });

    test('should handle cost optimization scenario', async () => {
      await enhancedDeviceAI.initializeMCP();
      
      // Simulate cost-conscious provider ordering
      const options = {
        preferredProviders: ['local-llm', 'azure-openai', 'openai'] // Cheapest first
      };

      const result = await enhancedDeviceAI.getPerformanceTips(options);
      
      expect(result.success).toBe(true);
      expect(result.tips).toBeDefined();
    });
  });
});

describe('MCP Performance Tests', () => {
  test('should handle concurrent requests efficiently', async () => {
    const enhancedDeviceAI = require('../src/EnhancedDeviceAI');
    await enhancedDeviceAI.initializeMCP();
    
    const requests = Array(5).fill().map(() => 
      enhancedDeviceAI.getDeviceInsights()
    );

    const results = await Promise.all(requests);
    
    results.forEach(result => {
      expect(result.success).toBe(true);
      expect(result.deviceInfo).toBeDefined();
    });
  });

  test('should cache device data appropriately', async () => {
    const enhancedDeviceAI = require('../src/EnhancedDeviceAI');
    await enhancedDeviceAI.initializeMCP();
    
    const start = Date.now();
    await enhancedDeviceAI.getDeviceInsights();
    const firstCallTime = Date.now() - start;
    
    const start2 = Date.now();
    await enhancedDeviceAI.getDeviceInsights();
    const secondCallTime = Date.now() - start2;
    
    // Second call should be faster due to caching
    expect(secondCallTime).toBeLessThan(firstCallTime);
  });
});