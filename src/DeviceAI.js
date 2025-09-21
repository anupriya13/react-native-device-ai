const { Platform, Dimensions } = require('react-native');
const AzureOpenAI = require('./AzureOpenAI.js');

// Try to import the native module with fallback handling
let NativeDeviceAI = null;
try {
  const NativeModule = require('./NativeDeviceAI.js');
  NativeDeviceAI = NativeModule;
} catch (error) {
  console.log('Native DeviceAI module not available, using JavaScript fallback:', error.message);
}

/**
 * DeviceAI - Main module for AI-powered device insights
 */
class DeviceAI {
  constructor() {
    this.deviceInfo = null;
    this.lastUpdate = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Auto-configure from environment variables if available
    this._autoConfigureFromEnvironment();
  }

  /**
   * Auto-configure Azure OpenAI from environment variables
   * @private
   */
  _autoConfigureFromEnvironment() {
    try {
      const envConfig = AzureOpenAI.AzureOpenAI.loadFromEnvironment();
      if (envConfig) {
        this.configure(envConfig);
        console.log('Azure OpenAI auto-configured from environment variables');
      }
    } catch (error) {
      // Silently fail - not having environment config is normal
      console.log('Environment configuration not available - manual configuration required');
    }
  }

  /**
   * Configure Azure OpenAI for AI-powered insights
   * @param {Object} config - Azure OpenAI configuration
   * @param {string} config.apiKey - Azure OpenAI API key
   * @param {string} config.endpoint - Azure OpenAI endpoint URL
   */
  configure(config) {
    AzureOpenAI.setConfig(config);
  }

