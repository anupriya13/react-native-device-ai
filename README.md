# react-native-device-ai

> **Windows-focused** React Native module that generates AI-powered insights and recommendations about the user's device using the Model Context Protocol (MCP).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.70%2B-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)
![Version](https://img.shields.io/badge/version-3.2.0-brightgreen.svg)

## Demo

![Demo Screenshot](https://github.com/user-attachments/assets/466fbee5-355b-42d5-b658-caabafa5bb90)

*The demo shows the React Native Device AI module running on Windows with TurboModule architecture, displaying Windows-specific system information, device insights, performance counters, WMI data, and AI-powered recommendations.*

## Features

- 🤖 **AI-Powered Insights**: Get intelligent device analysis using Azure OpenAI
- 🔋 **Enhanced Battery Analysis**: Comprehensive battery information with Windows-specific enhancements
- ⚡ **Performance Monitoring**: Real-time performance counters and system metrics
- 🔍 **WMI Integration**: Direct access to Windows Management Instrumentation data
- 🪟 **Windows-Focused Architecture**: Native Windows TurboModule for deep system diagnostics
- 📊 **Separated Data Types**: Dedicated methods for different data categories (performance, WMI, battery)
- 🛡️ **Error Handling**: Robust validation and graceful error handling
- 🔄 **Fallback Mode**: Works without AI configuration using built-in insights
- 🚀 **TurboModule Support**: Modern React Native architecture with enhanced performance
- 🎯 **TypeScript Ready**: Complete TypeScript definitions included
- 🔌 **MCP Integration**: Model Context Protocol support for Windows-specific AI and data collection

## What's New in v3.2.0

### 🎯 Windows-Focused Architecture
- **Platform Consolidation**: Removed Android/iOS support to focus exclusively on Windows
- **Enhanced Windows Features**: Deeper Windows system integration and optimization

### 🔧 New Dedicated Methods
- **`getWindowsPerformanceCounters()`**: Get only performance data (CPU, memory, disk usage)
- **`getWindowsWmiData()`**: Get only WMI system information
- **`getEnhancedBatteryInfo()`**: Cross-platform battery data with Windows enhancements

### 📊 Improved Data Separation
- **Clear Data Types**: Each method returns specific, separated data instead of combined responses
- **Better UX**: Example app now shows distinct data for each button press
- **Optimized Communication**: Enhanced Windows TurboModule to JS data flow

### 🔌 Windows-Focused MCP
- **Specialized Integration**: MCP implementation optimized for Windows-specific AI and data
- **Streamlined Architecture**: Removed cross-platform complexity for better Windows performance

## Architecture

This module uses React Native's modern **TurboModule** architecture for optimal performance:

- **New Architecture Ready**: Supports React Native's new architecture (Fabric/TurboModules)
- **Native Performance**: Direct native code execution without bridge overhead
- **Type Safety**: Full TypeScript support with proper interface definitions
- **Graceful Fallback**: Automatically falls back to JavaScript implementation when native module is unavailable
- **Windows C++ Implementation**: Advanced Windows-specific features using native C++ TurboModule

### TurboModule Benefits

- **Faster Execution**: Direct native method calls without serialization overhead
- **Better Type Safety**: Strong typing at the native bridge level
- **Reduced Memory Usage**: More efficient memory management
- **Future-Proof**: Compatible with React Native's future architecture plans

## Installation

Install the package from npm:

```bash
npm install react-native-device-ai
# or
yarn add react-native-device-ai
```

### Additional Setup

For React Native 0.60+ with autolinking, no additional setup is required.

For older versions or manual linking:
```bash
react-native link react-native-device-ai
```

### Platform Support

| Platform | Support | Native Module | TurboModule | Notes |
|----------|---------|---------------|-------------|--------|
| Windows  | ✅      | ✅           | ✅          | Full support with MCP |
| iOS      | ❌      | ❌           | ❌          | Removed in v3.2.0 |
| Android  | ❌      | ❌           | ❌          | Removed in v3.2.0 |
| Web      | ❌      | ❌           | ❌          | Not supported |

**Note**: Starting with v3.2.0, this module focuses exclusively on Windows platform to provide the best possible Windows-specific features and performance.

## Quick Start

### Legacy API (Backward Compatible)

```javascript
import DeviceAI from 'react-native-device-ai';

// ⚠️ IMPORTANT: Configure credentials securely!
// See CREDENTIALS_GUIDE.md for detailed setup instructions

// Option 1: Environment variables (Node.js/testing)
// Set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT
// Module auto-configures from environment variables

// Option 2: Manual configuration (use secure storage in production)
DeviceAI.configure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT
});

// Get comprehensive device insights
const insights = await DeviceAI.getDeviceInsights();
console.log(insights.insights); // AI-generated analysis
console.log(insights.recommendations); // Actionable tips
```

### Enhanced API with MCP Support

```javascript
import { Enhanced } from 'react-native-device-ai';

// Initialize MCP for Windows-specific AI support
await Enhanced.initializeMCP();

// Get device insights with Windows TurboModule integration
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['azure-openai', 'openai'], // Failover support
  dataSources: ['windows-device-server'], // Windows-specific data collection
  includeOSSpecific: true
});

console.log('AI Provider Used:', insights.providers);
console.log('Windows Device Data:', insights.deviceInfo.windowsSpecific);

// Natural language queries with Windows context
const response = await Enhanced.queryDeviceInfo(
  "How is my Windows system performing?",
  { includeOSSpecific: true }
);
```

### New Dedicated Windows Methods (v3.2.0)

```javascript
import DeviceAI from 'react-native-device-ai';

// Get only performance counter data
const perfData = await DeviceAI.getWindowsPerformanceCounters();
console.log('CPU Usage:', perfData.cpuUsage);
console.log('Memory Usage:', perfData.memoryUsage);
console.log('Disk Usage:', perfData.diskUsage);

// Get only WMI system information
const wmiData = await DeviceAI.getWindowsWmiData();
console.log('Computer System:', wmiData.computerSystem);
console.log('Operating System:', wmiData.operatingSystem);
console.log('Processor:', wmiData.processor);

// Get enhanced battery information with Windows enhancements
const batteryInfo = await DeviceAI.getEnhancedBatteryInfo();
console.log('Battery Level:', batteryInfo.level);
console.log('Charging:', batteryInfo.isCharging);
console.log('Windows Specific:', batteryInfo.windowsSpecific);
```

## 🔐 Credential Configuration

**NEVER commit credentials to version control!** 

### Quick Setup
```bash
# 1. Copy example configuration
cp .env.example .env

# 2. Add your Azure OpenAI credentials to .env
# 3. See CREDENTIALS_GUIDE.md for detailed instructions
```

### Supported Configuration Methods
- 🔧 **Environment Variables**: Auto-configuration from `.env` file
- 🔒 **Secure Storage**: React Native Keychain/AsyncStorage
- ⚙️ **Runtime Configuration**: Dynamic credential loading
- 📁 **Config Files**: Development-only approach

📖 **Complete guide**: [CREDENTIALS_GUIDE.md](./CREDENTIALS_GUIDE.md)

## 🔌 MCP (Model Context Protocol) Integration

The module now supports **MCP** for standardized Windows-specific AI integration and enhanced device data collection.

### MCP Benefits

- **🔄 Windows-Focused AI**: Optimized connections to AI providers for Windows-specific insights
- **📊 Enhanced Windows Data**: Real-time Windows system monitoring via MCP integration
- **⚡ Performance Separation**: Dedicated methods for performance, WMI, and battery data
- **💰 Cost Optimization**: Efficient Windows-specific data collection
- **🏢 Enterprise Integration**: Windows-specific compliance and monitoring systems

### Quick MCP Setup

```javascript
import { Enhanced } from 'react-native-device-ai';

// Initialize MCP with Windows focus
await Enhanced.initializeMCP();

// Add custom AI provider for Windows analysis
await Enhanced.addMCPServer({
  name: 'windows-ai-analyzer',
  type: 'ai-provider',
  endpoint: 'https://api.example.com',
  auth: {
    apiKey: process.env.CUSTOM_API_KEY,
    type: 'bearer'
  }
});

// Get Windows-specific insights
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['windows-ai-analyzer', 'azure-openai'],
  dataSources: ['windows-device-server'],
  includeOSSpecific: true
});
```

📖 **Complete MCP guide**: [MCP_INTEGRATION_GUIDE.md](./MCP_INTEGRATION_GUIDE.md)

## API Reference

### DeviceAI.configure(config)

Configure Azure OpenAI for AI-powered insights.

**⚠️ Security Warning**: Never hardcode credentials! Use environment variables or secure storage.

**Parameters:**
- `config` (Object): Configuration object
  - `apiKey` (string): Your Azure OpenAI API key
  - `endpoint` (string): Your Azure OpenAI endpoint URL
  - `apiVersion` (string): Optional API version (defaults to 2023-05-15)

```javascript
// ✅ Secure: Environment variables
DeviceAI.configure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT
});

// ✅ Secure: From secure storage (React Native)
const credentials = await loadFromSecureStorage();
DeviceAI.configure(credentials);

// ❌ Insecure: Hardcoded (never do this!)
// DeviceAI.configure({
//   apiKey: 'sk-...',  // DON'T DO THIS!
//   endpoint: 'https://...'
// });
```

📖 **See [CREDENTIALS_GUIDE.md](./CREDENTIALS_GUIDE.md) for complete setup instructions**

### DeviceAI.getDeviceInsights()

Returns comprehensive AI-powered analysis of device stats including CPU, memory, disk, battery, OS, and apps.

**Returns:** `Promise<Object>`

```javascript
const result = await DeviceAI.getDeviceInsights();

// Example response:
{
  success: true,
  deviceInfo: {
    platform: 'windows',
    version: '11.0',
    memory: { total: '16 GB', used: '10.8 GB', usedPercentage: 67 },
    storage: { total: '1024 GB', used: '597 GB', usedPercentage: 58 },
    battery: { level: 85, state: 'charging' },
    cpu: { cores: 8, usage: 23, temperature: '45°C' },
    windowsSpecific: {
      osVersion: 'Windows 11 Pro',
      buildNumber: '22621.2861',
      installedRam: '16 GB',
      processorName: 'Intel Core i7-12700H',
      runningProcesses: 157
    }
  },
  insights: "Your Windows device appears to be running well with good memory management. Consider optimizing startup programs for better boot performance.",
  recommendations: [
    "Disk usage is moderate - consider cleaning temporary files",
    "Memory usage is optimal for your system",
    "Run Windows Update to ensure latest security patches"
  ],
  timestamp: "2023-12-07T10:30:00.000Z"
}
```

### DeviceAI.getBatteryAdvice()

Provides AI-generated suggestions to optimize battery usage.

**Returns:** `Promise<Object>`

```javascript
const result = await DeviceAI.getBatteryAdvice();

// Example response:
{
  success: true,
  batteryInfo: {
    batteryLevel: 78,
    batteryState: 'unplugged',
    powerSaveMode: false
  },
  advice: "Your battery level looks good. Maintain good charging habits...",
  tips: [
    "Reduce screen brightness when possible",
    "Close unused background apps",
    "Enable power saving mode when battery is low"
  ],
  timestamp: "2023-12-07T10:30:00.000Z"
}
```

### DeviceAI.getPerformanceTips()

Returns actionable tips to improve device performance.

**Returns:** `Promise<Object>`

```javascript
const result = await DeviceAI.getPerformanceTips();

// Example response:
{
  success: true,
  performanceInfo: {
    memory: { total: '8 GB', used: '5.2 GB', usedPercentage: 65 },
    cpu: { cores: 8, usage: 25 },
    storage: { total: '128 GB', usedPercentage: 70 }
  },
  tips: "Your device performance looks good. Regular maintenance can help...",
  recommendations: [
    "Restart your device regularly",
    "Keep apps updated to latest versions",
    "Clear cache periodically"
  ],
  timestamp: "2023-12-07T10:30:00.000Z"
}
```

### DeviceAI.isNativeModuleAvailable()

Check if the native TurboModule is available for enhanced performance.

**Returns:** `boolean`

```javascript
const hasNativeModule = DeviceAI.isNativeModuleAvailable();
console.log('Native module available:', hasNativeModule);
```

### DeviceAI.getSupportedFeatures()

Get list of supported features based on platform and native module availability.

**Returns:** `Array<string>`

```javascript
const features = DeviceAI.getSupportedFeatures();
console.log('Supported features:', features);
// Example output: ['device-insights', 'battery-advice', 'performance-tips', 'native-device-info', 'windows-system-info']
```

### DeviceAI.getWindowsSystemInfo() (Windows only)

Get enhanced Windows system information using native WMI queries and performance counters.

**Returns:** `Promise<Object>`
**Platform:** Windows only
**Requires:** Native TurboModule

```javascript
if (Platform.OS === 'windows' && DeviceAI.isNativeModuleAvailable()) {
  const windowsInfo = await DeviceAI.getWindowsSystemInfo();
  
  // Example response:
  {
    osVersion: 'Windows 11',
    buildNumber: '22000',
    processor: 'Intel Core i7',
    architecture: 'x64',
    performanceCounters: {
      cpuUsage: 25.5,
      memoryUsage: 65.2,
      diskUsage: 12.1
    },
    wmiData: {
      computerSystem: 'Win32_ComputerSystem',
      operatingSystem: 'Microsoft Windows 11',
      processor: 'Intel(R) Core(TM) i7'
    }
  }
}
```

### DeviceAI.getWindowsPerformanceCounters() (Windows only)

Get only Windows performance counter data (CPU, memory, disk usage).

**Returns:** `Promise<Object>`
**Platform:** Windows only
**Requires:** Native TurboModule

```javascript
const perfData = await DeviceAI.getWindowsPerformanceCounters();

// Example response:
{
  cpuUsage: 25.3,
  memoryUsage: 64.8,
  diskUsage: 12.1
}
```

### DeviceAI.getWindowsWmiData() (Windows only)

Get only Windows WMI (Windows Management Instrumentation) data.

**Returns:** `Promise<Object>`
**Platform:** Windows only
**Requires:** Native TurboModule

```javascript
const wmiData = await DeviceAI.getWindowsWmiData();

// Example response:
{
  computerSystem: 'Win32_ComputerSystem',
  operatingSystem: 'Microsoft Windows 11',
  processor: 'Intel(R) Core(TM) i7'
}
```

### DeviceAI.getEnhancedBatteryInfo()

Get enhanced battery information with Windows-specific enhancements when available.

**Returns:** `Promise<Object>`
**Platform:** Cross-platform (with Windows enhancements)

```javascript
const batteryInfo = await DeviceAI.getEnhancedBatteryInfo();

// Example response:
{
  level: 85,
  state: 'discharging',
  isCharging: false,
  timestamp: '2023-12-07T10:30:00.000Z',
  windowsSpecific: {  // Only on Windows
    osVersion: 'Windows 11',
    powerProfile: 'balanced',
    estimatedTimeRemaining: 'unknown'
  }
}
```

## Windows Architecture

The module includes a specialized Windows fabric (`DeviceAIFabric`) that provides native access to Windows system APIs for enhanced device diagnostics:

### Features
- **Native WMI Integration**: Direct access to Windows Management Instrumentation
- **System Performance Counters**: Real-time CPU, memory, and disk usage
- **Battery Management**: Advanced battery diagnostics for portable devices
- **Process Monitoring**: Running processes and resource utilization
- **Hardware Information**: Detailed processor, memory, and storage specs

### Windows-Specific Data
When running on Windows, additional information is collected:

```javascript
const insights = await DeviceAI.getDeviceInsights();
console.log(insights.deviceInfo.windowsSpecific);

// Example Windows-specific data:
{
  osVersion: 'Windows 11',
  buildNumber: '22000',
  systemArchitecture: 'x64',
  installedRam: '16 GB',
  processorName: 'Intel Core i7',
  diskSpace: { total: '512 GB SSD', available: '256 GB' },
  runningProcesses: 45,
  systemUptime: '2 days, 14 hours'
}
```

## Example App

The `/example` directory contains a complete React Native app demonstrating all features:

```bash
cd example
npm install
npm run windows  # Windows only
```

### Example App Features
- Interactive dashboard for testing all Windows-specific API methods
- Visual display of separated data types (performance, WMI, battery)
- Enhanced battery information with Windows-specific data
- Real-time Windows performance monitoring
- WMI system information display

## Azure OpenAI Configuration

### Getting Started with Azure OpenAI

1. **Create Azure OpenAI Resource**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "Azure OpenAI" resource
   - Note your endpoint URL and API key

2. **Deploy a Model**:
   - Deploy a GPT-3.5-turbo or GPT-4 model
   - Note the deployment name

3. **Configure the Module**:
   ```javascript
   DeviceAI.configure({
     apiKey: process.env.AZURE_OPENAI_API_KEY,
     endpoint: process.env.AZURE_OPENAI_ENDPOINT
   });
   ```

### Environment Variables
For security, store credentials in environment variables:

```bash
# .env file
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
```

## Error Handling

All methods return standardized response objects with success/error states:

```javascript
const result = await DeviceAI.getDeviceInsights();

if (result.success) {
  console.log('Insights:', result.insights);
} else {
  console.error('Error:', result.error);
}
```

### Common Error Scenarios
- **No AI Configuration**: Falls back to basic insights
- **Network Errors**: Graceful handling with fallback responses
- **Invalid Device Data**: Validation and sanitization
- **API Rate Limits**: Retry logic and error messages

## Requirements

- **React Native**: 0.70.0 or higher
- **Platform Support**: Windows 10+ (Windows-focused as of v3.2.0)
- **Dependencies**: axios for API requests
- **Optional**: Azure OpenAI account for AI-powered insights
- **Windows**: Visual Studio 2019+ with C++ workload for native compilation

## Development

### Building from Source

```bash
git clone https://github.com/anupriya13/react-native-device-ai.git
cd react-native-device-ai
npm install
```

### Running Tests

```bash
npm test
```

### Building Windows Native Code

Requires Visual Studio 2019+ with C++ workload:

```bash
cd windows/ReactNativeDeviceAi
msbuild ReactNativeDeviceAi.vcxproj
```

### Windows-Specific Development

```bash
# Build Windows TurboModule
cd windows/ReactNativeDeviceAi
msbuild ReactNativeDeviceAi.sln

# Test Windows-specific features
npm run demo:windows

# Run Windows example app
cd example
npm run windows
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [x] **MCP Integration**: Model Context Protocol support for Windows-focused AI ✅
- [x] **Windows TurboModule**: Complete Windows-specific implementation ✅
- [x] **Separated Data Types**: Dedicated methods for performance, WMI, and battery data ✅
- [x] **Enhanced Windows APIs**: WMI integration and performance counters ✅
- [ ] **Real-time Streaming**: Live Windows system monitoring with streaming updates
- [ ] **Advanced Windows Features**: Registry monitoring, Windows Services integration
- [ ] **Windows-Specific AI Models**: Specialized AI models for Windows optimization
- [ ] **Offline Caching**: Cache last AI insights for offline access
- [ ] **Push Notifications**: Proactive alerts for Windows system optimization
- [ ] **Windows Admin Features**: Administrative tools and system management
- [ ] **Machine Learning Models**: On-device ML for Windows-specific insights
- [ ] **Enterprise Integration**: Enhanced enterprise and domain features
- [ ] **Edge Computing**: Distributed AI processing for Windows environments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 **Email**: [Create an issue](https://github.com/anupriya13/react-native-device-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/anupriya13/react-native-device-ai/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/anupriya13/react-native-device-ai/wiki)

## Testing

The module includes comprehensive tests covering all functionality:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode  
npm run test:watch

# Run integration tests only
npm test -- --testNamePattern="Integration"
```

### Test Coverage

- **Unit Tests**: Core module functionality and API methods
- **Integration Tests**: End-to-end testing of all features
- **Mock Tests**: Azure OpenAI service integration
- **Error Handling**: Comprehensive error scenario testing

### Running Demo

To test the module functionality quickly:

```bash
# Run standalone demo (Node.js)
node standalone-demo.js

# Run Windows-specific demo
node windows-demo-standalone.js

# Run example React Native app (Windows only)
cd example
npm install
npm run windows
```

## Troubleshooting

### EBUSY Error on Windows
If you encounter EBUSY errors related to `.vsidx` files during `yarn install`:

```bash
# Solution 1: Use npm instead of yarn
cd example
npm install

# Solution 2: Clean Visual Studio cache
rm -rf windows/.vs
yarn install
```

### AutolinkedNativeModules.g.cpp Missing
If autolink fails with missing AutolinkedNativeModules.g.cpp:

```bash
# Use npm for more reliable installation
cd example
npm install
npm run windows
```

**See [EXAMPLE_APP_FIXES.md](EXAMPLE_APP_FIXES.md) for complete troubleshooting guide.**

## Acknowledgments

- Azure OpenAI for powering intelligent insights
- React Native community for cross-platform excellence
- Windows development team for native architecture support

---

**Made with ❤️ for the React Native community**