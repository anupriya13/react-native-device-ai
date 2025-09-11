# React Native Device AI - Example App

This example demonstrates the usage of react-native-device-ai library across different platforms.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- React Native development environment
- For Windows: Visual Studio 2019/2022 with Windows development workloads

### Installation
```bash
npm install
```

## Platform-Specific Setup

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Windows

**⚠️ React Native 0.79 Windows Setup Notice**

The `NoWindowsConfig` error occurs because React Native 0.79 has changed Windows project initialization. Here are the solutions:

#### Option 1: Quick Demo (Recommended)
Test all functionality without Windows app setup:
```bash
cd ..
node standalone-demo.js        # Quick functionality test
node working-example-demo.js   # Interactive demo with Windows features
```

#### Option 2: Windows App Development

For React Native 0.79 Windows apps, you need Visual Studio 2022:

1. **Prerequisites:**
   - Visual Studio 2022 with Windows development workload
   - Windows 10 SDK (19041.0+)

2. **Initialize Windows (if not done):**
   ```bash
   yarn react-native init-windows --template cpp-lib  # For module development
   # OR for apps (requires VS2022 integration)
   npx @react-native-community/cli init-windows
   ```

3. **Run Windows App:**
   ```bash
   npm run windows
   ```

#### Option 3: Alternative Setup

If automatic initialization fails, use the working demos which include all Windows TurboModule features:
- Windows system information via WMI
- Performance counters and monitoring  
- Native device insights
- AI-powered recommendations

## Alternative Testing Methods

If the full React Native Windows setup is complex, you can test the library functionality using:

### Quick Test (30 seconds)
```bash
cd ..
node standalone-demo.js
```

### Interactive Demo
```bash
cd ..
node working-example-demo.js
```

### Full Test Suite
```bash
cd ..
npm test
```

## Features Demonstrated

- **Device Insights**: Real-time system metrics
- **AI Recommendations**: Smart optimization tips
- **Natural Language Queries**: Ask questions about your device
- **Cross-Platform Support**: iOS, Android, Windows
- **TurboModule Architecture**: Enhanced performance with native code

## Windows-Specific Features

When running on Windows, the app demonstrates:
- WMI queries for detailed system information
- Performance counters for real-time monitoring
- Windows-specific hardware and software details
- Registry access for system configuration

## Need Help?

See the complete Windows setup guide: [WINDOWS_SETUP.md](../WINDOWS_SETUP.md)

For more information, check the main project documentation.