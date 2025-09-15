
/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once
// clang-format off

#include <string>
#include <optional>
#include <functional>
#include <vector>

namespace ReactNativeDeviceAiCodegen {

struct DeviceAISpecSpec_getDeviceInfo_returnType_memory {
    double total;
    double available;
};

struct DeviceAISpecSpec_getDeviceInfo_returnType_storage {
    double total;
    double available;
};

struct DeviceAISpecSpec_getDeviceInfo_returnType_battery {
    double level;
    bool isCharging;
};

struct DeviceAISpecSpec_getDeviceInfo_returnType_cpu {
    double usage;
    double cores;
};

struct DeviceAISpecSpec_getDeviceInfo_returnType_network {
    std::string type;
    bool isConnected;
};

struct DeviceAISpecSpec_getDeviceInfo_returnType {
    std::string platform;
    std::string osVersion;
    std::string deviceModel;
    DeviceAISpecSpec_getDeviceInfo_returnType_memory memory;
    DeviceAISpecSpec_getDeviceInfo_returnType_storage storage;
    DeviceAISpecSpec_getDeviceInfo_returnType_battery battery;
    DeviceAISpecSpec_getDeviceInfo_returnType_cpu cpu;
    DeviceAISpecSpec_getDeviceInfo_returnType_network network;
};

struct DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters {
    double cpuUsage;
    double memoryUsage;
    double diskUsage;
};

struct DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData {
    std::string computerSystem;
    std::string operatingSystem;
    std::string processor;
};

struct DeviceAISpecSpec_getWindowsSystemInfo_returnType {
    std::string osVersion;
    std::string buildNumber;
    std::string processor;
    std::string architecture;
    DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters performanceCounters;
    DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData wmiData;
};

} // namespace ReactNativeDeviceAiCodegen
