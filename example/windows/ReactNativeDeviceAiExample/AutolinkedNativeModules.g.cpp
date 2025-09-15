// Optimized AutolinkedNativeModules.g.cpp - ReactNativeDeviceAi registration
// clang-format off
#include "pch.h"
#include "AutolinkedNativeModules.g.h"

// ReactNativeDeviceAi Headers
#ifdef _M_X64
// Include headers for ReactNativeDeviceAi TurboModule
#if __has_include("winrt/ReactNativeDeviceAi.h")
#include "winrt/ReactNativeDeviceAi.h"
#endif
#endif

namespace winrt::Microsoft::ReactNative
{

void RegisterAutolinkedNativeModulePackages(winrt::Windows::Foundation::Collections::IVector<winrt::Microsoft::ReactNative::IReactPackageProvider> const& packageProviders)
{ 
#ifdef _M_X64
    // ReactNativeDeviceAi TurboModule registration
    #if __has_include("winrt/ReactNativeDeviceAi.h")
    try {
        packageProviders.Append(winrt::ReactNativeDeviceAi::ReactPackageProvider());
    } catch (...) {
        // Silently handle registration issues during development
    }
    #endif
#endif
}

}
