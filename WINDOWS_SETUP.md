# Windows Setup Guide for React Native Device AI

## Prerequisites

1. **Windows Development Environment:**
   - Windows 10 version 1903 (Build 18362) or higher
   - Visual Studio 2019 or 2022 with the following workloads:
     - Universal Windows Platform development
     - Desktop development with C++
   - Windows 10 SDK (10.0.18362.0 or higher)

2. **React Native Development:**
   - Node.js (v16 or higher)
   - React Native CLI: `npm install -g @react-native-community/cli`
   - Yarn (recommended): `npm install -g yarn`

## Setting up the Example App for Windows

### Step 1: Install Dependencies
```bash
cd example
npm install
```

### Step 2: Initialize Windows Support
You need to initialize the example app as a proper React Native Windows project:

```bash
# Initialize Windows support with C++ library template
npx react-native-windows-init --projectType lib --language cpp
```

### Step 3: Configure Windows AutoLinking
The `react-native.config.js` is already configured to link the device-ai module.

### Step 4: Run the Windows App
```bash
npm run windows
# or
npx react-native run-windows
```

## Alternative: Use the Standalone Demo

If you want to quickly test the Windows TurboModule functionality without setting up the full React Native Windows app:

### Option 1: Quick Test (30 seconds)
```bash
cd react-native-device-ai
node standalone-demo.js
```

### Option 2: Interactive Demo
```bash
cd react-native-device-ai
node working-example-demo.js
```

### Option 3: Full Test Suite
```bash
cd react-native-device-ai
npm test
```

## Windows-Specific Features

The Windows implementation includes:
- **WMI Queries**: Windows Management Instrumentation for detailed system info
- **Performance Counters**: Real-time CPU, memory, and process monitoring
- **Registry Access**: System configuration information
- **Enhanced Device Information**: Windows-specific hardware and software details

### Windows-Specific API Methods
```javascript
import DeviceAI from 'react-native-device-ai';

// Windows-specific system information
const windowsInfo = await DeviceAI.getWindowsSystemInfo();

// Check if native module is available
const isAvailable = DeviceAI.isNativeModuleAvailable();

// Get platform-specific features
const features = DeviceAI.getSupportedFeatures();
```

## Troubleshooting

### Error: "unknown command 'run-windows'"

This error occurs when:
1. `react-native-windows` is not installed in the project
2. The project is not initialized as a React Native Windows app
3. The React Native CLI doesn't recognize Windows commands

**Solution:**
```bash
# Install react-native-windows
npm install react-native-windows

# Initialize Windows support with C++ library template
npx react-native-windows-init --projectType lib --language cpp

# Run the app
npx react-native run-windows
```

### Visual Studio Build Errors

If you encounter build errors in Visual Studio:
1. Ensure all required workloads are installed
2. Check that Windows SDK version matches project requirements
3. Clean and rebuild the solution

### Module Linking Issues

If the device-ai module is not recognized:
1. Verify `react-native.config.js` is properly configured
2. Run autolinking: `npx react-native autolink-windows`
3. Clean and rebuild the project

## Project Structure

After initialization, your project structure should look like:
```
example/
├── windows/
│   ├── react-native-device-ai-example.sln
│   └── react-native-device-ai-example/
│       ├── react-native-device-ai-example.vcxproj
│       ├── App.xaml
│       ├── App.cpp
│       ├── MainPage.xaml
│       ├── MainPage.cpp
│       └── pch.h
├── App.js
├── index.js
├── package.json
└── react-native.config.js
```

## Additional Resources

- [React Native Windows Documentation](https://microsoft.github.io/react-native-windows/)
- [Windows Development Setup](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies)
- [TurboModule Documentation](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)