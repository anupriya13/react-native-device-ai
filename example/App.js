import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';

import DeviceAI from 'react-native-device-ai';

/**
 * Example App demonstrating react-native-device-ai usage
 */
const App = () => {
  const [deviceInsights, setDeviceInsights] = useState(null);
  const [batteryAdvice, setBatteryAdvice] = useState(null);
  const [performanceTips, setPerformanceTips] = useState(null);
  const [windowsSystemInfo, setWindowsSystemInfo] = useState(null);
  const [supportedFeatures, setSupportedFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Configure Azure OpenAI (optional - app works without it but provides basic insights)
    // In production, you would get these from secure storage or environment variables
    try {
      // DeviceAI.configure({
      //   apiKey: 'your-azure-openai-api-key',
      //   endpoint: 'https://your-resource.openai.azure.com'
      // });
    } catch (error) {
      console.log('Azure OpenAI not configured - using fallback insights');
    }

    // Get supported features
    setSupportedFeatures(DeviceAI.getSupportedFeatures());
  }, []);

  const handleGetDeviceInsights = async () => {
    setLoading(true);
    try {
      const insights = await DeviceAI.getDeviceInsights();
      setDeviceInsights(insights);
      
      if (insights.success) {
        Alert.alert('Success', 'Device insights retrieved successfully!');
      } else {
        Alert.alert('Error', insights.error || 'Failed to get device insights');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetBatteryAdvice = async () => {
    setLoading(true);
    try {
      const advice = await DeviceAI.getBatteryAdvice();
      setBatteryAdvice(advice);
      
      if (advice.success) {
        Alert.alert('Success', 'Battery advice retrieved successfully!');
      } else {
        Alert.alert('Error', advice.error || 'Failed to get battery advice');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPerformanceTips = async () => {
    setLoading(true);
    try {
      const tips = await DeviceAI.getPerformanceTips();
      setPerformanceTips(tips);
      
      if (tips.success) {
        Alert.alert('Success', 'Performance tips retrieved successfully!');
      } else {
        Alert.alert('Error', tips.error || 'Failed to get performance tips');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetWindowsSystemInfo = async () => {
    setLoading(true);
    try {
      const windowsInfo = await DeviceAI.getWindowsSystemInfo();
      setWindowsSystemInfo(windowsInfo);
      
      if (windowsInfo) {
        Alert.alert('Success', 'Windows system info retrieved successfully!');
      } else {
        Alert.alert('Error', 'Failed to get Windows system info');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDeviceInfo = (deviceInfo) => {
    if (!deviceInfo) return 'No device info available';
    
    let info = `Platform: ${deviceInfo.platform}
Version: ${deviceInfo.version}
Screen: ${deviceInfo.screen.width}x${deviceInfo.screen.height}
Memory: ${deviceInfo.memory.used} / ${deviceInfo.memory.total} (${deviceInfo.memory.usedPercentage}%)
Storage: ${deviceInfo.storage.used} / ${deviceInfo.storage.total} (${deviceInfo.storage.usedPercentage}%)
Battery: ${deviceInfo.battery.level}% (${deviceInfo.battery.state})
CPU Usage: ${deviceInfo.cpu.usage}%`;

    // Add Windows-specific info if available
    if (deviceInfo.windowsSpecific) {
      info += `

Windows Specific:
OS Version: ${deviceInfo.windowsSpecific.osVersion}
Build: ${deviceInfo.windowsSpecific.buildNumber}
RAM: ${deviceInfo.windowsSpecific.installedRam}
Processor: ${deviceInfo.windowsSpecific.processorName}
Processes: ${deviceInfo.windowsSpecific.runningProcesses}`;
    }

    return info;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>React Native Device AI</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'windows' ? 'Windows TurboModule Demo' : 'AI-Powered Device Insights Demo'}
        </Text>

        {/* Platform and Features Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Platform: {Platform.OS}</Text>
          <Text style={styles.infoText}>
            Native Module: {DeviceAI.isNativeModuleAvailable() ? 'Available' : 'Not Available'}
          </Text>
          <Text style={styles.infoText}>
            Supported Features: {supportedFeatures.length > 0 ? supportedFeatures.join(', ') : 'Loading...'}
          </Text>
        </View>

        {/* Note: Azure OpenAI configuration is commented out for demo purposes */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Azure OpenAI not configured. Using fallback insights.
          </Text>
          <Text style={styles.warningSubtext}>
            Configure Azure OpenAI for AI-powered recommendations.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGetDeviceInsights}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Device Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleGetBatteryAdvice}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Battery Advice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={handleGetPerformanceTips}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Performance Tips</Text>
          </TouchableOpacity>

          {/* Windows-specific button */}
          {Platform.OS === 'windows' && DeviceAI.isNativeModuleAvailable() && (
            <TouchableOpacity
              style={[styles.button, styles.windowsButton]}
              onPress={handleGetWindowsSystemInfo}
              disabled={loading}
            >
              <Text style={styles.buttonText}>🪟 Get Windows System Info</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Analyzing device...</Text>
          </View>
        )}

        {deviceInsights && deviceInsights.success && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>📱 Device Insights</Text>
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceInfoText}>
                {formatDeviceInfo(deviceInsights.deviceInfo)}
              </Text>
            </View>
            <Text style={styles.insightsTitle}>AI Insights:</Text>
            <Text style={styles.insightsText}>{deviceInsights.insights}</Text>
            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
            {deviceInsights.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationItem}>
                • {rec}
              </Text>
            ))}
          </View>
        )}

        {batteryAdvice && batteryAdvice.success && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>🔋 Battery Advice</Text>
            <Text style={styles.batteryLevel}>
              Battery Level: {batteryAdvice.batteryInfo.batteryLevel}%
            </Text>
            <Text style={styles.insightsTitle}>AI Advice:</Text>
            <Text style={styles.insightsText}>{batteryAdvice.advice}</Text>
            <Text style={styles.recommendationsTitle}>Battery Tips:</Text>
            {batteryAdvice.tips.map((tip, index) => (
              <Text key={index} style={styles.recommendationItem}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        {performanceTips && performanceTips.success && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>⚡ Performance Tips</Text>
            <Text style={styles.insightsTitle}>AI Tips:</Text>
            <Text style={styles.insightsText}>{performanceTips.tips}</Text>
            <Text style={styles.recommendationsTitle}>General Recommendations:</Text>
            {performanceTips.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationItem}>
                • {rec}
              </Text>
            ))}
          </View>
        )}

        {/* Windows System Info Display */}
        {windowsSystemInfo && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>🪟 Windows System Information</Text>
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceInfoText}>
                OS Version: {windowsSystemInfo.osVersion}
                {'\n'}Build: {windowsSystemInfo.buildNumber}
                {'\n'}Architecture: {windowsSystemInfo.systemArchitecture}
                {'\n'}RAM: {windowsSystemInfo.installedRam}
                {'\n'}Processor: {windowsSystemInfo.processorName}
                {'\n'}Uptime: {windowsSystemInfo.systemUptime}
                {'\n'}Running Processes: {windowsSystemInfo.runningProcesses}
              </Text>
            </View>
            
            {windowsSystemInfo.performanceCounters && (
              <View>
                <Text style={styles.insightsTitle}>Performance Counters:</Text>
                <View style={styles.deviceInfoContainer}>
                  <Text style={styles.deviceInfoText}>
                    CPU Usage: {windowsSystemInfo.performanceCounters.cpuUsage}%
                    {'\n'}Memory Usage: {windowsSystemInfo.performanceCounters.memoryUsage}%
                    {'\n'}Disk Activity: {windowsSystemInfo.performanceCounters.diskActivity}%
                    {'\n'}Network Activity: {windowsSystemInfo.performanceCounters.networkActivity} MB/s
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.insightsTitle}>Disk Information:</Text>
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceInfoText}>
                Total: {windowsSystemInfo.diskSpace.total}
                {'\n'}Available: {windowsSystemInfo.diskSpace.available}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#1976d2',
    marginBottom: 2,
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 5,
  },
  warningSubtext: {
    fontSize: 12,
    color: '#856404',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  tertiaryButton: {
    backgroundColor: '#FF9500',
  },
  windowsButton: {
    backgroundColor: '#0078D4', // Windows blue
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  deviceInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  deviceInfoText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#495057',
    lineHeight: 18,
  },
  batteryLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 10,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  insightsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  recommendationItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginBottom: 4,
  },
});

export default App;