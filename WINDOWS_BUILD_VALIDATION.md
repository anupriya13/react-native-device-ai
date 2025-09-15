# Windows Build Validation & Testing Guide

## 🔍 Quick Validation

Before attempting to build ReactNativeDeviceAiExample.sln, run our validation script:

```bash
npm run validate-windows
```

This script checks for:
- ✅ All critical files exist
- ✅ No deprecated Windows APIs (GetVersionExW, WinRT exports)
- ✅ Modern APIs in use (RtlGetVersion, PowerManager)
- ✅ Correct project configuration
- ✅ No build-breaking issues

## 🏗️ Building on Windows

### Prerequisites
- Windows 10/11 with Visual Studio 2022
- React Native development environment setup
- Windows SDK 10.0 or later

### Step-by-Step Build Process

1. **Validate Configuration:**
   ```bash
   npm run validate-windows
   ```

2. **Install Dependencies (Example App):**
   ```bash
   cd example
   npm install  # Use npm, not yarn to avoid EBUSY errors
   ```

3. **Build and Run:**
   ```bash
   npm run windows
   ```

   Or manually:
   ```bash
   npx @react-native-community/cli run-windows
   ```

## 🔧 Troubleshooting Common Issues

### Build Error: "Cannot open source file: 'codegen\module.g.cpp'"

**Solution:** This file was removed from the build. The error indicates an old configuration.

**Fix:** 
- Ensure `module.g.cpp` is NOT referenced in `ReactNativeDeviceAi.vcxproj`
- Our validation script checks for this

### Build Error: "unresolved external symbol WINRT_CanUnloadNow"

**Solution:** WinRT DLL exports were removed from the module definition.

**Fix:** 
- `ReactNativeDeviceAi.def` should only contain `EXPORTS` header
- No WinRT functions should be exported

### Build Error: "GetVersionExW was declared deprecated"

**Solution:** Modern `RtlGetVersion` API is now used.

**Fix:** 
- The C++ code uses `RtlGetVersion` instead of deprecated `GetVersionExW`
- This is automatically validated by our script

### EBUSY Error During npm install

**Solution:** Visual Studio IntelliSense files cause file locks.

**Fix:**
```bash
# Close Visual Studio, then:
cd example
npm install  # Use npm instead of yarn
```

### AutolinkedNativeModules.g.cpp Missing

**Solution:** Autolink process needs to run on Windows.

**Fix:**
```bash
cd example
npx @react-native-community/cli autolink-windows
```

## 🧪 Testing Build Without Windows

While you can't fully compile without Windows, you can validate:

1. **Run Validation Script:**
   ```bash
   npm run validate-windows
   ```

2. **Check JavaScript Build:**
   ```bash
   npm run build
   npm test
   ```

3. **Verify TurboModule Spec:**
   ```bash
   npx tsc --noEmit  # Check TypeScript compilation
   ```

## 📊 Expected Results

### Successful Validation Output:
```
🎉 All checks passed! The Windows build should compile successfully.

🚀 To build and run:
   cd example
   npm install
   npm run windows
```

### Successful Windows Build:
- No compilation errors
- TurboModule successfully loads
- Device info APIs return real Windows data
- Example app runs and displays Windows system information

## 🔍 Manual Verification

If you have access to Windows, you can manually verify:

1. **Visual Studio Build:**
   ```
   Open: example/windows/ReactNativeDeviceAiExample.sln
   Build: Ctrl+Shift+B
   Expected: 0 errors, solution builds successfully
   ```

2. **Runtime Test:**
   ```
   Run: npm run windows (from example directory)
   Expected: App launches and shows Windows device information
   ```

3. **TurboModule Test:**
   ```javascript
   import { ReactNativeDeviceAi } from 'react-native-device-ai';
   
   // Should return actual Windows data
   const deviceInfo = await ReactNativeDeviceAi.getDeviceInfo();
   const windowsInfo = await ReactNativeDeviceAi.getWindowsSystemInfo();
   ```

## 📋 Validation Checklist

Before reporting Windows build issues, ensure:

- [ ] `npm run validate-windows` passes with 0 failures
- [ ] `npm run build` succeeds
- [ ] `npm test` shows majority of tests passing
- [ ] No deprecated API warnings in validation
- [ ] Example app package.json has no infinite install loop
- [ ] All critical files exist and are properly referenced

## 🆘 Getting Help

If validation passes but build still fails:

1. **Share validation output:** `npm run validate-windows`
2. **Include full build error log**
3. **Specify Windows/Visual Studio versions**
4. **Mention if any manual changes were made**

The validation script eliminates most common build issues automatically.