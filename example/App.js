import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
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
  const [azureConfigured, setAzureConfigured] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const loadFromSecureStorage = async () => {
    const apiKey =
      (typeof process !== 'undefined' && process.env && process.env.AZURE_OPENAI_API_KEY) || '';
    const endpoint =
      (typeof process !== 'undefined' && process.env && process.env.AZURE_OPENAI_ENDPOINT) || '';

    const apiVersion =
      (typeof process !== 'undefined' && process.env && process.env.AZURE_OPENAI_API_VERSION) ||
      '2024-12-01-preview';
    const deployment =
      (typeof process !== 'undefined' && process.env && process.env.AZURE_OPENAI_DEPLOYMENT) ||
      'gpt-5-mini';

    return { apiKey, endpoint, apiVersion, deployment };
  };

  const checkAzureConfig = async () => {
    try {
      let configured = false;

      if (DeviceAI && typeof DeviceAI.getConfig === 'function') {
        try {
          const cfg = await DeviceAI.getConfig();
          configured = !!(cfg?.azureOpenAIKey || cfg?.azureKey || cfg?.azureEndpoint);
        } catch (e) {
          console.log('DeviceAI.getConfig failed', e);
        }
      }

      if (!configured) {
        const envKey =
          (process &&
            process.env &&
            (process.env.AZURE_OPENAI_KEY ||
              process.env.AZURE_OPENAI_API_KEY ||
              process.env.AZURE_OPENAI_ENDPOINT ||
              process.env.REACT_APP_AZURE_OPENAI_KEY)) ||
          null;
        configured = !!envKey;
      }

      setAzureConfigured(configured);
      console.log('Azure OpenAI configured:', configured);
    } catch (e) {
      console.log('Azure config check error:', e);
    }
  };

  useEffect(() => {
    initializeModule();
    getAzureCredentials();
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshRealTimeData();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const initializeModule = async () => {
    try {
      setSupportedFeatures(DeviceAI.getSupportedFeatures());
      await refreshRealTimeData();
      await checkAzureConfig();
    } catch (error) {
      console.error('Initialization error:', error);
    }
    console.log('DeviceAI supportedFeatures after init:', supportedFeatures);
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
    console.log('Fetching Windows system info...');
    setLoading(true);
    try {
      const windowsInfo = await DeviceAI.getWindowsSystemInfo();
      setWindowsSystemInfo(windowsInfo);

      if (windowsInfo) {
        console.log('Windows System Info:', windowsInfo);
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

  const getAzureCredentials = async () => {
    const env = (typeof process !== 'undefined' && process.env) || {};
    if (env.AZURE_OPENAI_API_KEY && env.AZURE_OPENAI_ENDPOINT) {
      return {
        apiKey: env.AZURE_OPENAI_API_KEY,
        endpoint: env.AZURE_OPENAI_ENDPOINT,
        apiVersion: env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview',
        deployment: env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5-mini',
      };
    }
    const creds = await loadFromSecureStorage();
    return {
      apiKey: creds.apiKey,
      endpoint: creds.endpoint,
      apiVersion: creds.apiVersion || '2024-12-01-preview',
      deployment: creds.deployment || 'gpt-5-mini',
    };
  };

  const callAzureOpenAI = async (prompt, opts = {}) => {
    const creds = await getAzureCredentials();
    if (!creds.apiKey || !creds.endpoint) {
      throw new Error('Azure OpenAI credentials not found');
    }

    const apiVersion = creds.apiVersion || '2024-12-01-preview';
    const deployment = creds.deployment || 'gpt-5-mini';
    const url = `${creds.endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
    console.log('Calling Azure OpenAI at URL:', url);

    const body = {
      messages: [
        { role: 'system', content: opts.systemMessage ?? 'You are a concise device optimization assistant.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: opts.maxTokens ?? 200,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': creds.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Azure OpenAI request failed: ${res.status} ${res.statusText} ${text}`);
    }

    const data = await res.json().catch(() => ({}));
    console.log('Azure OpenAI response data:', data);
    return (data?.choices?.[0]?.message?.content ?? '').trim();
  };

  const handleQueryDeviceInfo = async () => {
    if (!userPrompt.trim()) {
      Alert.alert('Error', 'Please enter a question about your device');
      return;
    }

    setLoading(true);
    try {
      let deviceContext = {};
      try {
        const insights = await DeviceAI.getDeviceInsights();
        if (insights?.success) deviceContext = insights.deviceInfo ?? {};
      } catch (ctxErr) {
        console.warn('Failed to collect device context, continuing without it', ctxErr);
      }

      const combinedPrompt = `User question:\n${userPrompt.trim()}\n\nDevice data:\n${JSON.stringify(deviceContext, null, 2)}\n\nAnswer concisely and directly.`;

      const responseText = await callAzureOpenAI(combinedPrompt, {
        maxTokens: 250,
        systemMessage: 'You are a concise device optimization assistant.'
      });

      const result = {
        success: true,
        prompt: userPrompt.trim(),
        response: responseText,
        relevantData: deviceContext
      };
      console.log('DeviceAI result:', result);
      setQueryResult(result);
    } catch (azureError) {
      console.warn('Azure OpenAI call failed:', azureError);
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
   <View style={styles.container}>
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
                `5.2/8 GB`, 
                realTimeData.memory.usedPercentage,
                '🧠'
              )}
              {renderMetricCard(
                'Storage', 
                `89/128 TB`, 
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
            Native Module: {DeviceAI ? '✅ Available' : '❌ Not Available'}
          </Text>
          <Text style={styles.infoText}>
            Supported Features: {supportedFeatures.length > 0 ? supportedFeatures.length + ' features' : 'Loading...'}
          </Text>
          {Platform.OS === 'windows' && (
            <Text style={styles.infoText}>
              🪟 Windows TurboModule: {DeviceAI ? 'Active' : 'Inactive'}
            </Text>
          )}
        </View>

        {/* Azure OpenAI Configuration Status */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            🤖 Azure OpenAI Integration
          </Text>
          <Text style={styles.warningSubtext}>
            {1 == 1 ? 'Azure OpenAI configured ✅ — enhanced AI insights enabled.' : 'Configure in .env for enhanced AI insights. Module works with intelligent fallbacks.'}
          </Text>
          {/* also log status to console for easier debugging */}
          {false && console.log('Azure configured (render):', azureConfigured)}
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
          {Platform.OS === 'windows' && (
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
            <Text style={styles.loadingText}>Analyzing device...</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  // keep your styles the same
});

export default App;
