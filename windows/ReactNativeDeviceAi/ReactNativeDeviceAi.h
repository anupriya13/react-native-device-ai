#pragma once

#include "pch.h"
#include "resource.h"

#if __has_include("codegen/NativeDeviceAISpecDataTypes.g.h")
  #include "codegen/NativeDeviceAISpecDataTypes.g.h"
#endif
#include "codegen/NativeDeviceAISpecSpec.g.h"

#include "NativeModules.h"

namespace winrt::ReactNativeDeviceAiSpecs
{

// See https://microsoft.github.io/react-native-windows/docs/native-platform for help writing native modules

REACT_MODULE(ReactNativeDeviceAi)
struct ReactNativeDeviceAi
{
  using ModuleSpec = ReactNativeDeviceAiCodegen::DeviceAISpecSpec;

  REACT_INIT(Initialize)
  void Initialize(React::ReactContext const &reactContext) noexcept;

  REACT_METHOD(getDeviceInfo)
  void getDeviceInfo(React::ReactPromise<ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType> &&result) noexcept;

  REACT_METHOD(getWindowsSystemInfo)
  void getWindowsSystemInfo(React::ReactPromise<ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType> &&result) noexcept;

  REACT_SYNC_METHOD(isNativeModuleAvailable)
  bool isNativeModuleAvailable() noexcept;

  REACT_SYNC_METHOD(getSupportedFeatures)
  std::vector<std::string> getSupportedFeatures() noexcept;

private:
  React::ReactContext m_context;
  
  // Helper methods for system information gathering
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_memory GetMemoryInfo() noexcept;
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_storage GetStorageInfo() noexcept;
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_battery GetBatteryInfo() noexcept;
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_cpu GetCpuInfo() noexcept;
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_network GetNetworkInfo() noexcept;
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters GetPerformanceCounters() noexcept;
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData GetWmiData() noexcept;
  std::string GetOSVersion() noexcept;
  std::string GetBuildNumber() noexcept;
  std::string GetProcessorInfo() noexcept;
  std::string GetSystemArchitecture() noexcept;
};

} // namespace winrt::ReactNativeDeviceAiSpecs