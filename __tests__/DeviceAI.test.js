/**
 * DeviceAI Module Tests
 */

const DeviceAI = require('../src/DeviceAI.js');
const AzureOpenAI = require('../src/AzureOpenAI.js');

// Get the mock from the setup file
const mockReactNative = require('../jest.setup.js');

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
      // Even when Dimensions throws an error, the module should still work with fallbacks
      const { Dimensions } = require('react-native');
      Dimensions.get.mockImplementation(() => {
        throw new Error('Dimensions error');
      });

      const result = await DeviceAI.getDeviceInsights();

      // The module should handle this gracefully and still provide basic functionality
      expect(result.success).toBe(true);
      expect(result.deviceInfo).toBeDefined();
      
      // Restore the original implementation
      Dimensions.get.mockImplementation(mockReactNative.Dimensions.get);
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

      expect(result.performanceInfo.cpu).toBeDefined();
      expect(result.performanceInfo.memory).toBeDefined();
      expect(result.performanceInfo.storage).toBeDefined();
      expect(typeof result.performanceInfo.cpu.usage).toBe('number');
      expect(typeof result.performanceInfo.memory.usedPercentage).toBe('number');
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

    it.skip('should handle Android platform correctly', async () => {
      // Mock Platform.OS for this test
      jest.doMock('react-native', () => ({
        Platform: { OS: 'android', Version: '14' },
        Dimensions: mockReactNative.Dimensions
      }));
      
      // Clear module cache and re-require
      delete require.cache[require.resolve('../src/DeviceAI.js')];
      const DeviceAIAndroid = require('../src/DeviceAI.js');

      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAIAndroid.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.deviceInfo.platform).toBe('android');
      
      // Restore original mock
      jest.doMock('react-native', () => mockReactNative);
      delete require.cache[require.resolve('../src/DeviceAI.js')];
    });

    it.skip('should handle Windows platform with additional info', async () => {
      // Mock Platform.OS for this test
      jest.doMock('react-native', () => ({
        Platform: { OS: 'windows', Version: '11' },
        Dimensions: mockReactNative.Dimensions
      }));
      
      // Clear module cache and re-require
      delete require.cache[require.resolve('../src/DeviceAI.js')];
      const DeviceAIWindows = require('../src/DeviceAI.js');

      AzureOpenAI.isConfigured.mockReturnValue(false);

      const result = await DeviceAIWindows.getDeviceInsights();

      expect(result.success).toBe(true);
      expect(result.deviceInfo.platform).toBe('windows');
      expect(result.deviceInfo.windowsSpecific).toBeDefined();
      
      // Restore original mock
      jest.doMock('react-native', () => mockReactNative);
      delete require.cache[require.resolve('../src/DeviceAI.js')];
    });
  });

  describe('Device Query Functionality', () => {
    beforeEach(() => {
      AzureOpenAI.isConfigured.mockReturnValue(false);
    });

    it('should handle empty or invalid prompts', async () => {
      const emptyResult = await DeviceAI.queryDeviceInfo('');
      expect(emptyResult.success).toBe(false);
      expect(emptyResult.error).toContain('valid prompt');

      const nullResult = await DeviceAI.queryDeviceInfo(null);
      expect(nullResult.success).toBe(false);
      expect(nullResult.error).toContain('valid prompt');

      const whitespaceResult = await DeviceAI.queryDeviceInfo('   ');
      expect(whitespaceResult.success).toBe(false);
      expect(whitespaceResult.error).toContain('valid prompt');
    });

    it('should respond to battery-related queries', async () => {
      const batteryQueries = [
        'How much battery do I have?',
        'What is my battery level?',
        'Is my device charging?'
      ];

      for (const query of batteryQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.prompt).toBe(query);
        expect(result.response).toBeDefined();
        expect(result.relevantData).toBeDefined();
        expect(result.timestamp).toBeDefined();
        expect(typeof result.response).toBe('string');
        expect(result.response.length).toBeGreaterThan(0);
        
        // The response should mention battery since it's a battery query
        expect(result.response.toLowerCase()).toMatch(/battery|power|charge/);
      }
    });

    it('should respond to memory-related queries', async () => {
      const memoryQueries = [
        'How much memory am I using?',
        'Is my RAM usage high?',
        'How much memory is available?'
      ];

      for (const query of memoryQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.relevantData.memory).toBeDefined();
        expect(result.response).toContain('%'); // Should mention percentage
      }
    });

    it('should respond to storage-related queries', async () => {
      const storageQueries = [
        'How much storage space do I have left?',
        'Is my disk full?',
        'What is my storage capacity?'
      ];

      for (const query of storageQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.relevantData.storage).toBeDefined();
        expect(result.response).toMatch(/storage|space|disk/i);
      }
    });

    it('should respond to CPU-related queries', async () => {
      const cpuQueries = [
        'What is my CPU usage?',
        'Is my processor hot?',
        'How many cores does my CPU have?'
      ];

      for (const query of cpuQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.relevantData.cpu).toBeDefined();
        expect(result.response).toMatch(/cpu|processor|cores|usage/i);
      }
    });

    it('should respond to screen-related queries', async () => {
      const screenQueries = [
        'What is my screen resolution?',
        'How big is my display?',
        'What is my screen size?'
      ];

      for (const query of screenQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.relevantData.screen).toBeDefined();
        expect(result.response).toMatch(/screen|resolution|display/i);
      }
    });

    it('should respond to network-related queries', async () => {
      const networkQueries = [
        'What is my network connection?',
        'Am I connected to wifi?',
        'What is my internet speed?'
      ];

      for (const query of networkQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.relevantData.network).toBeDefined();
        expect(result.response).toMatch(/network|wifi|connection/i);
      }
    });

    it('should provide general summary for non-specific queries', async () => {
      const generalQueries = [
        'Tell me about my device',
        'How is my device performing?',
        'What is the status of my device?'
      ];

      for (const query of generalQueries) {
        const result = await DeviceAI.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.relevantData.summary).toBeDefined();
        expect(result.response).toContain(result.relevantData.platform);
      }
    });

    it.skip('should handle Windows-specific queries when on Windows', async () => {
      // Mock Platform.OS for this test
      jest.doMock('react-native', () => ({
        Platform: { OS: 'windows', Version: '11' },
        Dimensions: mockReactNative.Dimensions
      }));
      
      // Clear module cache and re-require
      delete require.cache[require.resolve('../src/DeviceAI.js')];
      const DeviceAIWindows = require('../src/DeviceAI.js');

      const windowsQueries = [
        'How many processes are running?',
        'What is my Windows version?',
        'What is my system uptime?'
      ];

      for (const query of windowsQueries) {
        const result = await DeviceAIWindows.queryDeviceInfo(query);
        
        expect(result.success).toBe(true);
        expect(result.relevantData.windowsSpecific).toBeDefined();
        expect(result.response).toMatch(/windows|processes|system/i);
      }
      
      // Restore original mock
      jest.doMock('react-native', () => mockReactNative);
      delete require.cache[require.resolve('../src/DeviceAI.js')];
    });

    it('should work with AI enabled', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(true);
      AzureOpenAI.generateCustomResponse.mockResolvedValue('Your battery is at 78% and not charging.');

      const result = await DeviceAI.queryDeviceInfo('How much battery do I have?');

      expect(result.success).toBe(true);
      expect(result.response).toBe('Your battery is at 78% and not charging.');
      expect(AzureOpenAI.generateCustomResponse).toHaveBeenCalled();
    });

    it('should fallback gracefully when AI fails', async () => {
      AzureOpenAI.isConfigured.mockReturnValue(true);
      AzureOpenAI.generateCustomResponse.mockRejectedValue(new Error('AI service error'));

      const result = await DeviceAI.queryDeviceInfo('How much battery do I have?');

      expect(result.success).toBe(true);
      expect(result.response).toBeDefined();
      expect(result.response.length).toBeGreaterThan(0);
    });

    it('should extract relevant data correctly based on prompt keywords', async () => {
      // Test multiple keywords in one prompt
      const result = await DeviceAI.queryDeviceInfo('How much battery and memory am I using?');

      expect(result.success).toBe(true);
      expect(result.relevantData.battery).toBeDefined();
      expect(result.relevantData.memory).toBeDefined();
      expect(result.relevantData.storage).toBeUndefined(); // Should not include storage
    });
  });
});