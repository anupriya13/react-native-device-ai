/**
 * Real MCP Client implementation using @modelcontextprotocol/sdk
 * Provides actual Model Context Protocol support for react-native-device-ai
 */

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { SSEClientTransport } = require('mcp-sdk-client-ssejs');
const { Platform } = require('react-native');
const WindowsMCPServer = require('./WindowsMCPServer');
const AndroidMCPServer = require('./AndroidMCPServer');
const iOSMCPServer = require('./iOSMCPServer');

/**
 * Real MCP Client using actual Model Context Protocol
 */
class RealMCPClient {
  constructor() {
    this.clients = new Map(); // MCP client connections
    this.servers = new Map(); // Local server instances  
    this.isInitialized = false;
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      enableFallback: true,
      transports: {
        default: 'sse', // sse, stdio, or custom
        allowInsecure: false
      }
    };
  }

  /**
   * Initialize real MCP client with configuration
   * @param {Object} config - MCP configuration
   * @param {number} config.timeout - Request timeout in milliseconds
   * @param {number} config.retryAttempts - Number of retry attempts
   * @param {boolean} config.enableFallback - Enable fallback to non-MCP providers
   * @param {Object} config.transports - Transport configuration
   */
  async initialize(config = {}) {
    try {
      this.config = { ...this.config, ...config };
      
      console.log('🔌 Initializing Real MCP Client...');
      
      // Initialize local OS-specific servers first
      await this._initializeLocalServers();
      
      // Initialize external MCP server connections
      await this._initializeExternalConnections();
      
      this.isInitialized = true;
      console.log('✅ Real MCP Client initialized successfully');
      
      return {
        success: true,
        clients: Array.from(this.clients.keys()),
        localServers: Array.from(this.servers.keys()),
        protocol: 'MCP/1.0',
        transports: Object.keys(this._getAvailableTransports())
      };
    } catch (error) {
      console.error('❌ Failed to initialize Real MCP client:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Connect to an external MCP server
   * @param {Object} serverConfig - Server configuration
   * @param {string} serverConfig.name - Server name
   * @param {string} serverConfig.url - Server URL for SSE transport
   * @param {string} serverConfig.transport - Transport type ('sse', 'stdio', 'custom')
   * @param {Object} serverConfig.auth - Authentication configuration
   */
  async connectServer(serverConfig) {
    try {
      const { name, url, transport = 'sse', auth } = serverConfig;
      
      if (!name || !url) {
        throw new Error('Server configuration must include name and url');
      }

      let client;
      let transportInstance;

      // Create appropriate transport
      switch (transport) {
        case 'sse':
          transportInstance = new SSEClientTransport(url, {
            headers: this._buildAuthHeaders(auth)
          });
          break;
          
        case 'stdio':
          // For stdio transport (not supported in React Native directly)
          throw new Error('STDIO transport not supported in React Native environment');
          
        default:
          throw new Error(`Unsupported transport type: ${transport}`);
      }

      // Create MCP client with transport
      client = new Client(
        {
          name: `react-native-device-ai-${name}`,
          version: '3.0.0'
        },
        {
          capabilities: {
            roots: {
              listChanged: true
            },
            sampling: {}
          }
        }
      );

      // Connect to server
      await client.connect(transportInstance);
      
      // Initialize the connection
      const initResult = await client.initialize();
      console.log(`✅ Connected to MCP server: ${name}`, {
        protocolVersion: initResult.protocolVersion,
        capabilities: initResult.capabilities,
        serverInfo: initResult.serverInfo
      });

      // Store client connection
      this.clients.set(name, {
        client,
        transport: transportInstance,
        config: serverConfig,
        serverInfo: initResult.serverInfo,
        capabilities: initResult.capabilities,
        connected: true,
        lastUsed: null
      });

      return { 
        success: true, 
        server: name,
        protocolVersion: initResult.protocolVersion,
        capabilities: initResult.capabilities
      };
    } catch (error) {
      console.error(`❌ Failed to connect to MCP server ${serverConfig.name}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * List available tools from connected MCP servers
   * @param {string} serverName - Specific server name (optional)
   */
  async listTools(serverName = null) {
    if (!this.isInitialized) {
      throw new Error('MCP client not initialized. Call initialize() first.');
    }

    const results = {};
    const clientsToQuery = serverName 
      ? [this.clients.get(serverName)].filter(Boolean)
      : Array.from(this.clients.values());

    for (const clientInfo of clientsToQuery) {
      try {
        if (!clientInfo.connected) continue;
        
        const tools = await clientInfo.client.listTools();
        results[clientInfo.config.name] = {
          tools: tools.tools,
          serverInfo: clientInfo.serverInfo
        };
      } catch (error) {
        console.error(`Failed to list tools from ${clientInfo.config.name}:`, error);
        results[clientInfo.config.name] = { error: error.message };
      }
    }

    return results;
  }

  /**
   * Call a tool on a specific MCP server
   * @param {string} serverName - Server name
   * @param {string} toolName - Tool name
   * @param {Object} toolArguments - Tool arguments
   */
  async callTool(serverName, toolName, toolArguments = {}) {
    if (!this.isInitialized) {
      throw new Error('MCP client not initialized. Call initialize() first.');
    }

    const clientInfo = this.clients.get(serverName);
    if (!clientInfo || !clientInfo.connected) {
      throw new Error(`Server ${serverName} not connected`);
    }

    try {
      clientInfo.lastUsed = new Date().toISOString();
      
      const result = await clientInfo.client.callTool({
        name: toolName,
        arguments: toolArguments
      });

      return {
        success: true,
        result: result.content,
        server: serverName,
        tool: toolName,
        timestamp: clientInfo.lastUsed
      };
    } catch (error) {
      console.error(`Failed to call tool ${toolName} on server ${serverName}:`, error);
      throw error;
    }
  }

  /**
   * Generate insights using MCP tools with device data
   * @param {Object} deviceData - Device information
   * @param {string} type - Type of insights ('general', 'battery', 'performance')
   * @param {Array} preferredServers - Ordered list of preferred servers
   */
  async generateInsights(deviceData, type = 'general', preferredServers = []) {
    if (!this.isInitialized) {
      throw new Error('MCP client not initialized. Call initialize() first.');
    }

    const servers = preferredServers.length > 0 
      ? preferredServers 
      : Array.from(this.clients.keys());

    // Try to find a server with analysis capabilities
    for (const serverName of servers) {
      try {
        const clientInfo = this.clients.get(serverName);
        if (!clientInfo || !clientInfo.connected) continue;

        // Check if server has analysis tools
        const tools = await clientInfo.client.listTools();
        const analysisTool = tools.tools.find(tool => 
          tool.name.includes('analyze') || 
          tool.name.includes('insight') ||
          tool.name.includes('recommend')
        );

        if (analysisTool) {
          const result = await this.callTool(serverName, analysisTool.name, {
            deviceData,
            analysisType: type
          });

          return {
            success: true,
            insights: result.result,
            server: serverName,
            tool: analysisTool.name,
            protocol: 'MCP/1.0',
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        console.log(`Server ${serverName} failed: ${error.message}, trying next...`);
      }
    }

    // Fallback to local servers if no external servers have analysis tools
    return await this._generateLocalInsights(deviceData, type);
  }

  /**
   * Collect enhanced device data using local MCP servers
   * @param {Array} serverNames - Specific servers to query
   */
  async collectDeviceData(serverNames = []) {
    const servers = serverNames.length > 0 
      ? serverNames 
      : Array.from(this.servers.keys());

    const deviceData = {};
    const errors = [];

    for (const serverName of servers) {
      try {
        const server = this.servers.get(serverName);
        if (!server || !server.isConnected()) {
          console.log(`Local server ${serverName} not available`);
          continue;
        }

        const data = await server.collectData();
        deviceData[serverName] = {
          ...data,
          protocol: 'MCP-Local',
          serverType: server.getType()
        };
      } catch (error) {
        errors.push({ server: serverName, error: error.message });
        console.error(`Failed to collect data from local server ${serverName}:`, error);
      }
    }

    return {
      success: errors.length === 0,
      data: deviceData,
      errors: errors,
      servers: servers,
      protocol: 'MCP/1.0'
    };
  }

  /**
   * Get status of all MCP connections
   */
  getConnectionStatus() {
    const status = {
      protocol: 'MCP/1.0',
      initialized: this.isInitialized,
      externalConnections: {},
      localServers: {}
    };
    
    // External MCP server connections
    for (const [name, clientInfo] of this.clients) {
      status.externalConnections[name] = {
        connected: clientInfo.connected,
        transport: clientInfo.transport.constructor.name,
        serverInfo: clientInfo.serverInfo,
        capabilities: clientInfo.capabilities,
        lastUsed: clientInfo.lastUsed
      };
    }
    
    // Local servers
    for (const [name, server] of this.servers) {
      status.localServers[name] = {
        connected: server.isConnected(),
        type: server.getType(),
        capabilities: server.getCapabilities(),
        lastCollected: server.getLastCollected()
      };
    }
    
    return status;
  }

  /**
   * Disconnect from all MCP servers
   */
  async disconnect() {
    const disconnectPromises = [];
    
    // Disconnect external connections
    for (const [name, clientInfo] of this.clients) {
      disconnectPromises.push(
        clientInfo.client.close().catch(error => 
          console.error(`Failed to disconnect from ${name}:`, error)
        )
      );
    }
    
    // Disconnect local servers
    for (const [name, server] of this.servers) {
      disconnectPromises.push(
        server.disconnect().catch(error => 
          console.error(`Failed to disconnect local server ${name}:`, error)
        )
      );
    }
    
    await Promise.allSettled(disconnectPromises);
    
    this.clients.clear();
    this.servers.clear();
    this.isInitialized = false;
    
    console.log('🔌 Disconnected from all MCP servers');
  }

  /**
   * Initialize local OS-specific MCP servers
   * @private
   */
  async _initializeLocalServers() {
    try {
      let osServer;
      
      switch (Platform.OS) {
        case 'windows':
          osServer = new WindowsMCPServer();
          break;
        case 'android':
          osServer = new AndroidMCPServer();
          break;
        case 'ios':
          osServer = new iOSMCPServer();
          break;
        default:
          console.log(`No OS-specific MCP server available for platform: ${Platform.OS}`);
          return;
      }

      if (osServer && osServer.isAvailable()) {
        await osServer.connect();
        this.servers.set(osServer.name, osServer);
        console.log(`✅ Local ${Platform.OS} MCP server initialized`);
      }
    } catch (error) {
      console.error('Failed to initialize local MCP servers:', error);
      // Don't throw - continue with external connections
    }
  }

  /**
   * Initialize external MCP server connections from environment
   * @private
   */
  async _initializeExternalConnections() {
    // Try to connect to predefined MCP servers from environment variables
    const externalServers = [
      {
        name: 'ai-analysis-server',
        url: process.env.MCP_AI_SERVER_URL,
        transport: 'sse',
        auth: {
          type: 'bearer',
          token: process.env.MCP_AI_SERVER_TOKEN
        }
      },
      {
        name: 'device-insights-server', 
        url: process.env.MCP_DEVICE_SERVER_URL,
        transport: 'sse',
        auth: {
          type: 'api-key',
          apiKey: process.env.MCP_DEVICE_SERVER_KEY
        }
      }
    ];

    for (const serverConfig of externalServers) {
      if (serverConfig.url) {
        try {
          await this.connectServer(serverConfig);
        } catch (error) {
          console.log(`Optional MCP server ${serverConfig.name} not available:`, error.message);
        }
      }
    }
  }

  /**
   * Build authentication headers for transport
   * @private
   */
  _buildAuthHeaders(auth) {
    if (!auth) return {};

    switch (auth.type) {
      case 'bearer':
        return { 'Authorization': `Bearer ${auth.token}` };
      case 'api-key':
        return { 'X-API-Key': auth.apiKey };
      case 'basic':
        const encoded = btoa(`${auth.username}:${auth.password}`);
        return { 'Authorization': `Basic ${encoded}` };
      default:
        return {};
    }
  }

  /**
   * Get available transport types
   * @private
   */
  _getAvailableTransports() {
    return {
      sse: 'Server-Sent Events (React Native compatible)',
      // stdio: 'Standard I/O (Node.js only)', // Not supported in RN
      // custom: 'Custom transport implementation'
    };
  }

  /**
   * Generate insights using local servers as fallback
   * @private
   */
  async _generateLocalInsights(deviceData, type) {
    try {
      // Use local OS-specific server for analysis
      const osServerName = `${Platform.OS}-device-server`;
      const osServer = this.servers.get(osServerName);
      
      if (osServer && osServer.isConnected()) {
        // Simulate tool call on local server
        const insights = await osServer.generateInsights(deviceData, type);
        
        return {
          success: true,
          insights,
          server: osServerName,
          tool: 'local-analysis',
          protocol: 'MCP-Local',
          timestamp: new Date().toISOString()
        };
      }
      
      throw new Error('No available MCP servers for insight generation');
    } catch (error) {
      throw new Error(`Local insight generation failed: ${error.message}`);
    }
  }
}

module.exports = RealMCPClient;