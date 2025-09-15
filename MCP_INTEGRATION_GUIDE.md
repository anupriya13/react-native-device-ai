# MCP (Model Context Protocol) Integration Guide

## Overview

The react-native-device-ai module now supports **MCP (Model Context Protocol)**, providing standardized connections to multiple AI providers and enhanced device data sources. This integration enables:

- **Multi-Provider AI Support**: Connect to Azure OpenAI, OpenAI, Anthropic, and local models
- **Enhanced Device Context**: Real-time system monitoring and enterprise device management
- **Automatic Failover**: Seamless switching between AI providers
- **Cost Optimization**: Route requests to the most cost-effective provider
- **Standardized Tool Access**: Unified interface for device monitoring tools

## Quick Start

### Basic Usage

```javascript
import { Enhanced } from 'react-native-device-ai';

// Initialize MCP with default configuration
await Enhanced.initializeMCP();

// Get device insights with multi-provider AI support
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['azure-openai', 'openai', 'anthropic']
});

console.log('AI Provider Used:', insights.providers);
console.log('Enhanced Device Data:', insights.deviceInfo.mcpData);
```

### Advanced Configuration

```javascript
import { Enhanced, MCPClient } from 'react-native-device-ai';

// Initialize with custom MCP configuration
await Enhanced.initializeMCP({
  timeout: 30000,
  retryAttempts: 3,
  enableFallback: true
});

// Add custom AI provider
await Enhanced.addMCPServer({
  name: 'claude-ai',
  type: 'ai-provider',
  endpoint: 'https://api.anthropic.com',
  auth: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    type: 'x-api-key'
  }
});

// Add enterprise data source
await Enhanced.addMCPServer({
  name: 'enterprise-mdm',
  type: 'data-source',
  endpoint: 'https://mdm.company.com/api',
  auth: {
    apiKey: process.env.ENTERPRISE_API_KEY,
    type: 'bearer'
  }
});
```

## MCP Configuration

### Environment Variables

Set up multiple AI providers using environment variables:

```bash
# Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com

# OpenAI
OPENAI_API_KEY=sk-your_openai_key

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key

# Enterprise
ENTERPRISE_MDM_API_KEY=your_enterprise_key
```

### Manual Configuration

```javascript
const mcpConfig = {
  timeout: 30000,           // Request timeout (ms)
  retryAttempts: 3,         // Number of retries per provider
  enableFallback: true      // Enable fallback to non-MCP providers
};

await Enhanced.initializeMCP(mcpConfig);
```

## AI Provider Management

### Supported Providers

| Provider | Type | Configuration |
|----------|------|---------------|
| Azure OpenAI | `ai-provider` | API key + endpoint |
| OpenAI | `ai-provider` | API key |
| Anthropic Claude | `ai-provider` | API key |
| Local LLM | `ai-provider` | Local endpoint |
| Enterprise AI | `ai-provider` | Custom endpoint + auth |

### Provider Prioritization

```javascript
// Cost-optimized ordering (cheapest first)
const costOptimized = {
  preferredProviders: ['local-llm', 'azure-openai', 'openai', 'anthropic']
};

// Performance-optimized ordering (fastest first)
const performanceOptimized = {
  preferredProviders: ['azure-openai', 'openai', 'anthropic', 'local-llm']
};

// Feature-optimized ordering (most capable first)
const featureOptimized = {
  preferredProviders: ['anthropic', 'openai', 'azure-openai', 'local-llm']
};

const insights = await Enhanced.getDeviceInsights(costOptimized);
```

### Provider Status Monitoring

```javascript
const status = Enhanced.getMCPStatus();

console.log('MCP Enabled:', status.enabled);
console.log('Provider Status:', status.providers);
console.log('Data Sources:', status.dataSources);

// Example output:
{
  enabled: true,
  providers: {
    'azure-openai': {
      connected: true,
      type: 'ai-provider',
      capabilities: ['text-generation', 'analysis'],
      lastUsed: '2023-12-07T10:30:00Z'
    },
    'openai': {
      connected: true,
      type: 'ai-provider',
      capabilities: ['text-generation', 'analysis'],
      lastUsed: null
    }
  }
}
```

## Enhanced Device Data Collection

### Available Data Sources

| Data Source | Type | Capabilities |
|-------------|------|--------------|
| `system-monitor` | `data-source` | CPU, memory, disk usage |
| `battery-monitor` | `data-source` | Battery level, charging state |
| `network-monitor` | `data-source` | Network connectivity, usage |
| `enterprise-mdm` | `data-source` | Enterprise device policies |

### Selective Data Collection

