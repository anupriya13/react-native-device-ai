/**
 * @format
 */

import {TurboModuleRegistry} from 'react-native';

// TurboModule interface specification
// This file defines the native module interface for codegen
const NativeDeviceAI = TurboModuleRegistry.getEnforcing 
  ? TurboModuleRegistry.getEnforcing('ReactNativeDeviceAi') 
  : null;

export default NativeDeviceAI;