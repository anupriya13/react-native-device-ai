/**
 * RAG Data Ingestion Guide
 * 
 * This example demonstrates various ways to add data/files for RAG data ingestion
 * in react-native-device-ai. The system supports multiple input methods and formats.
 */

const { Enhanced } = require('../index');
const fs = require('fs');
const path = require('path');

// Example data directory structure
const EXAMPLE_DATA = {
  // 1. Direct JSON data
  deviceGuides: [
    {
      id: 'ios-battery-optimization',
      content: `iOS Battery Optimization Best Practices:

1. Enable Low Power Mode when battery is below 20%
2. Reduce background app refresh for unused apps
3. Adjust screen brightness or enable auto-brightness
4. Turn off location services for apps that don't need it
5. Disable push notifications for non-essential apps
6. Use Wi-Fi instead of cellular data when possible
7. Close apps that are using excessive background processing
8. Keep iOS updated to the latest version
9. Avoid extreme temperatures that can damage battery health
10. Consider replacing battery if health drops below 80%`,
      metadata: { 
        platform: 'ios', 
        category: 'battery', 
        type: 'optimization-guide',
        source: 'internal-knowledge-base'
      },
      type: 'text'
    },
    {
      id: 'android-performance-troubleshooting',
      content: `Android Performance Troubleshooting Steps:

## Memory Issues
- Clear app cache: Settings > Apps > [App Name] > Storage > Clear Cache
- Restart device to free up RAM
- Uninstall unused apps

## Storage Issues  
- Delete old photos/videos or move to cloud storage
- Clear downloads folder
- Use storage analyzer tools

## Performance Issues
- Disable animations: Developer Options > Animation Scale > Off
- Limit background processes: Developer Options > Background Process Limit
- Update to latest Android version`,
      metadata: { 
        platform: 'android', 
        category: 'performance', 
        type: 'troubleshooting-guide',
        source: 'support-documentation'
      },
      type: 'markdown'
    }
  ],

  // 2. Device-specific knowledge base
  deviceKnowledgeBase: [
    {
      id: 'iphone-models-battery-capacity',
      content: JSON.stringify({
        iPhone: {
          "iPhone 14 Pro Max": { batteryCapacity: "4323 mAh", expectedLife: "29 hours video" },
          "iPhone 14 Pro": { batteryCapacity: "3200 mAh", expectedLife: "23 hours video" },
          "iPhone 14": { batteryCapacity: "3279 mAh", expectedLife: "20 hours video" },
          "iPhone 13": { batteryCapacity: "3240 mAh", expectedLife: "19 hours video" },
          "iPhone 12": { batteryCapacity: "2815 mAh", expectedLife: "17 hours video" }
        }
      }),
      metadata: { 
        platform: 'ios', 
        category: 'specifications', 
        type: 'device-database',
        dataType: 'structured'
      },
      type: 'json'
    }
  ]
};

/**
 * Utility function to load documents from various sources
 */
class RAGDataIngestion {
  constructor() {
    this.enhancedAI = new Enhanced();
  }

  /**
   * Initialize RAG system
   */
  async initialize() {
    const result = await this.enhancedAI.initializeMCP({
      enableRAG: true,
      enableLangChain: true,
      ragConfig: {
        apiKey: process.env.OPENAI_API_KEY || 'demo-key',
        chunkSize: 1000,
        maxDocuments: 500
      }
    });

    if (!result.success) {
      throw new Error(`Failed to initialize RAG: ${result.error}`);
    }

    console.log('✅ RAG system initialized successfully');
    return result;
  }

  /**
   * Method 1: Ingest from predefined data objects
   */
  async ingestPredefinedData() {
    console.log('\n📚 Method 1: Ingesting predefined data objects...');
    
    // Combine all predefined data
    const allDocuments = [
      ...EXAMPLE_DATA.deviceGuides,
      ...EXAMPLE_DATA.deviceKnowledgeBase
    ];

    const result = await this.enhancedAI.ingestDocuments(allDocuments);
    
    if (result.success) {
      console.log(`✅ Successfully ingested ${result.successful} documents`);
      console.log(`❌ Failed to ingest ${result.failed} documents`);
    } else {
      console.log(`❌ Ingestion failed: ${result.error}`);
    }

    return result;
  }

