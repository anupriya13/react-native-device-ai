/**
 * Test for OS-specific MCP server functionality
 */

const { Platform } = require('react-native');

// Mock Platform.OS for testing different platforms
const originalPlatformOS = Platform.OS;

describe('OS-Specific MCP Servers', () => {
  let Enhanced;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Fresh import to reset state
    delete require.cache[require.resolve('../src/EnhancedDeviceAI.js')];
    Enhanced = require('../src/EnhancedDeviceAI.js');
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

    const enhanced = new Enhanced();
    const result = await enhanced.initializeMCP();

    expect(result.success).toBe(true);
    expect(result.dataSources).toContain('windows-device-server');
  });

  test('Android MCP server should be initialized on Android platform', async () => {
    // Mock Android platform
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      writable: true
    });

    const enhanced = new Enhanced();
    const result = await enhanced.initializeMCP();

    expect(result.success).toBe(true);
    expect(result.dataSources).toContain('android-device-server');
  });

  test('iOS MCP server should be initialized on iOS platform', async () => {
    // Mock iOS platform
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
      writable: true
    });

    const enhanced = new Enhanced();
    const result = await enhanced.initializeMCP();

    expect(result.success).toBe(true);
    expect(result.dataSources).toContain('ios-device-server');
  });

  test('Should collect OS-specific data when includeOSSpecific is true', async () => {
    // Mock Windows platform for this test
    Object.defineProperty(Platform, 'OS', {
      value: 'windows',
      writable: true
    });

    const enhanced = new Enhanced();
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
    const enhanced = new Enhanced();
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

    const WindowsMCPServer = require('../src/WindowsMCPServer.js').default;
    const server = new WindowsMCPServer();

    expect(server.isAvailable()).toBe(true);
    expect(server.getCapabilities()).toContain('windows-system-info');
    expect(server.getCapabilities()).toContain('wmi-data-collection');
  });

  test('Android MCP server should collect Android-specific data', async () => {
    // Mock Android platform
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      writable: true
    });

    const AndroidMCPServer = require('../src/AndroidMCPServer.js').default;
    const server = new AndroidMCPServer();

    expect(server.isAvailable()).toBe(true);
    expect(server.getCapabilities()).toContain('android-system-info');
    expect(server.getCapabilities()).toContain('sensor-data-collection');
  });

  test('iOS MCP server should collect iOS-specific data', async () => {
    // Mock iOS platform
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
      writable: true
    });

    const iOSMCPServer = require('../src/iOSMCPServer.js').default;
    const server = new iOSMCPServer();

    expect(server.isAvailable()).toBe(true);
    expect(server.getCapabilities()).toContain('ios-system-info');
    expect(server.getCapabilities()).toContain('core-motion-data');
  });

  test('Should gracefully handle unavailable OS-specific servers', async () => {
    // Mock unsupported platform
    Object.defineProperty(Platform, 'OS', {
      value: 'web',
      writable: true
    });

    const enhanced = new Enhanced();
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

    const enhanced = new Enhanced();
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
    const enhanced = new Enhanced();
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