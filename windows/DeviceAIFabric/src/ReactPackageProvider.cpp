#include "pch.h"
#include "ReactPackageProvider.h"
#include "DeviceAITurboModule.h"

using namespace winrt;
using namespace Microsoft::ReactNative;

namespace winrt::DeviceAI::implementation {

void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept {
    // Register TurboModule
    packageBuilder.AddTurboModule(L"DeviceAI", 
        [](const IReactContext &reactContext) noexcept {
            return winrt::make<DeviceAI>();
        });
}

} // namespace winrt::DeviceAI::implementation