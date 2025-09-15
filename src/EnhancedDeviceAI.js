const { Platform, Dimensions } = require('react-native');
const AzureOpenAI = require('./AzureOpenAI.js');
const MCPClient = require('./MCPClient.js');

// Try to import the native module with fallback handling
let NativeDeviceAI = null;
try {
  const NativeModule = require('./NativeDeviceAI.js');
  NativeDeviceAI = NativeModule;
} catch (error) {
  console.log('Native DeviceAI module not available, using JavaScript fallback:', error.message);
}

/**
 * Enhanced DeviceAI with MCP (Model Context Protocol) support
 * Provides multi-provider AI support and enhanced device data collection
 */
class EnhancedDeviceAI {
  constructor() {
    this.deviceInfo = null;
    this.lastUpdate = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Initialize MCP client
    this.mcpClient = new MCPClient();
    this.mcpEnabled = false;
    
    // Legacy Azure OpenAI support for backward compatibility
    this._autoConfigureFromEnvironment();
  }

  /**
   * Initialize MCP client with optional configuration
   * @param {Object} mcpConfig - MCP configuration options
   * @returns {Promise<Object>} Initialization result
   */
  async initializeMCP(mcpConfig = {}) {
    try {
      const result = await this.mcpClient.initialize(mcpConfig);
      this.mcpEnabled = result.success;
      
      if (this.mcpEnabled) {
        console.log('MCP integration enabled successfully');
        console.log('Available AI providers:', result.providers);
        console.log('Available data sources:', result.dataSources);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to initialize MCP:', error);
      this.mcpEnabled = false;
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Configure AI provider (legacy method for backward compatibility)
   * @param {Object} config - Provider configuration
   */
  configure(config) {
    // Legacy Azure OpenAI configuration
    AzureOpenAI.setConfig(config);
  }

  /**
   * Add an MCP server connection
   * @param {Object} serverConfig - Server configuration
   */
  async addMCPServer(serverConfig) {
    if (!this.mcpClient) {
      throw new Error('MCP client not initialized');
    }
    
    return await this.mcpClient.connectServer(serverConfig);
  }

  /**
   * Get comprehensive AI-powered device insights with MCP support
   * @param {Object} options - Options for insight generation
   * @param {Array} options.preferredProviders - Preferred AI providers in order
   * @param {Array} options.dataSources - Specific data sources to use
   * @returns {Promise<Object>} Device insights with AI recommendations
   */
  async getDeviceInsights(options = {}) {
    try {
      const { preferredProviders = [], dataSources = [] } = options;
      
      // Collect device data using MCP if available, otherwise use legacy method
      const deviceData = this.mcpEnabled 
        ? await this._collectEnhancedDeviceInfo(dataSources)
        : await this._collectDeviceInfo();
      
      let aiInsights;
      
      try {
        if (this.mcpEnabled) {
          // Use MCP for AI insights with failover
          const mcpResult = await this.mcpClient.generateInsights(
            deviceData, 
            'general', 
            preferredProviders
          );
          aiInsights = mcpResult.insights;
        } else if (AzureOpenAI.isConfigured()) {
          // Fallback to legacy Azure OpenAI
          aiInsights = await AzureOpenAI.generateInsights(deviceData, 'general');
        } else {
          // Fallback to static insights
          aiInsights = this._generateFallbackInsights(deviceData);
        }
      } catch (aiError) {
        console.log('AI service unavailable, using fallback insights:', aiError.message);
        aiInsights = this._generateFallbackInsights(deviceData);
      }

      return {
        success: true,
        deviceInfo: deviceData,
        insights: aiInsights,
        recommendations: this._generateBasicRecommendations(deviceData),
        mcpEnabled: this.mcpEnabled,
        providers: this.mcpEnabled ? this.mcpClient.getProviderStatus() : null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting device insights:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get AI-powered battery optimization advice with MCP support
   * @param {Object} options - Options for battery advice
   * @returns {Promise<Object>} Battery optimization recommendations
   */
  async getBatteryAdvice(options = {}) {
    try {
      const { preferredProviders = [] } = options;
      
      const deviceData = this.mcpEnabled 
        ? await this._collectEnhancedDeviceInfo(['battery-monitor', 'system-monitor'])
        : await this._collectDeviceInfo();
      
      const batteryData = this._extractBatteryInfo(deviceData);
      let aiAdvice;
      
      try {
        if (this.mcpEnabled) {
          const mcpResult = await this.mcpClient.generateInsights(
            batteryData, 
            'battery', 
            preferredProviders
          );
          aiAdvice = mcpResult.insights;
        } else if (AzureOpenAI.isConfigured()) {
          aiAdvice = await AzureOpenAI.generateInsights(batteryData, 'battery');
        } else {
          aiAdvice = this._generateFallbackBatteryAdvice(batteryData);
        }
      } catch (aiError) {
        console.log('AI service unavailable, using fallback battery advice:', aiError.message);
        aiAdvice = this._generateFallbackBatteryAdvice(batteryData);
      }

      return {
        success: true,
        batteryInfo: batteryData,
        advice: aiAdvice,
        tips: this._getBatteryTips(),
        mcpEnabled: this.mcpEnabled,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting battery advice:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get AI-powered performance optimization tips with MCP support
   * @param {Object} options - Options for performance tips
   * @returns {Promise<Object>} Performance optimization recommendations
   */
  async getPerformanceTips(options = {}) {
    try {
      const { preferredProviders = [] } = options;
      
      const deviceData = this.mcpEnabled 
        ? await this._collectEnhancedDeviceInfo(['system-monitor', 'network-monitor'])
        : await this._collectDeviceInfo();
      
      const performanceData = this._extractPerformanceInfo(deviceData);
      let aiTips;
      
      try {
        if (this.mcpEnabled) {
          const mcpResult = await this.mcpClient.generateInsights(
            performanceData, 
            'performance', 
            preferredProviders
          );
          aiTips = mcpResult.insights;
        } else if (AzureOpenAI.isConfigured()) {
          aiTips = await AzureOpenAI.generateInsights(performanceData, 'performance');
        } else {
          aiTips = this._generateFallbackPerformanceTips(performanceData);
        }
      } catch (aiError) {
        console.log('AI service unavailable, using fallback performance tips:', aiError.message);
        aiTips = this._generateFallbackPerformanceTips(performanceData);
      }

      return {
        success: true,
        performanceInfo: performanceData,
        tips: aiTips,
        recommendations: this._getPerformanceRecommendations(),
        mcpEnabled: this.mcpEnabled,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting performance tips:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Natural language device queries with MCP support
   * @param {string} query - User's natural language query
   * @param {Object} options - Query options
   * @returns {Promise<Object>} AI response to user query
   */
  async queryDeviceInfo(query, options = {}) {
    try {
      const { preferredProviders = [], includeContext = true } = options;
      
      if (!query || typeof query !== 'string') {
        throw new Error('Query must be a non-empty string');
      }
      
      // Collect relevant device data
      const deviceData = includeContext 
        ? (this.mcpEnabled 
            ? await this._collectEnhancedDeviceInfo()
            : await this._collectDeviceInfo())
        : {};
      
      const relevantData = this._extractRelevantData(query, deviceData);
      let response;
      
      try {
        if (this.mcpEnabled) {
          // Use MCP to process natural language query
          const mcpResult = await this.mcpClient.generateInsights(
            { query, relevantData }, 
            'query', 
            preferredProviders
          );
          response = mcpResult.insights;
        } else if (AzureOpenAI.isConfigured()) {
          // Fallback to legacy Azure OpenAI
          response = await AzureOpenAI.generateCustomResponse(query, relevantData);
        } else {
          // Static response based on query
          response = this._generateStaticResponse(query, relevantData);
        }
      } catch (aiError) {
        console.log('AI service unavailable, using static response:', aiError.message);
        response = this._generateStaticResponse(query, relevantData);
      }

      return {
        success: true,
        query: query,
        response: response,
        relevantData: relevantData,
        mcpEnabled: this.mcpEnabled,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error processing device query:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get MCP client status and capabilities
   * @returns {Object} MCP status information
   */
  getMCPStatus() {
    if (!this.mcpEnabled) {
      return {
        enabled: false,
        reason: 'MCP client not initialized'
      };
    }
    
    return {
      enabled: true,
      providers: this.mcpClient.getProviderStatus(),
      dataSources: this.mcpClient.getDataSourceStatus(),
      initialized: this.mcpClient.isInitialized
    };
  }

  /**
   * Check if native module is available
   * @returns {boolean} True if native module is available
   */
  isNativeModuleAvailable() {
    return NativeDeviceAI !== null;
  }

  /**
   * Get supported features including MCP capabilities
   * @returns {Array<string>} List of supported features
   */
  getSupportedFeatures() {
    const features = [
      'device-insights',
      'battery-advice', 
      'performance-tips',
      'natural-language-queries'
    ];
    
    if (this.isNativeModuleAvailable()) {
      features.push('native-device-info');
      if (Platform.OS === 'windows') {
        features.push('windows-system-info');
      }
    }
    
    if (this.mcpEnabled) {
      features.push('mcp-multi-provider-ai');
      features.push('mcp-enhanced-data-collection');
      features.push('mcp-real-time-monitoring');
    }
    
    if (AzureOpenAI.isConfigured()) {
      features.push('azure-openai-integration');
    }
    
    return features;
  }

  /**
   * Cleanup and disconnect from MCP servers
   */
  async cleanup() {
    if (this.mcpEnabled && this.mcpClient) {
      await this.mcpClient.disconnect();
      this.mcpEnabled = false;
    }
  }

  // Enhanced data collection using MCP
  async _collectEnhancedDeviceInfo(dataSources = []) {
    const mcpData = await this.mcpClient.collectDeviceData(dataSources);
    const legacyData = await this._collectDeviceInfo();
    
    // Merge MCP data with legacy data
    return {
      ...legacyData,
      mcpData: mcpData.data,
      mcpSources: mcpData.sources,
      mcpErrors: mcpData.errors
    };
  }

  // Legacy methods (keeping for backward compatibility)
  _autoConfigureFromEnvironment() {
    try {
      const envConfig = AzureOpenAI.AzureOpenAI.loadFromEnvironment();
      if (envConfig) {
        this.configure(envConfig);
        console.log('Azure OpenAI auto-configured from environment variables');
      }
    } catch (error) {
      console.log('Environment configuration not available - manual configuration required');
    }
  }

  // All other legacy methods remain the same...
  async _collectDeviceInfo() {
    // Check cache first
    if (this.deviceInfo && this.lastUpdate && 
        (Date.now() - this.lastUpdate) < this.cacheTimeout) {
      return this.deviceInfo;
    }

    try {
      let deviceData = {};

      // Collect basic React Native device info
      if (typeof Platform !== 'undefined') {
        deviceData.platform = Platform.OS;
        deviceData.version = Platform.Version;
      }

      if (typeof Dimensions !== 'undefined') {
        const { width, height } = Dimensions.get('window');
        deviceData.screen = { width, height };
      }

      // Try to get native device info if available
      if (this.isNativeModuleAvailable()) {
        try {
          const nativeInfo = await NativeDeviceAI.getDeviceInfo();
          deviceData = { ...deviceData, ...nativeInfo };
        } catch (error) {
          console.log('Native device info not available:', error.message);
        }
      }

      // Generate mock data for demonstration if no real data available
      if (Object.keys(deviceData).length === 0) {
        deviceData = this._generateMockDeviceData();
      }

      // Cache the result
      this.deviceInfo = deviceData;
      this.lastUpdate = Date.now();

      return deviceData;
    } catch (error) {
      console.error('Error collecting device info:', error);
      return this._generateMockDeviceData();
    }
  }

  _generateMockDeviceData() {
    return {
      platform: Platform?.OS || 'unknown',
      version: Platform?.Version || '0.0',
      memory: {
        total: '8 GB',
        used: '5.2 GB', 
        usedPercentage: 65
      },
      storage: {
        total: '128 GB',
        used: '89 GB',
        usedPercentage: 70
      },
      battery: {
        level: Math.floor(Math.random() * 100),
        state: Math.random() > 0.5 ? 'charging' : 'unplugged'
      },
      cpu: {
        cores: 8,
        usage: Math.floor(Math.random() * 100),
        temperature: 45 + Math.floor(Math.random() * 20)
      }
    };
  }

  _extractBatteryInfo(deviceData) {
    return {
      batteryLevel: deviceData.battery?.level || 0,
      batteryState: deviceData.battery?.state || 'unknown',
      powerSaveMode: deviceData.battery?.powerSaveMode || false
    };
  }

  _extractPerformanceInfo(deviceData) {
    return {
      memory: deviceData.memory || { total: 'Unknown', used: 'Unknown', usedPercentage: 0 },
      cpu: deviceData.cpu || { cores: 0, usage: 0 },
      storage: deviceData.storage || { total: 'Unknown', usedPercentage: 0 }
    };
  }

  _extractRelevantData(query, deviceData) {
    const queryLower = query.toLowerCase();
    const relevantData = {};

    if (queryLower.includes('battery')) {
      relevantData.battery = deviceData.battery;
    }
    if (queryLower.includes('memory') || queryLower.includes('ram')) {
      relevantData.memory = deviceData.memory;
    }
    if (queryLower.includes('storage') || queryLower.includes('disk')) {
      relevantData.storage = deviceData.storage;
    }
    if (queryLower.includes('cpu') || queryLower.includes('processor')) {
      relevantData.cpu = deviceData.cpu;
    }

    // If no specific category mentioned, include basic info
    if (Object.keys(relevantData).length === 0) {
      relevantData.battery = deviceData.battery;
      relevantData.memory = deviceData.memory;
    }

    return relevantData;
  }

  _generateStaticResponse(query, relevantData) {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('battery')) {
      const battery = relevantData.battery;
      if (battery) {
        return `Your battery is at ${battery.level}% and ${battery.state === 'charging' ? 'charging' : 'not charging'}.`;
      }
    }
    
    if (queryLower.includes('memory')) {
      const memory = relevantData.memory;
      if (memory) {
        return `You're using ${memory.usedPercentage}% of your ${memory.total} memory.`;
      }
    }
    
    return "I need more specific information to answer your question.";
  }

  _generateFallbackInsights(deviceData) {
    const insights = [];
    
    if (deviceData.memory?.usedPercentage > 80) {
      insights.push("Memory usage is high - consider closing unused apps");
    }
    if (deviceData.storage?.usedPercentage > 85) {
      insights.push("Storage is running low - consider freeing up space");
    }
    if (deviceData.battery?.level < 20) {
      insights.push("Battery is low - consider charging soon");
    }
    
    return insights.length > 0 
      ? insights.join('. ') + '.'
      : "Your device appears to be running normally.";
  }

  _generateFallbackBatteryAdvice(batteryData) {
    if (batteryData.batteryLevel < 20) {
      return "Your battery is low. Consider charging your device and enabling power saving mode.";
    }
    if (batteryData.batteryLevel > 80) {
      return "Your battery level is good. To maintain battery health, avoid keeping it at 100% constantly.";
    }
    return "Your battery level looks reasonable. Monitor your usage patterns for optimization opportunities.";
  }

  _generateFallbackPerformanceTips(performanceData) {
    const tips = [];
    
    if (performanceData.memory?.usedPercentage > 75) {
      tips.push("High memory usage detected - restart apps periodically");
    }
    if (performanceData.storage?.usedPercentage > 80) {
      tips.push("Storage is getting full - clean up old files");
    }
    
    return tips.length > 0 
      ? tips.join('. ') + '.'
      : "Your device performance looks good. Regular maintenance helps keep it running smoothly.";
  }

  _generateBasicRecommendations(deviceData) {
    const recommendations = [];
    
    if (deviceData.memory?.usedPercentage > 80) {
      recommendations.push("Close unused applications to free up memory");
    }
    if (deviceData.storage?.usedPercentage > 85) {
      recommendations.push("Delete old files and clear cache to free up storage");
    }
    if (deviceData.battery?.level < 30) {
      recommendations.push("Charge your device and enable battery saver mode");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Your device is running well - no immediate action needed");
    }
    
    return recommendations;
  }

  _getBatteryTips() {
    return [
      "Reduce screen brightness when possible",
      "Close apps running in the background", 
      "Turn off unnecessary notifications",
      "Use Wi-Fi instead of cellular data when available",
      "Enable power saving mode when battery is low"
    ];
  }

  _getPerformanceRecommendations() {
    return [
      "Restart your device regularly",
      "Keep apps updated to latest versions",
      "Clear app cache periodically",
      "Remove unused apps",
      "Ensure sufficient storage space"
    ];
  }
}

// Create and export singleton instance
const enhancedDeviceAI = new EnhancedDeviceAI();
module.exports = enhancedDeviceAI;