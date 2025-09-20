# React Native Windows Metro Fix

This directory contains a solution for fixing Metro bundler errors when using React Native Windows.

## Problem

React Native 0.79+ ships with only platform-specific files (`.android.js`, `.ios.js`) but no generic fallbacks (`.js`). This causes Metro bundler to fail when resolving modules for Windows and other platforms that don't have dedicated implementations.

## Solution

The `fix-react-native-windows.js` script creates missing generic fallback files that delegate to the Android implementations, which are generally more platform-agnostic than iOS implementations.

## Usage

The script is automatically run after `npm install` via the `postinstall` script in `package.json`. You can also run it manually:

```bash
npm run fix-metro
```

## What it fixes

The script creates generic fallback files for:

- `Libraries/Image/Image.js` - Image component
- `Libraries/Utilities/BackHandler.js` - Android back button handler
- `Libraries/Utilities/Platform.js` - Platform detection utilities
- `Libraries/StyleSheet/PlatformColorValueTypes.js` - Platform-specific color types
- `Libraries/Network/RCTNetworking.js` - Networking implementation
- `Libraries/Components/AccessibilityInfo/legacySendAccessibilityEvent.js` - Accessibility events
- `Libraries/Alert/RCTAlertManager.js` - Alert manager (stub implementation)
- `Libraries/NativeComponent/BaseViewConfig.js` - Base view configuration

## Notes

- These files are created in `node_modules` and will be removed if you reinstall dependencies
- The `postinstall` script ensures they are recreated automatically
- This is a temporary workaround until React Native Windows provides proper platform resolution
- The fix enables successful Metro bundling for Windows platform development