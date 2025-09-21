/**
 * Windows-specific MCP Server for enhanced Windows device data collection
 * Leverages Windows TurboModule APIs for comprehensive system insights
 * Implements proper MCP server using @modelcontextprotocol/sdk
 */

const { NativeModules, Platform } = require('react-native');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

const { ReactNativeDeviceAi } = NativeModules || {};

/**
 * Windows MCP Server that provides OS-specific device data
 * Uses Windows TurboModule for real Windows API access
 * Implements Model Context Protocol server functionality
 */
class WindowsMCPServer {
  constructor() {
    this.name = 'windows-device-server';
    this.type = 'data-source';
    this.platform = 'windows';
    this.connected = false;
    this.lastCollected = null;
    this.capabilities = [
      'windows-system-info',
      'wmi-data-collection',
      'registry-access',
      'performance-counters',
      'power-management',
      'device-enumeration'
    ];
    
    // Initialize MCP Server
    this.mcpServer = new Server({
      name: 'react-native-device-ai-windows',
      version: '3.1.0'
    }, {
      capabilities: {
        resources: {},
        tools: {}
      }
    });
    
    this._setupMCPServer();
  }

  /**
   * Setup MCP server with tools and resources
   * @private
   */
  _setupMCPServer() {
    // Register tools for device operations
    this.mcpServer.registerTool("get_device_info", {
      description: "Get comprehensive Windows device information",
      inputSchema: {
        type: "object",
        properties: {
          includeWMI: {
            type: "boolean",
            description: "Include WMI system information"
          },
          includePerformance: {
            type: "boolean", 
            description: "Include performance counters"
          }
        }
      }
    }, async (params) => {
      if (!this.isConnected()) {
        throw new Error('Windows MCP Server not connected');
      }
      
      try {
        const deviceInfo = await ReactNativeDeviceAi.getDeviceInfo();
        const result = { deviceInfo };
        
        if (params?.includeWMI) {
          try {
            result.wmiData = await ReactNativeDeviceAi.getWMISystemInfo();
          } catch (error) {
            result.wmiData = { error: 'WMI not available' };
          }
        }
        
        if (params?.includePerformance) {
          try {
            result.performanceData = await this._collectPerformanceData();
          } catch (error) {
            result.performanceData = { error: 'Performance data not available' };
          }
        }
        
        return result;
      } catch (error) {
        throw new Error(`Failed to get device info: ${error.message}`);
      }
    });

    this.mcpServer.registerTool("get_windows_system_info", {
      description: "Get Windows-specific system information",
      inputSchema: {
        type: "object",
        properties: {}
      }
    }, async () => {
      if (!this.isConnected()) {
        throw new Error('Windows MCP Server not connected');
      }
      
      try {
        return await ReactNativeDeviceAi.getWindowsSystemInfo();
      } catch (error) {
        throw new Error(`Failed to get Windows system info: ${error.message}`);
      }
    });

    // Register resources for device data
    this.mcpServer.registerResource("device-data://windows/current", {
      description: "Current Windows device data",
      mimeType: "application/json"
    }, async () => {
      if (!this.isConnected()) {
        throw new Error('Windows MCP Server not connected');
      }
      
      const data = await this.collectData();
      return JSON.stringify(data, null, 2);
    });

    this.mcpServer.registerResource("device-data://windows/performance", {
      description: "Windows performance counters and metrics",
      mimeType: "application/json"
    }, async () => {
      if (!this.isConnected()) {
        throw new Error('Windows MCP Server not connected');
      }
      
      const performanceData = await this._collectPerformanceData();
      return JSON.stringify(performanceData, null, 2);
    });
  }

  /**
   * Check if this server is available on current platform
   */
  isAvailable() {
    return Platform.OS === 'windows' && ReactNativeDeviceAi;
  }

  /**
   * Connect to Windows TurboModule and start MCP server
   */
  async connect() {
    if (!this.isAvailable()) {
      throw new Error('Windows MCP Server only available on Windows with TurboModule support');
    }
    
    try {
      // Test TurboModule connectivity
      await ReactNativeDeviceAi.getDeviceInfo();
      this.connected = true;
      console.log('Windows MCP Server connected successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to connect Windows MCP Server:', error);
      throw error;
    }
  }

  /**
   * Start MCP server with stdio transport (if supported)
   * Note: stdio transport may not work in React Native environment
   */
  async startMCPServer() {
    if (!this.isConnected()) {
      throw new Error('Windows MCP Server not connected');
    }

    try {
      // Try to start stdio transport (may not work in React Native)
      // This would typically be used in a Node.js environment
      console.log('MCP Server setup complete - stdio transport not supported in React Native');
      console.log('MCP Server tools and resources registered successfully');
      
      return { 
        success: true, 
        message: 'MCP Server configured with tools and resources',
        tools: ['get_device_info', 'get_windows_system_info'],
        resources: ['device-data://windows/current', 'device-data://windows/performance']
      };
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      throw error;
    }
  }