```javascript
// Collect specific data sources
const insights = await Enhanced.getDeviceInsights({
  dataSources: ['system-monitor', 'battery-monitor']
});

// Access MCP-collected data
console.log('System Metrics:', insights.deviceInfo.mcpData['system-monitor']);
console.log('Battery Metrics:', insights.deviceInfo.mcpData['battery-monitor']);
```

### Real-time Monitoring

```javascript
// Get enhanced battery advice with real-time data
const batteryAdvice = await Enhanced.getBatteryAdvice({
  dataSources: ['battery-monitor', 'system-monitor'],
  preferredProviders: ['azure-openai']
});

// Get performance tips with network insights
const performanceTips = await Enhanced.getPerformanceTips({
  dataSources: ['system-monitor', 'network-monitor'],
  preferredProviders: ['anthropic', 'openai']
});
```

## Natural Language Queries with MCP

### Enhanced Query Processing

```javascript
// Query with provider preference
const response = await Enhanced.queryDeviceInfo(
  "How is my battery performing compared to yesterday?",
  {
    preferredProviders: ['anthropic'], // Best for complex analysis
    includeContext: true
  }
);

// Query with specific data sources
const response2 = await Enhanced.queryDeviceInfo(
  "What's causing high memory usage?",
  {
    dataSources: ['system-monitor'],
    preferredProviders: ['azure-openai', 'openai']
  }
);
```

### Multi-Provider Responses

```javascript
// Compare responses from different providers
const query = "Should I be concerned about my device performance?";

const responses = await Promise.all([
  Enhanced.queryDeviceInfo(query, { preferredProviders: ['azure-openai'] }),
  Enhanced.queryDeviceInfo(query, { preferredProviders: ['anthropic'] }),
  Enhanced.queryDeviceInfo(query, { preferredProviders: ['openai'] })
]);

responses.forEach((response, index) => {
  console.log(`Provider ${index + 1} says:`, response.response);
});
```

## Enterprise Integration

### MDM (Mobile Device Management) Integration

```javascript
// Connect to enterprise MDM system
await Enhanced.addMCPServer({
  name: 'company-mdm',
  type: 'data-source',
  endpoint: 'https://mdm.company.com/api/v1',
  auth: {
    apiKey: process.env.COMPANY_MDM_KEY,
    type: 'bearer'
  }
});

// Get insights with enterprise context
const enterpriseInsights = await Enhanced.getDeviceInsights({
  dataSources: ['company-mdm', 'system-monitor'],
  preferredProviders: ['azure-openai'] // Enterprise-approved provider
});
```

### Compliance and Security

```javascript
// Add compliance monitoring
await Enhanced.addMCPServer({
  name: 'security-monitor',
  type: 'data-source',
  endpoint: 'https://security.company.com/device-compliance',
  auth: {
    apiKey: process.env.SECURITY_API_KEY,
    type: 'bearer'
  }
});

// Check device compliance
const complianceCheck = await Enhanced.queryDeviceInfo(
  "Is my device compliant with company security policies?",
  {
    dataSources: ['security-monitor'],
    preferredProviders: ['azure-openai']
  }
);
```

## Error Handling and Fallbacks

### Graceful Degradation

```javascript
try {
  // Try with MCP first
  await Enhanced.initializeMCP();
  const insights = await Enhanced.getDeviceInsights();
  
  if (!insights.mcpEnabled) {
    console.log('MCP not available, using fallback mode');
  }
} catch (error) {
  console.log('MCP initialization failed:', error.message);
  
  // Fallback to legacy API
  const DeviceAI = require('react-native-device-ai');
  const insights = await DeviceAI.getDeviceInsights();
}
```

### Provider Failover

```javascript
// MCP automatically handles provider failover
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: [
    'primary-provider',    // Try first
    'backup-provider',     // Try if first fails
    'emergency-provider'   // Last resort
  ]
});

// Check which provider was actually used
console.log('Successful provider:', insights.providers);
```

## Performance Optimization

### Caching Strategy

```javascript
// Device data is cached for 5 minutes by default
const insights1 = await Enhanced.getDeviceInsights(); // Fresh data
const insights2 = await Enhanced.getDeviceInsights(); // Cached data (faster)

// Force fresh data collection
await Enhanced.cleanup(); // Clear cache
const freshInsights = await Enhanced.getDeviceInsights();
```

### Concurrent Requests

```javascript
// Handle multiple requests efficiently
const requests = [
  Enhanced.getDeviceInsights(),
  Enhanced.getBatteryAdvice(),
  Enhanced.getPerformanceTips()
];

const [insights, battery, performance] = await Promise.all(requests);
```

### Cost Management

