/**
 * Tests for Enhanced MCP functionality with RAG and LangChain integration
 */

// Mock React Native dependencies first
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Dimensions: { get: () => ({ width: 375, height: 812 }) },
  NativeModules: {}
}));

// Mock the native dependencies
jest.mock('../src/WindowsMCPServer', () => {
  return jest.fn().mockImplementation(() => ({
    isAvailable: () => false,
    connect: jest.fn(),
    name: 'windows-mcp',
    collectData: jest.fn()
  }));
});

jest.mock('../src/AndroidMCPServer', () => {
  return jest.fn().mockImplementation(() => ({
    isAvailable: () => false,
    connect: jest.fn(),
    name: 'android-mcp'
  }));
});

jest.mock('../src/iOSMCPServer', () => {
  return jest.fn().mockImplementation(() => ({
    isAvailable: () => false,
    connect: jest.fn(),
    name: 'ios-mcp'
  }));
});

const { Enhanced } = require('../index.js');

// Mock the dependencies
jest.mock('../src/MCPClient');
jest.mock('../src/RAGDataStore');
jest.mock('../src/LangChainProvider');

const MCPClient = require('../src/MCPClient');
const RAGDataStore = require('../src/RAGDataStore');
const LangChainProvider = require('../src/LangChainProvider');

