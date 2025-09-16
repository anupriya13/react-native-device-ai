# Windows Example for react-native-device-ai

A minimal Windows app for testing react-native-device-ai v1.0.0 integration.

## Purpose

This example provides the simplest possible integration test for the react-native-device-ai library on Windows. It demonstrates calling key APIs without complex UI.

## Features Tested

- ✅ Native module availability check
- ✅ Device insights gathering
- ✅ Battery advice
- ✅ Performance tips
- ✅ Windows-specific system information
- ✅ Supported features enumeration

## Quick Setup

1. **Prerequisites:**
   - Windows 10/11 with Visual Studio 2022
   - React Native development environment
   - Node.js 16+ 

2. **Install Dependencies:**
   ```bash
   cd windows-example
   npm install
   ```

3. **Initialize Windows Support:**
   ```bash
   npm run windows-init
   ```

4. **Run the Example:**
   ```bash
   npm run windows
   ```

## Usage

The app provides a simple interface with buttons to test each API:

- **Get Device Insights** - Calls `DeviceAI.getDeviceInsights()`
- **Get Battery Advice** - Calls `DeviceAI.getBatteryAdvice()`
- **Get Performance Tips** - Calls `DeviceAI.getPerformanceTips()`
- **Windows System Info** - Calls `DeviceAI.getWindowsSystemInfo()` (Windows only)
- **Supported Features** - Calls `DeviceAI.getSupportedFeatures()`

Each test displays success/failure status and truncated result data.

## Integration Test Results

The app shows:
- ✅ Green checkmark for successful API calls
- ❌ Red X for failed calls with error messages
- JSON preview of returned data
- Loading indicators during API calls

## Troubleshooting

If the app fails to run:

1. **Check Native Module:** The app will show if the native module is available
2. **Review Console:** Check Metro console for detailed error messages
3. **Verify Dependencies:** Ensure react-native-device-ai is properly linked
4. **Windows Setup:** Confirm Visual Studio C++ workloads are installed

## Expected Behavior

- **With Native Module:** All APIs should work, including Windows-specific features
- **Fallback Mode:** Basic functionality works even without native module
- **Error Handling:** Graceful degradation with informative error messages

This example focuses on minimal code and maximum API coverage for integration validation.