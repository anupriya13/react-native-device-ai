#pragma once

#include "winrt/Microsoft.ReactNative.h"

namespace winrt::DeviceAI::implementation {

struct ReactPackageProvider : winrt::implements<ReactPackageProvider, winrt::Microsoft::ReactNative::IReactPackageProvider> {
public:
    void CreatePackage(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) noexcept;
};

} // namespace winrt::DeviceAI::implementation

namespace winrt::DeviceAI::factory_implementation {

struct ReactPackageProvider : ReactPackageProviderT<ReactPackageProvider, implementation::ReactPackageProvider> {};

} // namespace winrt::DeviceAI::factory_implementation