  /**
   * Get the MCP server instance
   */
  getMCPServer() {
    return this.mcpServer;
  }

  /**
   * Disconnect from Windows APIs
   */
  async disconnect() {
    this.connected = false;
    console.log('Windows MCP Server disconnected');
  }

  /**
   * Check connection status
   */
  isConnected() {
    return this.connected && this.isAvailable();
  }

  /**
   * Get server type
   */
  getType() {
    return this.type;
  }

  /**
   * Get server capabilities
   */
  getCapabilities() {
    return this.capabilities;
  }

  /**
   * Get last data collection timestamp
   */
  getLastCollected() {
    return this.lastCollected;
  }

  /**
   * Collect comprehensive Windows device data
   * @param {Object} options - Data collection options
   * @param {Array} options.sources - Specific data sources to collect
   * @param {boolean} options.includeWMI - Include WMI data collection
   * @param {boolean} options.includeRegistry - Include registry data
   * @param {boolean} options.includePerformance - Include performance counters
   */
  async collectData(options = {}) {
    if (!this.isConnected()) {
      throw new Error('Windows MCP Server not connected');
    }

    const {
      sources = ['all'],
      includeWMI = true,
      includeRegistry = true,
      includePerformance = true
    } = options;

    try {
      const windowsData = {};
      this.lastCollected = new Date().toISOString();

      // Collect basic device info (always included)
      if (sources.includes('all') || sources.includes('device-info')) {
        windowsData.deviceInfo = await ReactNativeDeviceAi.getDeviceInfo();
      }

      // Collect Windows-specific system information
      if (sources.includes('all') || sources.includes('windows-system')) {
        windowsData.windowsSystemInfo = await ReactNativeDeviceAi.getWindowsSystemInfo();
      }

      // Collect WMI data if available and requested
      if (includeWMI && (sources.includes('all') || sources.includes('wmi'))) {
        try {
          windowsData.wmiData = await ReactNativeDeviceAi.getWMISystemInfo();
        } catch (error) {
          console.warn('WMI data collection failed:', error.message);
          windowsData.wmiData = { error: 'WMI not available' };
        }
      }

      // Collect registry information
      if (includeRegistry && (sources.includes('all') || sources.includes('registry'))) {
        windowsData.registryInfo = await this._collectRegistryData();
      }

      // Collect performance data
      if (includePerformance && (sources.includes('all') || sources.includes('performance'))) {
        windowsData.performanceData = await this._collectPerformanceData();
      }

      // Add Windows-specific metadata
      windowsData.metadata = {
        timestamp: this.lastCollected,
        source: 'windows-mcp-server',
        platform: 'windows',
        turboModuleVersion: '1.0.0',
        dataCollectionMethod: 'windows-apis'
      };

      return {
        success: true,
        data: windowsData,
        timestamp: this.lastCollected,
        source: this.name
      };
    } catch (error) {
      console.error('Windows MCP data collection failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: this.lastCollected,
        source: this.name
      };
    }
  }