  /**
   * Method 2: Load and ingest from file system (for Node.js environments)
   */
  async ingestFromFiles(dataDirectory) {
    console.log('\n📁 Method 2: Ingesting from file system...');
    
    if (!fs.existsSync(dataDirectory)) {
      console.log(`⚠️  Directory ${dataDirectory} does not exist. Creating example files...`);
      await this.createExampleFiles(dataDirectory);
    }

    const documents = [];
    const files = fs.readdirSync(dataDirectory);

    for (const file of files) {
      const filePath = path.join(dataDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileExt = path.extname(file);
      
      let contentType = 'text';
      if (fileExt === '.json') contentType = 'json';
      else if (fileExt === '.md') contentType = 'markdown';

      documents.push({
        id: path.basename(file, fileExt),
        content: fileContent,
        metadata: {
          filename: file,
          filepath: filePath,
          filesize: fs.statSync(filePath).size,
          lastModified: fs.statSync(filePath).mtime.toISOString(),
          source: 'filesystem'
        },
        type: contentType
      });
    }

    const result = await this.enhancedAI.ingestDocuments(documents);
    
    if (result.success) {
      console.log(`✅ Successfully ingested ${result.successful} files from ${dataDirectory}`);
    }

    return result;
  }

  /**
   * Method 3: Ingest from API or external sources
   */
  async ingestFromAPI(apiEndpoint) {
    console.log('\n🌐 Method 3: Ingesting from API endpoint...');
    
    try {
      // Simulate API call (replace with actual API call)
      const mockAPIResponse = [
        {
          title: "Common Device Issues FAQ",
          content: "Q: Why is my device running slowly? A: This can be due to insufficient storage, too many background apps, or outdated software...",
          category: "faq",
          platform: "general"
        },
        {
          title: "Security Best Practices",  
          content: "Always keep your device updated, use strong passwords, enable two-factor authentication...",
          category: "security",
          platform: "general"
        }
      ];

      const documents = mockAPIResponse.map((item, index) => ({
        id: `api-doc-${index}`,
        content: `${item.title}\n\n${item.content}`,
        metadata: {
          source: 'api',
          endpoint: apiEndpoint,
          category: item.category,
          platform: item.platform,
          importedAt: new Date().toISOString()
        },
        type: 'text'
      }));

      const result = await this.enhancedAI.ingestDocuments(documents);
      
      if (result.success) {
        console.log(`✅ Successfully ingested ${result.successful} documents from API`);
      }

      return result;
    } catch (error) {
      console.log(`❌ API ingestion failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Method 4: Ingest structured device data
   */
  async ingestDeviceData(deviceDataCollection) {
    console.log('\n📱 Method 4: Ingesting structured device data...');

    const documents = deviceDataCollection.map((deviceData, index) => ({
      id: `device-data-${deviceData.deviceId || index}`,
      content: JSON.stringify(deviceData, null, 2),
      metadata: {
        deviceId: deviceData.deviceId,
        platform: deviceData.platform,
        dataType: 'device-telemetry',
        collectedAt: deviceData.timestamp || new Date().toISOString(),
        source: 'device-monitoring'
      },
      type: 'device-data'
    }));

    const result = await this.enhancedAI.ingestDocuments(documents);
    
    if (result.success) {
      console.log(`✅ Successfully ingested ${result.successful} device data records`);
    }

    return result;
  }

  /**
   * Method 5: Batch ingest from multiple sources
   */
  async batchIngestFromSources(sources) {
    console.log('\n🔄 Method 5: Batch ingesting from multiple sources...');
    
    const allDocuments = [];
    
    for (const source of sources) {
      if (source.type === 'predefined') {
        allDocuments.push(...source.data);
      } else if (source.type === 'files' && source.directory) {
        // Process files
        const files = fs.readdirSync(source.directory);
        for (const file of files) {
          const filePath = path.join(source.directory, file);
          const content = fs.readFileSync(filePath, 'utf8');
          allDocuments.push({
            id: `${source.prefix || 'file'}-${path.basename(file, path.extname(file))}`,
            content,
            metadata: { ...source.metadata, filename: file },
            type: source.contentType || 'text'
          });
        }
      }
    }

    const result = await this.enhancedAI.ingestDocuments(allDocuments);
    
    if (result.success) {
      console.log(`✅ Successfully batch ingested ${result.successful} documents from ${sources.length} sources`);
    }

    return result;
  }

  /**
   * Create example files for demonstration
   */
  async createExampleFiles(directory) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Create example text file
    const textContent = `Device Troubleshooting Guide

# Common Issues and Solutions

## Battery Drain
- Close unnecessary background apps
- Reduce screen brightness
- Disable location services for unused apps
- Enable power saving mode

## Performance Issues  
- Restart your device
- Clear app caches
- Free up storage space
- Update to latest OS version

## Connectivity Problems
- Toggle Wi-Fi/Cellular off and on
- Forget and reconnect to Wi-Fi networks
- Reset network settings if issues persist`;

    fs.writeFileSync(path.join(directory, 'troubleshooting-guide.txt'), textContent);

    // Create example JSON file
    const jsonContent = {
      deviceSpecs: {
        iPhone: {
          "iPhone 14": {
            processor: "A15 Bionic",
            ram: "6GB",
            storage: ["128GB", "256GB", "512GB"],
            batteryLife: "20 hours video playback"
          }
        },
        Android: {
          "Samsung Galaxy S23": {
            processor: "Snapdragon 8 Gen 2",
            ram: "8GB",
            storage: ["128GB", "256GB"],
            batteryLife: "22 hours video playback"
          }
        }
      }
    };

    fs.writeFileSync(path.join(directory, 'device-specs.json'), JSON.stringify(jsonContent, null, 2));

    // Create example markdown file
    const markdownContent = `# iOS Performance Optimization

## Memory Management

### Automatic Reference Counting (ARC)
iOS uses ARC to automatically manage memory allocation and deallocation.

### Tips for Better Performance:
1. **Close unused apps**: Double-tap home button and swipe up on apps
2. **Restart device**: Hold power + volume buttons
3. **Update iOS**: Settings > General > Software Update
4. **Storage management**: Settings > General > iPhone Storage

## Battery Optimization

### Low Power Mode
Enable when battery drops below 20% for extended usage.

### Background App Refresh
Disable for apps that don't need real-time updates.`;

    fs.writeFileSync(path.join(directory, 'ios-optimization.md'), markdownContent);

    console.log(`📁 Created example files in ${directory}/`);
  }

  /**
   * Search ingested documents to verify ingestion
   */
  async searchIngested(query, options = {}) {
    console.log(`\n🔍 Searching for: "${query}"`);
    
    const result = await this.enhancedAI.searchDocuments(query, {
      k: 3,
      ...options
    });

    if (result.success) {
      console.log(`✅ Found ${result.results.length} relevant documents:`);
      result.results.forEach((doc, index) => {
        console.log(`  ${index + 1}. Score: ${doc.score.toFixed(2)} - ${doc.content.substring(0, 100)}...`);
      });
    } else {
      console.log(`❌ Search failed: ${result.error}`);
    }

    return result;
  }

  /**
   * Get system status to see ingested documents
   */
  async getStatus() {
    console.log('\n📊 Getting RAG system status...');
    
    const status = await this.enhancedAI.getAdvancedStatus();
    
    if (status.success) {
      console.log(`📚 Total documents: ${status.rag?.totalDocuments || 0}`);
      console.log(`🔧 Chunk size: ${status.rag?.chunkSize || 'N/A'}`);
      console.log(`📝 Documents ingested:`);
      
      if (status.rag?.documents) {
        status.rag.documents.forEach(doc => {
          console.log(`  - ${doc.id} (${doc.type}, ${doc.chunksCount} chunks)`);
        });
      }
    }

    return status;
  }
}

/**
 * Complete demonstration of all ingestion methods
 */
async function demonstrateDataIngestion() {
  console.log('🚀 RAG Data Ingestion Demonstration\n');

  const ragSystem = new RAGDataIngestion();

  try {
    // Initialize
    await ragSystem.initialize();

    // Method 1: Predefined data
    await ragSystem.ingestPredefinedData();

    // Method 2: File system (create example directory)
    const dataDir = path.join(__dirname, 'sample-data');
    await ragSystem.ingestFromFiles(dataDir);

    // Method 3: API simulation
    await ragSystem.ingestFromAPI('https://api.example.com/device-guides');

    // Method 4: Device data
    const sampleDeviceData = [
      {
        deviceId: 'iPhone-001',
        platform: 'ios',
        battery: { level: 45, health: 89 },
        memory: { usage: 78, total: 4096 },
        timestamp: new Date().toISOString()
      },
      {
        deviceId: 'Android-001', 
        platform: 'android',
        battery: { level: 67, health: 95 },
        memory: { usage: 65, total: 8192 },
        timestamp: new Date().toISOString()
      }
    ];
    await ragSystem.ingestDeviceData(sampleDeviceData);

    // Test search functionality
    await ragSystem.searchIngested('battery optimization');
    await ragSystem.searchIngested('performance issues');

    // Show final status
    await ragSystem.getStatus();

    console.log('\n🎉 Data ingestion demonstration complete!');

  } catch (error) {
    console.error('❌ Demonstration failed:', error.message);
  }
}

// Export for use as module
module.exports = {
  RAGDataIngestion,
  EXAMPLE_DATA,
  demonstrateDataIngestion
};

// Run demonstration if executed directly
if (require.main === module) {
  demonstrateDataIngestion().catch(console.error);
}