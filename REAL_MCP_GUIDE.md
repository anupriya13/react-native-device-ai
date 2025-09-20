# Real MCP Protocol Integration

This document explains how to use the actual Model Context Protocol (MCP) in the react-native-device-ai package.

## Overview

The package now supports **real MCP protocol** in addition to the existing mock implementation. This enables connecting to external MCP servers and using standardized MCP tools and resources.

## Transport Protocols

### Supported in React Native
- **SSE (Server-Sent Events)** - Primary transport for React Native apps
- **HTTP/HTTPS** - For REST-like interactions with MCP servers

### Not Supported in React Native
- **STDIO** - Not available in React Native environment (Node.js only)
- **WebSocket** - Not yet implemented (future enhancement)

## MCP Servers and Clients

### External MCP Servers (via Network)
Connect to external MCP servers using the real MCP protocol:

```javascript
// Initialize with real MCP
await Enhanced.initializeMCP({ 
  useRealMCP: true,
  transports: { default: 'sse' }
});

// Connect to external MCP server
await Enhanced.addMCPServer({
  name: 'ai-analysis-server',
  url: 'https://your-mcp-server.com/mcp',
  transport: 'sse',
  auth: {
    type: 'bearer',
    token: 'your-auth-token'
  }
});
```

### Local MCP Servers (OS-Specific)
Built-in servers that provide OS-specific device data:

1. **WindowsMCPServer** - Windows device data via TurboModule
2. **AndroidMCPServer** - Android device data collection  
3. **iOSMCPServer** - iOS device data collection

These run locally and provide device-specific capabilities without network transport.

## Usage Examples

### Basic Real MCP Usage

```javascript
import { Enhanced } from 'react-native-device-ai';

// Initialize with real MCP protocol
const mcpResult = await Enhanced.initializeMCP({
  useRealMCP: true,
  timeout: 30000,
  transports: {
    default: 'sse',
    allowInsecure: false
  }
});

if (mcpResult.success) {
  console.log('Real MCP enabled!');
  console.log('Protocol:', mcpResult.protocol); // MCP/1.0
  console.log('External connections:', mcpResult.clients);
  console.log('Local servers:', mcpResult.localServers);
}
```

### Connecting to External MCP Servers

```javascript
// AI Analysis Server
await Enhanced.addMCPServer({
  name: 'ai-insights',
  url: 'https://ai-server.example.com/mcp',
  transport: 'sse',
  auth: {
    type: 'api-key',
    apiKey: process.env.AI_SERVER_KEY
  }
});

// Device Monitoring Server
await Enhanced.addMCPServer({
  name: 'device-monitor',
  url: 'https://monitor.example.com/mcp',
  transport: 'sse',
  auth: {
    type: 'bearer',
    token: process.env.MONITOR_TOKEN
  }
});
```

### Getting Device Insights with Real MCP

```javascript
const insights = await Enhanced.getDeviceInsights({
  preferredProviders: ['ai-insights', 'device-monitor'],
  includeOSSpecific: true
});

console.log('Using Real MCP:', insights.usingRealMCP);
console.log('Connection Status:', insights.providers);
console.log('AI Insights:', insights.insights);
```

## Environment Configuration

Set these environment variables to enable external MCP servers:

```bash
# AI Analysis Server
MCP_AI_SERVER_URL=https://your-ai-server.com/mcp
MCP_AI_SERVER_TOKEN=your-bearer-token

# Device Insights Server  
MCP_DEVICE_SERVER_URL=https://device-server.com/mcp
MCP_DEVICE_SERVER_KEY=your-api-key

# Demo Server (for testing)
MCP_DEMO_SERVER_URL=http://localhost:3000/mcp
MCP_DEMO_API_KEY=demo-key
```

## Authentication Types

### Bearer Token
```javascript
auth: {
  type: 'bearer',
  token: 'your-bearer-token'
}
```

### API Key
```javascript
auth: {
  type: 'api-key',
  apiKey: 'your-api-key'
}
```

### Basic Authentication
```javascript
auth: {
  type: 'basic',
  username: 'your-username',
  password: 'your-password'
}
```

## MCP Tools and Resources

### Listing Available Tools
```javascript
// List tools from all connected servers
const tools = await Enhanced.realMcpClient.listTools();

// List tools from specific server
const specificTools = await Enhanced.realMcpClient.listTools('ai-insights');
```

### Calling MCP Tools
```javascript
const result = await Enhanced.realMcpClient.callTool(
  'ai-insights',
  'analyze-device',
  {
    deviceData: myDeviceData,
    analysisType: 'performance'
  }
);
```

## Migration from Mock to Real MCP

### Option 1: Flag-based Migration
```javascript
// Use environment variable to control MCP type
const useRealMCP = process.env.ENABLE_REAL_MCP === 'true';

await Enhanced.initializeMCP({ 
  useRealMCP,
  // ... other config
});
```

### Option 2: Gradual Migration
```javascript
// Start with mock, gradually enable real MCP
let mcpConfig = { useRealMCP: false };

if (hasExternalMCPServers()) {
  mcpConfig.useRealMCP = true;
}

await Enhanced.initializeMCP(mcpConfig);
```

## Error Handling

```javascript
try {
  await Enhanced.initializeMCP({ useRealMCP: true });
} catch (error) {
  console.log('Real MCP failed, falling back to mock:', error.message);
  
  // Fallback to mock implementation
  await Enhanced.initializeMCP({ useRealMCP: false });
}
```

## Development and Testing

### Run MCP Tests
```bash
# Test MCP SDK integration
npm run test:mcp

# Test real MCP demo
node real-mcp-demo.js

# Test MCP SDK only
node test-mcp-sdk.js
```

### Mock vs Real MCP Comparison

| Feature | Mock MCP | Real MCP |
|---------|----------|----------|
| External Servers | ❌ Simulated | ✅ Real connections |
| Protocol Compliance | ❌ Custom | ✅ MCP/1.0 standard |
| Transport | Local only | SSE, HTTP/HTTPS |
| Tools & Resources | ❌ Mock data | ✅ Real MCP tools |
| Authentication | ❌ Simulated | ✅ Real auth |
| Development | ✅ Zero setup | Requires MCP servers |

## Future Enhancements

- **WebSocket Transport** - For real-time bidirectional communication
- **STDIO Adapter** - Bridge for Node.js-based MCP servers
- **Resource Subscriptions** - Real-time updates from MCP servers
- **Tool Discovery** - Automatic discovery of available MCP tools
- **Prompt Templates** - Use server-provided prompt templates

## Dependencies

The real MCP implementation uses these packages:

- `@modelcontextprotocol/sdk` - Official MCP SDK
- `mcp-sdk-client-ssejs` - React Native compatible SSE transport

Both are automatically installed when you install react-native-device-ai v3.0.0+.

## Conclusion

Real MCP protocol support enables powerful integrations with external AI services and device monitoring platforms while maintaining backward compatibility with the existing mock implementation.