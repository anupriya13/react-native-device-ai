/**
 * Integration Tests for react-native-device-ai
 */

const DeviceAI = require('../index.js');

describe('DeviceAI Integration Tests', () => {
  it('should export the DeviceAI module correctly', () => {
    expect(DeviceAI).toBeDefined();
    expect(typeof DeviceAI).toBe('object');
  });

  it('should have all required methods', () => {
    expect(typeof DeviceAI.getDeviceInsights).toBe('function');
    expect(typeof DeviceAI.getBatteryAdvice).toBe('function');
    expect(typeof DeviceAI.getPerformanceTips).toBe('function');
    expect(typeof DeviceAI.queryDeviceInfo).toBe('function');
    expect(typeof DeviceAI.configure).toBe('function');
  });

  it('should work as a singleton when imported', async () => {
    // Test the default export behavior
    expect(typeof DeviceAI.getDeviceInsights).toBe('function');
    expect(typeof DeviceAI.getBatteryAdvice).toBe('function');
    expect(typeof DeviceAI.getPerformanceTips).toBe('function');
    expect(typeof DeviceAI.queryDeviceInfo).toBe('function');
    expect(typeof DeviceAI.configure).toBe('function');
  });

  it('should handle basic functionality without configuration', async () => {
    const result = await DeviceAI.getDeviceInsights();
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.deviceInfo).toBeDefined();
    expect(result.insights).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it('should provide consistent API structure across all methods', async () => {
    const [insights, battery, performance] = await Promise.all([
      DeviceAI.getDeviceInsights(),
      DeviceAI.getBatteryAdvice(),
      DeviceAI.getPerformanceTips()
    ]);

    // All should have success field
    expect(insights.success).toBeDefined();
    expect(battery.success).toBeDefined();
    expect(performance.success).toBeDefined();

    // All should have timestamp
    expect(insights.timestamp).toBeDefined();
    expect(battery.timestamp).toBeDefined();
    expect(performance.timestamp).toBeDefined();

    // All should be successful when no errors occur
    expect(insights.success).toBe(true);
    expect(battery.success).toBe(true);
    expect(performance.success).toBe(true);
  });

  it('should handle configuration changes', () => {
    const config = {
      apiKey: 'test-key',
      endpoint: 'https://test.openai.azure.com'
    };

    expect(() => {
      DeviceAI.configure(config);
    }).not.toThrow();
  });

  describe('Query Device Info Integration', () => {
    it('should handle device queries end-to-end', async () => {
      const query = 'How much battery do I have?';
      const result = await DeviceAI.queryDeviceInfo(query);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.prompt).toBe(query);
      expect(result.response).toBeDefined();
      expect(typeof result.response).toBe('string');
      expect(result.response.length).toBeGreaterThan(0);
      expect(result.relevantData).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should provide consistent query API structure', async () => {
      const queries = [
        'How much battery do I have?',
        'What is my memory usage?',
        'How much storage space is left?'
      ];

      const results = await Promise.all(
        queries.map(query => DeviceAI.queryDeviceInfo(query))
      );

      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.prompt).toBe(queries[index]);
        expect(result.response).toBeDefined();
        expect(result.relevantData).toBeDefined();
        expect(result.timestamp).toBeDefined();
        expect(typeof result.response).toBe('string');
        expect(result.response.length).toBeGreaterThan(0);
      });
    });

    it('should extract different data types based on query', async () => {
      // Test battery query
      const batteryResult = await DeviceAI.queryDeviceInfo('How much battery do I have?');
      expect(batteryResult.relevantData.battery).toBeDefined();
      expect(batteryResult.relevantData.memory).toBeUndefined();

      // Test memory query
      const memoryResult = await DeviceAI.queryDeviceInfo('How much memory am I using?');
      expect(memoryResult.relevantData.memory).toBeDefined();
      expect(memoryResult.relevantData.battery).toBeUndefined();

      // Test general query
      const generalResult = await DeviceAI.queryDeviceInfo('Tell me about my device');
      expect(generalResult.relevantData.summary).toBeDefined();
    });

    it('should work alongside existing methods', async () => {
      // Get data using existing methods
      const insights = await DeviceAI.getDeviceInsights();
      const battery = await DeviceAI.getBatteryAdvice();

      // Get data using query method
      const queryResult = await DeviceAI.queryDeviceInfo('How is my device performing?');

      // All should succeed
      expect(insights.success).toBe(true);
      expect(battery.success).toBe(true);
      expect(queryResult.success).toBe(true);

      // Query result should be different format but valid
      expect(queryResult.response).toBeDefined();
      expect(typeof queryResult.response).toBe('string');
    });

    it('should handle invalid queries gracefully', async () => {
      const invalidQueries = ['', '   ', null, undefined];

      for (const query of invalidQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain('valid prompt');
      }
    });
  });
});