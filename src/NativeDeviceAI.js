/**
 * @format
 */

import {TurboModuleRegistry} from 'react-native';

// TurboModule interface specification
// This file defines the native module interface for codegen
const NativeDeviceAI = TurboModuleRegistry.getEnforcing 
  ? TurboModuleRegistry.getEnforcing('DeviceAI') 
  : null;

export default NativeDeviceAI;