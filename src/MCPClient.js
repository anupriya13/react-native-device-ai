/**
 * MCPClient - Model Context Protocol integration for react-native-device-ai
 * Provides standardized connections to multiple AI providers and device data sources
 */

import { Platform } from 'react-native';
const WindowsMCPServer = require('./WindowsMCPServer');

/**
 * MCP Client for managing connections to MCP servers and AI providers
 */
class MCPClient {
  constructor() {
    this.servers = new Map();
    this.aiProviders = new Map();
    this.deviceDataSources = new Map();
    this.isInitialized = false;
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      enableFallback: true
    };
  }

  /**
   * Initialize MCP client with configuration
   * @param {Object} config - MCP configuration
   * @param {number} config.timeout - Request timeout in milliseconds
   * @param {number} config.retryAttempts - Number of retry attempts
   * @param {boolean} config.enableFallback - Enable fallback to non-MCP providers
   */
  async initialize(config = {}) {
    try {
      this.config = { ...this.config, ...config };
      
      // Initialize default AI providers
      await this._initializeDefaultProviders();
      
      // Initialize device data sources
      await this._initializeDeviceDataSources();
      
      this.isInitialized = true;
      console.log('MCP Client initialized successfully');
      
      return {
        success: true,
        providers: Array.from(this.aiProviders.keys()),
        dataSources: Array.from(this.deviceDataSources.keys())
      };
    } catch (error) {
      console.error('Failed to initialize MCP client:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Connect to an MCP server
   * @param {Object} serverConfig - Server configuration
   * @param {string} serverConfig.name - Server name
   * @param {string} serverConfig.type - Server type ('ai-provider', 'data-source', 'tool')
   * @param {string} serverConfig.endpoint - Server endpoint URL
   * @param {Object} serverConfig.auth - Authentication configuration
   */
  async connectServer(serverConfig) {
    try {
      const { name, type, endpoint, auth } = serverConfig;
      
      if (!name || !type || !endpoint) {
        throw new Error('Server configuration must include name, type, and endpoint');
      }

      // Create mock MCP server connection (since we don't have real MCP SDK yet)
      const server = new MCPServerConnection(serverConfig);
      await server.connect();
      
      this.servers.set(name, server);
      
      // Register server by type
      switch (type) {
        case 'ai-provider':
          this.aiProviders.set(name, server);
          break;
        case 'data-source':
          this.deviceDataSources.set(name, server);
          break;
        default:
          console.warn(`Unknown server type: ${type}`);
      }

      console.log(`Connected to MCP server: ${name} (${type})`);
      return { success: true, server: name };
    } catch (error) {
      console.error(`Failed to connect to MCP server ${serverConfig.name}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate AI insights using MCP providers with failover
   * @param {Object} deviceData - Device information
   * @param {string} type - Type of insights ('general', 'battery', 'performance')
   * @param {Array} preferredProviders - Ordered list of preferred providers
   */
  async generateInsights(deviceData, type = 'general', preferredProviders = []) {
    if (!this.isInitialized) {
      throw new Error('MCP client not initialized. Call initialize() first.');
    }

    const providers = preferredProviders.length > 0 
      ? preferredProviders 
      : Array.from(this.aiProviders.keys());

    let lastError;
    
    for (const providerName of providers) {
      try {
        const provider = this.aiProviders.get(providerName);
        if (!provider || !provider.isConnected()) {
          console.log(`Provider ${providerName} not available, trying next...`);
          continue;
        }

        console.log(`Attempting to generate insights using provider: ${providerName}`);
        const result = await provider.generateInsights(deviceData, type);
        
        return {
          success: true,
          insights: result,
          provider: providerName,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        lastError = error;
        console.log(`Provider ${providerName} failed: ${error.message}, trying next...`);
      }
    }

    // If all providers fail, throw the last error
    throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Collect enhanced device data using MCP data sources
   * @param {Array} dataSources - Specific data sources to query
   */
  async collectDeviceData(dataSources = []) {
    const sources = dataSources.length > 0 
      ? dataSources 
      : Array.from(this.deviceDataSources.keys());

    const deviceData = {};
    const errors = [];

    for (const sourceName of sources) {
      try {
        const source = this.deviceDataSources.get(sourceName);
        if (!source || !source.isConnected()) {
          console.log(`Data source ${sourceName} not available`);
          continue;
        }

        const data = await source.collectData();
        deviceData[sourceName] = data;
      } catch (error) {
        errors.push({ source: sourceName, error: error.message });
        console.error(`Failed to collect data from ${sourceName}:`, error);
      }
    }

    return {
      success: errors.length === 0,
      data: deviceData,
      errors: errors,
      sources: sources
    };
  }

  /**
   * Get available AI providers and their status
   */
  getProviderStatus() {
    const status = {};
    
    for (const [name, provider] of this.aiProviders) {
      status[name] = {
        connected: provider.isConnected(),
        type: provider.getType(),
        capabilities: provider.getCapabilities(),
        lastUsed: provider.getLastUsed()
      };
    }
    
    return status;
  }

  /**
   * Get available data sources and their status
   */
  getDataSourceStatus() {
    const status = {};
    
    for (const [name, source] of this.deviceDataSources) {
      status[name] = {
        connected: source.isConnected(),
        type: source.getType(),
        capabilities: source.getCapabilities(),
        lastCollected: source.getLastCollected()
      };
    }
    
    return status;
  }

  /**
   * Disconnect from all MCP servers
   */
  async disconnect() {
    const disconnectPromises = [];
    
    for (const [name, server] of this.servers) {
      disconnectPromises.push(
        server.disconnect().catch(error => 
          console.error(`Failed to disconnect from ${name}:`, error)
        )
      );
    }
    
    await Promise.allSettled(disconnectPromises);
    
    this.servers.clear();
    this.aiProviders.clear();
    this.deviceDataSources.clear();
    this.isInitialized = false;
    
    console.log('Disconnected from all MCP servers');
  }

  /**
   * Initialize default AI providers
   * @private
   */
  async _initializeDefaultProviders() {
    // Azure OpenAI provider (existing)
    if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
      await this.connectServer({
        name: 'azure-openai',
        type: 'ai-provider',
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        auth: {
          apiKey: process.env.AZURE_OPENAI_API_KEY,
          type: 'api-key'
        }
      });
    }

    // OpenAI provider
    if (process.env.OPENAI_API_KEY) {
      await this.connectServer({
        name: 'openai',
        type: 'ai-provider',
        endpoint: 'https://api.openai.com',
        auth: {
          apiKey: process.env.OPENAI_API_KEY,
          type: 'bearer'
        }
      });
    }

    // Anthropic provider
    if (process.env.ANTHROPIC_API_KEY) {
      await this.connectServer({
        name: 'anthropic',
        type: 'ai-provider',
        endpoint: 'https://api.anthropic.com',
        auth: {
          apiKey: process.env.ANTHROPIC_API_KEY,
          type: 'x-api-key'
        }
      });
    }
  }

  /**
   * Initialize device data sources including OS-specific servers
   * @private
   */
  async _initializeDeviceDataSources() {
    // System data source (generic)
    await this.connectServer({
      name: 'system-monitor',
      type: 'data-source',
      endpoint: 'local://system',
      auth: { type: 'none' }
    });

    // Battery data source (generic)
    await this.connectServer({
      name: 'battery-monitor',
      type: 'data-source',
      endpoint: 'local://battery',
      auth: { type: 'none' }
    });

    // Network data source (generic)
    await this.connectServer({
      name: 'network-monitor',
      type: 'data-source',
      endpoint: 'local://network',
      auth: { type: 'none' }
    });

    // Initialize OS-specific MCP servers
    await this._initializeOSSpecificServers();
  }

  /**
   * Initialize OS-specific MCP servers based on current platform
   * @private
   */
  async _initializeOSSpecificServers() {
    try {
      if (Platform.OS !== 'windows') {
        console.log(`MCP server only supported on Windows platform, current platform: ${Platform.OS}`);
        return;
      }

      const windowsServer = new WindowsMCPServer();
      if (windowsServer.isAvailable()) {
        await windowsServer.connect();
        this.deviceDataSources.set(windowsServer.name, windowsServer);
        console.log('Windows-specific MCP server initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Windows MCP server:', error);
      // Don't throw error - fallback to generic servers
    }
  }
}

/**
 * Mock MCP Server Connection class
 * In a real implementation, this would use the actual MCP SDK
 */
class MCPServerConnection {
  constructor(config) {
    this.config = config;
    this.connected = false;
    this.lastUsed = null;
    this.lastCollected = null;
  }

  async connect() {
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 100));
    this.connected = true;
    console.log(`Connected to MCP server: ${this.config.name}`);
  }

  async disconnect() {
    this.connected = false;
    console.log(`Disconnected from MCP server: ${this.config.name}`);
  }

  isConnected() {
    return this.connected;
  }

  getType() {
    return this.config.type;
  }

  getCapabilities() {
    // Return mock capabilities based on server type
    switch (this.config.type) {
      case 'ai-provider':
        return ['text-generation', 'analysis', 'recommendations'];
      case 'data-source':
        return ['real-time-monitoring', 'historical-data', 'metrics'];
      default:
        return [];
    }
  }

  getLastUsed() {
    return this.lastUsed;
  }

  getLastCollected() {
    return this.lastCollected;
  }

  async generateInsights(deviceData, type) {
    this.lastUsed = new Date().toISOString();
    
    // Mock AI generation based on provider
    switch (this.config.name) {
      case 'azure-openai':
        return this._generateAzureOpenAIInsights(deviceData, type);
      case 'openai':
        return this._generateOpenAIInsights(deviceData, type);
      case 'anthropic':
        return this._generateAnthropicInsights(deviceData, type);
      default:
        throw new Error(`Unknown AI provider: ${this.config.name}`);
    }
  }

  async collectData() {
    this.lastCollected = new Date().toISOString();
    
    // Mock data collection based on data source
    switch (this.config.name) {
      case 'system-monitor':
        return this._collectSystemData();
      case 'battery-monitor':
        return this._collectBatteryData();
      case 'network-monitor':
        return this._collectNetworkData();
      default:
        throw new Error(`Unknown data source: ${this.config.name}`);
    }
  }

  // Mock AI insight generation methods
  _generateAzureOpenAIInsights(deviceData, type) {
    return `[Azure OpenAI] Generated ${type} insights for device with ${JSON.stringify(deviceData).length} bytes of data`;
  }

  _generateOpenAIInsights(deviceData, type) {
    return `[OpenAI] Generated ${type} insights for device with ${JSON.stringify(deviceData).length} bytes of data`;
  }

  _generateAnthropicInsights(deviceData, type) {
    return `[Anthropic] Generated ${type} insights for device with ${JSON.stringify(deviceData).length} bytes of data`;
  }

  // Mock data collection methods
  _collectSystemData() {
    return {
      timestamp: new Date().toISOString(),
      source: 'system-monitor',
      metrics: {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        temperature: 40 + Math.random() * 30
      }
    };
  }

  _collectBatteryData() {
    return {
      timestamp: new Date().toISOString(),
      source: 'battery-monitor',
      metrics: {
        level: Math.floor(Math.random() * 100),
        charging: Math.random() > 0.5,
        health: 85 + Math.random() * 15,
        cycleCount: Math.floor(Math.random() * 1000)
      }
    };
  }

  _collectNetworkData() {
    return {
      timestamp: new Date().toISOString(),
      source: 'network-monitor',
      metrics: {
        connected: true,
        connectionType: 'wifi',
        signalStrength: Math.floor(Math.random() * 100),
        dataUsage: Math.floor(Math.random() * 1000000)
      }
    };
  }
}

module.exports = MCPClient;