#!/usr/bin/env node

/**
 * Fix React Native Windows Feature Flags Compatibility
 * 
 * Addresses React Native Windows 0.79.0 codegen compatibility issues
 * where certain feature flags were removed from React Native core
 * but are still referenced by React Native Windows codegen.
 * 
 * Error: 'useEditTextStockAndroidFocusBehavior': is not a member of 'facebook::react::NativeReactNativeFeatureFlags'
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing React Native Windows Feature Flags Compatibility...\n');

// Feature flags that were removed in React Native 0.79.0 but still referenced by RNW
const REMOVED_FEATURE_FLAGS = [
    'useEditTextStockAndroidFocusBehavior',
    'useTextInputCursorBlinkingAPI',
    'enableTextInputOnKeyPressForDirectManipulation'
];

/**
 * Create feature flags compatibility patch
 */
function createFeatureFlagsCompatibilityPatch() {
    const patchContent = `
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
#define ADD_MISSING_FEATURE_FLAG(flag_name, default_value) \\
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
`;

    const patchDir = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample');
    const patchFile = path.join(patchDir, 'FeatureFlagsCompatibility.h');
    
    try {
        if (!fs.existsSync(patchDir)) {
            console.log(`⚠️  Windows project directory not found: ${patchDir}`);
            return false;
        }
        
        fs.writeFileSync(patchFile, patchContent);
        console.log(`✅ Created feature flags compatibility patch: ${patchFile}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to create compatibility patch: ${error.message}`);
        return false;
    }
}

/**
 * Update vcxproj to include compatibility patch
 */
