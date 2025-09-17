# Windows App Component Registration Fix

## Issue
The Windows React Native app was building successfully but crashing on startup with the error:
```
ReactNativeDeviceAiExample has not been registered. This can happen if:
* Metro (the local dev server) is run from the wrong folder. Check if Metro is running, stop it and restart it in the current project.
* A module failed to load due to an error and `AppRegistry.registerComponent` wasn't called.
```

The Visual Studio debugger showed a `winrt::hresult` error in the Windows activation factory code.

## Root Cause
There was a component name mismatch between:
- JavaScript side: `AppRegistry.registerComponent('react-native-device-ai-example', () => App)`
- Windows C++ side: `viewOptions.ComponentName(L"ReactNativeDeviceAiExample")`

The Windows code was looking for a component named "ReactNativeDeviceAiExample" but the JavaScript code registered it as "react-native-device-ai-example".

## Solution
Updated the Windows C++ code to use the correct component name that matches the package.json name:

**Before:**
```cpp
viewOptions.ComponentName(L"ReactNativeDeviceAiExample");
```

**After:**
```cpp
viewOptions.ComponentName(L"react-native-device-ai-example");
```

## Additional Improvements
- Simplified Metro configuration by removing unnecessary transformer options that are already handled by defaults
- Fixed npm scripts to use local react-native CLI instead of npx commands

## Verification
- ✅ Metro bundler starts successfully
- ✅ Bundle generation works for both Android and Windows
- ✅ Component names now match between JavaScript and Windows C++
- ✅ App should no longer crash on Windows startup

## Files Changed
- `example/windows/ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.cpp`: Fixed component name
- `example/metro.config.js`: Removed unnecessary transformer configuration
- `example/package.json`: Reverted to local react-native CLI commands