  /**
   * Get comprehensive AI-powered device insights
   * @returns {Promise<Object>} Device insights with AI recommendations
   */
  async getDeviceInsights() {
    try {
      const deviceData = await this._collectDeviceInfo();
      let aiInsights;
      
      try {
        aiInsights = AzureOpenAI.isConfigured() 
          ? await AzureOpenAI.generateInsights(deviceData, 'general')
          : this._generateFallbackInsights(deviceData);
      } catch (aiError) {
        console.log('AI service unavailable, using fallback insights:', aiError.message);
        aiInsights = this._generateFallbackInsights(deviceData);
      }

      return {
        success: true,
        deviceInfo: deviceData,
        insights: aiInsights,
        recommendations: this._generateBasicRecommendations(deviceData),
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
   * Get AI-powered battery optimization advice
   * @returns {Promise<Object>} Battery optimization recommendations
   */
  async getBatteryAdvice() {
    try {
      const deviceData = await this._collectDeviceInfo();
      const batteryData = this._extractBatteryInfo(deviceData);
      let aiAdvice;
      
      try {
        aiAdvice = AzureOpenAI.isConfigured()
          ? await AzureOpenAI.generateInsights(batteryData, 'battery')
          : this._generateFallbackBatteryAdvice(batteryData);
      } catch (aiError) {
        console.log('AI service unavailable, using fallback battery advice:', aiError.message);
        aiAdvice = this._generateFallbackBatteryAdvice(batteryData);
      }

      return {
        success: true,
        batteryInfo: batteryData,
        advice: aiAdvice,
        tips: this._getBatteryTips(),
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
   * Get AI-powered performance optimization tips
   * @returns {Promise<Object>} Performance optimization recommendations
   */
  async getPerformanceTips() {
    try {
      const deviceData = await this._collectDeviceInfo();
      const performanceData = this._extractPerformanceInfo(deviceData);
      let aiTips;
      
      try {
        aiTips = AzureOpenAI.isConfigured()
          ? await AzureOpenAI.generateInsights(performanceData, 'performance')
          : this._generateFallbackPerformanceTips(performanceData);
      } catch (aiError) {
        console.log('AI service unavailable, using fallback performance tips:', aiError.message);
        aiTips = this._generateFallbackPerformanceTips(performanceData);
      }

      return {
        success: true,
        performanceInfo: performanceData,
        tips: aiTips,
        recommendations: this._getPerformanceRecommendations(),
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
   * Query specific device information using natural language prompts
   * @param {string} prompt - User's question about device information
   * @returns {Promise<Object>} AI-generated response with relevant device data
   */
  async queryDeviceInfo(prompt) {
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return {
        success: false,
        error: 'Please provide a valid prompt question',
        timestamp: new Date().toISOString(),
      };
    }

    try {
      // Collect comprehensive device data
      const deviceData = await this._collectDeviceInfo();
      
      // Analyze prompt to determine relevant data context
      const relevantData = this._extractRelevantDataForPrompt(prompt, deviceData);
      
      let aiResponse;
      
      try {
        if (AzureOpenAI.isConfigured()) {
          aiResponse = await AzureOpenAI.generateCustomResponse(prompt, relevantData);
        } else {
          aiResponse = this._generateFallbackResponse(prompt, relevantData);
        }
      } catch (aiError) {
        console.log('AI service unavailable, using fallback response:', aiError.message);
        aiResponse = this._generateFallbackResponse(prompt, relevantData);
      }

      return {
        success: true,
        prompt: prompt.trim(),
        response: aiResponse,
        relevantData: relevantData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error processing device info query:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Collect comprehensive device information
   * Uses native TurboModule when available for enhanced data collection
   * @private
   */
  async _collectDeviceInfo() {
    // Check cache first
    if (this.deviceInfo && this.lastUpdate && 
        (Date.now() - this.lastUpdate) < this.cacheTimeout) {
      return this.deviceInfo;
    }

    // Try to use native module first for enhanced device info
    try {
      if (NativeDeviceAI && NativeDeviceAI.getDeviceInfo) {
        const nativeInfo = await NativeDeviceAI.getDeviceInfo();
        this.deviceInfo = {
          ...nativeInfo,
          // Add any additional computed fields
          screen: {
            width: nativeInfo.screenResolution.split('x')[0] || 0,
            height: nativeInfo.screenResolution.split('x')[1] || 0,
          },
          memoryUsagePercentage: Math.round((nativeInfo.usedMemory / nativeInfo.totalMemory) * 100),
          storageUsagePercentage: Math.round((nativeInfo.usedStorage / nativeInfo.totalStorage) * 100),
        };
        this.lastUpdate = Date.now();
        return this.deviceInfo;
      }
    } catch (nativeError) {
      console.log('Native module unavailable, falling back to JS implementation:', nativeError.message);
    }

    // Fallback to JavaScript-only implementation
    const screenData = Dimensions.get('screen');
    const windowData = Dimensions.get('window');

    const deviceInfo = {
      platform: Platform.OS,
      version: Platform.Version,
      screen: {
        width: screenData.width,
        height: screenData.height,
        scale: screenData.scale,
        fontScale: screenData.fontScale,
      },
      window: {
        width: windowData.width,
        height: windowData.height,
      },
      // Mock additional device info (in real implementation, this would come from native modules)
      memory: this._getMockMemoryInfo(),
      storage: this._getMockStorageInfo(),
      battery: this._getMockBatteryInfo(),
      cpu: this._getMockCPUInfo(),
      network: this._getMockNetworkInfo(),
      timestamp: new Date().toISOString(),
    };

    // On Windows, collect additional system information through fabric
    if (Platform.OS === 'windows') {
      deviceInfo.windowsSpecific = await this._collectWindowsInfo();
    }

    this.deviceInfo = deviceInfo;
    this.lastUpdate = Date.now();
    return deviceInfo;
  }

  /**
   * Collect Windows-specific information through native fabric
   * @private
   */
  async _collectWindowsInfo() {
    // In real implementation, this would call native Windows APIs through the fabric
    return {
      osVersion: 'Windows 11',
      buildNumber: '22000',
      systemArchitecture: 'x64',
      installedRam: '16 GB',
      processorName: 'Intel Core i7',
      diskSpace: {
        total: '512 GB SSD',
        available: '256 GB',
      },
      runningProcesses: 45,
      systemUptime: '2 days, 14 hours',
    };
  }

  /**
   * Extract battery-specific information
   * @private
   */
  _extractBatteryInfo(deviceData) {
    return {
      platform: deviceData.platform,
      batteryLevel: deviceData.battery.level,
      batteryState: deviceData.battery.state,
      powerSaveMode: deviceData.battery.powerSaveMode,
      screenBrightness: deviceData.screen.scale, // Approximation
    };
  }

  /**
   * Extract performance-specific information
   * @private
   */
  _extractPerformanceInfo(deviceData) {
    return {
      platform: deviceData.platform,
      memory: deviceData.memory,
      cpu: deviceData.cpu,
      storage: deviceData.storage,
      screen: deviceData.screen,
    };
  }

  /**
   * Extract relevant device data based on the user's prompt
   * @param {string} prompt - User's question
   * @param {Object} deviceData - Complete device information
   * @returns {Object} Filtered device data relevant to the prompt
   * @private
   */
  _extractRelevantDataForPrompt(prompt, deviceData) {
    const promptLower = prompt.toLowerCase();
    const relevantData = {
      platform: deviceData.platform,
      version: deviceData.version,
    };

    // Battery-related queries
    if (this._isPromptAbout(promptLower, ['battery', 'power', 'charge', 'energy'])) {
      relevantData.battery = deviceData.battery;
      relevantData.batteryLevel = deviceData.battery?.level;
      relevantData.batteryState = deviceData.battery?.state;
    }

    // CPU-related queries
    if (this._isPromptAbout(promptLower, ['cpu', 'processor', 'performance', 'speed', 'temperature', 'hot'])) {
      relevantData.cpu = deviceData.cpu;
    }

    // Memory-related queries
    if (this._isPromptAbout(promptLower, ['memory', 'ram', 'usage', 'available'])) {
      relevantData.memory = deviceData.memory;
      relevantData.memoryUsagePercentage = deviceData.memoryUsagePercentage;
    }

    // Storage-related queries
    if (this._isPromptAbout(promptLower, ['storage', 'disk', 'space', 'capacity', 'free'])) {
      relevantData.storage = deviceData.storage;
      relevantData.storageUsagePercentage = deviceData.storageUsagePercentage;
    }

    // Screen-related queries
    if (this._isPromptAbout(promptLower, ['screen', 'display', 'resolution', 'size', 'brightness'])) {
      relevantData.screen = deviceData.screen;
    }

    // Network-related queries
    if (this._isPromptAbout(promptLower, ['network', 'wifi', 'internet', 'connection', 'speed'])) {
      relevantData.network = deviceData.network;
    }

    // Windows-specific queries
    if (this._isPromptAbout(promptLower, ['windows', 'os', 'system', 'uptime', 'processes']) && deviceData.windowsSpecific) {
      relevantData.windowsSpecific = deviceData.windowsSpecific;
    }

    // If no specific category detected, include basic info
    if (Object.keys(relevantData).length === 2) { // only platform and version
      relevantData.summary = {
        battery: deviceData.battery?.level || 'Unknown',
        memory: deviceData.memory?.usedPercentage || 'Unknown',
        storage: deviceData.storage?.usedPercentage || 'Unknown',
        cpu: deviceData.cpu?.usage || 'Unknown',
      };
    }

    return relevantData;
  }

  /**
   * Check if prompt is about specific topics
   * @param {string} prompt - Lowercase prompt
   * @param {Array<string>} keywords - Keywords to check for
   * @returns {boolean} True if prompt contains any of the keywords
   * @private
   */
  _isPromptAbout(prompt, keywords) {
    return keywords.some(keyword => prompt.includes(keyword));
  }

  /**
   * Generate fallback response when AI is not available
   * @param {string} prompt - User's question
   * @param {Object} relevantData - Device data relevant to the prompt
   * @returns {string} Simple response based on device data
   * @private
   */
  _generateFallbackResponse(prompt, relevantData) {
    const promptLower = prompt.toLowerCase();

    // CPU responses (check this first to avoid memory keyword overlap)
    if (this._isPromptAbout(promptLower, ['cpu', 'processor', 'cores']) && relevantData.cpu) {
      return `Your CPU is running at ${relevantData.cpu.usage}% usage with ${relevantData.cpu.cores} cores.`;
    }

    // Battery responses
    if (this._isPromptAbout(promptLower, ['battery', 'power', 'charge']) && relevantData.battery) {
      const level = relevantData.battery.level || relevantData.batteryLevel;
      const state = relevantData.battery.state || relevantData.batteryState;
      return `Your battery is at ${level}% and ${state === 'charging' ? 'charging' : 'not charging'}.`;
    }

    // Memory responses
    if (this._isPromptAbout(promptLower, ['memory', 'ram']) && relevantData.memory) {
      const used = relevantData.memoryUsagePercentage || relevantData.memory.usedPercentage;
      return `Your device is using ${used}% of available memory (${relevantData.memory.used} of ${relevantData.memory.total}).`;
    }

    // Storage responses
    if (this._isPromptAbout(promptLower, ['storage', 'disk', 'space']) && relevantData.storage) {
      const used = relevantData.storageUsagePercentage || relevantData.storage.usedPercentage;
      return `Your storage is ${used}% full with ${relevantData.storage.available} available space.`;
    }

    // Screen responses
    if (this._isPromptAbout(promptLower, ['screen', 'display', 'resolution']) && relevantData.screen) {
      return `Your screen resolution is ${relevantData.screen.width}x${relevantData.screen.height} with scale factor ${relevantData.screen.scale}.`;
    }

    // Network responses
    if (this._isPromptAbout(promptLower, ['network', 'wifi', 'internet']) && relevantData.network) {
      return `You're connected via ${relevantData.network.type} with ${relevantData.network.strength} signal strength.`;
    }

    // Windows-specific responses
    if (this._isPromptAbout(promptLower, ['windows', 'os', 'system', 'processes']) && relevantData.windowsSpecific) {
      return `Your system is running ${relevantData.windowsSpecific.osVersion} with ${relevantData.windowsSpecific.runningProcesses} running processes.`;
    }

    // General summary response
    if (relevantData.summary) {
      return `Your ${relevantData.platform} device: Battery ${relevantData.summary.battery}%, Memory ${relevantData.summary.memory}%, Storage ${relevantData.summary.storage}%, CPU ${relevantData.summary.cpu}%.`;
    }

    // Default response
    return `Your ${relevantData.platform} device (version ${relevantData.version}) is currently running.`;
  }

  /**
   * Generate fallback insights when AI is not configured
   * @private
   */
  _generateFallbackInsights(deviceData) {
    return `Your ${deviceData.platform} device appears to be running well. Consider optimizing battery usage and clearing storage space for better performance. Regular maintenance can help keep your device running smoothly.`;
  }

  /**
   * Generate fallback battery advice
   * @private
   */
  _generateFallbackBatteryAdvice(batteryData) {
    const level = batteryData.batteryLevel;
    if (level < 20) {
      return "Your battery is running low. Consider enabling power save mode and reducing screen brightness.";
    } else if (level < 50) {
      return "Your battery is at moderate levels. Closing unused apps can help extend battery life.";
    }
    return "Your battery level looks good. Maintain good charging habits for optimal battery health.";
  }

  /**
   * Generate fallback performance tips
   * @private
   */
  _generateFallbackPerformanceTips(performanceData) {
    const memoryUsage = performanceData.memory.usedPercentage;
    if (memoryUsage > 80) {
      return "High memory usage detected. Consider closing unused applications and restarting your device.";
    }
    return "Your device performance looks good. Regular maintenance and updates can help maintain optimal performance.";
  }

  /**
   * Generate basic recommendations based on device data
   * @private
   */
  _generateBasicRecommendations(deviceData) {
    const recommendations = [];
    
    if (deviceData.memory.usedPercentage > 80) {
      recommendations.push("High memory usage - consider closing unused apps");
    }
    
    if (deviceData.storage.usedPercentage > 90) {
      recommendations.push("Low storage space - clean up old files and apps");
    }
    
    if (deviceData.battery.level < 20) {
      recommendations.push("Low battery - enable power saving mode");
    }

    return recommendations.length > 0 ? recommendations : ["Your device is running optimally"];
  }

  /**
   * Get general battery tips
   * @private
   */
  _getBatteryTips() {
    return [
      "Reduce screen brightness when possible",
      "Close unused background apps",
      "Enable power saving mode when battery is low",
      "Avoid extreme temperatures",
      "Use original charger when possible",
    ];
  }

  /**
   * Get general performance recommendations
   * @private
   */
  _getPerformanceRecommendations() {
    return [
      "Restart your device regularly",
      "Keep apps updated to latest versions",
      "Clear cache periodically",
      "Monitor storage space",
      "Close unused background applications",
    ];
  }

  // Mock data methods (in real implementation, these would come from native modules)
  _getMockMemoryInfo() {
    return {
      total: '8 GB',
      used: '5.2 GB',
      available: '2.8 GB',
      usedPercentage: 65,
    };
  }

  _getMockStorageInfo() {
    return {
      total: '128 GB',
      used: '89 GB',
      available: '39 GB',
      usedPercentage: 70,
    };
  }

  _getMockBatteryInfo() {
    return {
      level: 78,
      state: 'unplugged',
      powerSaveMode: false,
    };
  }

  _getMockCPUInfo() {
    return {
      cores: 8,
      usage: 25,
      temperature: '45°C',
    };
  }

  _getMockNetworkInfo() {
    return {
      type: 'wifi',
      strength: 'excellent',
      speed: '150 Mbps',
    };
  }

  /**
   * Check if the native TurboModule is available
   * @returns {boolean} True if native module is available
   */
  isNativeModuleAvailable() {
    return NativeDeviceAI !== null && typeof NativeDeviceAI.getDeviceInfo === 'function';
  }

  /**
   * Get list of supported features based on platform and native module availability
   * @returns {Array<string>} Array of supported feature names
   */
  getSupportedFeatures() {
    const features = [
      'device-insights',
      'battery-advice',
      'performance-tips',
      'fallback-mode'
    ];

    if (this.isNativeModuleAvailable()) {
      features.push('native-device-info');
      
      if (Platform.OS === 'windows') {
        features.push('windows-system-info', 'wmi-queries', 'performance-counters');
      }
    }

    if (AzureOpenAI.isConfigured()) {
      features.push('ai-powered-insights');
    }

    return features;
  }

  /**
   * Get enhanced Windows system information (Windows only)
   * Requires native module to be available
   * @returns {Promise<Object>} Windows-specific system information
   */
  async getWindowsSystemInfo() {
    if (Platform.OS !== 'windows') {
      throw new Error('Windows system info is only available on Windows platform');
    }

    if (!this.isNativeModuleAvailable()) {
      throw new Error('Native module required for Windows system info');
    }

    try {
      return await NativeDeviceAI.getWindowsSystemInfo();
    } catch (error) {
      console.error('Error getting Windows system info:', error);
      throw error;
    }
  }

  /**
   * Get Windows performance counters (Windows only)
   * Requires native module to be available
   * @returns {Promise<Object>} Windows performance counter data
   */
  async getWindowsPerformanceCounters() {
    if (Platform.OS !== 'windows') {
      throw new Error('Windows performance counters are only available on Windows platform');
    }

    if (!this.isNativeModuleAvailable()) {
      throw new Error('Native module required for Windows performance counters');
    }

    try {
      const systemInfo = await NativeDeviceAI.getWindowsSystemInfo();
      return systemInfo.performanceCounters;
    } catch (error) {
      console.error('Error getting Windows performance counters:', error);
      throw error;
    }
  }

  /**
   * Get Windows WMI data (Windows only)
   * Requires native module to be available
   * @returns {Promise<Object>} Windows WMI data
   */
  async getWindowsWmiData() {
    if (Platform.OS !== 'windows') {
      throw new Error('Windows WMI data is only available on Windows platform');
    }

    if (!this.isNativeModuleAvailable()) {
      throw new Error('Native module required for Windows WMI data');
    }

    try {
      const systemInfo = await NativeDeviceAI.getWindowsSystemInfo();
      return systemInfo.wmiData;
    } catch (error) {
      console.error('Error getting Windows WMI data:', error);
      throw error;
    }
  }

  /**
   * Get enhanced battery information (cross-platform with Windows-specific enhancements)
   * @returns {Promise<Object>} Enhanced battery information
   */
  async getEnhancedBatteryInfo() {
    try {
      const deviceInfo = await this.collectDeviceInfo();
      const batteryInfo = {
        level: deviceInfo.battery.level,
        state: deviceInfo.battery.state,
        isCharging: deviceInfo.battery.state === 'charging',
        timestamp: new Date().toISOString()
      };

      // Add Windows-specific battery data if available
      if (Platform.OS === 'windows' && this.isNativeModuleAvailable()) {
        try {
          const windowsInfo = await NativeDeviceAI.getWindowsSystemInfo();
          batteryInfo.windowsSpecific = {
            osVersion: windowsInfo.osVersion,
            powerProfile: 'balanced', // Could be extracted from WMI
            estimatedTimeRemaining: 'unknown' // Could be calculated
          };
        } catch (error) {
          console.warn('Could not get Windows-specific battery info:', error.message);
        }
      }

      return batteryInfo;
    } catch (error) {
      console.error('Error getting enhanced battery info:', error);
      throw error;
    }
  }
}

// Export as singleton instance and class
const deviceAIInstance = new DeviceAI();
module.exports = deviceAIInstance;
module.exports.DeviceAI = DeviceAI;

module.exports = new DeviceAI();