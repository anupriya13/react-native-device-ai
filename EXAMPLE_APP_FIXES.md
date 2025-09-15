# Example App Installation & Build Fixes

## ✅ **EBUSY Error Fix (Visual Studio Files)**

### Problem:
```
error Error: EBUSY: resource busy or locked, copyfile '...\windows\.vs\...\*.vsidx'
```

### Solutions:

**Option 1: Use npm instead of yarn**
```bash
cd example
npm install
```

**Option 2: Clean Visual Studio cache before yarn**
```bash
cd example
# Close Visual Studio if open
rm -rf windows/.vs
yarn install
```

**Option 3: Add .npmignore to exclude VS files**
```bash
echo ".vs/" >> .npmignore
echo "*.vsidx" >> .npmignore
```

## ✅ **AutolinkedNativeModules.g.cpp Error Fix**

### Problem:
```
Error: ENOENT: no such file or directory, open '...\node_modules\react-native-windows\templates\cpp-lib\windows\MyApp\AutolinkedNativeModules.g.cpp'
```

### Solutions:

**Option 1: Use npm instead of yarn**
```bash
cd example
npm install
npm run windows
```

**Option 2: Manual autolink (Windows only)**
```bash
cd example
npx @react-native-community/cli autolink-windows --check --logging
```

**Option 3: Reset Windows project (if corrupted)**
```bash
cd example
rm -rf windows/ReactNativeDeviceAiExample/AutolinkedNativeModules.g.*
npx @react-native-community/cli init-windows --template cpp-lib
```

## 🎯 **Recommended Installation Process**

### For Windows Development:
```bash
# 1. Clean install with npm
cd example
npm install

# 2. Initialize Windows project (if needed)
npx @react-native-community/cli init-windows --template cpp-lib

# 3. Run the app
npm run windows
```

### For Cross-Platform Development:
```bash
# Use npm for consistency
cd example
npm install

# Run on desired platform
npm run android  # or ios, or windows
```

## 🔧 **Additional Notes**

- **Visual Studio**: Close VS before installing dependencies to avoid file locks
- **Yarn**: May cause EBUSY errors on Windows due to VS IntelliSense cache files
- **npm**: More reliable for React Native Windows projects
- **Autolink**: Only works on Windows hosts for Windows projects

## 📊 **What's Fixed**

✅ Visual Studio .vs/ directory excluded from packages  
✅ Updated .gitignore to prevent VS cache file inclusion  
✅ Added npm install script to package.json  
✅ Updated setup instructions to use npm over yarn  
✅ Comprehensive troubleshooting guide created