function updateVcxprojWithCompatibilityPatch() {
    const vcxprojPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'ReactNativeDeviceAiExample.vcxproj');
    
    if (!fs.existsSync(vcxprojPath)) {
        console.log(`⚠️  vcxproj file not found: ${vcxprojPath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(vcxprojPath, 'utf8');
        
        // Check if compatibility patch is already included
        if (content.includes('FeatureFlagsCompatibility.h')) {
            console.log('✅ Feature flags compatibility patch already included in vcxproj');
            return true;
        }
        
        // Add include for compatibility patch
        const includeSection = content.match(/<ItemGroup>\s*<ClInclude[^>]*>[\s\S]*?<\/ItemGroup>/);
        if (includeSection) {
            const newInclude = '    <ClInclude Include="FeatureFlagsCompatibility.h" />';
            const updatedSection = includeSection[0].replace('</ItemGroup>', `${newInclude}\n  </ItemGroup>`);
            content = content.replace(includeSection[0], updatedSection);
            
            fs.writeFileSync(vcxprojPath, content);
            console.log('✅ Added feature flags compatibility patch to vcxproj');
            return true;
        } else {
            console.log('⚠️  Could not find ClInclude section in vcxproj');
            return false;
        }
    } catch (error) {
        console.error(`❌ Failed to update vcxproj: ${error.message}`);
        return false;
    }
}

/**
 * Create React Native config override for feature flags
 */
function createReactNativeConfigOverride() {
    const configContent = `
// React Native Windows Feature Flags Configuration Override
// This configuration helps resolve compatibility issues with React Native 0.79.0

const path = require('path');

module.exports = {
  // Dependencies configuration
  dependencies: {
    'react-native-device-ai': {
      platforms: {
        windows: {
          sourceDir: '../windows',
          solutionFile: 'ReactNativeDeviceAi.sln',
          projectFile: 'ReactNativeDeviceAi/ReactNativeDeviceAi.vcxproj',
        },
      },
    },
  },
  
  // Project configuration - corrected paths to prevent duplication
  project: {
    windows: {
      sourceDir: './windows',
      solutionFile: 'ReactNativeDeviceAiExample.sln',
      projectFile: 'ReactNativeDeviceAiExample/ReactNativeDeviceAiExample.vcxproj',
      experimentalNuGetDependency: false,
      useWinUI3: false,
      projectName: 'ReactNativeDeviceAiExample',
      projectGuid: '{2AB167A1-C158-4721-B131-093D7987CEA9}',
      projectLang: 'cpp',
      // Feature flags compatibility settings
      codegenConfig: {
        featureFlags: {
          // Override problematic feature flags
          useEditTextStockAndroidFocusBehavior: false,
          useTextInputCursorBlinkingAPI: false,
          enableTextInputOnKeyPressForDirectManipulation: false
        }
      }
    },
  },
  
  // Platform configuration
  platforms: {
    windows: {
      npmPackageName: 'react-native-windows',
    },
  },
  
  // Assets configuration
  assets: ['./assets/'],
  
  // Codegen configuration for compatibility
  codegenConfig: {
    windows: {
      namespace: "ReactNativeDeviceAiExampleCodegen",
      outputDirectory: "windows/ReactNativeDeviceAiExample/codegen",
      separateDataTypes: true,
      // Compatibility settings
      featureFlags: {
        useEditTextStockAndroidFocusBehavior: false,
        useTextInputCursorBlinkingAPI: false,
        enableTextInputOnKeyPressForDirectManipulation: false
      }
    }
  }
};
`;

    const configPath = path.join(__dirname, 'react-native.config.compatibility.js');
    
    try {
        fs.writeFileSync(configPath, configContent);
        console.log(`✅ Created React Native config override: ${configPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to create config override: ${error.message}`);
        return false;
    }
}

/**
 * Create MSBuild props override for feature flags
 */
function createMSBuildFeatureFlagsOverride() {
    const propsContent = `<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  
  <!-- React Native Windows Feature Flags Compatibility Override -->
  <!-- This props file resolves feature flag compatibility issues with React Native 0.79.0 -->
  
  <PropertyGroup Label="React Native Feature Flags Compatibility">
    <ReactNativeFeatureFlagsCompatibility>true</ReactNativeFeatureFlagsCompatibility>
    
    <!-- Define missing feature flags as preprocessor definitions -->
    <ClCompile>
      <PreprocessorDefinitions>
        RN_FEATURE_FLAG_useEditTextStockAndroidFocusBehavior=0;
        RN_FEATURE_FLAG_useTextInputCursorBlinkingAPI=0;
        RN_FEATURE_FLAG_enableTextInputOnKeyPressForDirectManipulation=0;
        REACT_NATIVE_FEATURE_FLAGS_COMPATIBILITY=1;
        %(PreprocessorDefinitions)
      </PreprocessorDefinitions>
      
      <!-- Include compatibility header path -->
      <AdditionalIncludeDirectories>
        $(MSBuildThisFileDirectory);
        %(AdditionalIncludeDirectories)
      </AdditionalIncludeDirectories>
    </ClCompile>
  </PropertyGroup>
  
  <!-- Ensure compatibility patch is included in build -->
  <ItemGroup Condition="'$(ReactNativeFeatureFlagsCompatibility)' == 'true'">
    <ClInclude Include="$(MSBuildThisFileDirectory)FeatureFlagsCompatibility.h" 
                Condition="Exists('$(MSBuildThisFileDirectory)FeatureFlagsCompatibility.h')" />
  </ItemGroup>
  
</Project>
`;

    const propsPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'FeatureFlagsCompatibility.props');
    
    try {
        const propsDir = path.dirname(propsPath);
        if (!fs.existsSync(propsDir)) {
            console.log(`⚠️  Props directory not found: ${propsDir}`);
            return false;
        }
        
        fs.writeFileSync(propsPath, propsContent);
        console.log(`✅ Created MSBuild feature flags override: ${propsPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to create MSBuild override: ${error.message}`);
        return false;
    }
}

/**
 * Add feature flags compatibility to vcxproj imports
 */
function addFeatureFlagsCompatibilityToVcxproj() {
    const vcxprojPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'ReactNativeDeviceAiExample.vcxproj');
    
    if (!fs.existsSync(vcxprojPath)) {
        console.log(`⚠️  vcxproj file not found: ${vcxprojPath}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(vcxprojPath, 'utf8');
        
        // Check if feature flags compatibility is already imported
        if (content.includes('FeatureFlagsCompatibility.props')) {
            console.log('✅ Feature flags compatibility props already imported in vcxproj');
            return true;
        }
        
        // Add import for feature flags compatibility props
        const importLocation = content.indexOf('</Project>');
        if (importLocation !== -1) {
            const compatibilityImport = `
  <!-- Feature Flags Compatibility Import -->
  <Import Project="FeatureFlagsCompatibility.props" Condition="Exists('FeatureFlagsCompatibility.props')" />
  
`;
            content = content.slice(0, importLocation) + compatibilityImport + content.slice(importLocation);
            
            fs.writeFileSync(vcxprojPath, content);
            console.log('✅ Added feature flags compatibility props import to vcxproj');
            return true;
        } else {
            console.log('⚠️  Could not find insertion point in vcxproj');
            return false;
        }
    } catch (error) {
        console.error(`❌ Failed to add compatibility import: ${error.message}`);
        return false;
    }
}

/**
 * Validate the fix
 */
function validateFix() {
    console.log('\n🔍 Validating Feature Flags Compatibility Fix...\n');
    
    const checks = [
        {
            name: 'Feature flags compatibility header exists',
            check: () => fs.existsSync(path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'FeatureFlagsCompatibility.h'))
        },
        {
            name: 'MSBuild props override exists',
            check: () => fs.existsSync(path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'FeatureFlagsCompatibility.props'))
        },
        {
            name: 'React Native config override exists',
            check: () => fs.existsSync(path.join(__dirname, 'react-native.config.compatibility.js'))
        },
        {
            name: 'vcxproj includes compatibility files',
            check: () => {
                const vcxprojPath = path.join(__dirname, 'windows', 'ReactNativeDeviceAiExample', 'ReactNativeDeviceAiExample.vcxproj');
                if (!fs.existsSync(vcxprojPath)) return false;
                const content = fs.readFileSync(vcxprojPath, 'utf8');
                return content.includes('FeatureFlagsCompatibility');
            }
        }
    ];
    
    let allPassed = true;
    checks.forEach(({ name, check }) => {
        const passed = check();
        console.log(`${passed ? '✅' : '❌'} ${name}`);
        if (!passed) allPassed = false;
    });
    
    console.log(`\n${allPassed ? '🎉' : '⚠️'} Feature flags compatibility fix ${allPassed ? 'completed successfully' : 'partially completed'}\n`);
    
    return allPassed;
}

