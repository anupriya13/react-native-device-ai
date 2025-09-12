#pragma once

#include "pch.h"
#include "resource.h"

#if __has_include("codegen/NativeReactNativeDeviceAiDataTypes.g.h")
  #include "codegen/NativeReactNativeDeviceAiDataTypes.g.h"
#endif
#include "codegen/NativeReactNativeDeviceAiSpec.g.h"

#include "NativeModules.h"

namespace winrt::ReactNativeDeviceAiSpecs
{

// See https://microsoft.github.io/react-native-windows/docs/native-platform for help writing native modules

REACT_MODULE(ReactNativeDeviceAi)
struct ReactNativeDeviceAi
{
  using ModuleSpec = ReactNativeDeviceAiCodegen::ReactNativeDeviceAiSpec;

  REACT_INIT(Initialize)
  void Initialize(React::ReactContext const &reactContext) noexcept;

  REACT_METHOD(helloWorld)
  void helloWorld() noexcept;

  REACT_METHOD(getDeviceInfo)
  void getDeviceInfo(React::JSValue result) noexcept;

  REACT_METHOD(getWindowsSystemInfo)
  void getWindowsSystemInfo(React::JSValue result) noexcept;

private:
  React::ReactContext m_context;
};

} // namespace winrt::ReactNativeDeviceAiSpecs