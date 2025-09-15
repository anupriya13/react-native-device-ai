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
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';

import DeviceAI from 'react-native-device-ai';

const { width, height } = Dimensions.get('window');

/**
 * Enhanced Example App demonstrating react-native-device-ai usage
 * Features: Windows TurboModule integration, AI insights, real-time monitoring
 */
const App = () => {
  const [deviceInsights, setDeviceInsights] = useState(null);
  const [batteryAdvice, setBatteryAdvice] = useState(null);
  const [performanceTips, setPerformanceTips] = useState(null);
  const [windowsSystemInfo, setWindowsSystemInfo] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [supportedFeatures, setSupportedFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [realTimeData, setRealTimeData] = useState(null);
  const [aiInsightsHistory, setAiInsightsHistory] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    // Initialize the module and get basic info
    initializeModule();
    
    // Start auto-refresh if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshRealTimeData();
      }, 5000); // Refresh every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const initializeModule = async () => {
    try {
      // Get supported features
      setSupportedFeatures(DeviceAI.getSupportedFeatures());
      
      // Get initial device insights for real-time data
      await refreshRealTimeData();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  };

  const refreshRealTimeData = async () => {
    try {
      const insights = await DeviceAI.getDeviceInsights();
      if (insights.success) {
        setRealTimeData(insights.deviceInfo);
      }
    } catch (error) {
      console.error('Real-time data refresh error:', error);
    }
  };

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

  const handleQueryDeviceInfo = async () => {
    if (!userPrompt.trim()) {
      Alert.alert('Error', 'Please enter a question about your device');
      return;
    }

    setLoading(true);
    try {
      const result = await DeviceAI.queryDeviceInfo(userPrompt.trim());
      setQueryResult(result);
      
      // Add to AI insights history
      if (result.success) {
        const newInsight = {
          timestamp: new Date().toLocaleTimeString(),
          query: userPrompt.trim(),
          response: result.response,
          platform: Platform.OS
        };
        setAiInsightsHistory(prev => [newInsight, ...prev.slice(0, 4)]); // Keep last 5
        Alert.alert('AI Response', result.response);
      } else {
        Alert.alert('Error', result.error || 'Failed to process query');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSamplePrompt = (prompt) => {
    setUserPrompt(prompt);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
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

  const getStatusColor = (percentage) => {
    if (percentage > 80) return '#ff4757';
    if (percentage > 60) return '#ffa502';
    return '#2ed573';
  };

  const renderMetricCard = (title, value, percentage, icon) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min(percentage, 100)}%`, 
              backgroundColor: getStatusColor(percentage) 
            }
          ]} 
        />
      </View>
      <Text style={styles.metricPercentage}>{percentage.toFixed(1)}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🤖 React Native Device AI</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'windows' 
            ? '🪟 Windows TurboModule with AI Insights' 
            : '📱 AI-Powered Device Insights'}
        </Text>

        {/* Real-time Metrics Dashboard */}
        {realTimeData && (
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardHeader}>
              <Text style={styles.dashboardTitle}>📊 Real-time Metrics</Text>
              <TouchableOpacity 
                style={[styles.refreshButton, autoRefresh && styles.refreshButtonActive]}
                onPress={toggleAutoRefresh}
              >
                <Text style={styles.refreshButtonText}>
                  {autoRefresh ? '⏸️ Live' : '▶️ Auto'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.metricsGrid}>
              {renderMetricCard(
                'Memory', 
                `${(realTimeData.memory.used / (1024*1024*1024)).toFixed(1)}GB`, 
                realTimeData.memory.usedPercentage,
                '🧠'
              )}
              {renderMetricCard(
                'Storage', 
                `${(realTimeData.storage.used / (1024*1024*1024*1024)).toFixed(1)}TB`, 
                realTimeData.storage.usedPercentage,
                '💾'
              )}
              {renderMetricCard(
                'Battery', 
                `${realTimeData.battery.level}%`, 
                realTimeData.battery.level,
                '🔋'
              )}
              {renderMetricCard(
                'CPU', 
                `${realTimeData.cpu.usage}%`, 
                realTimeData.cpu.usage,
                '⚡'
              )}
            </View>
          </View>
        )}

        {/* Platform and Features Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>🔧 Platform: {Platform.OS}</Text>
          <Text style={styles.infoText}>
            Native Module: {DeviceAI.isNativeModuleAvailable() ? '✅ Available' : '❌ Not Available'}
          </Text>
          <Text style={styles.infoText}>
            Supported Features: {supportedFeatures.length > 0 ? supportedFeatures.length + ' features' : 'Loading...'}
          </Text>
          {Platform.OS === 'windows' && (
            <Text style={styles.infoText}>
              🪟 Windows TurboModule: {DeviceAI.isNativeModuleAvailable() ? 'Active' : 'Inactive'}
            </Text>
          )}
        </View>

        {/* Azure OpenAI Configuration Status */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            🤖 Azure OpenAI Integration
          </Text>
          <Text style={styles.warningSubtext}>
            Configure in .env for enhanced AI insights. Module works with intelligent fallbacks.
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

        {/* Custom Query Section with Enhanced AI Interface */}
        <View style={styles.queryContainer}>
          <Text style={styles.queryTitle}>🤖 AI Assistant</Text>
          <Text style={styles.querySubtitle}>
            Ask natural language questions about your device
          </Text>
          
          {/* Sample prompts */}
          <View style={styles.samplePromptsContainer}>
            <Text style={styles.samplePromptsTitle}>💡 Try these questions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.samplePromptsScroll}>
              {[
                "How much battery do I have?",
                "Is my memory usage high?",
                "How much storage space is left?",
                "What's my CPU usage?",
                "Is my device running well?",
                Platform.OS === 'windows' ? "How many processes are running?" : "What's my screen resolution?",
                "Should I optimize my device?",
                "Tell me about my system performance"
              ].map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.samplePromptButton}
                  onPress={() => handleSelectSamplePrompt(prompt)}
                >
                  <Text style={styles.samplePromptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TextInput
            style={styles.promptInput}
            placeholder="e.g., How much battery do I have left?"
            value={userPrompt}
            onChangeText={setUserPrompt}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleQueryDeviceInfo}
          />
          
          <TouchableOpacity
            style={[styles.button, styles.queryButton]}
            onPress={handleQueryDeviceInfo}
            disabled={loading || !userPrompt.trim()}
          >
            <Text style={styles.buttonText}>🤖 Ask AI Assistant</Text>
          </TouchableOpacity>
        </View>

        {/* AI Insights History */}
        {aiInsightsHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>🧠 Recent AI Insights</Text>
            {aiInsightsHistory.map((insight, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyTime}>{insight.timestamp}</Text>
                <Text style={styles.historyQuery}>Q: {insight.query}</Text>
                <Text style={styles.historyResponse}>A: {insight.response}</Text>
              </View>
            ))}
          </View>
        )}

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

        {/* Query Result Display */}
        {queryResult && queryResult.success && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>🤖 AI Response</Text>
            <View style={styles.queryResultContainer}>
              <Text style={styles.queryPromptText}>
                Question: "{queryResult.prompt}"
              </Text>
              <Text style={styles.queryResponseText}>
                {queryResult.response}
              </Text>
            </View>
            <Text style={styles.recommendationsTitle}>Relevant Data:</Text>
            <View style={styles.deviceInfoContainer}>
              <Text style={styles.deviceInfoText}>
                {JSON.stringify(queryResult.relevantData, null, 2)}
              </Text>
            </View>
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
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  
  // Dashboard styles
  dashboardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  refreshButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  refreshButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  refreshButtonText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 60) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricPercentage: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '500',
  },
  
  // History styles
  historyContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  historyTime: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  historyQuery: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 4,
  },
  historyResponse: {
    fontSize: 12,
    color: '#34495e',
    lineHeight: 16,
  },
  infoContainer: {
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2980b9',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#2c3e50',
    marginBottom: 4,
    fontWeight: '500',
  },
  warningContainer: {
    backgroundColor: '#fef9e7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f39c12',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d68910',
    marginBottom: 6,
  },
  warningSubtext: {
    fontSize: 12,
    color: '#b7950b',
    fontWeight: '500',
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
  queryButton: {
    backgroundColor: '#6C63FF', // Purple for AI
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  queryContainer: {
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
  queryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  querySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  samplePromptsContainer: {
    marginBottom: 15,
  },
  samplePromptsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  samplePromptsScroll: {
    flexGrow: 0,
  },
  samplePromptButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  samplePromptText: {
    fontSize: 12,
    color: '#333',
  },
  promptInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
    maxHeight: 100,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  queryResultContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  queryPromptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  queryResponseText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    lineHeight: 22,
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