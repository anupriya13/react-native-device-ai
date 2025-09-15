@echo off
echo Visual Studio Build Helper - React Native Device AI Example
echo =========================================================

echo Checking for missing template files...
if not exist "node_modules\react-native-windows\templates\cpp-lib\windows\MyApp\AutolinkedNativeModules.g.cpp" (
    echo Creating missing template file...
    node fix-visual-studio-build.js
)

echo.
echo Template files are ready. You can now build from Visual Studio:
echo 1. Open windows\ReactNativeDeviceAiExample.sln in Visual Studio
echo 2. Select Debug x64 configuration
echo 3. Build Solution (Ctrl+Shift+B)
echo.
echo The example app should build successfully without ENOENT errors.
pause
