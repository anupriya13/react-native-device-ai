#include "../include/WindowsDeviceAIFabric.h"
#include <windows.h>
#include <pdh.h>
#include <pdhmsg.h>
#include <psapi.h>
#include <powrprof.h>
#include <batclass.h>
#include <devguid.h>
#include <setupapi.h>
#include <wbemidl.h>
#include <comdef.h>
#include <iostream>
#include <sstream>

#pragma comment(lib, "pdh.lib")
#pragma comment(lib, "psapi.lib")
#pragma comment(lib, "powrprof.lib")
#pragma comment(lib, "setupapi.lib")
#pragma comment(lib, "wbemuuid.lib")

namespace DeviceAIFabric {

WindowsDeviceAIFabric::WindowsDeviceAIFabric() : m_initialized(false) {
}

WindowsDeviceAIFabric::~WindowsDeviceAIFabric() {
}

bool WindowsDeviceAIFabric::Initialize() {
    // Initialize COM for WMI access
    HRESULT hr = CoInitializeEx(0, COINIT_MULTITHREADED);
    if (FAILED(hr)) {
        return false;
    }

    // Initialize security for WMI
    hr = CoInitializeSecurity(
        NULL,
        -1,
        NULL,
        NULL,
        RPC_C_AUTHN_LEVEL_NONE,
        RPC_C_IMP_LEVEL_IMPERSONATE,
        NULL,
        EOAC_NONE,
        NULL
    );

    if (FAILED(hr) && hr != RPC_E_TOO_LATE) {
        CoUninitialize();
        return false;
    }

    m_initialized = true;
    return true;
}

WindowsDeviceInfo WindowsDeviceAIFabric::CollectDeviceInfo() {
    WindowsDeviceInfo info = {};
    
    if (!m_initialized) {
        return info;
    }

    try {
        info.osVersion = GetOSVersion();
        info.buildNumber = QueryWMI("SELECT BuildNumber FROM Win32_OperatingSystem", "BuildNumber");
        info.architecture = QueryWMI("SELECT OSArchitecture FROM Win32_OperatingSystem", "OSArchitecture");
        info.processorName = GetProcessorInfo();
        info.totalMemory = GetTotalPhysicalMemory();
        info.availableMemory = GetAvailablePhysicalMemory();
        
        // Get disk space for C: drive
        ULARGE_INTEGER freeBytesAvailable, totalNumberOfBytes, totalNumberOfFreeBytes;
        if (GetDiskFreeSpaceEx(L"C:\\", &freeBytesAvailable, &totalNumberOfBytes, &totalNumberOfFreeBytes)) {
            info.totalDiskSpace = totalNumberOfBytes.QuadPart;
            info.availableDiskSpace = freeBytesAvailable.QuadPart;
        }

        info.batteryLevel = GetBatteryLevel();
        info.batteryStatus = GetBatteryStatus();
        info.systemUptime = GetSystemUptime();
        info.cpuUsage = GetCPUUsage();
        
        // Count running processes
        DWORD processIds[1024];
        DWORD bytesReturned;
        if (EnumProcesses(processIds, sizeof(processIds), &bytesReturned)) {
            info.runningProcessCount = bytesReturned / sizeof(DWORD);
        }

        info.networkStatus = "Connected"; // Simplified for demo
    }
    catch (...) {
        // Handle exceptions gracefully
    }

    return info;
}

std::map<std::string, double> WindowsDeviceAIFabric::GetPerformanceMetrics() {
    std::map<std::string, double> metrics;
    
    metrics["cpu_usage"] = GetCPUUsage();
    metrics["memory_usage"] = static_cast<double>(GetTotalPhysicalMemory() - GetAvailablePhysicalMemory()) / GetTotalPhysicalMemory() * 100.0;
    
    return metrics;
}

std::map<std::string, std::string> WindowsDeviceAIFabric::GetBatteryInfo() {
    std::map<std::string, std::string> batteryInfo;
    
    batteryInfo["level"] = std::to_string(GetBatteryLevel());
    batteryInfo["status"] = GetBatteryStatus();
    
    return batteryInfo;
}

std::map<std::string, uint64_t> WindowsDeviceAIFabric::GetMemoryInfo() {
    std::map<std::string, uint64_t> memoryInfo;
    
    memoryInfo["total"] = GetTotalPhysicalMemory();
    memoryInfo["available"] = GetAvailablePhysicalMemory();
    memoryInfo["used"] = GetTotalPhysicalMemory() - GetAvailablePhysicalMemory();
    
    return memoryInfo;
}

std::map<std::string, std::map<std::string, uint64_t>> WindowsDeviceAIFabric::GetStorageInfo() {
    std::map<std::string, std::map<std::string, uint64_t>> storageInfo;
    
    // Get information for C: drive (can be extended for all drives)
    ULARGE_INTEGER freeBytesAvailable, totalNumberOfBytes, totalNumberOfFreeBytes;
    if (GetDiskFreeSpaceEx(L"C:\\", &freeBytesAvailable, &totalNumberOfBytes, &totalNumberOfFreeBytes)) {
        std::map<std::string, uint64_t> driveInfo;
        driveInfo["total"] = totalNumberOfBytes.QuadPart;
        driveInfo["available"] = freeBytesAvailable.QuadPart;
        driveInfo["used"] = totalNumberOfBytes.QuadPart - freeBytesAvailable.QuadPart;
        storageInfo["C:"] = driveInfo;
    }
    
    return storageInfo;
}

std::vector<std::map<std::string, std::string>> WindowsDeviceAIFabric::GetProcessInfo() {
    std::vector<std::map<std::string, std::string>> processes;
    
    // This would enumerate running processes using WMI or EnumProcesses
    // Simplified implementation for demo
    std::map<std::string, std::string> processInfo;
    processInfo["name"] = "System Idle Process";
    processInfo["cpu_usage"] = "0.0";
    processInfo["memory_usage"] = "0";
    processes.push_back(processInfo);
    
    return processes;
}

std::map<std::string, std::string> WindowsDeviceAIFabric::GetNetworkInfo() {
    std::map<std::string, std::string> networkInfo;
    
    networkInfo["status"] = "Connected";
    networkInfo["type"] = "Ethernet";
    
    return networkInfo;
}

uint64_t WindowsDeviceAIFabric::GetSystemUptime() {
    return GetTickCount64() / 1000; // Return uptime in seconds
}

bool WindowsDeviceAIFabric::SupportsFeature(const std::string& feature) {
    // Check for specific Windows features
    if (feature == "battery") {
        return GetBatteryLevel() >= 0;
    }
    if (feature == "wmi") {
        return m_initialized;
    }
    return false;
}

// Private helper methods

std::string WindowsDeviceAIFabric::QueryWMI(const std::string& query, const std::string& property) {
    // Simplified WMI query implementation
    // In production, this would use IWbemServices to execute WQL queries
    return "Unknown";
}

std::vector<std::map<std::string, std::string>> WindowsDeviceAIFabric::QueryWMIMultiple(const std::string& query) {
    std::vector<std::map<std::string, std::string>> results;
    // Implementation would use WMI to execute queries and return multiple results
    return results;
}

std::string WindowsDeviceAIFabric::GetOSVersion() {
    OSVERSIONINFOEX osvi;
    ZeroMemory(&osvi, sizeof(OSVERSIONINFOEX));
    osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFOEX);
    
