/**
 * Test for OS-specific MCP server functionality
 */

const { Platform } = require('react-native');

// Mock Platform.OS for testing different platforms
const originalPlatformOS = Platform.OS;

describe('OS-Specific MCP Servers', () => {
  let enhanced;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Fresh import to reset state
    delete require.cache[require.resolve('../src/EnhancedDeviceAI.js')];
    enhanced = require('../src/EnhancedDeviceAI.js');
  });

  afterEach(() => {
    // Restore original platform
    Object.defineProperty(Platform, 'OS', {
      value: originalPlatformOS,
      writable: true
    });
  });

  test('Windows MCP server should be initialized on Windows platform', async () => {
    // Mock Windows platform
    Object.defineProperty(Platform, 'OS', {
      value: 'windows',
      writable: true
    });

    const enhanced = require('../src/EnhancedDeviceAI.js');
    const result = await enhanced.initializeMCP();

    expect(result.success).toBe(true);
    expect(result.dataSources).toContain('windows-device-server');
  });

  test('Non-Windows platforms should not initialize MCP server', async () => {
    // Mock Android platform
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      writable: true
    });

    const enhanced = require('../src/EnhancedDeviceAI.js');
    const result = await enhanced.initializeMCP();

    expect(result.success).toBe(true);
    // Should not contain any OS-specific servers since only Windows is supported
    expect(result.dataSources).not.toContain('android-device-server');
  });

  test('iOS platform should not initialize MCP server', async () => {
    // Mock iOS platform
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
      writable: true
    });

    const enhanced = require('../src/EnhancedDeviceAI.js');
    const result = await enhanced.initializeMCP();

    expect(result.success).toBe(true);
    // Should not contain any OS-specific servers since only Windows is supported
    expect(result.dataSources).not.toContain('ios-device-server');
  });

  test('Should collect OS-specific data when includeOSSpecific is true', async () => {
    // Mock Windows platform for this test
    Object.defineProperty(Platform, 'OS', {
      value: 'windows',
      writable: true
    });

    const enhanced = require('../src/EnhancedDeviceAI.js');
    await enhanced.initializeMCP();

    const insights = await enhanced.getDeviceInsights({
      includeOSSpecific: true
    });

    expect(insights.success).toBe(true);
    expect(insights.osSpecific).toBe(true);
    expect(insights.deviceInfo.osSpecificData).toBeDefined();
    expect(insights.deviceInfo.osSpecificData.available).toBe(true);
    expect(insights.deviceInfo.osSpecificData.platform).toBe('windows');
  });

  test('Should not collect OS-specific data when includeOSSpecific is false', async () => {
    const enhanced = require('../src/EnhancedDeviceAI.js');
    await enhanced.initializeMCP();

    const insights = await enhanced.getDeviceInsights({
      includeOSSpecific: false
    });

    expect(insights.success).toBe(true);
    expect(insights.osSpecific).toBe(false);
    // OS-specific data should still be present but empty
    expect(insights.deviceInfo.osSpecificData).toEqual({});
  });

  test('Windows MCP server should collect Windows-specific data', async () => {
    // Mock Windows platform
    Object.defineProperty(Platform, 'OS', {
      value: 'windows',
      writable: true
    });

    const WindowsMCPServer = require('../src/WindowsMCPServer.js');
    const server = new WindowsMCPServer();

    expect(server.isAvailable()).toBe(true);
    expect(server.getCapabilities()).toContain('windows-system-info');
    expect(server.getCapabilities()).toContain('wmi-data-collection');
    expect(server.getMCPServer()).toBeDefined();
    expect(server.getMCPServer().name).toBe('react-native-device-ai-windows');
  });

  test('Non-Windows platforms should not have MCP servers available', async () => {
    // Mock Android platform
    Object.defineProperty(Platform, 'OS', {
      value: 'android', 
      writable: true
    });

    const WindowsMCPServer = require('../src/WindowsMCPServer.js');
    const server = new WindowsMCPServer();

    expect(server.isAvailable()).toBe(false);
  });

  test('iOS platform should not have Windows MCP server available', async () => {
    // Mock iOS platform
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
      writable: true
    });

    const WindowsMCPServer = require('../src/WindowsMCPServer.js');
    const server = new WindowsMCPServer();

    expect(server.isAvailable()).toBe(false);
  });

  test('Should gracefully handle unavailable OS-specific servers', async () => {
    // Mock unsupported platform
    Object.defineProperty(Platform, 'OS', {
      value: 'web',
      writable: true
    });

    const enhanced = require('../src/EnhancedDeviceAI.js');
    await enhanced.initializeMCP();

    const insights = await enhanced.getDeviceInsights({
      includeOSSpecific: true
    });

    expect(insights.success).toBe(true);
    expect(insights.deviceInfo.osSpecificData.available).toBe(false);
    expect(insights.deviceInfo.osSpecificData.reason).toContain('No OS-specific server available');
  });

  test('Should include OS-specific insights in natural language queries', async () => {
    // Mock Windows platform
    Object.defineProperty(Platform, 'OS', {
      value: 'windows',
      writable: true
    });

    const enhanced = require('../src/EnhancedDeviceAI.js');
    await enhanced.initializeMCP();

    const response = await enhanced.queryDeviceInfo(
      'Tell me about my Windows system',
      { includeOSSpecific: true }
    );

    expect(response.success).toBe(true);
    expect(response.response).toContain('Windows');
  });

  test('OS-specific servers should report correct platform capabilities', async () => {
    const platforms = [
      { os: 'windows', serverFile: '../src/WindowsMCPServer.js', expectedCapabilities: ['windows-system-info', 'wmi-data-collection'] },
      { os: 'android', serverFile: '../src/AndroidMCPServer.js', expectedCapabilities: ['android-system-info', 'sensor-data-collection'] },
      { os: 'ios', serverFile: '../src/iOSMCPServer.js', expectedCapabilities: ['ios-system-info', 'core-motion-data'] }
    ];

    for (const platform of platforms) {
      // Mock platform
      Object.defineProperty(Platform, 'OS', {
        value: platform.os,
        writable: true
      });

      const ServerClass = require(platform.serverFile).default;
      const server = new ServerClass();

      expect(server.platform).toBe(platform.os);
      expect(server.isAvailable()).toBe(true);
      
      for (const capability of platform.expectedCapabilities) {
        expect(server.getCapabilities()).toContain(capability);
      }
    }
  });

  test('Enhanced device insights should include MCP status and OS-specific data', async () => {
    const enhanced = require('../src/EnhancedDeviceAI.js');
    await enhanced.initializeMCP();

    const insights = await enhanced.getDeviceInsights();

    expect(insights).toMatchObject({
      success: true,
      mcpEnabled: true,
      osSpecific: true,
      deviceInfo: expect.objectContaining({
        mcpData: expect.any(Object),
        osSpecificData: expect.any(Object)
      }),
      providers: expect.any(Object),
      timestamp: expect.any(String)
    });
  });
});

module.exports = {};