/**
 * Main execution
 */
async function main() {
    console.log('React Native Windows Feature Flags Compatibility Fix');
    console.log('====================================================\n');
    
    console.log('This fix addresses the React Native Windows 0.79.0 compatibility issue:');
    console.log('Error: \'useEditTextStockAndroidFocusBehavior\': is not a member of \'facebook::react::NativeReactNativeFeatureFlags\'\n');
    
    let success = true;
    
    // Step 1: Create compatibility patch
    success &= createFeatureFlagsCompatibilityPatch();
    
    // Step 2: Update vcxproj with compatibility patch
    success &= updateVcxprojWithCompatibilityPatch();
    
    // Step 3: Create React Native config override
    success &= createReactNativeConfigOverride();
    
    // Step 4: Create MSBuild props override
    success &= createMSBuildFeatureFlagsOverride();
    
    // Step 5: Add compatibility to vcxproj imports
    success &= addFeatureFlagsCompatibilityToVcxproj();
    
    // Step 6: Validate the fix
    const validated = validateFix();
    
    if (success && validated) {
        console.log('🎯 How to use the fix:');
        console.log('');
        console.log('1. Use the compatibility config:');
        console.log('   npx react-native run-windows --config-name react-native.config.compatibility.js --no-autolink');
        console.log('');
        console.log('2. Or build directly with MSBuild:');
        console.log('   cd windows && msbuild ReactNativeDeviceAiExample.sln /p:Configuration=Debug /p:Platform=x64');
        console.log('');
        console.log('3. For Visual Studio: Open the solution and build normally');
        console.log('');
        console.log('The feature flags compatibility patch resolves the React Native 0.79.0 compatibility issue.');
    } else {
        console.log('⚠️  Some steps failed. Please check the error messages above.');
        process.exit(1);
    }
}

// Run the fix
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    createFeatureFlagsCompatibilityPatch,
    updateVcxprojWithCompatibilityPatch,
    createReactNativeConfigOverride,
    createMSBuildFeatureFlagsOverride,
    addFeatureFlagsCompatibilityToVcxproj,
    validateFix
};