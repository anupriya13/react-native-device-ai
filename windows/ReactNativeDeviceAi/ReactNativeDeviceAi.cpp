#include "ReactNativeDeviceAi.h"

namespace winrt::ReactNativeDeviceAiSpecs {

void ReactNativeDeviceAi::Initialize(React::ReactContext const &reactContext) noexcept {
  m_context = reactContext;
}

void ReactNativeDeviceAi::helloWorld() noexcept {
  // Log a welcome message using Windows console
  OutputDebugStringA("Hello, world! Welcome to the ReactNativeDeviceAi module!\n");
}

void ReactNativeDeviceAi::getDeviceInfo(React::JSValue result) noexcept {
  // TODO: Implement getDeviceInfo
}

void ReactNativeDeviceAi::getWindowsSystemInfo(React::JSValue result) noexcept {
  // TODO: Implement getWindowsSystemInfo
}

} // namespace winrt::ReactNativeDeviceAiSpecs
