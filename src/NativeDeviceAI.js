/**
 * @format
 */

// Note: This is a TurboModule specification file
// It defines the interface for the native DeviceAI module
// Actual implementation is in C++ for Windows and native code for other platforms

const {TurboModuleRegistry} = require('react-native');

// Export the TurboModule
module.exports = TurboModuleRegistry.getEnforcing ? 
  TurboModuleRegistry.getEnforcing('DeviceAI') : 
  null;