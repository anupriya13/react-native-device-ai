
// React Native Windows Feature Flags Compatibility Patch
// This patch provides definitions for feature flags that were removed 
// from React Native 0.79.0 but are still referenced by React Native Windows codegen

#pragma once

// Temporary definitions for removed feature flags to maintain compatibility
namespace facebook {
namespace react {

// Define missing feature flags with default values
class NativeReactNativeFeatureFlagsCompatibility {
public:
    // Feature flags removed in React Native 0.79.0
    static bool useEditTextStockAndroidFocusBehavior() {
        return false;  // Default behavior
    }
    
    static bool useTextInputCursorBlinkingAPI() {
        return false;  // Default behavior
    }
    
    static bool enableTextInputOnKeyPressForDirectManipulation() {
        return false;  // Default behavior
    }
};

// Extend NativeReactNativeFeatureFlags with missing methods
#ifndef FEATURE_FLAGS_COMPATIBILITY_INCLUDED
#define FEATURE_FLAGS_COMPATIBILITY_INCLUDED

// Macro to add missing feature flag methods
#define ADD_MISSING_FEATURE_FLAG(flag_name, default_value) \
    static bool flag_name() { return default_value; }

// Add missing feature flags to existing class
namespace {
    template<typename T>
    struct FeatureFlagsExtension : public T {
        ADD_MISSING_FEATURE_FLAG(useEditTextStockAndroidFocusBehavior, false)
        ADD_MISSING_FEATURE_FLAG(useTextInputCursorBlinkingAPI, false)
        ADD_MISSING_FEATURE_FLAG(enableTextInputOnKeyPressForDirectManipulation, false)
    };
}

#endif // FEATURE_FLAGS_COMPATIBILITY_INCLUDED

} // namespace react
} // namespace facebook
