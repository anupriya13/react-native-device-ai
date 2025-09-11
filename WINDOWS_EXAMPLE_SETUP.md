# Windows Example App Setup Guide

## Issue: NoWindowsConfig Error

The error `Couldn't determine Windows app config` occurs because React Native 0.79 changed how Windows projects are initialized and managed.

## Fixed Setup Instructions

### Option 1: Quick Demo (Recommended for Testing)
```bash
# Test the module functionality without Windows app
cd react-native-device-ai
node standalone-demo.js        # 30-second functionality test
node working-example-demo.js   # Interactive demo with Windows features
```

### Option 2: Windows TurboModule Library Development
For developing native Windows modules (not apps), use:
```bash
cd react-native-device-ai
yarn react-native init-windows --template cpp-lib  # Creates Windows library project
```

### Option 3: Windows App with React Native 0.79

For React Native 0.79, Windows app setup requires Visual Studio:

1. **Prerequisites:**
   - Visual Studio 2022 with C++ and Windows development workloads
   - Windows 10 SDK (version 10.0.19041.0 or later)

2. **Setup:**
   ```bash
   cd example
   npm install
   npx @react-native-community/cli init-windows --template app
   ```

3. **Manual Windows Project Creation:**
   If automatic initialization fails, create Windows project manually:
   - Open Visual Studio 2022
   - Create new "React Native Windows App" project
   - Copy the generated App.js content into the new project

4. **Build and Run:**
   ```bash
   npx react-native run-windows --arch x64
   ```

## Working Demo

The module is fully functional with these working examples:

- ✅ **Device Insights**: Memory, CPU, battery, storage metrics
- ✅ **Natural Language Queries**: "How much battery do I have?"
- ✅ **Windows TurboModule**: Native performance counters and WMI
- ✅ **AI Recommendations**: Azure OpenAI integration with fallbacks

## Testing Commands

```bash
# Functionality testing (no Visual Studio required)
node standalone-demo.js

# Interactive demo with all features
node working-example-demo.js

# Full test suite
npm test
```

## Alternative: Use Existing Windows Demo

The main library already includes a working Windows TurboModule demo. See the screenshots in the PR showing the Windows interface with device insights and natural language queries.

For production apps, consider using React Native 0.75 or earlier for stable Windows support, or wait for improved Windows tooling in future React Native releases.