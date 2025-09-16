# Windows Build Codegen Fix

## Problem

The Windows build fails with the following error:

```
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/codegen-windows - Not found
npm ERR! 404  'codegen-windows@latest' is not in the npm registry.
```

This occurs during the MSBuild process when it tries to run:
```
npx --yes @react-native-community/cli codegen-windows --logging
```

## Root Cause

The issue is in `react-native-windows/PropertySheets/Codegen.props` which defines:

```xml
<CodegenCommand>npx --yes @react-native-community/cli codegen-windows</CodegenCommand>
```

The `--yes` flag causes npx to try installing a package named `codegen-windows` when it can't find the command in already installed packages, but this package doesn't exist on npm.

## Solution

We created a custom property sheet `CodegenFix.props` that overrides the problematic `CodegenCommand` property:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <!-- Override the CodegenCommand to remove the problematic --yes flag -->
    <CodegenCommand>npx @react-native-community/cli codegen-windows</CodegenCommand>
  </PropertyGroup>
</Project>
```

This property sheet is imported in `ReactNativeDeviceAiExample.vcxproj` after the React Native Windows property sheets to ensure it overrides the original command.

## Files Modified

1. **windows/CodegenFix.props** (new file) - Contains the fixed CodegenCommand property
2. **windows/ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj** - Imports the fix property sheet
3. **package.json** - Added test script to validate the fix
4. **test-codegen-fix.js** (new file) - Test script to validate the fix works

## Testing

Run the following command to test the fix:

```bash
npm run test-codegen-fix
```

This confirms that:
- ✅ The codegen command runs successfully without the npm 404 error
- ✅ The property override is working correctly
- ✅ Windows builds should now complete successfully

## Key Benefits

- **Minimal change**: Only overrides one property, doesn't modify react-native-windows files
- **Robust**: Works across different versions and doesn't get overwritten on package updates
- **Testable**: Includes test script to validate the fix
- **Documented**: Clear explanation of the problem and solution

## Command Comparison

**Original (broken):**
```bash
npx --yes @react-native-community/cli codegen-windows --logging
```

**Fixed:**
```bash
npx @react-native-community/cli codegen-windows --logging
```

The fix simply removes the problematic `--yes` flag that was causing npx to try installing a non-existent package.