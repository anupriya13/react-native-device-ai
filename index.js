/**
 * React Native Device AI
 * Cross-platform React Native module that generates AI-powered insights 
 * and recommendations about the user's device.
 */

const DeviceAI = require('./src/DeviceAI.js');
const EnhancedDeviceAI = require('./src/EnhancedDeviceAI.js');
const MCPClient = require('./src/MCPClient.js');

// Export the legacy DeviceAI as default for backward compatibility
module.exports = DeviceAI;

// Also export enhanced versions and MCP client for advanced users
module.exports.Enhanced = EnhancedDeviceAI;
module.exports.MCPClient = MCPClient;
module.exports.Legacy = DeviceAI;