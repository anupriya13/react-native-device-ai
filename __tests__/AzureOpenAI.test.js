/**
 * AzureOpenAI Service Tests
 */

const axios = require('axios');
const AzureOpenAI = require('../src/AzureOpenAI.js');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('AzureOpenAI Service', () => {
  beforeEach(() => {
    // Reset configuration before each test
    AzureOpenAI.setConfig(null);
    jest.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should set configuration correctly', () => {
      const config = {
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com'
      };

      AzureOpenAI.setConfig(config);

      expect(AzureOpenAI.isConfigured()).toBe(true);
    });

    it('should handle null configuration', () => {
      AzureOpenAI.setConfig(null);

      expect(AzureOpenAI.isConfigured()).toBe(false);
    });

    it('should validate configuration parameters', () => {
      const invalidConfig = {
        apiKey: '',
        endpoint: 'invalid-url'
      };

      expect(() => {
        AzureOpenAI.setConfig(invalidConfig);
      }).toThrow();
    });

    it('should set deployment parameter correctly', () => {
      const config = {
        apiKey: 'test-key-12345',
        endpoint: 'https://test.openai.azure.com',
        apiVersion: '2024-02-15-preview',
        deployment: 'gpt-4'
      };

      AzureOpenAI.setConfig(config);

      expect(AzureOpenAI.isConfigured()).toBe(true);
      expect(AzureOpenAI.deployment).toBe('gpt-4');
      expect(AzureOpenAI.apiVersion).toBe('2024-02-15-preview');
    });

    it('should use default deployment when not provided', () => {
      const config = {
        apiKey: 'test-key-12345',
        endpoint: 'https://test.openai.azure.com'
      };

      AzureOpenAI.setConfig(config);

      expect(AzureOpenAI.deployment).toBe('gpt-35-turbo');
      expect(AzureOpenAI.apiVersion).toBe('2023-05-15');
    });

    it('should reset deployment to default when config is null', () => {
      // First set a custom deployment
      const config = {
        apiKey: 'test-key-12345',
        endpoint: 'https://test.openai.azure.com',
        deployment: 'gpt-4'
      };
      AzureOpenAI.setConfig(config);
      expect(AzureOpenAI.deployment).toBe('gpt-4');

      // Then reset with null
      AzureOpenAI.setConfig(null);
      expect(AzureOpenAI.deployment).toBe('gpt-35-turbo');
      expect(AzureOpenAI.isConfigured()).toBe(false);
    });
  });

  describe('Environment Configuration', () => {
    beforeEach(() => {
      // Clear environment variables
      delete process.env.AZURE_OPENAI_API_KEY;
      delete process.env.AZURE_OPENAI_ENDPOINT;
      delete process.env.AZURE_OPENAI_API_VERSION;
      delete process.env.AZURE_OPENAI_DEPLOYMENT;
    });

    it('should load configuration from environment variables including deployment', () => {
      process.env.AZURE_OPENAI_API_KEY = 'env-test-key';
      process.env.AZURE_OPENAI_ENDPOINT = 'https://env.openai.azure.com';
      process.env.AZURE_OPENAI_API_VERSION = '2024-02-15-preview';
      process.env.AZURE_OPENAI_DEPLOYMENT = 'gpt-4-turbo';

      const envConfig = AzureOpenAI.AzureOpenAI.loadFromEnvironment();

      expect(envConfig).toEqual({
        apiKey: 'env-test-key',
        endpoint: 'https://env.openai.azure.com',
        apiVersion: '2024-02-15-preview',
        deployment: 'gpt-4-turbo'
      });
    });

    it('should load configuration without deployment from environment', () => {
      process.env.AZURE_OPENAI_API_KEY = 'env-test-key';
      process.env.AZURE_OPENAI_ENDPOINT = 'https://env.openai.azure.com';
      process.env.AZURE_OPENAI_API_VERSION = '2024-02-15-preview';
      // No AZURE_OPENAI_DEPLOYMENT set

      const envConfig = AzureOpenAI.AzureOpenAI.loadFromEnvironment();

      expect(envConfig).toEqual({
        apiKey: 'env-test-key',
        endpoint: 'https://env.openai.azure.com',
        apiVersion: '2024-02-15-preview',
        deployment: undefined
      });
    });

    it('should return null when required env vars are missing', () => {
      process.env.AZURE_OPENAI_DEPLOYMENT = 'gpt-4';
      // Missing API key and endpoint

      const envConfig = AzureOpenAI.AzureOpenAI.loadFromEnvironment();

      expect(envConfig).toBeNull();
    });
    });
  });

  describe('Insights Generation', () => {
    beforeEach(() => {
      const config = {
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com'
      };
      AzureOpenAI.setConfig(config);
    });

    it('should generate general insights successfully', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Your device is performing well with good battery life.'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const deviceData = {
        platform: 'ios',
        memory: { usedPercentage: 60 },
        battery: { level: 80 }
      };

      const result = await AzureOpenAI.generateInsights(deviceData, 'general');

      expect(result).toBe('Your device is performing well with good battery life.');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://test.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15',
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('device optimization expert')
            }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('ios')
            })
          ])
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'api-key': 'test-key'
          }),
          timeout: 30000
        })
      );
    });

    it('should generate battery insights successfully', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Enable low power mode to extend battery life.'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const batteryData = {
        batteryLevel: 30,
        batteryState: 'unplugged'
      };

      const result = await AzureOpenAI.generateInsights(batteryData, 'battery');

      expect(result).toBe('Enable low power mode to extend battery life.');
    });

    it('should generate performance insights successfully', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Close unused apps to improve performance.'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const performanceData = {
        cpuUsage: 85,
        memoryUsage: 90,
        storageUsage: 70
      };

      const result = await AzureOpenAI.generateInsights(performanceData, 'performance');

      expect(result).toBe('Close unused apps to improve performance.');
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.post.mockRejectedValue(new Error('API Error'));

      const deviceData = { platform: 'ios' };

      await expect(AzureOpenAI.generateInsights(deviceData, 'general'))
        .rejects.toThrow('Failed to generate AI insights');
    });

    it('should use custom deployment in API URL', async () => {
      // Configure with custom deployment
      const config = {
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com',
        apiVersion: '2024-02-15-preview',
        deployment: 'gpt-4'
      };
      AzureOpenAI.setConfig(config);

      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Custom deployment response'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const deviceData = { platform: 'ios' };
      await AzureOpenAI.generateInsights(deviceData, 'general');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://test.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview',
        expect.any(Object),
        expect.any(Object)
      );
    });
  });

  describe('Deployment Parameter Tests', () => {
    beforeEach(() => {
      AzureOpenAI.setConfig(null);
    });

    it('should use default deployment for API calls when not specified', async () => {
      const config = {
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com'
      };
      AzureOpenAI.setConfig(config);

      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Default deployment response'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const deviceData = { platform: 'ios' };
      await AzureOpenAI.generateInsights(deviceData, 'general');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://test.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15',
        expect.any(Object),
        expect.any(Object)
      );
    });
    });

    it.skip('should handle invalid response format', async () => {
      const mockResponse = {
        data: {
          choices: []
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const deviceData = { platform: 'ios' };

      await expect(AzureOpenAI.generateInsights(deviceData, 'general'))
        .rejects.toThrow('Invalid response format');
    });

    it('should handle network timeout', async () => {
      mockedAxios.post.mockRejectedValue({ code: 'ECONNABORTED' });

      const deviceData = { platform: 'ios' };

      await expect(AzureOpenAI.generateInsights(deviceData, 'general'))
        .rejects.toThrow('Failed to generate AI insights');
    });
  });

  describe('System Prompts', () => {
    beforeEach(() => {
      const config = {
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com'
      };
      AzureOpenAI.setConfig(config);
    });

    it('should use appropriate system prompt for general insights', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'General device insight'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await AzureOpenAI.generateInsights({ platform: 'ios' }, 'general');

      const call = mockedAxios.post.mock.calls[0];
      const systemMessage = call[1].messages[0];

      expect(systemMessage.role).toBe('system');
      expect(systemMessage.content).toContain('device optimization expert');
    });

    it('should use appropriate system prompt for battery insights', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Battery advice'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await AzureOpenAI.generateInsights({ batteryLevel: 50 }, 'battery');

      const call = mockedAxios.post.mock.calls[0];
      const systemMessage = call[1].messages[0];

      expect(systemMessage.role).toBe('system');
      expect(systemMessage.content).toContain('device optimization expert');
    });

    it('should use appropriate system prompt for performance insights', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Performance tip'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await AzureOpenAI.generateInsights({ cpuUsage: 80 }, 'performance');

      const call = mockedAxios.post.mock.calls[0];
      const systemMessage = call[1].messages[0];

      expect(systemMessage.role).toBe('system');
      expect(systemMessage.content).toContain('device optimization expert');
    });
  });

  describe('Rate Limiting and Timeouts', () => {
    beforeEach(() => {
      const config = {
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com'
      };
      AzureOpenAI.setConfig(config);
    });

    it('should handle rate limiting errors', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: {
            error: {
              message: 'Rate limit exceeded'
            }
          }
        }
      };

      mockedAxios.post.mockRejectedValue(rateLimitError);

      await expect(AzureOpenAI.generateInsights({ platform: 'ios' }, 'general'))
        .rejects.toThrow('Failed to generate AI insights');
    });

    it('should set appropriate timeout for API calls', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Test response'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await AzureOpenAI.generateInsights({ platform: 'ios' }, 'general');

      const call = mockedAxios.post.mock.calls[0];
      const config = call[2];

      expect(config.timeout).toBe(30000); // 30 seconds
    });
  });

  describe('Custom Response Generation', () => {
    beforeEach(() => {
      const config = {
        apiKey: 'test-key',
        endpoint: 'https://test.openai.azure.com'
      };
      AzureOpenAI.setConfig(config);
    });

    it('should generate custom response for user prompts', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Your battery is at 78% and not charging.'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const userPrompt = 'How much battery do I have?';
      const relevantData = { battery: { level: 78, state: 'unplugged' } };

      const result = await AzureOpenAI.generateCustomResponse(userPrompt, relevantData);

      expect(result).toBe('Your battery is at 78% and not charging.');
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it('should use proper prompt structure for custom responses', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Your device is using 65% of available memory.'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const userPrompt = 'How much memory am I using?';
      const relevantData = { memory: { usedPercentage: 65 } };

      await AzureOpenAI.generateCustomResponse(userPrompt, relevantData);

      const call = mockedAxios.post.mock.calls[0];
      const requestData = call[1];
      const userMessage = requestData.messages[1];

      expect(userMessage.role).toBe('user');
      expect(userMessage.content).toContain('User Question: "How much memory am I using?"');
      expect(userMessage.content).toContain('ONE SHORT SENTENCE');
      expect(userMessage.content).toContain('maximum 20 words');
    });

    it('should use limited tokens for custom responses', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Short response'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await AzureOpenAI.generateCustomResponse('Test prompt', { platform: 'ios' });

      const call = mockedAxios.post.mock.calls[0];
      const requestData = call[1];

      expect(requestData.max_tokens).toBe(100); // Should be limited for one-liners
    });

    it('should handle errors in custom response generation', async () => {
      const apiError = new Error('API request failed');
      mockedAxios.post.mockRejectedValue(apiError);

      await expect(AzureOpenAI.generateCustomResponse('Test prompt', { platform: 'ios' }))
        .rejects.toThrow('Failed to generate custom response');
    });

    it('should require configuration for custom responses', async () => {
      AzureOpenAI.setConfig(null); // Clear configuration

      await expect(AzureOpenAI.generateCustomResponse('Test prompt', { platform: 'ios' }))
        .rejects.toThrow('Azure OpenAI not configured');
    });

    it('should handle invalid API responses for custom responses', async () => {
      const invalidResponse = {
        data: {
          choices: [] // Empty choices array
        }
      };

      mockedAxios.post.mockResolvedValue(invalidResponse);

      const result = await AzureOpenAI.generateCustomResponse('Test prompt', { platform: 'ios' });

      expect(result).toBe('Unable to generate insights at this time. Please try again later.');
    });

    it('should include relevant data in prompt for custom responses', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Response based on data'
            }
          }]
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const relevantData = {
        platform: 'ios',
        battery: { level: 78, state: 'unplugged' },
        memory: { usedPercentage: 65 }
      };

      await AzureOpenAI.generateCustomResponse('Device status?', relevantData);

      const call = mockedAxios.post.mock.calls[0];
      const requestData = call[1];
      const userMessage = requestData.messages[1];

      expect(userMessage.content).toContain('Device Data:');
      expect(userMessage.content).toContain(JSON.stringify(relevantData, null, 2));
    });
  });
});