```javascript
// Use local models for frequent queries
const frequentQueryOptions = {
  preferredProviders: ['local-llm'] // No API costs
};

// Use premium providers for complex analysis
const complexQueryOptions = {
  preferredProviders: ['anthropic', 'openai'] // Better reasoning
};

const simpleResponse = await Enhanced.queryDeviceInfo(
  "What's my battery level?", 
  frequentQueryOptions
);

const complexResponse = await Enhanced.queryDeviceInfo(
  "Analyze my device's performance trends and recommend optimizations",
  complexQueryOptions
);
```

## Migration from Legacy API

### Backward Compatibility

```javascript
// Legacy code continues to work
import DeviceAI from 'react-native-device-ai';

DeviceAI.configure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT
});

const insights = await DeviceAI.getDeviceInsights();
```

### Gradual Migration

```javascript
// Phase 1: Initialize MCP alongside legacy
import DeviceAI, { Enhanced } from 'react-native-device-ai';

// Legacy configuration
DeviceAI.configure({ ... });

// Enhanced configuration
await Enhanced.initializeMCP();

// Phase 2: Use enhanced features gradually
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['azure-openai'] // Same provider as legacy
});

// Phase 3: Migrate to full MCP features
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['azure-openai', 'openai', 'anthropic'],
  dataSources: ['system-monitor', 'enterprise-mdm']
});
```

## Best Practices

### 1. Provider Selection Strategy

```javascript
// Development: Use free/cheap providers
const devOptions = {
  preferredProviders: ['local-llm', 'azure-openai']
};

// Production: Use reliable providers with fallbacks
const prodOptions = {
  preferredProviders: ['azure-openai', 'openai', 'anthropic']
};

// Offline: Use local providers only
const offlineOptions = {
  preferredProviders: ['local-llm']
};
```

### 2. Data Source Management

```javascript
// Basic monitoring
const basicSources = ['system-monitor', 'battery-monitor'];

// Enterprise monitoring
const enterpriseSources = [
  'system-monitor', 
  'battery-monitor', 
  'network-monitor',
  'enterprise-mdm',
  'security-monitor'
];

// Use appropriate sources for context
const insights = await Enhanced.getDeviceInsights({
  dataSources: isEnterprise ? enterpriseSources : basicSources
});
```

### 3. Error Recovery

```javascript
async function robustDeviceInsights() {
  try {
    // Try MCP first
    await Enhanced.initializeMCP();
    return await Enhanced.getDeviceInsights();
  } catch (mcpError) {
    console.log('MCP failed, trying legacy:', mcpError.message);
    
    try {
      // Fallback to legacy Azure OpenAI
      const DeviceAI = require('react-native-device-ai');
      return await DeviceAI.getDeviceInsights();
    } catch (legacyError) {
      console.log('All AI providers failed, using static insights');
      
      // Final fallback to static insights
      return {
        success: true,
        insights: "Your device appears to be running normally.",
        recommendations: ["Regular maintenance helps keep devices running smoothly."],
        timestamp: new Date().toISOString()
      };
    }
  }
}
```

### 4. Resource Cleanup

```javascript
// Always cleanup MCP resources
useEffect(() => {
  return () => {
    Enhanced.cleanup();
  };
}, []);

// Or in non-React environments
process.on('exit', async () => {
  await Enhanced.cleanup();
});
```

## Troubleshooting

### Common Issues

1. **MCP initialization fails**
   ```javascript
   // Check environment variables
   console.log('Azure OpenAI Key:', process.env.AZURE_OPENAI_API_KEY ? 'Set' : 'Missing');
   console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Missing');
   ```

2. **No providers available**
   ```javascript
   const status = Enhanced.getMCPStatus();
   if (!status.enabled) {
     console.log('MCP not enabled:', status.reason);
   }
   ```

3. **Slow responses**
   ```javascript
   // Use faster providers for quick queries
   const options = {
     preferredProviders: ['azure-openai'], // Usually fastest
     dataSources: ['system-monitor'] // Minimal data collection
   };
   ```

### Debug Mode

```javascript
// Enable debug logging
const mcpConfig = {
  timeout: 30000,
  retryAttempts: 3,
  enableFallback: true,
  debug: true // Add debug flag
};

await Enhanced.initializeMCP(mcpConfig);
```

## Future Enhancements

The MCP integration is designed to support future enhancements:

- **Real-time Streaming**: Live device monitoring with streaming updates
- **Machine Learning Models**: On-device ML for privacy-focused insights
- **IoT Integration**: Connect to IoT sensors and smart home devices
- **Custom Protocols**: Support for proprietary enterprise protocols
- **Edge Computing**: Distributed AI processing for better performance

---

**Next Steps**: Explore the [MCP Test Suite](./__tests__/mcp.test.js) for comprehensive examples and edge cases.