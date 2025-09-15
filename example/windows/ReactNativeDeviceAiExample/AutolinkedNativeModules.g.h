// Ultimate AutolinkedNativeModules.g.h - ReactNativeDeviceAi declarations
#pragma once

#include <winrt/Microsoft.ReactNative.h>

namespace winrt::Microsoft::ReactNative
{
    void RegisterAutolinkedNativeModulePackages(winrt::Windows::Foundation::Collections::IVector<winrt::Microsoft::ReactNative::IReactPackageProvider> const& packageProviders);
}
