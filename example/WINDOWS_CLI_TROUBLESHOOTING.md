# Windows App Config Detection - Troubleshooting Guide

## Problem
React Native CLI showing: "Couldn't determine Windows app config"

## Root Cause
This error occurs when React Native CLI cannot detect the Windows project configuration, typically due to:
1. Missing or incorrect react-native.config.js
2. Incomplete Windows project initialization
3. React Native 0.79 CLI detection bugs
4. Missing Visual Studio components

## Solutions (Try in Order)

### Solution 1: Use Bypass Scripts
```bash
# Try the direct build approach (recommended)
npm run windows-direct

# Or MSBuild only
npm run build-windows-only
```

### Solution 2: Force CLI with Explicit Paths
```bash
npx react-native run-windows --no-autolink \
  --sln "windows\ReactNativeDeviceAiExample.sln" \
  --proj "windows\ReactNativeDeviceAiExample\ReactNativeDeviceAiExample.vcxproj"
```

### Solution 3: Visual Studio Direct
1. Open `windows/ReactNativeDeviceAiExample.sln` in Visual Studio
2. Set `ReactNativeDeviceAiExample.Package` as startup project
3. Select Debug | x64 configuration
4. Press F5 to build and run

### Solution 4: Re-initialize Windows Project
```bash
# Backup current windows folder
mv windows windows-backup

# Re-initialize
npx react-native init-windows --template cpp-lib --overwrite

# Restore custom modifications if any
```

### Solution 5: Manual Package Installation
1. Build the solution in Visual Studio
2. Navigate to `windows/ReactNativeDeviceAiExample.Package/AppPackages/`
3. Find the .msix or .appx file
4. Right-click and select "Install"

## Verification
After successful build, you should see:
- ✅ Metro bundler running on port 8081
- ✅ Windows app launching
- ✅ React Native Device AI module accessible

## Prerequisites
Ensure you have:
- Visual Studio 2019/2022 with C++ development tools
- Windows 10/11 SDK (latest version)
- MSBuild in your system PATH
- Node.js and npm properly configured

## Common Issues

### "MSBuild not found"
- Install Visual Studio Build Tools
- Add MSBuild to your PATH
- Use Visual Studio Developer Command Prompt

### "Windows SDK not found"
- Install Windows 10/11 SDK via Visual Studio Installer
- Ensure latest version is selected

### "Package deployment failed"
- Enable Developer Mode in Windows Settings
- Run PowerShell as Administrator
- Clear existing app installations

## Support
If all solutions fail, this may be a React Native 0.79 Windows CLI bug.
Consider using Visual Studio IDE directly or downgrading to React Native 0.72.
