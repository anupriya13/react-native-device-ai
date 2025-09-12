#pragma once

#include <string>
#include <map>
#include <memory>
#include <winrt/base.h>

namespace DeviceAIFabric {

/**
 * Device Information Structure for Windows Platform
 */
struct WindowsDeviceInfo {
    std::string osVersion;
    std::string buildNumber;
    std::string architecture;
    std::string processorName;
    uint64_t totalMemory;
    uint64_t availableMemory;
    uint64_t totalDiskSpace;
    uint64_t availableDiskSpace;
    int batteryLevel;
    std::string batteryStatus;
    int runningProcessCount;
    uint64_t systemUptime;
    double cpuUsage;
    std::string networkStatus;
};

/**
 * Windows Device AI Fabric
 * Native Windows implementation for collecting device diagnostics and system information
 */
class WindowsDeviceAIFabric {
public:
    WindowsDeviceAIFabric();
    ~WindowsDeviceAIFabric();

    /**
     * Initialize the fabric with system access
     */
    bool Initialize();

    /**
     * Collect comprehensive device information
     */
    WindowsDeviceInfo CollectDeviceInfo();

    /**
     * Get real-time system performance metrics
     */
    std::map<std::string, double> GetPerformanceMetrics();

    /**
     * Get battery information (for devices with battery)
     */
    std::map<std::string, std::string> GetBatteryInfo();

    /**
     * Get memory utilization details
     */
    std::map<std::string, uint64_t> GetMemoryInfo();

    /**
     * Get storage information for all drives
     */
    std::map<std::string, std::map<std::string, uint64_t>> GetStorageInfo();

    /**
     * Get running processes information
     */
    std::vector<std::map<std::string, std::string>> GetProcessInfo();

    /**
     * Get network adapter information
     */
    std::map<std::string, std::string> GetNetworkInfo();

    /**
     * Get system uptime
     */
    uint64_t GetSystemUptime();

    /**
     * Check if the device supports specific features
     */
    bool SupportsFeature(const std::string& feature);

private:
    bool m_initialized;
    
    // Helper methods for WMI queries
    std::string QueryWMI(const std::string& query, const std::string& property);
    std::vector<std::map<std::string, std::string>> QueryWMIMultiple(const std::string& query);
    
    // System information helpers
    std::string GetOSVersion();
    std::string GetProcessorInfo();
    uint64_t GetTotalPhysicalMemory();
    uint64_t GetAvailablePhysicalMemory();
    double GetCPUUsage();
    int GetBatteryLevel();
    std::string GetBatteryStatus();
};

} // namespace DeviceAIFabric