#pragma once

#include <NativeModules.h>
#include <ReactCommon/TurboModule.h>
#include <ReactCommon/TurboModuleUtils.h>
#include <jsi/jsi.h>
#include "WindowsDeviceAIFabric.h"

namespace Microsoft::ReactNative {

REACT_MODULE(DeviceAI)
struct DeviceAI : TurboModule {
public:
    using ModuleSpec = DeviceAISpec;

    DeviceAI(const std::shared_ptr<facebook::react::CallInvoker> &jsInvoker);

    // TurboModule methods implementation
    facebook::jsi::Object getDeviceInfo(facebook::jsi::Runtime &rt);
    
    facebook::jsi::Object generateDeviceInsights(
        facebook::jsi::Runtime &rt, 
        facebook::jsi::Object deviceData
    );
    
    facebook::jsi::Object getBatteryOptimizations(facebook::jsi::Runtime &rt);
    
    facebook::jsi::Object getPerformanceAnalysis(facebook::jsi::Runtime &rt);
    
    facebook::jsi::Object getWindowsSystemInfo(facebook::jsi::Runtime &rt);
    
    void configure(
        facebook::jsi::Runtime &rt,
        facebook::jsi::Object config
    );

    // Promise-based async methods
    void getDeviceInfoAsync(
        facebook::jsi::Runtime &rt,
        facebook::jsi::Function resolve,
        facebook::jsi::Function reject
    );

    void generateDeviceInsightsAsync(
        facebook::jsi::Runtime &rt,
        facebook::jsi::Object deviceData,
        facebook::jsi::Function resolve,
        facebook::jsi::Function reject
    );

    void getBatteryOptimizationsAsync(
        facebook::jsi::Runtime &rt,
        facebook::jsi::Function resolve,
        facebook::jsi::Function reject
    );

    void getPerformanceAnalysisAsync(
        facebook::jsi::Runtime &rt,
        facebook::jsi::Function resolve,
        facebook::jsi::Function reject
    );

    void getWindowsSystemInfoAsync(
        facebook::jsi::Runtime &rt,
        facebook::jsi::Function resolve,
        facebook::jsi::Function reject
    );

private:
    std::unique_ptr<DeviceAIFabric::WindowsDeviceAIFabric> m_fabric;
    
    // Configuration
    std::string m_apiKey;
    std::string m_endpoint;
    bool m_enableWindowsNative;

    // Helper methods
    facebook::jsi::Object deviceInfoToJSI(
        facebook::jsi::Runtime &rt,
        const DeviceAIFabric::WindowsDeviceInfo &info
    );
    
    facebook::jsi::Object mapToJSI(
        facebook::jsi::Runtime &rt,
        const std::map<std::string, std::string> &map
    );
    
    facebook::jsi::Object mapToJSI(
        facebook::jsi::Runtime &rt,
        const std::map<std::string, double> &map
    );
    
    facebook::jsi::Array vectorToJSI(
        facebook::jsi::Runtime &rt,
        const std::vector<std::map<std::string, std::string>> &vec
    );
};

// TurboModule specification
class JSI_EXPORT DeviceAISpecJSI : public TurboModule {
public:
    DeviceAISpecJSI(const std::shared_ptr<facebook::react::CallInvoker> &jsInvoker);

    facebook::jsi::Value get(facebook::jsi::Runtime &rt, const facebook::jsi::PropNameID &name) override;
};

} // namespace Microsoft::ReactNative