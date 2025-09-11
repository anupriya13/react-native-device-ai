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

**Important**: Windows requires additional setup steps.

#### Step 1: Initialize Windows Support
```bash
yarn react-native init-windows --template cpp-lib
```

#### Step 2: Run Windows App
```bash
npm run windows
```

### Troubleshooting Windows Setup

If you get the error: `error: unknown command 'run-windows'`

1. **Install React Native Windows:**
   ```bash
   npm install react-native-windows
   ```

2. **Initialize Windows platform with C++ template:**
   ```bash
   yarn react-native init-windows --template cpp-lib
   ```

3. **Try running again:**
   ```bash
   npx react-native run-windows
   ```

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