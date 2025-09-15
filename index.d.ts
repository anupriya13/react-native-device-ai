declare module 'react-native-device-ai' {
  export interface DeviceInfo {
    platform: string;
    platformVersion: string;
    model: string;
    totalMemory: number;
    usedMemory: number;
    totalStorage: number;
    usedStorage: number;
    batteryLevel: number;
    batteryState: string;
    cpuUsage: number;
    networkType: string;
    isCharging: boolean;
    screenResolution: string;
    memoryUsagePercentage?: number;
    storageUsagePercentage?: number;
  }

  export interface DeviceInsightsResult {
    success: boolean;
    deviceInfo: DeviceInfo;
    insights: string;
    recommendations: string[];
    timestamp: string;
    error?: string;
  }

  export interface BatteryAdviceResult {
    success: boolean;
    batteryInfo: any;
    advice: string;
    tips: string[];
    timestamp: string;
    error?: string;
  }

  export interface PerformanceTipsResult {
    success: boolean;
    performanceInfo: any;
    tips: string;
    recommendations: string[];
    timestamp: string;
    error?: string;
  }

  export interface WindowsSystemInfo {
    wmiData: Record<string, any>;
    performanceCounters: Record<string, number>;
    systemMetrics: Record<string, number>;
  }

  export interface DeviceQueryResult {
    success: boolean;
    prompt: string;
    response: string;
    relevantData: any;
    timestamp: string;
    error?: string;
  }

  export interface AzureOpenAIConfig {
    apiKey: string;
    endpoint: string;
    enableWindowsNative?: boolean;
  }

  // MCP interfaces
  export interface MCPServerConfig {
    name: string;
    type: 'ai-provider' | 'data-source' | 'tool';
    endpoint: string;
    auth: {
      apiKey?: string;
      type: 'api-key' | 'bearer' | 'x-api-key' | 'none';
    };
  }

  export interface MCPConfig {
    timeout?: number;
    retryAttempts?: number;
    enableFallback?: boolean;
  }

  export interface MCPStatus {
    enabled: boolean;
    providers?: any;
    dataSources?: any;
    initialized?: boolean;
    reason?: string;
  }

  export interface DeviceAIOptions {
    preferredProviders?: string[];
    dataSources?: string[];
    includeContext?: boolean;
  }

  export interface DeviceAI {
    /**
     * Configure Azure OpenAI for AI-powered insights
     */
    configure(config: AzureOpenAIConfig): void;

    /**
     * Get comprehensive AI-powered device insights
     */
    getDeviceInsights(): Promise<DeviceInsightsResult>;

    /**
     * Get personalized battery optimization advice
     */
    getBatteryAdvice(): Promise<BatteryAdviceResult>;

    /**
     * Get performance optimization tips
     */
    getPerformanceTips(): Promise<PerformanceTipsResult>;

    /**
     * Query specific device information using natural language prompts
     */
    queryDeviceInfo(prompt: string): Promise<DeviceQueryResult>;

    /**
     * Check if native TurboModule is available
     */
    isNativeModuleAvailable(): boolean;

    /**
     * Get list of supported features
     */
    getSupportedFeatures(): string[];

    /**
     * Get enhanced Windows system information (Windows only)
     */
    getWindowsSystemInfo(): Promise<WindowsSystemInfo>;
  }

  // Enhanced DeviceAI class with MCP support
  export interface EnhancedDeviceAI {
    /**
     * Initialize MCP client with optional configuration
     */
    initializeMCP(config?: MCPConfig): Promise<any>;

    /**
     * Configure Azure OpenAI (legacy compatibility)
     */
    configure(config: AzureOpenAIConfig): void;

    /**
     * Add an MCP server connection
     */
    addMCPServer(config: MCPServerConfig): Promise<any>;

    /**
     * Get comprehensive AI-powered device insights with MCP support
     */
    getDeviceInsights(options?: DeviceAIOptions): Promise<DeviceInsightsResult>;

    /**
     * Get AI-powered battery optimization advice with MCP support
     */
    getBatteryAdvice(options?: DeviceAIOptions): Promise<BatteryAdviceResult>;

    /**
     * Get AI-powered performance optimization tips with MCP support
     */
    getPerformanceTips(options?: DeviceAIOptions): Promise<PerformanceTipsResult>;

    /**
     * Natural language device queries with MCP support
     */
    queryDeviceInfo(query: string, options?: DeviceAIOptions): Promise<DeviceQueryResult>;

    /**
     * Get MCP client status and capabilities
     */
    getMCPStatus(): MCPStatus;

    /**
     * Check if native module is available
     */
    isNativeModuleAvailable(): boolean;

    /**
     * Get supported features including MCP capabilities
     */
    getSupportedFeatures(): string[];

    /**
     * Cleanup and disconnect from MCP servers
     */
    cleanup(): Promise<void>;
  }

  // MCP Client class
  export interface MCPClientInterface {
    /**
     * Initialize MCP client
     */
    initialize(config?: MCPConfig): Promise<any>;

    /**
     * Connect to an MCP server
     */
    connectServer(config: MCPServerConfig): Promise<any>;

    /**
     * Generate AI insights using MCP providers with failover
     */
    generateInsights(deviceData: any, type?: string, preferredProviders?: string[]): Promise<any>;

    /**
     * Collect enhanced device data using MCP data sources
     */
    collectDeviceData(dataSources?: string[]): Promise<any>;

    /**
     * Get available AI providers and their status
     */
    getProviderStatus(): any;

    /**
     * Get available data sources and their status
     */
    getDataSourceStatus(): any;

    /**
     * Disconnect from all MCP servers
     */
    disconnect(): Promise<void>;
  }

  // Legacy default export for backward compatibility
  const DeviceAI: DeviceAI;
  export default DeviceAI;

  // Named exports for enhanced functionality
  export const Enhanced: EnhancedDeviceAI;
  export const MCPClient: MCPClientInterface;
  export const Legacy: DeviceAI;
}