/**
 * Windows-specific Demo for react-native-device-ai
 * Showcases TurboModule integration and Windows system APIs
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';

import DeviceAI from 'react-native-device-ai';

const WindowsDemo = () => {
  const [windowsSystemInfo, setWindowsSystemInfo] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [performanceCounters, setPerformanceCounters] = useState(null);
  const [wmiData, setWmiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNativeAvailable, setIsNativeAvailable] = useState(false);

  useEffect(() => {
    checkNativeAvailability();
  }, []);

  const checkNativeAvailability = () => {
    const available = DeviceAI.isNativeModuleAvailable();
    setIsNativeAvailable(available);
    
    if (!available) {
      Alert.alert(
        'Native Module Not Available',
        'Windows TurboModule is not available. This demo requires the native Windows implementation.',
        [{ text: 'OK' }]
      );
    }
  };

  const getWindowsSystemInfo = async () => {
    if (!isNativeAvailable) {
      Alert.alert('Error', 'Windows TurboModule not available');
      return;
    }

    setLoading(true);
    try {
      const result = await DeviceAI.getWindowsSystemInfo();
      setWindowsSystemInfo(result);
      Alert.alert('Success', 'Windows system information retrieved!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceInfo = async () => {
    setLoading(true);
    try {
      const result = await DeviceAI.getDeviceInsights();
      if (result.success) {
        setDeviceInfo(result.deviceInfo);
        Alert.alert('Success', 'Device information retrieved!');
      } else {
        Alert.alert('Error', result.error || 'Failed to get device info');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testPerformanceCounters = async () => {
    if (!isNativeAvailable) {
      Alert.alert('Error', 'Windows TurboModule not available');
      return;
    }

    setLoading(true);
    try {
      // Get Windows system info which includes performance counters
      const result = await DeviceAI.getWindowsSystemInfo();
      if (result && result.performanceCounters) {
        setPerformanceCounters(result.performanceCounters);
        Alert.alert('Success', 'Performance counters retrieved!');
      } else {
        Alert.alert('Info', 'No performance counter data available');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testWmiQueries = async () => {
    if (!isNativeAvailable) {
      Alert.alert('Error', 'Windows TurboModule not available');
      return;
    }

    setLoading(true);
    try {
      // Get Windows system info which includes WMI data
      const result = await DeviceAI.getWindowsSystemInfo();
      if (result && result.wmiData) {
        setWmiData(result.wmiData);
        Alert.alert('Success', 'WMI data retrieved!');
      } else {
        Alert.alert('Info', 'No WMI data available');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🪟 Windows TurboModule Demo</Text>
        <Text style={styles.subtitle}>
          Native Windows System Integration with AI Insights
        </Text>

        {/* Status Card */}
        <View style={[styles.statusCard, isNativeAvailable ? styles.statusSuccess : styles.statusError]}>
          <Text style={styles.statusTitle}>
            {isNativeAvailable ? '✅ TurboModule Status' : '❌ TurboModule Status'}
          </Text>
          <Text style={styles.statusText}>
            Native Module: {isNativeAvailable ? 'Available' : 'Not Available'}
          </Text>
          <Text style={styles.statusText}>
            Platform: {Platform.OS}
          </Text>
          <Text style={styles.statusText}>
            Features: {DeviceAI.getSupportedFeatures().join(', ')}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={getWindowsSystemInfo}
            disabled={loading || !isNativeAvailable}
          >
            <Text style={styles.buttonText}>🔧 Get Windows System Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={getDeviceInfo}
            disabled={loading}
          >
            <Text style={styles.buttonText}>📱 Get Device Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={testPerformanceCounters}
            disabled={loading || !isNativeAvailable}
          >
            <Text style={styles.buttonText}>📊 Performance Counters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.quaternaryButton]}
            onPress={testWmiQueries}
            disabled={loading || !isNativeAvailable}
          >
            <Text style={styles.buttonText}>🔍 WMI Queries</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Processing Windows APIs...</Text>
          </View>
        )}

        {/* Windows System Info Display */}
        {windowsSystemInfo && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>🪟 Windows System Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>OS Information</Text>
                <Text style={styles.infoCardText}>
                  Version: {windowsSystemInfo.osVersion}
                  {'\n'}Build: {windowsSystemInfo.buildNumber}
                  {'\n'}Architecture: {windowsSystemInfo.systemArchitecture}
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Hardware</Text>
                <Text style={styles.infoCardText}>
                  Processor: {windowsSystemInfo.processorName}
                  {'\n'}RAM: {windowsSystemInfo.installedRam}
                  {'\n'}Uptime: {windowsSystemInfo.systemUptime}
                </Text>
              </View>
            </View>

            {windowsSystemInfo.diskSpace && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Storage Information</Text>
                <Text style={styles.infoCardText}>
                  Total: {formatBytes(windowsSystemInfo.diskSpace.total)}
                  {'\n'}Available: {formatBytes(windowsSystemInfo.diskSpace.available)}
                  {'\n'}Used: {formatBytes(windowsSystemInfo.diskSpace.total - windowsSystemInfo.diskSpace.available)}
                </Text>
              </View>
            )}

            {windowsSystemInfo.runningProcesses && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>System Activity</Text>
                <Text style={styles.infoCardText}>
                  Running Processes: {windowsSystemInfo.runningProcesses}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Performance Counters Display */}
        {performanceCounters && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>📊 Performance Counters</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>CPU Usage</Text>
                <Text style={styles.infoCardText}>{performanceCounters.cpuUsage}%</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Memory Usage</Text>
                <Text style={styles.infoCardText}>{performanceCounters.memoryUsage}%</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Disk Activity</Text>
                <Text style={styles.infoCardText}>{performanceCounters.diskActivity}%</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Network Activity</Text>
                <Text style={styles.infoCardText}>{performanceCounters.networkActivity} MB/s</Text>
              </View>
            </View>
          </View>
        )}

        {/* Device Info Display */}
        {deviceInfo && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>📱 Device Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Memory</Text>
                <Text style={styles.infoCardText}>
                  Used: {formatBytes(deviceInfo.memory.used)}
                  {'\n'}Total: {formatBytes(deviceInfo.memory.total)}
                  {'\n'}Usage: {deviceInfo.memory.usedPercentage}%
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Storage</Text>
                <Text style={styles.infoCardText}>
                  Used: {formatBytes(deviceInfo.storage.used)}
                  {'\n'}Total: {formatBytes(deviceInfo.storage.total)}
                  {'\n'}Usage: {deviceInfo.storage.usedPercentage}%
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Battery</Text>
                <Text style={styles.infoCardText}>
                  Level: {deviceInfo.battery.level}%
                  {'\n'}State: {deviceInfo.battery.state}
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>CPU</Text>
                <Text style={styles.infoCardText}>
                  Usage: {deviceInfo.cpu.usage}%
                  {'\n'}Cores: {deviceInfo.cpu.cores || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📖 How to Use</Text>
          <Text style={styles.instructionsText}>
            1. Ensure you're running on Windows with the TurboModule enabled
            {'\n'}2. Click "Get Windows System Info" to test native Windows APIs
            {'\n'}3. Use "Performance Counters" to see real-time system metrics
            {'\n'}4. Try "WMI Queries" for detailed hardware information
            {'\n'}5. "Get Device Info" works on all platforms with AI insights
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
  },
  statusSuccess: {
    backgroundColor: '#d5f4e6',
    borderColor: '#27ae60',
  },
  statusError: {
    backgroundColor: '#fadbd8',
    borderColor: '#e74c3c',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  statusText: {
    fontSize: 12,
    color: '#34495e',
    marginBottom: 4,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#0078D4',
  },
  secondaryButton: {
    backgroundColor: '#00bcf2',
  },
  tertiaryButton: {
    backgroundColor: '#40e0d0',
  },
  quaternaryButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#0078D4',
    fontWeight: '500',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '48%',
    minWidth: 150,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 12,
    color: '#2c3e50',
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  instructionsContainer: {
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#34495e',
    lineHeight: 18,
  },
});

export default WindowsDemo;