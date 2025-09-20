/**
 * Tests for RAG Data Store functionality
 */

const RAGDataStore = require('../src/RAGDataStore');

describe('RAGDataStore', () => {
  let ragStore;
  const mockApiKey = 'test-openai-key';

  beforeEach(() => {
    ragStore = new RAGDataStore();
    // Clear console logs
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize successfully with API key', async () => {
      const result = await ragStore.initialize({ apiKey: mockApiKey });
      
      expect(result.success).toBe(true);
      expect(result.embeddingModel).toBe('text-embedding-3-small');
      expect(ragStore.isInitialized).toBe(true);
    });

    it('should fail initialization without API key', async () => {
      const result = await ragStore.initialize();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('No API key provided');
      expect(ragStore.isInitialized).toBe(false);
    });

    it('should use custom embedding model configuration', async () => {
      const customModel = 'text-embedding-ada-002';
      const result = await ragStore.initialize({ 
        apiKey: mockApiKey, 
        model: customModel 
      });
      
      expect(result.success).toBe(true);
      expect(result.embeddingModel).toBe(customModel);
    });
  });

  describe('Document Ingestion', () => {
    beforeEach(async () => {
      await ragStore.initialize({ apiKey: mockApiKey });
    });

    it('should ingest a text document successfully', async () => {
      const document = {
        id: 'test-doc-1',
        content: 'This is a test document with some content for RAG testing. It has multiple sentences to test chunking.',
        metadata: { author: 'test', category: 'test' },
        type: 'text'
      };

      const result = await ragStore.ingestDocument(document);

      expect(result.success).toBe(true);
      expect(result.documentId).toBe('test-doc-1');
      expect(result.chunksCreated).toBeGreaterThan(0);
      expect(ragStore.documents.has('test-doc-1')).toBe(true);
    });

    it('should ingest device data document', async () => {
      const deviceData = {
        platform: 'ios',
        battery: { level: 85, state: 'unplugged' },
        memory: { usage: 65 }
      };

      const document = {
        id: 'device-data-1',
        content: JSON.stringify(deviceData),
        metadata: { type: 'device-info', platform: 'ios' },
        type: 'device-data'
      };

      const result = await ragStore.ingestDocument(document);

      expect(result.success).toBe(true);
      expect(result.documentId).toBe('device-data-1');
    });

    it('should fail to ingest document without required fields', async () => {
      const result = await ragStore.ingestDocument({ content: 'test' });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Document must have id and content');
    });

    it('should fail if RAG store is not initialized', async () => {
      const uninitializedStore = new RAGDataStore();
      const document = {
        id: 'test-doc',
        content: 'test content',
        type: 'text'
      };

      await expect(uninitializedStore.ingestDocument(document)).rejects.toThrow('not initialized');
    });
  });

  describe('Document Search', () => {
    beforeEach(async () => {
      await ragStore.initialize({ apiKey: mockApiKey });
      
      // Ingest some test documents
      await ragStore.ingestDocument({
        id: 'doc1',
        content: 'iOS battery optimization techniques for better performance',
        type: 'text'
      });
      
      await ragStore.ingestDocument({
        id: 'doc2',
        content: 'Android performance tuning guide with battery tips',
        type: 'text'
      });
    });

    it('should search documents successfully', async () => {
      const result = await ragStore.searchDocuments('battery optimization');

      expect(result.success).toBe(true);
      expect(result.query).toBe('battery optimization');
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]).toHaveProperty('content');
      expect(result.results[0]).toHaveProperty('score');
      expect(result.results[0]).toHaveProperty('documentId');
    });

    it('should search with custom options', async () => {
      const options = {
        k: 1,
        scoreThreshold: 0.0,
        filter: { type: 'text' }
      };

      const result = await ragStore.searchDocuments('performance', options);

      expect(result.success).toBe(true);
      expect(result.results.length).toBeGreaterThan(0);
    });

    it('should return augmented context', async () => {
      const result = await ragStore.getAugmentedContext('battery optimization');

      expect(result.success).toBe(true);
      expect(result.query).toBe('battery optimization');
      expect(result.augmentedContext).toBeTruthy();
      expect(result.sources).toBeDefined();
    });

    it('should fail search without query', async () => {
      const result = await ragStore.searchDocuments('');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Query must be a non-empty string');
    });
  });

  describe('Document Management', () => {
    beforeEach(async () => {
      await ragStore.initialize({ apiKey: mockApiKey });
      await ragStore.ingestDocument({
        id: 'test-doc',
        content: 'test content',
        type: 'text'
      });
    });

    it('should get statistics', () => {
      const stats = ragStore.getStatistics();

      expect(stats.isInitialized).toBe(true);
      expect(stats.totalDocuments).toBe(1);
      expect(stats.chunkSize).toBe(1000);
      expect(stats.documents).toHaveLength(1);
    });

    it('should remove document', async () => {
      const result = await ragStore.removeDocument('test-doc');

      expect(result.success).toBe(true);
      expect(ragStore.documents.has('test-doc')).toBe(false);
    });

    it('should clear all documents', async () => {
      const result = await ragStore.clearDocuments();

      expect(result.success).toBe(true);
      expect(ragStore.documents.size).toBe(0);
    });
  });

  describe('Content Preprocessing', () => {
    beforeEach(async () => {
      await ragStore.initialize({ apiKey: mockApiKey });
    });

    it('should preprocess JSON content', async () => {
      const jsonContent = '{"key":"value","nested":{"array":[1,2,3]}}';
      const document = {
        id: 'json-doc',
        content: jsonContent,
        type: 'json'
      };

      const result = await ragStore.ingestDocument(document);
      expect(result.success).toBe(true);
    });

    it('should preprocess markdown content', async () => {
      const markdownContent = '# Header\n**Bold text** and *italic text*';
      const document = {
        id: 'md-doc',
        content: markdownContent,
        type: 'markdown'
      };

      const result = await ragStore.ingestDocument(document);
      expect(result.success).toBe(true);
    });

    it('should handle device data type', async () => {
      const deviceData = { platform: 'ios', version: '15.0' };
      const document = {
        id: 'device-doc',
        content: deviceData,
        type: 'device-data'
      };

      const result = await ragStore.ingestDocument(document);
      expect(result.success).toBe(true);
    });
  });
});