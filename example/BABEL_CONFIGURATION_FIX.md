# Babel Configuration Fix for React Native 0.79

## Issue
React Native 0.79 with React Native Windows was experiencing syntax errors during Metro bundling:

```
ERROR  SyntaxError: Missing initializer in const declaration. (156:41)
```

The error occurred in React Native Windows's `ActivityIndicator.js` due to Flow syntax not being properly parsed.

## Root Cause
The example was using the deprecated `metro-react-native-babel-preset` which doesn't properly handle Flow syntax in React Native 0.79. This caused Flow type annotations and component syntax to fail during transpilation.

## Solution
Updated the `babel.config.js` to use the newer `@react-native/babel-preset`:

```javascript
module.exports = {
  presets: [
    ['@react-native/babel-preset', {
      unstable_transformProfile: 'hermes-stable'
    }],
  ],
};
```

## Changes Made
1. Updated `example/babel.config.js` to use `@react-native/babel-preset`
2. Removed deprecated `metro-react-native-babel-preset` dependency from `package.json`
3. Added Hermes-stable transform profile for optimal performance

## Verification
- ✅ Metro bundler starts without errors
- ✅ Windows platform bundles generate successfully 
- ✅ Android platform bundles generate successfully
- ✅ ActivityIndicator component compiles correctly
- ✅ All Flow syntax is properly transpiled

## Benefits
- Resolves syntax errors in React Native Windows libraries
- Enables proper Flow type checking and transpilation
- Uses the official React Native 0.79 babel preset
- Optimizes for Hermes JavaScript engine
- Removes deprecated dependencies

This fix ensures the example app can run properly on all supported platforms with React Native 0.79.