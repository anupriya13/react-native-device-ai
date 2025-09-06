# react-native-device-ai

> Cross-platform React Native module that generates AI-powered insights and recommendations about the user's device.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.70%2B-green.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Windows-lightgrey.svg)

## Demo

![Demo Screenshot](https://github.com/user-attachments/assets/c5751e9c-b444-46aa-9004-f34c5729a969)

*The demo shows the React Native Device AI module in action, displaying device insights, battery advice, and performance tips.*

## Features

- 🤖 **AI-Powered Insights**: Get intelligent device analysis using Azure OpenAI
- 🔋 **Battery Optimization**: Receive personalized battery saving recommendations
- ⚡ **Performance Tips**: Get actionable advice to improve device performance
- 🏗️ **Windows Architecture**: Native Windows fabric for deep system diagnostics
- 🌐 **Cross-Platform**: Works on iOS, Android, and Windows
- 📊 **Real-time Data**: Collect comprehensive device information and system stats
- 🛡️ **Error Handling**: Robust validation and graceful error handling
- 🔄 **Fallback Mode**: Works without AI configuration using built-in insights

## Installation

```bash
npm install react-native-device-ai
```

### Additional Setup

For React Native 0.60+ with autolinking, no additional setup is required.

For older versions:
```bash
react-native link react-native-device-ai
```

## Quick Start

```javascript
import DeviceAI from 'react-native-device-ai';

// Optional: Configure Azure OpenAI for AI-powered insights
DeviceAI.configure({
  apiKey: 'your-azure-openai-api-key',
  endpoint: 'https://your-resource.openai.azure.com'
});

// Get comprehensive device insights
const insights = await DeviceAI.getDeviceInsights();
console.log(insights.insights); // AI-generated analysis
console.log(insights.recommendations); // Actionable tips

// Get battery optimization advice
const batteryAdvice = await DeviceAI.getBatteryAdvice();
console.log(batteryAdvice.advice); // AI-powered battery tips

// Get performance optimization tips
const performanceTips = await DeviceAI.getPerformanceTips();
console.log(performanceTips.tips); // AI-generated performance advice
```

## API Reference

### DeviceAI.configure(config)

Configure Azure OpenAI for AI-powered insights.

**Parameters:**
- `config` (Object): Configuration object
  - `apiKey` (string): Your Azure OpenAI API key
  - `endpoint` (string): Your Azure OpenAI endpoint URL

```javascript
DeviceAI.configure({
  apiKey: 'your-api-key-here',
  endpoint: 'https://your-resource.openai.azure.com'
});
```

### DeviceAI.getDeviceInsights()

Returns comprehensive AI-powered analysis of device stats including CPU, memory, disk, battery, OS, and apps.

**Returns:** `Promise<Object>`

```javascript
const result = await DeviceAI.getDeviceInsights();

// Example response:
{
  success: true,
  deviceInfo: {
    platform: 'ios',
    version: '16.0',
    memory: { total: '8 GB', used: '5.2 GB', usedPercentage: 65 },
    storage: { total: '128 GB', used: '89 GB', usedPercentage: 70 },
    battery: { level: 78, state: 'unplugged' },
    cpu: { cores: 8, usage: 25, temperature: '45°C' }
  },
  insights: "Your iOS device appears to be running well. Consider optimizing battery usage...",
  recommendations: [
    "High memory usage - consider closing unused apps",
    "Your device is running optimally"
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
npm run android  # or ios, windows
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

- [ ] **Real-time Monitoring**: Continuous device monitoring with AI updates
- [ ] **Multi-language Support**: AI responses in multiple languages
- [ ] **Detailed Explanations**: Granular recommendations with explanations
- [ ] **Offline Caching**: Cache last AI insights for offline access
- [ ] **Push Notifications**: Proactive alerts for device optimization
- [ ] **iOS/Android Native Modules**: Enhanced platform-specific data collection
- [ ] **Machine Learning Models**: On-device ML for privacy-focused insights

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

## Acknowledgments

- Azure OpenAI for powering intelligent insights
- React Native community for cross-platform excellence
- Windows development team for native architecture support

---

**Made with ❤️ for the React Native community**