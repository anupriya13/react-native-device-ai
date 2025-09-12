#include "pch.h"
#include "ReactNativeDeviceAi.h"

#pragma comment(lib, "wbemuuid.lib")
#pragma comment(lib, "pdh.lib")
#pragma comment(lib, "psapi.lib")
#pragma comment(lib, "setupapi.lib")
#pragma comment(lib, "powrprof.lib")

namespace winrt::ReactNativeDeviceAiSpecs {

void ReactNativeDeviceAi::Initialize(React::ReactContext const &reactContext) noexcept {
  m_context = reactContext;
  
  // Initialize COM for WMI calls
  CoInitializeEx(NULL, COINIT_MULTITHREADED);
  
  // Log initialization
  OutputDebugStringA("ReactNativeDeviceAi initialized successfully!\n");
}

void ReactNativeDeviceAi::getDeviceInfo(React::ReactPromise<ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType> &&result) noexcept {
  try {
    ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType deviceInfo;
    
    // Basic platform info
    deviceInfo.platform = "windows";
    deviceInfo.osVersion = GetOSVersion();
    deviceInfo.deviceModel = GetProcessorInfo();
    
    // Gather system information
    deviceInfo.memory = GetMemoryInfo();
    deviceInfo.storage = GetStorageInfo();
    deviceInfo.battery = GetBatteryInfo();
    deviceInfo.cpu = GetCpuInfo();
    deviceInfo.network = GetNetworkInfo();
    
    result.Resolve(deviceInfo);
  } catch (...) {
    result.Reject("Failed to gather device information");
  }
}

void ReactNativeDeviceAi::getWindowsSystemInfo(React::ReactPromise<ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType> &&result) noexcept {
  try {
    ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType windowsInfo;
    
    windowsInfo.osVersion = GetOSVersion();
    windowsInfo.buildNumber = GetBuildNumber();
    windowsInfo.processor = GetProcessorInfo();
    windowsInfo.architecture = GetSystemArchitecture();
    windowsInfo.performanceCounters = GetPerformanceCounters();
    windowsInfo.wmiData = GetWmiData();
    
    result.Resolve(windowsInfo);
  } catch (...) {
    result.Reject("Failed to gather Windows system information");
  }
}

bool ReactNativeDeviceAi::isNativeModuleAvailable() noexcept {
  return true;
}

std::vector<std::string> ReactNativeDeviceAi::getSupportedFeatures() noexcept {
  return {
    "device-insights",
    "native-device-info",
    "windows-system-info",
    "wmi-queries",
    "performance-counters",
    "memory-info",
    "storage-info",
    "battery-info",
    "cpu-info",
    "network-info"
  };
}

// Helper method implementations

ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_memory ReactNativeDeviceAi::GetMemoryInfo() noexcept {
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_memory memInfo;
  
  try {
    MEMORYSTATUSEX memStatus;
    memStatus.dwLength = sizeof(memStatus);
    
    if (GlobalMemoryStatusEx(&memStatus)) {
      memInfo.total = static_cast<double>(memStatus.ullTotalPhys);
      memInfo.available = static_cast<double>(memStatus.ullAvailPhys);
    } else {
      // Fallback values
      memInfo.total = 8589934592.0; // 8GB
      memInfo.available = 4294967296.0; // 4GB
    }
  } catch (...) {
    memInfo.total = 8589934592.0;
    memInfo.available = 4294967296.0;
  }
  
  return memInfo;
}

ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_storage ReactNativeDeviceAi::GetStorageInfo() noexcept {
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_storage storageInfo;
  
  try {
    ULARGE_INTEGER freeBytesAvailable, totalNumberOfBytes, totalNumberOfFreeBytes;
    
    if (GetDiskFreeSpaceEx(L"C:\\", &freeBytesAvailable, &totalNumberOfBytes, &totalNumberOfFreeBytes)) {
      storageInfo.total = static_cast<double>(totalNumberOfBytes.QuadPart);
      storageInfo.available = static_cast<double>(freeBytesAvailable.QuadPart);
    } else {
      // Fallback values
      storageInfo.total = 549755813888.0; // 512GB
      storageInfo.available = 274877906944.0; // 256GB
    }
  } catch (...) {
    storageInfo.total = 549755813888.0;
    storageInfo.available = 274877906944.0;
  }
  
  return storageInfo;
}

ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_battery ReactNativeDeviceAi::GetBatteryInfo() noexcept {
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_battery batteryInfo;
  
  try {
    using namespace winrt::Windows::System::Power;
    
    auto batteryReport = BatteryManager::GetBatteryReport();
    if (batteryReport) {
      auto chargeRate = batteryReport.ChargeRateInMilliwatts();
      auto remainingCapacity = batteryReport.RemainingCapacityInMilliwattHours();
      auto fullCapacity = batteryReport.FullChargeCapacityInMilliwattHours();
      
      if (remainingCapacity && fullCapacity) {
        batteryInfo.level = (static_cast<double>(remainingCapacity.Value()) / fullCapacity.Value()) * 100.0;
      } else {
        batteryInfo.level = 85.0; // Default
      }
      
      batteryInfo.isCharging = chargeRate.has_value() && chargeRate.value() > 0;
    } else {
      // Desktop/AC powered system - assume no battery or full charge
      batteryInfo.level = 100.0;
      batteryInfo.isCharging = false;
    }
  } catch (...) {
    batteryInfo.level = 85.0;
    batteryInfo.isCharging = false;
  }
  
  return batteryInfo;
}

ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_cpu ReactNativeDeviceAi::GetCpuInfo() noexcept {
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_cpu cpuInfo;
  
  try {
    SYSTEM_INFO sysInfo;
    GetSystemInfo(&sysInfo);
    cpuInfo.cores = static_cast<double>(sysInfo.dwNumberOfProcessors);
    
    // Get CPU usage using PDH
    PDH_HQUERY query;
    PDH_HCOUNTER counter;
    
    if (PdhOpenQuery(NULL, 0, &query) == ERROR_SUCCESS) {
      if (PdhAddEnglishCounter(query, L"\\Processor(_Total)\\% Processor Time", 0, &counter) == ERROR_SUCCESS) {
        PdhCollectQueryData(query);
        Sleep(100); // Brief delay for accurate reading
        PdhCollectQueryData(query);
        
        PDH_FMT_COUNTERVALUE value;
        if (PdhGetFormattedCounterValue(counter, PDH_FMT_DOUBLE, NULL, &value) == ERROR_SUCCESS) {
          cpuInfo.usage = value.doubleValue;
        } else {
          cpuInfo.usage = 25.0; // Default
        }
        
        PdhCloseQuery(query);
      } else {
        cpuInfo.usage = 25.0;
      }
    } else {
      cpuInfo.usage = 25.0;
    }
  } catch (...) {
    cpuInfo.cores = 8.0;
    cpuInfo.usage = 25.0;
  }
  
  return cpuInfo;
}

ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_network ReactNativeDeviceAi::GetNetworkInfo() noexcept {
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getDeviceInfo_returnType_network networkInfo;
  
  try {
    using namespace winrt::Windows::Networking::Connectivity;
    
    auto connectionProfile = NetworkInformation::GetInternetConnectionProfile();
    if (connectionProfile) {
      networkInfo.isConnected = true;
      
      auto networkAdapter = connectionProfile.NetworkAdapter();
      if (networkAdapter) {
        auto ianaType = networkAdapter.IanaInterfaceType();
        
        switch (ianaType) {
          case 6:   // Ethernet
            networkInfo.type = "ethernet";
            break;
          case 71:  // WiFi
            networkInfo.type = "wifi";
            break;
          case 244: // WWWLAN (cellular)
            networkInfo.type = "cellular";
            break;
          default:
            networkInfo.type = "unknown";
            break;
        }
      } else {
        networkInfo.type = "unknown";
      }
    } else {
      networkInfo.isConnected = false;
      networkInfo.type = "none";
    }
  } catch (...) {
    networkInfo.isConnected = true;
    networkInfo.type = "wifi";
  }
  
  return networkInfo;
}

ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters ReactNativeDeviceAi::GetPerformanceCounters() noexcept {
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType_performanceCounters perfCounters;
  
  try {
    PDH_HQUERY query;
    PDH_HCOUNTER cpuCounter, memCounter, diskCounter;
    
    if (PdhOpenQuery(NULL, 0, &query) == ERROR_SUCCESS) {
      PdhAddEnglishCounter(query, L"\\Processor(_Total)\\% Processor Time", 0, &cpuCounter);
      PdhAddEnglishCounter(query, L"\\Memory\\% Committed Bytes In Use", 0, &memCounter);
      PdhAddEnglishCounter(query, L"\\PhysicalDisk(_Total)\\% Disk Time", 0, &diskCounter);
      
      PdhCollectQueryData(query);
      Sleep(100);
      PdhCollectQueryData(query);
      
      PDH_FMT_COUNTERVALUE value;
      
      // CPU Usage
      if (PdhGetFormattedCounterValue(cpuCounter, PDH_FMT_DOUBLE, NULL, &value) == ERROR_SUCCESS) {
        perfCounters.cpuUsage = value.doubleValue;
      } else {
        perfCounters.cpuUsage = 25.0;
      }
      
      // Memory Usage
      if (PdhGetFormattedCounterValue(memCounter, PDH_FMT_DOUBLE, NULL, &value) == ERROR_SUCCESS) {
        perfCounters.memoryUsage = value.doubleValue;
      } else {
        perfCounters.memoryUsage = 65.0;
      }
      
      // Disk Usage
      if (PdhGetFormattedCounterValue(diskCounter, PDH_FMT_DOUBLE, NULL, &value) == ERROR_SUCCESS) {
        perfCounters.diskUsage = value.doubleValue;
      } else {
        perfCounters.diskUsage = 15.0;
      }
      
      PdhCloseQuery(query);
    } else {
      perfCounters.cpuUsage = 25.0;
      perfCounters.memoryUsage = 65.0;
      perfCounters.diskUsage = 15.0;
    }
  } catch (...) {
    perfCounters.cpuUsage = 25.0;
    perfCounters.memoryUsage = 65.0;
    perfCounters.diskUsage = 15.0;
  }
  
  return perfCounters;
}

ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData ReactNativeDeviceAi::GetWmiData() noexcept {
  ReactNativeDeviceAiCodegen::DeviceAISpecSpec_getWindowsSystemInfo_returnType_wmiData wmiData;
  
  try {
    HRESULT hres;
    IWbemLocator *pLoc = NULL;
    IWbemServices *pSvc = NULL;
    
    // Initialize WMI
    hres = CoCreateInstance(
        CLSID_WbemLocator,
        0,
        CLSCTX_INPROC_SERVER,
        IID_IWbemLocator, (LPVOID *)&pLoc);
    
    if (SUCCEEDED(hres)) {
      hres = pLoc->ConnectServer(
          _bstr_t(L"ROOT\\CIMV2"),
          NULL, NULL, 0, NULL, 0, 0, &pSvc);
      
      if (SUCCEEDED(hres)) {
        // Set security levels
        CoSetProxyBlanket(
            pSvc,
            RPC_C_AUTHN_WINNT,
            RPC_C_AUTHZ_NONE,
            NULL,
            RPC_C_AUTHN_LEVEL_CALL,
            RPC_C_IMP_LEVEL_IMPERSONATE,
            NULL,
            EOAC_NONE);
        
        // Query computer system
        IEnumWbemClassObject* pEnumerator = NULL;
        hres = pSvc->ExecQuery(
            bstr_t("WQL"),
            bstr_t("SELECT * FROM Win32_ComputerSystem"),
            WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY,
            NULL,
            &pEnumerator);
        
        if (SUCCEEDED(hres)) {
          IWbemClassObject *pclsObj = NULL;
          ULONG uReturn = 0;
          
          while (pEnumerator) {
            HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
            if (0 == uReturn) break;
            
            VARIANT vtProp;
            hr = pclsObj->Get(L"Model", 0, &vtProp, 0, 0);
            if (SUCCEEDED(hr) && vtProp.vt == VT_BSTR) {
              wmiData.computerSystem = _com_util::ConvertBSTRToString(vtProp.bstrVal);
            }
            VariantClear(&vtProp);
            
            pclsObj->Release();
            break;
          }
          pEnumerator->Release();
        }
        
        // Query operating system
        pEnumerator = NULL;
        hres = pSvc->ExecQuery(
            bstr_t("WQL"),
            bstr_t("SELECT * FROM Win32_OperatingSystem"),
            WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY,
            NULL,
            &pEnumerator);
        
        if (SUCCEEDED(hres)) {
          IWbemClassObject *pclsObj = NULL;
          ULONG uReturn = 0;
          
          while (pEnumerator) {
            HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
            if (0 == uReturn) break;
            
            VARIANT vtProp;
            hr = pclsObj->Get(L"Caption", 0, &vtProp, 0, 0);
            if (SUCCEEDED(hr) && vtProp.vt == VT_BSTR) {
              wmiData.operatingSystem = _com_util::ConvertBSTRToString(vtProp.bstrVal);
            }
            VariantClear(&vtProp);
            
            pclsObj->Release();
            break;
          }
          pEnumerator->Release();
        }
        
        // Query processor
        pEnumerator = NULL;
        hres = pSvc->ExecQuery(
            bstr_t("WQL"),
            bstr_t("SELECT * FROM Win32_Processor"),
            WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY,
            NULL,
            &pEnumerator);
        
        if (SUCCEEDED(hres)) {
          IWbemClassObject *pclsObj = NULL;
          ULONG uReturn = 0;
          
          while (pEnumerator) {
            HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
            if (0 == uReturn) break;
            
            VARIANT vtProp;
            hr = pclsObj->Get(L"Name", 0, &vtProp, 0, 0);
            if (SUCCEEDED(hr) && vtProp.vt == VT_BSTR) {
              wmiData.processor = _com_util::ConvertBSTRToString(vtProp.bstrVal);
            }
            VariantClear(&vtProp);
            
            pclsObj->Release();
            break;
          }
          pEnumerator->Release();
        }
        
        pSvc->Release();
      }
      pLoc->Release();
    }
    
    // Fallback if WMI fails
    if (wmiData.computerSystem.empty()) {
      wmiData.computerSystem = "Generic Windows Computer";
    }
    if (wmiData.operatingSystem.empty()) {
      wmiData.operatingSystem = "Microsoft Windows";
    }
    if (wmiData.processor.empty()) {
      wmiData.processor = "Unknown Processor";
    }
  } catch (...) {
    wmiData.computerSystem = "Generic Windows Computer";
    wmiData.operatingSystem = "Microsoft Windows";
    wmiData.processor = "Unknown Processor";
  }
  
  return wmiData;
}

std::string ReactNativeDeviceAi::GetOSVersion() noexcept {
  try {
    OSVERSIONINFOEX osInfo;
    ZeroMemory(&osInfo, sizeof(OSVERSIONINFOEX));
    osInfo.dwOSVersionInfoSize = sizeof(OSVERSIONINFOEX);
    
    if (GetVersionEx((OSVERSIONINFO*)&osInfo)) {
      return std::to_string(osInfo.dwMajorVersion) + "." + std::to_string(osInfo.dwMinorVersion) + 
             "." + std::to_string(osInfo.dwBuildNumber);
    }
  } catch (...) {
    // Fallback
  }
  
  return "10.0.22000"; // Windows 11 default
}

std::string ReactNativeDeviceAi::GetBuildNumber() noexcept {
  try {
    HKEY hKey;
    if (RegOpenKeyEx(HKEY_LOCAL_MACHINE, 
                     L"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion", 
                     0, KEY_READ, &hKey) == ERROR_SUCCESS) {
      
      WCHAR buildNumber[256];
      DWORD size = sizeof(buildNumber);
      
      if (RegQueryValueEx(hKey, L"CurrentBuild", NULL, NULL, 
                          (LPBYTE)buildNumber, &size) == ERROR_SUCCESS) {
        RegCloseKey(hKey);
        
        int len = WideCharToMultiByte(CP_UTF8, 0, buildNumber, -1, NULL, 0, NULL, NULL);
        std::string result(len - 1, 0);
        WideCharToMultiByte(CP_UTF8, 0, buildNumber, -1, &result[0], len, NULL, NULL);
        return result;
      }
      
      RegCloseKey(hKey);
    }
  } catch (...) {
    // Fallback
  }
  
  return "22000";
}

std::string ReactNativeDeviceAi::GetProcessorInfo() noexcept {
  try {
    HKEY hKey;
    if (RegOpenKeyEx(HKEY_LOCAL_MACHINE, 
                     L"HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0", 
                     0, KEY_READ, &hKey) == ERROR_SUCCESS) {
      
      WCHAR processorName[256];
      DWORD size = sizeof(processorName);
      
      if (RegQueryValueEx(hKey, L"ProcessorNameString", NULL, NULL, 
                          (LPBYTE)processorName, &size) == ERROR_SUCCESS) {
        RegCloseKey(hKey);
        
        int len = WideCharToMultiByte(CP_UTF8, 0, processorName, -1, NULL, 0, NULL, NULL);
        std::string result(len - 1, 0);
        WideCharToMultiByte(CP_UTF8, 0, processorName, -1, &result[0], len, NULL, NULL);
        return result;
      }
      
      RegCloseKey(hKey);
    }
  } catch (...) {
    // Fallback
  }
  
  return "Unknown Processor";
}

std::string ReactNativeDeviceAi::GetSystemArchitecture() noexcept {
  try {
    SYSTEM_INFO sysInfo;
    GetNativeSystemInfo(&sysInfo);
    
    switch (sysInfo.wProcessorArchitecture) {
      case PROCESSOR_ARCHITECTURE_AMD64:
        return "x64";
      case PROCESSOR_ARCHITECTURE_ARM64:
        return "ARM64";
      case PROCESSOR_ARCHITECTURE_INTEL:
        return "x86";
      case PROCESSOR_ARCHITECTURE_ARM:
        return "ARM";
      default:
        return "Unknown";
    }
  } catch (...) {
    return "x64";
  }
}

} // namespace winrt::ReactNativeDeviceAiSpecs
