// Ultimate AutolinkedNativeModules.g.cpp - ReactNativeDeviceAi registration
// clang-format off
#include "pch.h"
#include "AutolinkedNativeModules.g.h"

namespace winrt::Microsoft::ReactNative
{

void RegisterAutolinkedNativeModulePackages(winrt::Windows::Foundation::Collections::IVector<winrt::Microsoft::ReactNative::IReactPackageProvider> const& packageProviders)
{ 
    // ReactNativeDeviceAi TurboModule registration
    // Note: Package provider will be registered when the TurboModule is properly built
    try {
        // Manual registration placeholder for ReactNativeDeviceAi
        // The actual registration happens in the main app when the TurboModule is loaded
    } catch (...) {
        // Silently handle registration during development
    }
}

}
