/**
 * Tests for LangChain Provider functionality
 */

const LangChainProvider = require('../src/LangChainProvider');
const RAGDataStore = require('../src/RAGDataStore');

describe('LangChainProvider', () => {
  let provider;
  let mockRAGStore;
  const mockApiKey = 'test-openai-key';

  beforeEach(() => {
    provider = new LangChainProvider();
    
    // Create mock RAG store
    mockRAGStore = {
      isInitialized: true,
      getAugmentedContext: jest.fn().mockResolvedValue({
        success: true,
        augmentedContext: 'mock context',
        sources: [{ documentId: 'doc1', score: 0.8 }]
      })
    };

    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize successfully with API key', async () => {
      const result = await provider.initialize({ apiKey: mockApiKey });
      
      expect(result.success).toBe(true);
      expect(result.model).toBe('gpt-3.5-turbo');
      expect(result.chainsAvailable).toContain('device-analysis-general');
      expect(provider.isInitialized).toBe(true);
    });

    it('should fail initialization without API key', async () => {
      const result = await provider.initialize();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('OpenAI API key required');
      expect(provider.isInitialized).toBe(false);
    });

    it('should initialize with custom model configuration', async () => {
      const result = await provider.initialize({
        apiKey: mockApiKey,
        model: 'gpt-4',
        temperature: 0.5
      });
      
      expect(result.success).toBe(true);
      expect(result.model).toBe('gpt-4');
    });

    it('should initialize with RAG data store', async () => {
      const result = await provider.initialize({ apiKey: mockApiKey }, mockRAGStore);
      
      expect(result.success).toBe(true);
      expect(result.ragEnabled).toBe(true);
      expect(provider.ragDataStore).toBe(mockRAGStore);
    });
  });

  describe('Chain Execution', () => {
    beforeEach(async () => {
      await provider.initialize({ apiKey: mockApiKey });
    });

    it('should execute device analysis chain', async () => {
      const deviceData = {
        platform: 'ios',
        battery: { level: 75, state: 'unplugged' },
        memory: { usage: 60 }
      };

      const result = await provider.executeChain('device-analysis-general', {
        deviceData: JSON.stringify(deviceData)
      });

      expect(result.success).toBe(true);
      expect(result.chainName).toBe('device-analysis-general');
      expect(result.result).toBeTruthy();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should execute chain with RAG augmentation', async () => {
      provider.setRAGDataStore(mockRAGStore);
      
      const result = await provider.executeChain('device-analysis-battery', {
        deviceData: '{"battery": {"level": 20}}'
      }, { useRAG: true });

      expect(result.success).toBe(true);
      expect(result.ragUsed).toBe(true);
      expect(result.input.ragContext).toBe('mock context');
    });

    it('should fail to execute non-existent chain', async () => {
      const result = await provider.executeChain('non-existent-chain', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('Chain \'non-existent-chain\' not found');
    });

    it('should fail if provider not initialized', async () => {
      const uninitializedProvider = new LangChainProvider();
      
      await expect(uninitializedProvider.executeChain('test', {})).rejects.toThrow('not initialized');
    });
  });

  describe('Device Analysis with RAG', () => {
    beforeEach(async () => {
      await provider.initialize({ apiKey: mockApiKey }, mockRAGStore);
    });

    it('should analyze device with general analysis', async () => {
      const deviceData = {
        platform: 'android',
        cpu: { usage: 80 },
        memory: { usage: 75 }
      };

      const result = await provider.analyzeDeviceWithRAG(deviceData, 'general');

      expect(result.success).toBe(true);
      expect(result.ragUsed).toBe(true);
      expect(mockRAGStore.getAugmentedContext).toHaveBeenCalled();
    });

    it('should analyze device with battery focus', async () => {
      const deviceData = {
        battery: { level: 15, state: 'unplugged', health: 85 }
      };

      const result = await provider.analyzeDeviceWithRAG(deviceData, 'battery');

      expect(result.success).toBe(true);
    });

    it('should analyze device with performance focus', async () => {
      const deviceData = {
        cpu: { usage: 95, temperature: 85 },
        memory: { usage: 90 }
      };

      const result = await provider.analyzeDeviceWithRAG(deviceData, 'performance');

      expect(result.success).toBe(true);
    });

    it('should handle RAG failure gracefully', async () => {
      mockRAGStore.getAugmentedContext.mockResolvedValueOnce({
        success: false,
        error: 'RAG error'
      });

      const result = await provider.analyzeDeviceWithRAG({}, 'general');

      expect(result.success).toBe(true); // Should still work without RAG
    });
  });

  describe('Conversational Queries', () => {
    beforeEach(async () => {
      await provider.initialize({ apiKey: mockApiKey });
    });

    it('should process conversational query', async () => {
      const query = 'How is my battery performing?';
      const deviceData = { battery: { level: 60, state: 'charging' } };

      const result = await provider.queryDeviceConversational(query, deviceData);

      expect(result.success).toBe(true);
      expect(result.input.input).toBe(query);
    });

    it('should process conversational query with RAG', async () => {
      provider.setRAGDataStore(mockRAGStore);
      
      const result = await provider.queryDeviceConversational(
        'Optimize my device performance',
        { cpu: { usage: 85 } },
        { useRAG: true }
      );

      expect(result.success).toBe(true);
    });
  });

  describe('Custom Chains', () => {
    beforeEach(async () => {
      await provider.initialize({ apiKey: mockApiKey });
    });

    it('should create custom chain successfully', async () => {
      const chainConfig = {
        template: 'Analyze this: {input}',
        inputVariables: ['input']
      };

      const result = await provider.createCustomChain('custom-analysis', chainConfig);

      expect(result.success).toBe(true);
      expect(result.chainName).toBe('custom-analysis');
      expect(provider.chains.has('custom-analysis')).toBe(true);
    });

    it('should fail to create chain without required config', async () => {
      const result = await provider.createCustomChain('invalid-chain', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('template and inputVariables');
    });

    it('should execute custom chain', async () => {
      await provider.createCustomChain('test-chain', {
        template: 'Test: {input}',
        inputVariables: ['input']
      });

      const result = await provider.executeChain('test-chain', { input: 'test data' });

      expect(result.success).toBe(true);
      expect(result.chainName).toBe('test-chain');
    });
  });

  describe('Memory Management', () => {
    beforeEach(async () => {
      await provider.initialize({ apiKey: mockApiKey });
    });

    it('should clear memory successfully', async () => {
      const result = await provider.clearMemory();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Memory cleared');
    });

    it('should handle memory operations when memory not enabled', async () => {
      const providerNoMemory = new LangChainProvider({ enableMemory: false });
      await providerNoMemory.initialize({ apiKey: mockApiKey });

      const result = await providerNoMemory.clearMemory();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Memory not enabled');
    });
  });

  describe('RAG Integration', () => {
    beforeEach(async () => {
      await provider.initialize({ apiKey: mockApiKey });
    });

    it('should set RAG data store', () => {
      provider.setRAGDataStore(mockRAGStore);

      expect(provider.ragDataStore).toBe(mockRAGStore);
    });

    it('should handle RAG augmentation failure', async () => {
      const failingRAGStore = {
        isInitialized: false
      };
      
      provider.setRAGDataStore(failingRAGStore);

      const result = await provider._augmentWithRAG({ query: 'test' });

      expect(result.success).toBe(false);
    });
  });

  describe('Status and Configuration', () => {
    beforeEach(async () => {
      await provider.initialize({ apiKey: mockApiKey }, mockRAGStore);
    });

    it('should get available chains', () => {
      const status = provider.getAvailableChains();

      expect(status.chains).toContain('device-analysis-general');
      expect(status.chains).toContain('device-analysis-battery');
      expect(status.chains).toContain('device-analysis-performance');
      expect(status.isInitialized).toBe(true);
      expect(status.ragEnabled).toBe(true);
      expect(status.memoryEnabled).toBe(true);
    });

    it('should report correct model configuration', () => {
      const status = provider.getAvailableChains();

      expect(status.model).toBe('gpt-3.5-turbo');
    });
  });
});