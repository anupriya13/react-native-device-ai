/**
 * @format
 */

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly getDeviceInfo: () => Promise<{
    readonly platform: string;
    readonly osVersion: string;
    readonly deviceModel: string;
    readonly memory: {
      readonly total: number;
      readonly available: number;
    };
    readonly storage: {
      readonly total: number;
      readonly available: number;
    };
    readonly battery: {
      readonly level: number;
      readonly isCharging: boolean;
    };
    readonly cpu: {
      readonly usage: number;
      readonly cores: number;
    };
    readonly network: {
      readonly type: string;
      readonly isConnected: boolean;
    };
  }>;
  
  readonly getWindowsSystemInfo: () => Promise<{
    readonly osVersion: string;
    readonly buildNumber: string;
    readonly processor: string;
    readonly architecture: string;
    readonly performanceCounters: {
      readonly cpuUsage: number;
      readonly memoryUsage: number;
      readonly diskUsage: number;
    };
    readonly wmiData: {
      readonly computerSystem: string;
      readonly operatingSystem: string;
      readonly processor: string;
    };
  }>;
  
  readonly isNativeModuleAvailable: () => boolean;
  readonly getSupportedFeatures: () => ReadonlyArray<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeDeviceAi');