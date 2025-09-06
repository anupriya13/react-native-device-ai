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
    expect(typeof DeviceAI.configure).toBe('function');
  });

  it('should work as a singleton when imported', async () => {
    // Test the default export behavior
    expect(typeof DeviceAI.getDeviceInsights).toBe('function');
    expect(typeof DeviceAI.getBatteryAdvice).toBe('function');
    expect(typeof DeviceAI.getPerformanceTips).toBe('function');
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
});