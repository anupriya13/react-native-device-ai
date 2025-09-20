/**
 * Integration tests for RAG and LangChain features
 */

const RAGDataStore = require('../src/RAGDataStore');
const LangChainProvider = require('../src/LangChainProvider');
const MCPClient = require('../src/MCPClient');

// Mock React Native dependencies
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Dimensions: { get: () => ({ width: 375, height: 812 }) },
  NativeModules: {}
}));

jest.mock('../src/WindowsMCPServer', () => {
  return jest.fn().mockImplementation(() => ({
    isAvailable: () => false,
    connect: jest.fn(),
    name: 'windows-mcp'
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

describe('RAG and LangChain Integration', () => {
  const mockApiKey = 'test-api-key';

  describe('End-to-End RAG Workflow', () => {
    let ragStore;
    let langChainProvider;

    beforeEach(async () => {
      ragStore = new RAGDataStore();
      langChainProvider = new LangChainProvider();
      
      await ragStore.initialize({ apiKey: mockApiKey });
      await langChainProvider.initialize({ apiKey: mockApiKey }, ragStore);
    });

    it('should perform complete RAG-enhanced device analysis', async () => {
      // 1. Ingest device knowledge
      const knowledgeDocs = [
        {
          id: 'ios-battery-guide',
          content: 'iOS devices can optimize battery life by enabling Low Power Mode, reducing background app refresh, and adjusting screen brightness.',
          metadata: { platform: 'ios', category: 'battery' },
          type: 'text'
        },
        {
          id: 'performance-tips',
          content: 'To improve iOS performance, close unused apps, restart the device regularly, and ensure sufficient storage space.',
          metadata: { platform: 'ios', category: 'performance' },
          type: 'text'
        }
      ];

      // Ingest documents
      for (const doc of knowledgeDocs) {
        const result = await ragStore.ingestDocument(doc);
        expect(result.success).toBe(true);
      }

      // 2. Simulate device data
      const deviceData = {
        platform: 'ios',
        battery: { level: 15, state: 'unplugged', health: 85 },
        memory: { usage: 85, available: 2048 },
        storage: { used: 90, total: 64000 }
      };

      // 3. Perform RAG-enhanced analysis
      const analysisResult = await langChainProvider.analyzeDeviceWithRAG(
        deviceData, 
        'battery',
        { 
          useRAG: true,
          ragOptions: { k: 3, scoreThreshold: 0.0 }
        }
      );

      expect(analysisResult.success).toBe(true);
      // RAG may or may not find matches with our simple similarity calculation
      expect(analysisResult.result.toLowerCase()).toContain('battery');
    });

    it('should search and retrieve relevant device documentation', async () => {
      // Ingest diverse device documentation
      const docs = [
        {
          id: 'android-guide',
          content: 'Android battery optimization includes Doze mode, adaptive battery, and app standby features.',
          metadata: { platform: 'android', category: 'battery' },
          type: 'text'
        },
        {
          id: 'ios-memory',
          content: 'iOS memory management uses automatic reference counting and compressed memory to optimize RAM usage.',
          metadata: { platform: 'ios', category: 'memory' },
          type: 'text'
        }
      ];

      for (const doc of docs) {
        await ragStore.ingestDocument(doc);
      }

      // Search for battery-related content
      const batterySearch = await ragStore.searchDocuments('battery optimization', {
        k: 5,
        scoreThreshold: 0.1
      });

      expect(batterySearch.success).toBe(true);
      expect(batterySearch.results.length).toBeGreaterThan(0);
      expect(batterySearch.results[0].content).toContain('battery');

      // Search for platform-specific content
      const iosSearch = await ragStore.searchDocuments('iOS memory management', {
        k: 3,
        filter: { platform: 'ios' }
      });

      expect(iosSearch.success).toBe(true);
      expect(iosSearch.results.length).toBeGreaterThan(0);
    });
  });

  describe('LangChain Chain Operations', () => {
    let langChainProvider;

    beforeEach(async () => {
      langChainProvider = new LangChainProvider();
      await langChainProvider.initialize({ apiKey: mockApiKey });
    });

    it('should create and execute custom device analysis chains', async () => {
      // Create a custom chain for device security analysis
      const chainResult = await langChainProvider.createCustomChain('security-analysis', {
        template: `Analyze device security for {platform} platform:

Device Data: {deviceData}

Security Assessment:
1. Check for security updates
2. Review app permissions
3. Assess network security
4. Evaluate storage encryption

Analysis:`,
        inputVariables: ['platform', 'deviceData']
      });

      expect(chainResult.success).toBe(true);
      expect(chainResult.chainName).toBe('security-analysis');

      // Execute the custom chain
      const execution = await langChainProvider.executeChain('security-analysis', {
        platform: 'iOS',
        deviceData: JSON.stringify({
          platform: 'ios',
          version: '15.0',
          apps: ['Safari', 'Messages', 'Settings']
        })
      });

      expect(execution.success).toBe(true);
      expect(execution.result).toBeTruthy();
    });

    it('should handle conversational device queries', async () => {
      const deviceContext = {
        platform: 'android',
        battery: { level: 30, charging: false },
        memory: { usage: 75 },
        apps: { background: 12, foreground: 1 }
      };

      const response = await langChainProvider.queryDeviceConversational(
        'My phone battery is draining fast, what should I do?',
        deviceContext
      );

      expect(response.success).toBe(true);
      expect(response.result).toBeTruthy();
      expect(response.input.input).toContain('battery');
    });
  });

  describe('MCP Integration with RAG and LangChain', () => {
    let mcpClient;

    beforeEach(() => {
      mcpClient = new MCPClient();
    });

    it('should initialize MCP with RAG and LangChain enabled', async () => {
      const result = await mcpClient.initialize({
        enableRAG: true,
        enableLangChain: true,
        ragConfig: { apiKey: mockApiKey },
        langChainConfig: { apiKey: mockApiKey }
      });

      expect(result.success).toBe(true);
      expect(result.ragEnabled).toBe(true);
      expect(result.langChainEnabled).toBe(true);
    });

    it('should provide advanced status information', async () => {
      await mcpClient.initialize({
        enableRAG: true,
        enableLangChain: true,
        ragConfig: { apiKey: mockApiKey },
        langChainConfig: { apiKey: mockApiKey }
      });

      const status = mcpClient.getAdvancedStatus();

      expect(status.ragEnabled).toBe(true);
      expect(status.langChainEnabled).toBe(true);
      expect(status.rag).toBeDefined();
      expect(status.langChain).toBeDefined();
    });

    it('should handle document ingestion through MCP interface', async () => {
      await mcpClient.initialize({
        enableRAG: true,
        ragConfig: { apiKey: mockApiKey }
      });

      const documents = [
        {
          id: 'troubleshooting-guide',
          content: 'Common device issues and their solutions for optimal performance.',
          metadata: { category: 'troubleshooting' },
          type: 'text'
        }
      ];

      const result = await mcpClient.ingestDocuments(documents);

      expect(result.success).toBe(true);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('should search documents through MCP interface', async () => {
      await mcpClient.initialize({
        enableRAG: true,
        ragConfig: { apiKey: mockApiKey }
      });

      // First ingest a document
      await mcpClient.ingestDocuments([{
        id: 'test-doc',
        content: 'Performance optimization techniques for mobile devices',
        type: 'text'
      }]);

      // Then search for it
      const searchResult = await mcpClient.searchDocuments('performance optimization', {
        k: 3
      });

      expect(searchResult.success).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle RAG operations without initialization', async () => {
      const uninitializedStore = new RAGDataStore();

      await expect(uninitializedStore.ingestDocument({
        id: 'test',
        content: 'test content'
      })).rejects.toThrow('not initialized');
    });

    it('should handle LangChain operations without initialization', async () => {
      const uninitializedProvider = new LangChainProvider();

      await expect(uninitializedProvider.executeChain('test', {}))
        .rejects.toThrow('not initialized');
    });

    it('should gracefully handle missing API keys', async () => {
      const ragStore = new RAGDataStore();
      const result = await ragStore.initialize();

      expect(result.success).toBe(false);
      expect(result.error).toContain('No API key provided');
    });
  });
});