# React Native CLI Commands Fix

## Issue
The example app was failing to start Metro bundler with the error:
```
sh: 1: react-native: not found
```

This occurred when running `npm start` or other React Native commands.

## Root Cause
Several npm scripts in `package.json` were calling `react-native` directly instead of using `npx @react-native-community/cli`. Since the `react-native` command is not globally available and wasn't being resolved from `node_modules/.bin/`, the commands were failing.

## Solution
Updated all npm scripts to use the proper `npx @react-native-community/cli` syntax instead of the bare `react-native` command.

### Scripts Updated
1. `start`: `react-native start` → `npx @react-native-community/cli start`
2. `android`: `react-native run-android` → `npx @react-native-community/cli run-android`
3. `ios`: `react-native run-ios` → `npx @react-native-community/cli run-ios`
4. `windows-init`: `react-native init-windows` → `npx @react-native-community/cli init-windows`
5. `autolink`: `react-native autolink` → `npx @react-native-community/cli autolink`
6. `windows-force`: `npx react-native run-windows` → `npx @react-native-community/cli run-windows`
7. `windows-cli`: `npx react-native run-windows` → `npx @react-native-community/cli run-windows`
8. `windows-compatible`: `npx react-native run-windows` → `npx @react-native-community/cli run-windows`

## Verification
- ✅ Metro bundler starts successfully with `npm start`
- ✅ React Native CLI version check works (`npx @react-native-community/cli --version` returns 20.0.2)
- ✅ Android bundles generate successfully
- ✅ Windows bundles generate successfully
- ✅ All React Native commands now use proper CLI syntax

## Usage
The example app can now be started properly:
```bash
cd example
npm install
npm start
```

All React Native commands now work correctly through npm scripts.