    if (GetVersionEx((OSVERSIONINFO*)&osvi)) {
        std::stringstream ss;
        ss << osvi.dwMajorVersion << "." << osvi.dwMinorVersion;
        return ss.str();
    }
    
    return "Unknown";
}

std::string WindowsDeviceAIFabric::GetProcessorInfo() {
    // Would query processor information via registry or WMI
    return "Intel64 Family Processor";
}

uint64_t WindowsDeviceAIFabric::GetTotalPhysicalMemory() {
    MEMORYSTATUSEX memInfo;
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);
    GlobalMemoryStatusEx(&memInfo);
    return memInfo.ullTotalPhys;
}

uint64_t WindowsDeviceAIFabric::GetAvailablePhysicalMemory() {
    MEMORYSTATUSEX memInfo;
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);
    GlobalMemoryStatusEx(&memInfo);
    return memInfo.ullAvailPhys;
}

double WindowsDeviceAIFabric::GetCPUUsage() {
    // Simplified CPU usage calculation
    // Production implementation would use PDH (Performance Data Helper) counters
    static uint64_t lastIdleTime = 0;
    static uint64_t lastKernelTime = 0;
    static uint64_t lastUserTime = 0;
    
    FILETIME idleTime, kernelTime, userTime;
    if (GetSystemTimes(&idleTime, &kernelTime, &userTime)) {
        uint64_t idle = ((uint64_t)idleTime.dwHighDateTime << 32) | idleTime.dwLowDateTime;
        uint64_t kernel = ((uint64_t)kernelTime.dwHighDateTime << 32) | kernelTime.dwLowDateTime;
        uint64_t user = ((uint64_t)userTime.dwHighDateTime << 32) | userTime.dwLowDateTime;
        
        if (lastIdleTime != 0) {
            uint64_t idleDiff = idle - lastIdleTime;
            uint64_t kernelDiff = kernel - lastKernelTime;
            uint64_t userDiff = user - lastUserTime;
            uint64_t totalDiff = kernelDiff + userDiff;
            
            if (totalDiff > 0) {
                double usage = (double)(totalDiff - idleDiff) / totalDiff * 100.0;
                lastIdleTime = idle;
                lastKernelTime = kernel;
                lastUserTime = user;
                return usage;
            }
        }
        
        lastIdleTime = idle;
        lastKernelTime = kernel;
        lastUserTime = user;
    }
    
    return 0.0;
}

int WindowsDeviceAIFabric::GetBatteryLevel() {
    SYSTEM_POWER_STATUS powerStatus;
    if (GetSystemPowerStatus(&powerStatus)) {
        if (powerStatus.BatteryLifePercent != 255) {
            return powerStatus.BatteryLifePercent;
        }
    }
    return -1; // No battery or unknown
}

std::string WindowsDeviceAIFabric::GetBatteryStatus() {
    SYSTEM_POWER_STATUS powerStatus;
    if (GetSystemPowerStatus(&powerStatus)) {
        if (powerStatus.ACLineStatus == 1) {
            return "Charging";
        } else if (powerStatus.ACLineStatus == 0) {
            return "On Battery";
        }
    }
    return "Unknown";
}

} // namespace DeviceAIFabric