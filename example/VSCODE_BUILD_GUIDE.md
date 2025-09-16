# VS Code Build Guide - React Native Device AI Example (No Autolink)

This guide provides step-by-step instructions for building and running the React Native Device AI example app from VS Code without using React Native's autolink feature.

## 🎯 Overview

Since React Native CLI autolink detection has known issues on Windows ("NoWindowsConfig" error), this guide shows how to build and run the example using VS Code with manual configuration.

## 📋 Prerequisites

- **VS Code** with these extensions:
  - C/C++ (Microsoft)
  - C# (Microsoft) 
  - MSBuild project file tools (Microsoft)
  - React Native Tools (Microsoft)
- **Visual Studio Build Tools 2022** or **Visual Studio 2022**
- **Windows 10 SDK** (10.0.19041.0 or later)
- **Node.js 16+** and npm

## 🚀 Quick Start

### Option 1: Integrated Terminal Build (Recommended)

1. **Open in VS Code**:
   ```bash
   cd react-native-device-ai/example
   code .
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Validate Configuration**:
   ```bash
   npm run validate-autolink-fixes
   ```

4. **Build and Run** (choose one):
   ```bash
   # Direct MSBuild (fastest, no autolink needed)
   npm run windows-manual
   
   # OR: With build monitoring
   npm run windows
   
   # OR: React Native CLI with explicit paths (bypasses autolink)
   npm run windows-force
   ```

### Option 2: VS Code Tasks Configuration

Create `.vscode/tasks.json` in the example directory:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build Windows (No Autolink)",
            "type": "shell",
            "command": "cd windows && msbuild ReactNativeDeviceAiExample.sln /p:Configuration=Debug /p:Platform=x64 /m:1 /verbosity:normal",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": [
                "$msCompile"
            ]
        },
        {
            "label": "Start Metro",
            "type": "shell",
            "command": "npm start",
            "isBackground": true,
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            },
            "problemMatcher": {
                "pattern": {
                    "regexp": "^(.*)$",
                    "file": 1,
                    "location": 2,
                    "message": 3
                },
                "background": {
                    "activeOnStart": true,
                    "beginsPattern": "Welcome to Metro",
                    "endsPattern": "Metro waiting on"
                }
            }
        },
        {
            "label": "Validate Windows Build",
            "type": "shell",
            "command": "npm run validate-autolink-fixes",
            "group": "test",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        }
    ]
}
```

### Option 3: VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Windows App",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/windows-build-monitor.js",
            "console": "integratedTerminal",
            "env": {
                "NODE_ENV": "development"
            }
        },
        {
            "name": "Debug React Native",
            "type": "reactnative",
            "request": "launch",
            "platform": "windows"
        }
    ]
}
```

## 🔧 Using VS Code Features

### Build from Command Palette

1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "Build Windows (No Autolink)"

### Using Terminal

VS Code's integrated terminal provides the best experience:

```bash
# Terminal 1: Metro bundler
npm start

# Terminal 2: Build and run
npm run windows-manual
```

### Debug Configuration

For debugging, set up your `launch.json` to use the pre-configured autolink files:

```json
{
    "name": "Debug Windows (No Autolink)",
    "type": "reactnative",
    "request": "launch",
    "platform": "windows",
    "enableDebug": true,
    "runArguments": [
        "--no-autolink",
        "--sln", "windows\\ReactNativeDeviceAiExample.sln",
        "--proj", "windows\\ReactNativeDeviceAiExample\\ReactNativeDeviceAiExample.vcxproj"
    ]
}
```

## 📁 VS Code Workspace Setup

Create a `.vscode/settings.json` for optimal development:

```json
{
    "files.exclude": {
        "**/node_modules": true,
        "**/windows/x64": true,
        "**/windows/**/x64": true,
        "**/.git": false
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/windows/x64": true
    },
    "typescript.preferences.includePackageJsonAutoImports": "on",
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
    },
    "files.associations": {
        "*.vcxproj": "xml",
        "*.props": "xml",
        "*.targets": "xml"
    }
}
```

## 🎯 Step-by-Step Workflow

### 1. Setup Phase
```bash
# Open VS Code in example directory
cd react-native-device-ai/example
code .

# Install dependencies
npm install

# Validate autolink configuration
npm run validate-autolink-fixes
```

### 2. Development Phase
```bash
# Start Metro in one terminal
npm start

# Build in another terminal (choose one):
npm run windows-manual          # Direct MSBuild
npm run windows                # With monitoring
npm run windows-force          # CLI with explicit paths
```

### 3. Debugging Phase
- Set breakpoints in your React Native code
- Use VS Code's React Native debugger
- Monitor build output in the integrated terminal

## ✅ Validation Commands

Before building, always validate your setup:

```bash
# Check autolink configuration
npm run validate-autolink-fixes

# Check Windows project structure  
npm run validate-windows

# Test MSBuild directly
npm run windows-msbuild
```

Successful validation should show:
```
📊 Autolink Configuration: 7/7 checks passed
📊 Comprehensive Build Validation: 20/20 checks passed
🎉 All checks passed! The Windows example build should compile successfully.
```

## 🚫 Why No Autolink?

The React Native CLI autolink has known issues on Windows:

1. **NoWindowsConfig Error**: CLI fails to detect Windows app projects
2. **Incorrect Path Resolution**: Autolink generates wrong project paths
3. **Missing Project References**: Generated files lack proper TurboModule registration

Our solution provides pre-configured autolink files that bypass these issues.

## 🔍 Troubleshooting

### Issue: "NoWindowsConfig" error
**Solution**: Use the manual build commands that don't rely on autolink detection:
```bash
npm run windows-manual
```

### Issue: Metro not connecting
**Solution**: Ensure Metro is running in a separate terminal:
```bash
npm start
```

### Issue: MSBuild errors
**Solution**: Validate your configuration first:
```bash
npm run validate-autolink-fixes
```

### Issue: VS Code can't find build tasks
**Solution**: Ensure `.vscode/tasks.json` exists in the example directory (not the root).

## 🎉 Success Indicators

When everything works correctly:

- ✅ VS Code builds the solution without autolink errors
- ✅ Metro bundler connects successfully
- ✅ App launches with React Native Device AI functionality
- ✅ Hot reload works for JavaScript changes
- ✅ Debug breakpoints work in both JS and C++ code

## 💡 Pro Tips

1. **Use Multiple Terminals**: One for Metro, one for builds
2. **Validate First**: Always run validation before building
3. **Watch Mode**: Use `npm run windows` for monitored builds
4. **Direct MSBuild**: Use `npm run windows-manual` for fastest builds
5. **Force CLI**: Use `npm run windows-force` when you need CLI features

## 🔗 Related Files

- `package.json` - Contains all build scripts
- `react-native.config.js` - Windows project configuration 
- `windows/ReactNativeDeviceAiExample.sln` - Solution file
- `validate-autolink-fixes.js` - Validation script
- `build-windows.md` - Detailed build documentation

This approach provides a reliable VS Code development experience without depending on React Native's problematic autolink detection.