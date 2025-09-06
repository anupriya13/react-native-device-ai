/**
 * DeviceAI Module Tests
 */

const DeviceAI = require('../src/DeviceAI.js');
const AzureOpenAI = require('../src/AzureOpenAI.js');

// Mock the AzureOpenAI module
jest.mock('../src/AzureOpenAI.js');

describe('DeviceAI Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should configure Azure OpenAI correctly', () => {
      const config = {
        apiKey: 'test-api-key',
        endpoint: 'https://test.openai.azure.com'
      };

      DeviceAI.configure(config);

      expect(AzureOpenAI.setConfig).toHaveBeenCalledWith(config);
    });
  });

  describe('Device Insights', () => {
    it('should return device insights successfully', async () => {
      // Mock AzureOpenAI responses
      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.deviceInfo).toBeDefined();
      expect(result.insights).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should include proper device information', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getDeviceInsights();

      expect(result.deviceInfo.platform).toBe('ios');
      expect(result.deviceInfo.version).toBe('16.0');
      expect(result.deviceInfo.screen).toBeDefined();
      expect(result.deviceInfo.memory).toBeDefined();
      expect(result.deviceInfo.storage).toBeDefined();
      expect(result.deviceInfo.battery).toBeDefined();
      expect(result.deviceInfo.cpu).toBeDefined();
    });

    it('should use AI insights when Azure OpenAI is configured', async () => {
      const mockAIInsights = 'Your device is performing well!';
      AzureOpenAI.isConfigured.mockReturnValue(true);
      AzureOpenAI.generateInsights.mockResolvedValue(mockAIInsights);

      const result = await DeviceAI.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.insights).toBe(mockAIInsights);
      expect(AzureOpenAI.generateInsights).toHaveBeenCalled();
    });

    it('should fallback to basic insights when AI fails', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(true);
      AzureOpenAI.generateInsights.mockRejectedValue(new Error('AI service unavailable'));

      const result = await DeviceAI.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.insights).toBeDefined();
      expect(typeof result.insights).toBe('string');
    });

    it('should handle errors gracefully', async () => {
      // Force an error by mocking Dimensions to throw
      const { Dimensions } = require('react-native');
      Dimensions.get.mockImplementation(() => {
        throw new Error('Dimensions error');
      });

      const result = await DeviceAI.getDeviceInsights();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Battery Advice', () => {
    it('should return battery advice successfully', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getBatteryAdvice();

      expect(result.success).toBe(true);
      expect(result.batteryInfo).toBeDefined();
      expect(result.advice).toBeDefined();
      expect(result.tips).toBeDefined();
      expect(Array.isArray(result.tips)).toBe(true);
      expect(result.timestamp).toBeDefined();
    });

    it('should include battery level and state', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getBatteryAdvice();

      expect(result.batteryInfo.batteryLevel).toBeDefined();
      expect(result.batteryInfo.batteryState).toBeDefined();
      expect(typeof result.batteryInfo.batteryLevel).toBe('number');
      expect(result.batteryInfo.batteryLevel).toBeGreaterThanOrEqual(0);
      expect(result.batteryInfo.batteryLevel).toBeLessThanOrEqual(100);
    });

    it('should use AI advice when configured', async () => {
      const mockAdvice = 'Enable low power mode to extend battery life.';
      AzureOpenAI.isConfigured.mockReturnValue(true);
      AzureOpenAI.generateInsights.mockResolvedValue(mockAdvice);

      const result = await DeviceAI.getBatteryAdvice();

      expect(result.success).toBe(true);
      expect(result.advice).toBe(mockAdvice);
      expect(AzureOpenAI.generateInsights).toHaveBeenCalled();
    });
  });

  describe('Performance Tips', () => {
    it('should return performance tips successfully', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getPerformanceTips();

      expect(result.success).toBe(true);
      expect(result.performanceInfo).toBeDefined();
      expect(result.tips).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.timestamp).toBeDefined();
    });

    it('should include performance metrics', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getPerformanceTips();

      expect(result.performanceInfo.cpuUsage).toBeDefined();
      expect(result.performanceInfo.memoryUsage).toBeDefined();
      expect(result.performanceInfo.storageUsage).toBeDefined();
      expect(typeof result.performanceInfo.cpuUsage).toBe('number');
      expect(typeof result.performanceInfo.memoryUsage).toBe('number');
    });

    it('should use AI tips when configured', async () => {
      const mockTips = 'Close unused applications to improve performance.';
      AzureOpenAI.isConfigured.mockReturnValue(true);
      AzureOpenAI.generateInsights.mockResolvedValue(mockTips);

      const result = await DeviceAI.getPerformanceTips();

      expect(result.success).toBe(true);
      expect(result.tips).toBe(mockTips);
      expect(AzureOpenAI.generateInsights).toHaveBeenCalled();
    });
  });

  describe('Caching', () => {
    it('should cache device information', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(false);

      // First call
      const result1 = await DeviceAI.getDeviceInsights();
      const timestamp1 = result1.deviceInfo.timestamp;

      // Second call should use cached data
      const result2 = await DeviceAI.getDeviceInsights();
      const timestamp2 = result2.deviceInfo.timestamp;

      expect(timestamp1).toBe(timestamp2);
    });
  });

  describe('Platform-specific features', () => {
    it('should handle iOS platform correctly', async () => {
      const { Platform } = require('react-native');
      Platform.OS = 'ios';

      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.deviceInfo.platform).toBe('ios');
    });

    it('should handle Android platform correctly', async () => {
      const { Platform } = require('react-native');
      Platform.OS = 'android';

      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.deviceInfo.platform).toBe('android');
    });

    it('should handle Windows platform with additional info', async () => {
      const { Platform } = require('react-native');
      Platform.OS = 'windows';

      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAI.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.deviceInfo.platform).toBe('windows');
      expect(result.deviceInfo.windowsSpecific).toBeDefined();
    });
  });
});