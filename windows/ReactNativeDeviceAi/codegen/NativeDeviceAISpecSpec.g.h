
/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once
// clang-format off

// #include "NativeDeviceAISpecDataTypes.g.h" before this file to use the generated type definition
#include <NativeModules.h>
#include <tuple>

namespace ReactNativeDeviceAiCodegen {

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getDeviceInfo_returnType_memory*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"total", &DeviceAISpecSpec_getDeviceInfo_returnType_memory::total},
        {L"available", &DeviceAISpecSpec_getDeviceInfo_returnType_memory::available},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getDeviceInfo_returnType_storage*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"total", &DeviceAISpecSpec_getDeviceInfo_returnType_storage::total},
        {L"available", &DeviceAISpecSpec_getDeviceInfo_returnType_storage::available},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getDeviceInfo_returnType_battery*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"level", &DeviceAISpecSpec_getDeviceInfo_returnType_battery::level},
        {L"isCharging", &DeviceAISpecSpec_getDeviceInfo_returnType_battery::isCharging},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getDeviceInfo_returnType_cpu*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"usage", &DeviceAISpecSpec_getDeviceInfo_returnType_cpu::usage},
        {L"cores", &DeviceAISpecSpec_getDeviceInfo_returnType_cpu::cores},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getDeviceInfo_returnType_network*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"type", &DeviceAISpecSpec_getDeviceInfo_returnType_network::type},
        {L"isConnected", &DeviceAISpecSpec_getDeviceInfo_returnType_network::isConnected},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getDeviceInfo_returnType*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"platform", &DeviceAISpecSpec_getDeviceInfo_returnType::platform},
        {L"osVersion", &DeviceAISpecSpec_getDeviceInfo_returnType::osVersion},
        {L"deviceModel", &DeviceAISpecSpec_getDeviceInfo_returnType::deviceModel},
        {L"memory", &DeviceAISpecSpec_getDeviceInfo_returnType::memory},
        {L"storage", &DeviceAISpecSpec_getDeviceInfo_returnType::storage},
        {L"battery", &DeviceAISpecSpec_getDeviceInfo_returnType::battery},
        {L"cpu", &DeviceAISpecSpec_getDeviceInfo_returnType::cpu},
        {L"network", &DeviceAISpecSpec_getDeviceInfo_returnType::network},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"cpuUsage", &DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters::cpuUsage},
        {L"memoryUsage", &DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters::memoryUsage},
        {L"diskUsage", &DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters::diskUsage},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"computerSystem", &DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData::computerSystem},
        {L"operatingSystem", &DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData::operatingSystem},
        {L"processor", &DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData::processor},
    };
    return fieldMap;
}

inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(DeviceAISpecSpec_getWindowsSystemInfo_returnType*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"osVersion", &DeviceAISpecSpec_getWindowsSystemInfo_returnType::osVersion},
        {L"buildNumber", &DeviceAISpecSpec_getWindowsSystemInfo_returnType::buildNumber},
        {L"processor", &DeviceAISpecSpec_getWindowsSystemInfo_returnType::processor},
        {L"architecture", &DeviceAISpecSpec_getWindowsSystemInfo_returnType::architecture},
        {L"performanceCounters", &DeviceAISpecSpec_getWindowsSystemInfo_returnType::performanceCounters},
        {L"wmiData", &DeviceAISpecSpec_getWindowsSystemInfo_returnType::wmiData},
    };
    return fieldMap;
}

struct DeviceAISpecSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<void(Promise<DeviceAISpecSpec_getDeviceInfo_returnType>) noexcept>{0, L"getDeviceInfo"},
      Method<void(Promise<DeviceAISpecSpec_getWindowsSystemInfo_returnType>) noexcept>{1, L"getWindowsSystemInfo"},
      SyncMethod<bool() noexcept>{2, L"isNativeModuleAvailable"},
      SyncMethod<std::vector<std::string>() noexcept>{3, L"getSupportedFeatures"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, DeviceAISpecSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "getDeviceInfo",
          "    REACT_METHOD(getDeviceInfo) void getDeviceInfo(::React::ReactPromise<DeviceAISpecSpec_getDeviceInfo_returnType> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(getDeviceInfo) static void getDeviceInfo(::React::ReactPromise<DeviceAISpecSpec_getDeviceInfo_returnType> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          1,
          "getWindowsSystemInfo",
          "    REACT_METHOD(getWindowsSystemInfo) void getWindowsSystemInfo(::React::ReactPromise<DeviceAISpecSpec_getWindowsSystemInfo_returnType> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(getWindowsSystemInfo) static void getWindowsSystemInfo(::React::ReactPromise<DeviceAISpecSpec_getWindowsSystemInfo_returnType> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          2,
          "isNativeModuleAvailable",
          "    REACT_SYNC_METHOD(isNativeModuleAvailable) bool isNativeModuleAvailable() noexcept { /* implementation */ }\n"
          "    REACT_SYNC_METHOD(isNativeModuleAvailable) static bool isNativeModuleAvailable() noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          3,
          "getSupportedFeatures",
          "    REACT_SYNC_METHOD(getSupportedFeatures) std::vector<std::string> getSupportedFeatures() noexcept { /* implementation */ }\n"
          "    REACT_SYNC_METHOD(getSupportedFeatures) static std::vector<std::string> getSupportedFeatures() noexcept { /* implementation */ }\n");
  }
};

} // namespace ReactNativeDeviceAiCodegen
