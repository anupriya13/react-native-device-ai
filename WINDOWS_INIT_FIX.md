# Windows Initialization Command Fix

## Problem
The command `yarn react-native init-windows --template cpp-lib` fails with:
```
error: unknown option '--template'
```

## Root Cause
The `--template` option doesn't exist in React Native Windows CLI. The correct parameters for creating a C++ library project are:
- `--projectType lib` (for library instead of app)
- `--language cpp` (for C++ instead of C#)

## Solution

### ✅ Correct Command
```bash
npx react-native-windows-init --projectType lib --language cpp
```

### ❌ Incorrect Command (will fail)
```bash
yarn react-native init-windows --template cpp-lib
```

## Available npm Scripts

### Quick fix
```bash
npm run init-windows
```

### See help
```bash
npm run init-windows-help
```

## Command Options Explained

From `npx react-native-windows-init --help`:

- `--projectType`: Choose "app" or "lib" (default: "app")
- `--language`: Choose "cs" or "cpp" (default: "cpp")  
- `--namespace`: Native project namespace (optional)
- `--version`: React Native Windows version (optional)

## Examples

### Create C++ Library (equivalent to --template cpp-lib)
```bash
npx react-native-windows-init --projectType lib --language cpp
```

### Create C++ App
```bash
npx react-native-windows-init --projectType app --language cpp
```

### Create C# Library  
```bash
npx react-native-windows-init --projectType lib --language cs
```

## Quick Testing Alternatives

If Windows setup is complex, test the module functionality directly:

```bash
# 30-second functionality test
node standalone-demo.js

# Interactive demo with Windows features  
node working-example-demo.js

# Full test suite
npm test
```

These demos include all Windows TurboModule functionality without requiring Windows app setup.