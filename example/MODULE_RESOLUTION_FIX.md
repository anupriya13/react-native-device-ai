# Module Resolution Fix for react-native-device-ai

## Issue
The example app was unable to resolve the `react-native-device-ai` module:

```
ERROR  Error: Unable to resolve module react-native-device-ai from App.js
```

## Root Cause
The example app was structured as a separate package that needed to import the parent library, but:
1. Metro configuration was not set up to resolve the parent directory as a module
2. Missing `@react-native/metro-config` dependency
3. The main library `index.js` was pointing to built files that had babel compilation issues

## Solution

### 1. Updated Metro Configuration
Added proper module resolution to map `react-native-device-ai` to the parent directory:

```javascript
extraNodeModules: {
  // Map react-native-device-ai to the parent directory
  'react-native-device-ai': root,
}
```

### 2. Added Missing Dependencies
Added required `@react-native/metro-config` to devDependencies in example package.json.

### 3. Fixed Main Entry Point
Updated the main library `index.js` to use source files instead of built files to avoid babel compilation issues with the built output.

### 4. Added Runtime Dependencies
Added `@babel/runtime` as a dependency in the root package.json to support transpiled code.

## Changes Made

1. **example/metro.config.js**: Added module mapping for `react-native-device-ai`
2. **example/package.json**: Added `@react-native/metro-config` dependency  
3. **index.js**: Changed to use source files (`./src/`) instead of built files (`./lib/`)
4. **package.json**: Added `@babel/runtime` as dependency

## Verification

- ✅ Metro bundler starts without module resolution errors
- ✅ Android bundle generates successfully (78 references to react-native-device-ai)
- ✅ Windows bundle generates successfully  
- ✅ Module is properly resolved and included in bundles
- ✅ Example app can now import and use `react-native-device-ai`

## Usage

The example app can now successfully import and use the library:

```javascript
import DeviceAI from 'react-native-device-ai';

// Use the library methods
const insights = await DeviceAI.getDeviceInsights();
```

This fix enables the example app to properly demonstrate the AI-powered device insights functionality.