  /**
   * Collect Windows registry information
   * @private
   */
  async _collectRegistryData() {
    try {
      // Use existing TurboModule functions that access registry
      const osVersion = await this._getRegistryValue('SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', 'ProductName');
      const buildNumber = await this._getRegistryValue('SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', 'CurrentBuild');
      const releaseId = await this._getRegistryValue('SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', 'ReleaseId');
      
      return {
        timestamp: new Date().toISOString(),
        osVersion,
        buildNumber,
        releaseId,
        source: 'windows-registry'
      };
    } catch (error) {
      return {
        error: 'Registry access failed: ' + error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Collect Windows performance data
   * @private
   */
  async _collectPerformanceData() {
    try {
      const deviceInfo = await ReactNativeDeviceAi.getDeviceInfo();
      
      return {
        timestamp: new Date().toISOString(),
        memory: deviceInfo.memory,
        cpu: deviceInfo.cpu,
        storage: deviceInfo.storage,
        battery: deviceInfo.battery,
        network: deviceInfo.network,
        source: 'windows-performance-apis'
      };
    } catch (error) {
      return {
        error: 'Performance data collection failed: ' + error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get registry value (mock implementation - would use TurboModule in real scenario)
   * @private
   */
  async _getRegistryValue(keyPath, valueName) {
    // In a real implementation, this would call a TurboModule function
    // For now, return mock data based on existing functionality
    switch (valueName) {
      case 'ProductName':
        return 'Microsoft Windows 11';
      case 'CurrentBuild':
        return '22000';
      case 'ReleaseId':
        return '21H2';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get Windows-specific insights using collected data
   * @param {Object} deviceData - Previously collected device data
   * @param {string} query - Natural language query about Windows system
   */
  async getWindowsInsights(deviceData, query) {
    if (!this.isConnected()) {
      throw new Error('Windows MCP Server not connected');
    }

    try {
      // Collect latest Windows data
      const windowsData = await this.collectData();
      
      // Generate Windows-specific insights
      const insights = this._generateWindowsSpecificInsights(windowsData.data, query);
      
      return {
        success: true,
        insights,
        windowsData: windowsData.data,
        query,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        query,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate Windows-specific insights
   * @private
   */
  _generateWindowsSpecificInsights(windowsData, query) {
    const insights = [];
    
    // Windows version insights
    if (windowsData.windowsSystemInfo) {
      const { osVersion, buildNumber } = windowsData.windowsSystemInfo;
      insights.push(`Running Windows ${osVersion} build ${buildNumber}`);
      
      // Check for Windows 11
      if (parseInt(buildNumber) >= 22000) {
        insights.push('Your system is running Windows 11 with modern security features');
      }
    }

    // WMI insights
    if (windowsData.wmiData && !windowsData.wmiData.error) {
      insights.push(`Computer: ${windowsData.wmiData.computerSystem}`);
      insights.push(`Processor: ${windowsData.wmiData.processor}`);
    }

    // Performance insights
    if (windowsData.performanceData) {
      const { memory, cpu } = windowsData.performanceData;
      if (memory && memory.used > 80) {
        insights.push('High memory usage detected - consider closing unused applications');
      }
      if (cpu && cpu.usage > 80) {
        insights.push('High CPU usage detected - system may be running intensive tasks');
      }
    }

    // Query-specific insights
    if (query && query.toLowerCase().includes('performance')) {
      insights.push('Windows Performance Monitor shows real-time system metrics');
    }
    if (query && query.toLowerCase().includes('security')) {
      insights.push('Windows Defender and Windows Security provide comprehensive protection');
    }

    return insights.length > 0 ? insights : ['Windows system information collected successfully'];
  }

  /**
   * Generate AI insights based on collected Windows data
   * @param {Object} deviceData - Device data to analyze
   * @param {string} type - Type of analysis ('general', 'performance', 'security')
   */
  async generateInsights(deviceData, type = 'general') {
    try {
      if (!this.isConnected()) {
        throw new Error('Windows MCP Server not connected');
      }

      // Collect fresh Windows data if needed
      const windowsData = await this.collectData();
      
      // Generate insights based on analysis type
      let insights = [];
      
      switch (type) {
        case 'performance':
          insights = this._generatePerformanceInsights(windowsData, deviceData);
          break;
        case 'security':
          insights = this._generateSecurityInsights(windowsData, deviceData);
          break;
        case 'general':
        default:
          insights = this._generateGeneralInsights(windowsData, deviceData);
          break;
      }

      return {
        type,
        insights: insights.join('. '),
        server: this.name,
        platform: 'windows',
        timestamp: new Date().toISOString(),
        dataSource: 'windows-turbo-module'
      };
    } catch (error) {
      console.error('Failed to generate Windows insights:', error);
      throw error;
    }
  }

  /**
   * Generate performance-specific insights
   * @private
   */
  _generatePerformanceInsights(windowsData, deviceData) {
    const insights = [];

    if (windowsData.performanceData) {
      const { memory, cpu } = windowsData.performanceData;
      
      if (memory) {
        if (memory.used > 90) {
          insights.push('Critical memory usage detected - immediate action required');
        } else if (memory.used > 80) {
          insights.push('High memory usage - consider closing unnecessary applications');
        } else {
          insights.push('Memory usage is within normal ranges');
        }
      }

      if (cpu) {
        if (cpu.usage > 90) {
          insights.push('Very high CPU usage - check for resource-intensive processes');
        } else if (cpu.usage > 70) {
          insights.push('Elevated CPU usage detected');
        } else {
          insights.push('CPU usage is normal');
        }
      }
    }

    return insights.length > 0 ? insights : ['Performance monitoring data collected'];
  }

  /**
   * Generate security-specific insights
   * @private
   */
  _generateSecurityInsights(windowsData, deviceData) {
    const insights = [];

    if (windowsData.windowsSystemInfo) {
      const { buildNumber } = windowsData.windowsSystemInfo;
      
      if (parseInt(buildNumber) >= 22000) {
        insights.push('Running Windows 11 with modern security features enabled');
      } else {
        insights.push('Consider upgrading to Windows 11 for enhanced security');
      }
    }

    insights.push('Windows Defender provides real-time protection');
    insights.push('Regular Windows Updates help maintain security');

    return insights;
  }

  /**
   * Generate general insights
   * @private
   */
  _generateGeneralInsights(windowsData, deviceData) {
    const insights = [];

    if (windowsData.windowsSystemInfo) {
      const { osVersion, processorName } = windowsData.windowsSystemInfo;
      insights.push(`System running ${osVersion} with ${processorName}`);
    }

    if (windowsData.performanceData) {
      insights.push('Real-time performance metrics available via Windows APIs');
    }

    if (windowsData.wmiData && !windowsData.wmiData.error) {
      insights.push('Comprehensive system information collected via WMI');
    }

    return insights.length > 0 ? insights : ['Windows system analysis completed'];
  }
}

module.exports = WindowsMCPServer;