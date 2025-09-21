/**
 * Jest setup file for react-native-device-ai
 */

// Mock react-native modules for Node.js testing environment
const mockReactNative = {
  Platform: {
    OS: 'ios',
    Version: '16.0',
  },
  Dimensions: {
    get: jest.fn((type) => {
      if (type === 'screen') {
        return {
          width: 375,
          height: 812,
          scale: 2,
          fontScale: 1,
        };
      }
      return {
        width: 375,
        height: 812,
      };
    }),
  },
};

// Export for moduleNameMapper
module.exports = mockReactNative;

// Mock react-native module
jest.mock('react-native', () => mockReactNative);

// Mock axios for Azure OpenAI tests
jest.mock('axios');

// Mock MCP SDK modules
jest.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({}),
    disconnect: jest.fn().mockResolvedValue({}),
    listResources: jest.fn().mockResolvedValue({ resources: [] }),
    listTools: jest.fn().mockResolvedValue({ tools: [] }),
    callTool: jest.fn().mockResolvedValue({ result: {} })
  }))
}));

jest.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: jest.fn().mockImplementation(() => ({
    registerTool: jest.fn(),
    registerResource: jest.fn(),
    connect: jest.fn().mockResolvedValue({}),
    name: 'test-server'
  }))
}));

jest.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('mcp-sdk-client-ssejs', () => ({
  SSEClientTransport: jest.fn().mockImplementation(() => ({}))
}));

// Global test timeout
jest.setTimeout(10000);

// Suppress console warnings/errors during tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});