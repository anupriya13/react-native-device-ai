# Windows Build Instructions

This document provides instructions for building the React Native Device AI example on Windows, addressing the autolink issues described in [Microsoft's React Native Windows documentation](https://microsoft.github.io/react-native-windows/docs/run-windows-cli).

## Prerequisites

- Visual Studio 2022 with C++ development tools
- Windows 10 SDK (10.0.19041.0 or later)
- React Native 0.79+ CLI tools
- Node.js 16+ and npm

## Autolink Issue Resolution

The React Native CLI may encounter a "NoWindowsConfig" error when trying to autolink Windows modules. This is a known issue where the CLI fails to detect the Windows app project configuration.

### Solution: Manual Autolink Configuration

We have pre-configured the autolink files to bypass the CLI detection issue:

- `AutolinkedNativeModules.g.cpp` - Properly registers ReactNativeDeviceAi package provider
- `AutolinkedNativeModules.g.props` - Contains correct project references with proper relative paths
- `AutolinkedNativeModules.g.targets` - Standard MSBuild targets file
- `react-native.config.js` - Configured for Windows project detection

## Build Commands

### Option 1: Direct MSBuild (Recommended)

```bash
# Navigate to example directory
cd example

# Install dependencies
npm install

# Validate build configuration
npm run validate-windows

# Build using MSBuild directly (Windows only)
npm run windows-manual
```

### Option 2: React Native CLI (if autolink is fixed)

```bash
# Navigate to example directory  
cd example

# Install dependencies
npm install

# Run with explicit paths to bypass detection issues
npx react-native run-windows --sln "windows\ReactNativeDeviceAiExample.sln" --proj "windows\ReactNativeDeviceAiExample\ReactNativeDeviceAiExample.vcxproj" --no-autolink
```

### Option 3: Visual Studio

1. Run `npm run validate-windows` to ensure configuration is correct
2. Open `windows\ReactNativeDeviceAiExample.sln` in Visual Studio
3. Select Debug x64 configuration
4. Build Solution (Ctrl+Shift+B)

## Validation

Before building, always run:

```bash
npm run validate-windows
```

This should show "20 passed, 0 failed, 0 warnings" indicating all build configuration checks pass.

## Troubleshooting

**Error: "NoWindowsConfig: Windows auto-link only supported on Windows app projects"**
- This is a known CLI detection issue
- Use the manual build approach with `npm run windows-manual`
- The autolink files are already correctly configured

**Error: "ReactNativeDeviceAi project not found"**  
- Verify the TurboModule project exists at `../windows/ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj`
- Check that the project GUID `{8D427E1F-1E62-4E19-BB90-8CFDB762014D}` matches

**Error: "MSBuild warnings about duplicate imports"**
- This is normal and doesn't affect functionality
- The warnings are handled by the autolink configuration

## Success Indicators

When the build completes successfully, you should see:
- ✅ All validation checks pass (20/20)
- ✅ Solution builds without errors in Visual Studio
- ✅ Example app launches and demonstrates device AI functionality
- ✅ ReactNativeDeviceAi TurboModule loads correctly

The build configuration follows Microsoft's React Native Windows guidelines and should work reliably on Windows development environments.