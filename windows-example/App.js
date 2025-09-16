/**
 * Simple Windows Example for react-native-device-ai
 * Minimal UI for integration testing
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';

import DeviceAI from 'react-native-device-ai';

const App = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [isNativeAvailable, setIsNativeAvailable] = useState(false);

  useEffect(() => {
    // Check if native module is available
    const nativeAvailable = DeviceAI.isNativeModuleAvailable();
    setIsNativeAvailable(nativeAvailable);
    console.log('Native module available:', nativeAvailable);
  }, []);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      console.log(`Running test: ${testName}`);
      const result = await testFunction();
      setResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result }
      }));
      console.log(`Test ${testName} completed:`, result);
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testDeviceInsights = () => runTest('deviceInsights', DeviceAI.getDeviceInsights);
  const testBatteryAdvice = () => runTest('batteryAdvice', DeviceAI.getBatteryAdvice);  
  const testPerformanceTips = () => runTest('performanceTips', DeviceAI.getPerformanceTips);
  
  const testWindowsSystemInfo = () => {
    if (Platform.OS !== 'windows') {
      setResults(prev => ({
        ...prev,
        windowsSystemInfo: { success: false, error: 'Not on Windows platform' }
      }));
      return;
    }
    runTest('windowsSystemInfo', DeviceAI.getWindowsSystemInfo);
  };

  const testSupportedFeatures = () => {
    const features = DeviceAI.getSupportedFeatures();
    setResults(prev => ({
      ...prev,
      supportedFeatures: { success: true, data: features }
    }));
  };

  const clearResults = () => {
    setResults({});
  };

  const renderResult = (testName, result) => {
    if (!result) return null;
    
    return (
      <View key={testName} style={styles.resultContainer}>
        <Text style={styles.resultTitle}>{testName}</Text>
        {result.success ? (
          <Text style={styles.successText}>✅ Success</Text>
        ) : (
          <Text style={styles.errorText}>❌ Error: {result.error}</Text>
        )}
        {result.data && (
          <Text style={styles.dataText} numberOfLines={3}>
            {JSON.stringify(result.data, null, 2).substring(0, 200)}...
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Windows Example</Text>
          <Text style={styles.subtitle}>react-native-device-ai v1.0.0</Text>
          <Text style={styles.platformInfo}>
            Platform: {Platform.OS} | Native: {isNativeAvailable ? '✅' : '❌'}
          </Text>
        </View>

        {/* Test Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={testDeviceInsights}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Device Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={testBatteryAdvice}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Battery Advice</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={testPerformanceTips}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Performance Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={testWindowsSystemInfo}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Windows System Info</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={testSupportedFeatures}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Supported Features</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={clearResults}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Clear Results</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Running test...</Text>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {Object.entries(results).map(([testName, result]) => 
            renderResult(testName, result)
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  platformInfo: {
    fontSize: 14,
    color: '#374151',
  },
  buttonContainer: {
    padding: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  successText: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
});

export default App;