const { Platform, Dimensions } = require('react-native');
const AzureOpenAI = require('./AzureOpenAI.js');

/**
 * DeviceAI - Main module for AI-powered device insights
 */
class DeviceAI {
  constructor() {
    this.deviceInfo = null;
    this.lastUpdate = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
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
   * Collect comprehensive device information
   * @private
   */
  async _collectDeviceInfo() {
    // Check cache first
    if (this.deviceInfo && this.lastUpdate && 
        (Date.now() - this.lastUpdate) < this.cacheTimeout) {
      return this.deviceInfo;
    }

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
}

// Export as singleton instance and class
const deviceAIInstance = new DeviceAI();
module.exports = deviceAIInstance;
module.exports.DeviceAI = DeviceAI;

module.exports = new DeviceAI();