describe('Enhanced MCP with RAG and LangChain', () => {
  let mockMCPClient;
  let mockRAGStore;
  let mockLangChainProvider;

  beforeEach(() => {
    // Setup mocks
    mockRAGStore = {
      initialize: jest.fn().mockResolvedValue({ success: true }),
      ingestDocument: jest.fn().mockResolvedValue({ success: true, documentId: 'test-doc' }),
      searchDocuments: jest.fn().mockResolvedValue({ 
        success: true, 
        results: [{ content: 'test content', score: 0.8 }] 
      }),
      getStatistics: jest.fn().mockReturnValue({ totalDocuments: 1, isInitialized: true })
    };

    mockLangChainProvider = {
      initialize: jest.fn().mockResolvedValue({ success: true }),
      analyzeDeviceWithRAG: jest.fn().mockResolvedValue({ 
        success: true, 
        result: 'Advanced analysis result',
        ragUsed: true 
      }),
      executeChain: jest.fn().mockResolvedValue({ success: true, result: 'Chain result' }),
      createCustomChain: jest.fn().mockResolvedValue({ success: true }),
      queryDeviceConversational: jest.fn().mockResolvedValue({ 
        success: true, 
        result: 'Conversational response' 
      }),
      getAvailableChains: jest.fn().mockReturnValue({ 
        chains: ['device-analysis-general'], 
        isInitialized: true 
      })
    };

    mockMCPClient = {
      initialize: jest.fn().mockResolvedValue({ 
        success: true, 
        providers: ['azure-openai', 'langchain'], 
        ragEnabled: true,
        langChainEnabled: true 
      }),
      generateInsights: jest.fn().mockResolvedValue({ 
        success: true, 
        insights: 'Generated insights',
        provider: 'langchain',
        processingMode: 'advanced',
        ragUsed: true 
      }),
      ingestDocuments: jest.fn().mockResolvedValue({ success: true }),
      searchDocuments: jest.fn().mockResolvedValue({ success: true }),
      executeLangChain: jest.fn().mockResolvedValue({ success: true }),
      createCustomChain: jest.fn().mockResolvedValue({ success: true }),
      processConversationalQuery: jest.fn().mockResolvedValue({ success: true }),
      getAdvancedStatus: jest.fn().mockReturnValue({ 
        ragEnabled: true, 
        langChainEnabled: true 
      }),
      getProviderStatus: jest.fn().mockReturnValue({
        'azure-openai': { connected: true, type: 'ai-provider' },
        'langchain': { connected: true, type: 'langchain', ragEnabled: true }
      })
    };

    // Mock constructors
    MCPClient.mockImplementation(() => mockMCPClient);
    RAGDataStore.mockImplementation(() => mockRAGStore);
    LangChainProvider.mockImplementation(() => mockLangChainProvider);

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('Initialization with RAG and LangChain', () => {
    it('should initialize MCP with RAG and LangChain enabled', async () => {
      const result = await Enhanced.initializeMCP({
        enableRAG: true,
        enableLangChain: true,
        ragConfig: { apiKey: 'test-key' },
        langChainConfig: { apiKey: 'test-key', model: 'gpt-4' }
      });

      expect(result.success).toBe(true);
      expect(result.ragEnabled).toBe(true);
      expect(result.langChainEnabled).toBe(true);
      expect(mockMCPClient.initialize).toHaveBeenCalledWith({
        enableRAG: true,
        enableLangChain: true,
        ragConfig: { apiKey: 'test-key' },
        langChainConfig: { apiKey: 'test-key', model: 'gpt-4' }
      });
    });

    it('should initialize with only RAG enabled', async () => {
      const result = await Enhanced.initializeMCP({
        enableRAG: true,
        enableLangChain: false,
        ragConfig: { apiKey: 'test-key' }
      });

      expect(result.success).toBe(true);
      expect(mockMCPClient.initialize).toHaveBeenCalledWith({
        enableRAG: true,
        enableLangChain: false,
        ragConfig: { apiKey: 'test-key' }
      });
    });

    it('should initialize with only LangChain enabled', async () => {
      const result = await Enhanced.initializeMCP({
        enableRAG: false,
        enableLangChain: true,
        langChainConfig: { apiKey: 'test-key' }
      });

      expect(result.success).toBe(true);
      expect(mockMCPClient.initialize).toHaveBeenCalledWith({
        enableRAG: false,
        enableLangChain: true,
        langChainConfig: { apiKey: 'test-key' }
      });
    });
  });

  describe('Enhanced Device Insights with RAG and LangChain', () => {
    beforeEach(async () => {
      await Enhanced.initializeMCP({ 
        enableRAG: true, 
        enableLangChain: true,
        ragConfig: { apiKey: 'test-key' },
        langChainConfig: { apiKey: 'test-key' }
      });
    });

    it('should get device insights with RAG and LangChain', async () => {
      const result = await Enhanced.getDeviceInsights({
        useRAG: true,
        useLangChain: true,
        preferredProviders: ['langchain'],
        ragOptions: { k: 5 },
        langChainOptions: { analysisType: 'comprehensive' }
      });

      expect(result.success).toBe(true);
      expect(result.processing.processingMode).toBe('advanced');
      expect(result.processing.ragUsed).toBe(true);
      expect(result.advancedFeatures.ragUsed).toBe(true);
      expect(result.advancedFeatures.advancedProcessing).toBe(true);
    });

    it('should fallback gracefully when advanced features fail', async () => {
      mockMCPClient.generateInsights.mockResolvedValueOnce({
        success: true,
        insights: 'Standard insights',
        provider: 'azure-openai',
        processingMode: 'standard',
        ragUsed: false
      });

      const result = await Enhanced.getDeviceInsights({
        useRAG: true,
        useLangChain: true
      });

      expect(result.success).toBe(true);
      expect(result.processing.processingMode).toBe('standard');
    });
  });

  describe('RAG Document Management', () => {
    beforeEach(async () => {
      await Enhanced.initializeMCP({ 
        enableRAG: true,
        ragConfig: { apiKey: 'test-key' }
      });
    });

    it('should ingest documents for RAG', async () => {
      const documents = [
        {
          id: 'ios-battery-guide',
          content: 'iOS battery optimization best practices...',
          metadata: { platform: 'ios', type: 'guide' },
          type: 'text'
        },
        {
          id: 'android-performance',
          content: 'Android performance tuning techniques...',
          metadata: { platform: 'android', type: 'guide' },
          type: 'text'
        }
      ];

      const result = await Enhanced.ingestDocuments(documents);

      expect(result.success).toBe(true);
      expect(mockMCPClient.ingestDocuments).toHaveBeenCalledWith(documents);
    });

    it('should search documents using semantic similarity', async () => {
      const result = await Enhanced.searchDocuments('battery optimization', {
        k: 3,
        filter: { platform: 'ios' }
      });

      expect(result.success).toBe(true);
      expect(mockMCPClient.searchDocuments).toHaveBeenCalledWith('battery optimization', {
        k: 3,
        filter: { platform: 'ios' }
      });
    });

    it('should handle document operations when RAG not enabled', async () => {
      // Create enhanced instance without RAG
      const Enhanced2 = require('../index.js').Enhanced;
      
      const result = await Enhanced2.ingestDocuments([]);

      expect(result.success).toBe(false);
      expect(result.error).toContain('MCP not enabled');
    });
  });

  describe('LangChain Operations', () => {
    beforeEach(async () => {
      await Enhanced.initializeMCP({ 
        enableLangChain: true,
        langChainConfig: { apiKey: 'test-key' }
      });
    });

    it('should execute LangChain chains', async () => {
      const result = await Enhanced.executeLangChain('device-analysis-battery', {
        deviceData: JSON.stringify({ battery: { level: 25 } })
      }, { useRAG: true });

      expect(result.success).toBe(true);
      expect(mockMCPClient.executeLangChain).toHaveBeenCalledWith(
        'device-analysis-battery',
        { deviceData: JSON.stringify({ battery: { level: 25 } }) },
        { useRAG: true }
      );
    });

    it('should create custom chains', async () => {
      const chainConfig = {
        template: 'Analyze device {deviceType}: {data}',
        inputVariables: ['deviceType', 'data']
      };

      const result = await Enhanced.createCustomChain('custom-device-analysis', chainConfig);

      expect(result.success).toBe(true);
      expect(mockMCPClient.createCustomChain).toHaveBeenCalledWith(
        'custom-device-analysis',
        chainConfig
      );
    });

    it('should process conversational queries', async () => {
      const result = await Enhanced.processConversationalQuery(
        'How can I improve my battery life?',
        { useRAG: true, dataSources: ['battery-monitor'] }
      );

      expect(result.success).toBe(true);
      expect(mockMCPClient.processConversationalQuery).toHaveBeenCalled();
    });
  });

  describe('Advanced Status and Monitoring', () => {
    beforeEach(async () => {
      await Enhanced.initializeMCP({ 
        enableRAG: true, 
        enableLangChain: true,
        ragConfig: { apiKey: 'test-key' },
        langChainConfig: { apiKey: 'test-key' }
      });
    });

    it('should get advanced status information', async () => {
      const result = await Enhanced.getAdvancedStatus();

      expect(result.success).toBe(true);
      expect(result.ragEnabled).toBe(true);
      expect(result.langChainEnabled).toBe(true);
      expect(mockMCPClient.getAdvancedStatus).toHaveBeenCalled();
    });

    it('should get provider status including advanced features', async () => {
      const providers = Enhanced.getProviderStatus();

      expect(providers['langchain']).toBeDefined();
      expect(providers['langchain'].ragEnabled).toBe(true);
      expect(providers['langchain'].type).toBe('langchain');
    });
  });

  describe('Integration Scenarios', () => {
    beforeEach(async () => {
      await Enhanced.initializeMCP({ 
        enableRAG: true, 
        enableLangChain: true,
        ragConfig: { apiKey: 'test-key' },
        langChainConfig: { apiKey: 'test-key' }
      });
    });

    it('should perform end-to-end RAG-enhanced device analysis', async () => {
      // 1. Ingest device knowledge base
      await Enhanced.ingestDocuments([
        {
          id: 'battery-guide',
          content: 'Battery optimization techniques for mobile devices...',
          type: 'text'
        }
      ]);

      // 2. Get device insights with RAG
      const insights = await Enhanced.getDeviceInsights({
        useRAG: true,
        useLangChain: true
      });

      // 3. Search for specific information
      const searchResults = await Enhanced.searchDocuments('battery optimization');

      expect(insights.success).toBe(true);
      expect(insights.advancedFeatures.ragUsed).toBe(true);
      expect(searchResults.success).toBe(true);
    });

    it('should handle mixed provider scenarios', async () => {
      // Test scenario where LangChain is primary but falls back to other providers
      const result = await Enhanced.getDeviceInsights({
        preferredProviders: ['langchain', 'azure-openai'],
        useRAG: true,
        useLangChain: true
      });

      expect(result.success).toBe(true);
    });

    it('should support natural language device queries with context', async () => {
      const query = "My phone feels slow and the battery drains quickly. What should I do?";
      
      const result = await Enhanced.processConversationalQuery(query, {
        useRAG: true,
        dataSources: ['system-monitor', 'battery-monitor']
      });

      expect(result.success).toBe(true);
      expect(mockMCPClient.processConversationalQuery).toHaveBeenCalledWith(
        query,
        expect.any(Object),
        expect.objectContaining({ useRAG: true })
      );
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle RAG initialization failure gracefully', async () => {
      mockMCPClient.initialize.mockResolvedValueOnce({
        success: true,
        ragEnabled: false,
        langChainEnabled: true,
        providers: ['azure-openai']
      });

      const result = await Enhanced.initializeMCP({
        enableRAG: true,
        enableLangChain: true
      });

      expect(result.success).toBe(true);
      expect(result.ragEnabled).toBe(false);
      expect(result.langChainEnabled).toBe(true);
    });

    it('should handle LangChain initialization failure gracefully', async () => {
      mockMCPClient.initialize.mockResolvedValueOnce({
        success: true,
        ragEnabled: true,
        langChainEnabled: false,
        providers: ['azure-openai']
      });

      const result = await Enhanced.initializeMCP({
        enableRAG: true,
        enableLangChain: true
      });

      expect(result.success).toBe(true);
      expect(result.ragEnabled).toBe(true);
      expect(result.langChainEnabled).toBe(false);
    });

    it('should provide meaningful error messages for unsupported operations', async () => {
      // Test without initialization
      const Enhanced2 = require('../index.js').Enhanced;
      
      const result = await Enhanced2.executeLangChain('test-chain', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('MCP not enabled');
    });
  });
});