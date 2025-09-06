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

  export interface AzureOpenAIConfig {
    apiKey: string;
    endpoint: string;
    enableWindowsNative?: boolean;
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

  const DeviceAI: DeviceAI;
  export default DeviceAI;
}