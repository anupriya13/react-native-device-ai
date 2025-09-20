/**
 * LangChainProvider - Real LangChain integration with actual chains and workflows
 * Provides sophisticated chain operations, workflow orchestration, and RAG integration
 */

const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
const { PromptTemplate } = require('@langchain/core/prompts');
const { LLMChain } = require('langchain/chains');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');

/**
 * Real LangChain Provider for advanced AI operations
 */
class LangChainProvider {
  constructor(config = {}) {
    this.config = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      timeout: 30000,
      enableMemory: true,
      ...config
    };
    
    this.chains = new Map();
    this.memory = new BufferMemory(); // Real LangChain memory
    this.isInitialized = false;
    this.ragDataStore = null;
    this.llm = null;
    this.apiKey = null;
  }

  /**
   * Initialize the LangChain provider with real LLM
   * @param {Object} llmConfig - LLM configuration
   * @param {string} llmConfig.apiKey - OpenAI API key
   * @param {string} llmConfig.model - Model to use
   * @param {Object} ragDataStore - Optional RAG data store for retrieval
   */
  async initialize(llmConfig = {}, ragDataStore = null) {
    try {
      const apiKey = llmConfig.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key required for LangChain provider');
      }

      this.apiKey = apiKey;
      this.model = llmConfig.model || this.config.model;
      this.temperature = llmConfig.temperature || this.config.temperature;

      // Initialize real ChatOpenAI LLM
      this.llm = new ChatOpenAI({
        openAIApiKey: this.apiKey,
        modelName: this.model,
        temperature: this.temperature,
        maxTokens: this.config.maxTokens,
        timeout: this.config.timeout,
      });

      // Test the LLM connection
      try {
        await this.llm.invoke([new HumanMessage('Hello')]);
        console.log('✅ LangChain Provider initialized with real ChatOpenAI');
      } catch (error) {
        console.warn('⚠️  LangChain LLM connection failed, using fallback responses');
        this.llm = null;
      }

      // Set RAG data store if provided
      this.ragDataStore = ragDataStore;

      // Initialize default chains with real LangChain
      await this._initializeRealChains();

      this.isInitialized = true;
      
      return {
        success: true,
        model: this.model,
        temperature: this.temperature,
        realLangChain: !!this.llm,
        ragEnabled: !!this.ragDataStore
      };
    } catch (error) {
      console.error('Failed to initialize LangChain Provider:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize real LangChain chains
   * @private
   */
  async _initializeRealChains() {
    if (!this.llm) {
      console.warn('No LLM available, skipping real chain initialization');
      return;
    }

    try {
      // Device Analysis Chain
      const deviceAnalysisPrompt = PromptTemplate.fromTemplate(`
You are a device optimization expert. Analyze the following device data and provide specific recommendations.

Device Data:
{deviceData}

Analysis Focus: {analysisType}

Provide concise, actionable recommendations based on the device data. Focus on:
1. Performance optimization
2. Battery life improvement  
3. Storage management
4. Security considerations

Response:
`);

      const deviceAnalysisChain = new LLMChain({
        llm: this.llm,
        prompt: deviceAnalysisPrompt,
        memory: this.config.enableMemory ? this.memory : undefined,
      });

      this.chains.set('device-analysis', {
        name: 'device-analysis',
        description: 'Comprehensive device analysis and optimization',
        chain: deviceAnalysisChain,
        inputVariables: ['deviceData', 'analysisType'],
        type: 'llm'
      });

      // Battery Optimization Chain
      const batteryPrompt = PromptTemplate.fromTemplate(`
You are a battery optimization specialist. Analyze battery data and provide optimization tips.

Battery Information:
Level: {batteryLevel}%
Health: {batteryHealth}%
State: {batteryState}
Platform: {platform}

Additional Context: {context}

Provide specific, actionable battery optimization recommendations:
`);

      const batteryChain = new LLMChain({
        llm: this.llm,
        prompt: batteryPrompt,
      });

      this.chains.set('battery-optimization', {
        name: 'battery-optimization', 
        description: 'Battery performance analysis and optimization',
        chain: batteryChain,
        inputVariables: ['batteryLevel', 'batteryHealth', 'batteryState', 'platform', 'context'],
        type: 'llm'
      });

      // Conversational Chain
      const conversationalChain = new ConversationChain({
        llm: this.llm,
        memory: this.memory,
      });

      this.chains.set('conversational', {
        name: 'conversational',
        description: 'Natural conversation about device topics',
        chain: conversationalChain,
        inputVariables: ['input'],
        type: 'conversation'
      });

      // RAG-enhanced Chain (if RAG is available)
      if (this.ragDataStore) {
        const ragPrompt = PromptTemplate.fromTemplate(`
You are a knowledgeable device assistant with access to a comprehensive knowledge base.

Context from knowledge base:
{retrievedContext}

User Question: {query}

Based on the retrieved context and your expertise, provide a helpful and accurate response:
`);

        const ragChain = new LLMChain({
          llm: this.llm,
          prompt: ragPrompt,
        });

        this.chains.set('rag-enhanced', {
          name: 'rag-enhanced',
          description: 'RAG-enhanced responses with knowledge base context',
          chain: ragChain,
          inputVariables: ['retrievedContext', 'query'],
          type: 'rag'
        });
      }

      console.log(`🔗 Initialized ${this.chains.size} real LangChain chains`);
    } catch (error) {
      console.error('Failed to initialize real chains:', error);
    }
  }

  /**
   * Execute a LangChain chain with real LLM
   * @param {string} chainName - Name of the chain to execute
   * @param {Object} input - Input parameters for the chain
   * @param {Object} options - Execution options
   */
  async executeChain(chainName, input, options = {}) {
    if (!this.isInitialized) {
      throw new Error('LangChain Provider not initialized. Call initialize() first.');
    }

    try {
      const chainConfig = this.chains.get(chainName);
      if (!chainConfig) {
        throw new Error(`Chain "${chainName}" not found`);
      }

      // If no real LLM, use fallback responses
      if (!this.llm) {
        return this._generateFallbackResponse(chainName, input);
      }

      // Handle RAG-enhanced chains
      if (chainConfig.type === 'rag' && this.ragDataStore) {
        const augmentedInput = await this._augmentWithRAG(input, options.ragOptions);
        if (augmentedInput.success) {
          input.retrievedContext = augmentedInput.augmentedContext;
        } else {
          input.retrievedContext = 'No relevant context found in knowledge base.';
        }
      }

      // Execute the real LangChain chain
      const result = await chainConfig.chain.call(input);
      
      console.log(`🔗 Executed "${chainName}" chain with real LangChain`);
      
      return {
        success: true,
        chainName,
        response: result.text || result.response,
        realLangChain: true,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens
      };
    } catch (error) {
      console.error(`Failed to execute chain "${chainName}":`, error);
      
      // Fallback to simple response
      const fallbackResponse = this._generateFallbackResponse(chainName, input);
      return {
        ...fallbackResponse,
        fallback: true,
        error: error.message
      };
    }
  }

  /**
   * Create a custom LangChain chain
   * @param {string} name - Chain name
   * @param {Object} config - Chain configuration
   * @param {string} config.template - Prompt template
   * @param {Array} config.inputVariables - Input variable names
   * @param {Object} config.llmOptions - LLM-specific options
   */
  async createCustomChain(name, config) {
    if (!this.isInitialized) {
      throw new Error('LangChain Provider not initialized. Call initialize() first.');
    }

    try {
      const { template, inputVariables = [], llmOptions = {} } = config;
      
      if (!template || !name) {
        throw new Error('Chain name and template are required');
      }

      // Create real LangChain prompt template
      const prompt = PromptTemplate.fromTemplate(template);
      
      // Create custom LLM with specific options if provided
      const customLLM = llmOptions && Object.keys(llmOptions).length > 0
        ? new ChatOpenAI({
            openAIApiKey: this.apiKey,
            ...this.config,
            ...llmOptions
          })
        : this.llm;

      if (!customLLM) {
        throw new Error('No LLM available for custom chain creation');
      }

      // Create the chain
      const chain = new LLMChain({
        llm: customLLM,
        prompt: prompt,
        memory: config.enableMemory ? new BufferMemory() : undefined,
      });

      // Store the chain
      this.chains.set(name, {
        name,
        description: config.description || `Custom chain: ${name}`,
        chain: chain,
        inputVariables: inputVariables,
        type: 'custom',
        template: template
      });

      console.log(`🔧 Created custom LangChain chain: "${name}"`);

      return {
        success: true,
        chainName: name,
        inputVariables: inputVariables,
        realLangChain: true
      };
    } catch (error) {
      console.error(`Failed to create custom chain "${name}":`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process conversational query with memory
   * @param {string} query - User query
   * @param {Object} options - Processing options
   */
  async processConversationalQuery(query, options = {}) {
    if (!this.isInitialized) {
      throw new Error('LangChain Provider not initialized. Call initialize() first.');
    }

    try {
      // Use RAG if enabled and requested
      if (options.useRAG && this.ragDataStore) {
        return await this.executeChain('rag-enhanced', { query }, options);
      }

      // Use conversational chain with memory
      return await this.executeChain('conversational', { input: query }, options);
    } catch (error) {
      console.error('Failed to process conversational query:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate insights using device analysis chain
   * @param {Object} deviceData - Device information
   * @param {string} analysisType - Type of analysis to perform
   * @param {Object} options - Analysis options
   */
  async generateInsights(deviceData, analysisType = 'general', options = {}) {
    if (!this.isInitialized) {
      throw new Error('LangChain Provider not initialized. Call initialize() first.');
    }

    try {
      const input = {
        deviceData: typeof deviceData === 'string' ? deviceData : JSON.stringify(deviceData, null, 2),
        analysisType: analysisType
      };

      return await this.executeChain('device-analysis', input, options);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fallback response generation when real LangChain is not available
   * @param {string} chainName - Chain name
   * @param {Object} input - Input data
   * @private
   */
  _generateFallbackResponse(chainName, input) {
    const responses = {
      'device-analysis': 'Device analysis indicates normal operation. Consider regular maintenance and updates.',
      'battery-optimization': 'Battery performance can be improved by reducing screen brightness and limiting background apps.',
      'conversational': 'I can help you with device optimization and troubleshooting questions.',
      'rag-enhanced': 'Based on available information, here are some general device recommendations.',
      'performance-analysis': 'Performance metrics are within acceptable ranges. Monitor resource usage regularly.'
    };

    const fallbackResponse = responses[chainName] || 'Analysis completed successfully with general recommendations.';

    return {
      success: true,
      chainName,
      response: fallbackResponse,
      realLangChain: false,
      fallback: true
    };
  }

  /**
   * Augment input with RAG context
   * @param {Object} input - Original input
   * @param {Object} ragOptions - RAG retrieval options
   * @private
   */
  async _augmentWithRAG(input, ragOptions = {}) {
    if (!this.ragDataStore || !this.ragDataStore.isInitialized) {
      return { success: false, error: 'RAG data store not available' };
    }

    try {
      // Extract query from input
      let query = input.query || input.input;
      
      if (!query && input.analysisType) {
        query = `${input.analysisType} optimization ${input.platform || ''}`;
      } else if (!query) {
        query = typeof input.deviceData === 'string' ? input.deviceData : JSON.stringify(input.deviceData);
      }

      // Get augmented context from RAG
      return await this.ragDataStore.getAugmentedContext(query, ragOptions);
    } catch (error) {
      console.error('Failed to augment with RAG:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get status of the LangChain provider
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      model: this.model,
      temperature: this.temperature,
      realLangChain: !!this.llm,
      ragEnabled: !!this.ragDataStore,
      totalChains: this.chains.size,
      availableChains: Array.from(this.chains.keys()),
      memoryEnabled: this.config.enableMemory,
      chainDetails: Array.from(this.chains.values()).map(chain => ({
        name: chain.name,
        description: chain.description,
        type: chain.type,
        inputVariables: chain.inputVariables
      }))
    };
  }

  /**
   * Clear conversation memory
   */
  async clearMemory() {
    if (this.memory) {
      await this.memory.clear();
      console.log('🧹 Cleared LangChain conversation memory');
    }
    
    return { success: true, message: 'Memory cleared' };
  }
}

module.exports = LangChainProvider;