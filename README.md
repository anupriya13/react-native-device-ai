# react-native-device-ai

> Cross-platform React Native module that generates AI-powered insights and recommendations about the user's device.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.70%2B-green.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Windows-lightgrey.svg)

## Demo

![Demo Screenshot](https://github.com/user-attachments/assets/466fbee5-355b-42d5-b658-caabafa5bb90)

*The demo shows the React Native Device AI module running on Windows with TurboModule architecture, displaying Windows-specific system information, device insights, and AI-powered recommendations.*

## Features

- 🤖 **AI-Powered Insights**: Get intelligent device analysis using Azure OpenAI
- 🔋 **Battery Optimization**: Receive personalized battery saving recommendations
- ⚡ **Performance Tips**: Get actionable advice to improve device performance
- 🏗️ **Windows Architecture**: Native Windows fabric for deep system diagnostics
- 🌐 **Cross-Platform**: Works on iOS, Android, and Windows
- 📊 **Real-time Data**: Collect comprehensive device information and system stats
- 🛡️ **Error Handling**: Robust validation and graceful error handling
- 🔄 **Fallback Mode**: Works without AI configuration using built-in insights
- 🚀 **TurboModule Support**: Modern React Native architecture with enhanced performance
- 🎯 **TypeScript Ready**: Complete TypeScript definitions included
- 🔌 **MCP Integration**: Model Context Protocol support for multi-provider AI and enhanced data collection

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

| Platform | Support | Native Module | TurboModule |
|----------|---------|---------------|-------------|
| iOS      | ✅      | ✅           | ✅          |
| Android  | ✅      | ✅           | ✅          |
| Windows  | ✅      | ✅           | ✅          |
| Web      | ⚠️*     | ❌           | ❌          |

*Web support through JavaScript fallback mode only

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

// Initialize MCP for multi-provider AI support
await Enhanced.initializeMCP();

// Get device insights with multiple AI providers
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['azure-openai', 'openai', 'anthropic'], // Failover support
  dataSources: ['system-monitor', 'battery-monitor'] // Enhanced data collection
});

console.log('AI Provider Used:', insights.providers);
console.log('Enhanced Device Data:', insights.deviceInfo.mcpData);

// Natural language queries with provider preferences
const response = await Enhanced.queryDeviceInfo(
  "How is my battery performing?",
  { preferredProviders: ['anthropic'] }
);
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

The module now supports **MCP** for standardized connections to multiple AI providers and enhanced device data sources.

### MCP Benefits

- **🔄 Multi-Provider AI**: Connect to Azure OpenAI, OpenAI, Anthropic, and local models
- **📊 Enhanced Data Collection**: Real-time system monitoring via MCP data sources
- **⚡ Automatic Failover**: Seamless switching between AI providers
- **💰 Cost Optimization**: Route requests to the most cost-effective provider
- **🏢 Enterprise Integration**: Connect to MDM and compliance systems

### Quick MCP Setup

```javascript
import { Enhanced } from 'react-native-device-ai';

// Initialize MCP with default providers
await Enhanced.initializeMCP();

// Add custom AI provider
await Enhanced.addMCPServer({
  name: 'claude-ai',
  type: 'ai-provider',
  endpoint: 'https://api.anthropic.com',
  auth: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    type: 'x-api-key'
  }
});

// Get insights with provider preferences
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['claude-ai', 'azure-openai', 'openai'],
  dataSources: ['system-monitor', 'enterprise-mdm']
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
    wmiData: {
      osVersion: 'Windows 11',
      buildNumber: '22000'
    },
    performanceCounters: {
      cpuUsage: 25.5,
      memoryUsage: 65.2
    },
    systemMetrics: {
      totalMemory: 17179869184,
      availableMemory: 6442450944
    }
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

## Example Apps

### Full Example App

The `/example` directory contains a complete React Native app demonstrating all features:

```bash
cd example
npm install
npm run android  # or ios, windows
```

### Simple Windows Example

The `/windows-example` directory contains a minimal Windows app for integration testing:

```bash
cd windows-example
npm install
npm test          # Validate setup
npm run windows-init  # Initialize Windows support
npm run windows   # Run on Windows
```

### Example App Features
- Interactive dashboard for testing all API methods
- Visual display of device information and AI insights
- Battery and performance monitoring
- Real-time device statistics

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
- **Platform Support**: iOS 11+, Android API 21+, Windows 10+
- **Dependencies**: axios for API requests
- **Optional**: Azure OpenAI account for AI-powered insights

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
cd windows/DeviceAIFabric
msbuild DeviceAIFabric.vcxproj
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [x] **MCP Integration**: Model Context Protocol support for multi-provider AI ✅
- [x] **Multi-Provider AI**: Support for Azure OpenAI, OpenAI, Anthropic, local models ✅
- [x] **Enhanced Data Collection**: Real-time monitoring via MCP data sources ✅
- [ ] **Real-time Streaming**: Live device monitoring with streaming updates
- [ ] **Multi-language Support**: AI responses in multiple languages
- [ ] **Detailed Explanations**: Granular recommendations with explanations
- [ ] **Offline Caching**: Cache last AI insights for offline access
- [ ] **Push Notifications**: Proactive alerts for device optimization
- [ ] **iOS/Android Native Modules**: Enhanced platform-specific data collection
- [ ] **Machine Learning Models**: On-device ML for privacy-focused insights
- [ ] **IoT Integration**: Connect to IoT sensors and smart home devices
- [ ] **Edge Computing**: Distributed AI processing for better performance

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

# Run example React Native app
cd example
npm install
npm run android  # or ios, windows
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