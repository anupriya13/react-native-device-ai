/**
 * Real RAG and LangChain Integration Demo
 * 
 * This example demonstrates the real RAG (Retrieval-Augmented Generation) and LangChain
 * integration with actual vector embeddings and LangChain chains.
 */

const { Enhanced } = require('../index');

/**
 * Comprehensive demo of real RAG and LangChain functionality
 */
async function demonstrateRealRAGAndLangChain() {
  console.log('🚀 Real RAG and LangChain Integration Demo\n');

  try {
    // Initialize with real RAG and LangChain
    console.log('1. Initializing Enhanced AI with real RAG and LangChain...');
    const enhanced = new Enhanced();
    
    const initResult = await enhanced.initializeMCP({
      enableRAG: true,
      enableLangChain: true,
      useRealLangChain: true, // Use real LangChain instead of simplified version
      ragConfig: {
        apiKey: process.env.OPENAI_API_KEY || 'demo-key',
        chunkSize: 500,
        maxDocuments: 100,
        embeddingModel: 'text-embedding-3-small'
      },
      langChainConfig: {
        apiKey: process.env.OPENAI_API_KEY || 'demo-key',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        enableMemory: true
      }
    });

    if (!initResult.success) {
      console.log('❌ Initialization failed:', initResult.error);
      return;
    }

    console.log('✅ Successfully initialized with real vector embeddings and LangChain');
    console.log(`   - Vector Embeddings: ${initResult.ragEnabled ? 'Enabled' : 'Disabled'}`);
    console.log(`   - Real LangChain: ${initResult.langChainEnabled ? 'Enabled' : 'Disabled'}\n`);

    // 2. Ingest comprehensive device knowledge base
    console.log('2. Ingesting comprehensive device knowledge base...');
    
    const knowledgeBase = [
      {
        id: 'ios-battery-optimization',
        content: `iOS Battery Optimization Comprehensive Guide:

## Understanding Battery Health
Your iPhone's battery health is crucial for optimal performance. Battery health below 80% significantly impacts device performance and battery life.

## Advanced Battery Optimization Techniques
1. **Low Power Mode**: Automatically reduces background activity when battery is low
2. **Optimized Battery Charging**: iOS learns your charging routine to reduce battery aging
3. **Background App Refresh**: Disable for apps that don't need real-time updates
4. **Location Services**: Review and disable for non-essential apps
5. **Push vs Fetch**: Use fetch instead of push for non-critical email accounts
6. **Screen Time Controls**: Limit app usage and set downtime periods

## Battery Usage Analysis
- Check Battery settings to identify power-hungry apps
- Review battery usage by app over the last 24 hours and 10 days
- Look for unexpected battery drain patterns

## Hardware Considerations
- Extreme temperatures (below 0°C or above 35°C) can damage battery
- Wireless charging generates more heat than wired charging
- Fast charging after 80% slows down to protect battery health

## When to Replace Battery
Consider battery replacement when:
- Maximum capacity drops below 80%
- Unexpected shutdowns occur
- Device performance is significantly reduced
- Charging takes unusually long`,
        metadata: { 
          platform: 'ios', 
          category: 'battery', 
          type: 'optimization-guide',
          expertise_level: 'advanced' 
        },
        type: 'markdown'
      },
      {
        id: 'android-performance-comprehensive',
        content: `Android Performance Optimization Expert Guide:

## Memory Management
Android uses a sophisticated memory management system with the Linux kernel's low memory killer.

### RAM Optimization
- Android automatically manages memory - don't use task killers
- Background app limits: Android 8.0+ automatically limits background activities
- Memory pressure indicators: Check Developer Options > Running services

### Storage Optimization
- Use Adaptive Storage to automatically clean up old photos/videos
- Clear app caches selectively - not all at once
- Monitor storage with built-in tools: Settings > Storage

## CPU and Performance
### Background Processing
- Doze mode and App Standby optimize battery and performance
- Background execution limits in newer Android versions
- Use Battery optimization settings for per-app control

### Developer Options for Performance
- Animation scales: Reduce or disable for faster UI
- Background process limit: Set to standard limit (not "no background processes")
- GPU rendering: Enable "Force GPU rendering" for graphics-intensive apps

## Network Performance
- Adaptive connectivity automatically manages network usage
- Data Saver mode reduces background data usage
- Wi-Fi scanning settings affect both battery and performance

## Thermal Management
- Android thermal throttling protects hardware
- Performance cores vs efficiency cores in modern processors
- Gaming mode and performance profiles on gaming phones

## Advanced Troubleshooting
1. Safe mode testing to identify problematic apps
2. Factory reset as last resort for persistent issues
3. ADB commands for advanced diagnostics
4. Logcat analysis for detailed troubleshooting`,
        metadata: { 
          platform: 'android', 
          category: 'performance', 
          type: 'optimization-guide',
          expertise_level: 'expert' 
        },
        type: 'markdown'
      },
      {
        id: 'device-specifications-database',
        content: JSON.stringify({
          devices: {
            "iPhone 15 Pro": {
              processor: "A17 Pro (3nm)",
              memory: "8GB",
              storage: ["128GB", "256GB", "512GB", "1TB"],
              battery: "3274 mAh",
              batteryLife: {
                video: "23 hours",
                audio: "75 hours", 
                wireless: "15 hours"
              },
              chargingSpeed: "Up to 27W wired, 15W MagSafe, 7.5W Qi",
              display: {
                size: "6.1 inch",
                resolution: "2556×1179",
                technology: "Super Retina XDR OLED",
                refresh: "120Hz ProMotion"
              },
              optimizationTips: [
                "Use ProRAW sparingly to save storage",
                "Enable ProMotion battery optimization",
                "Use Cinematic mode wisely for battery life"
              ]
            },
            "Samsung Galaxy S24 Ultra": {
              processor: "Snapdragon 8 Gen 3",
              memory: "12GB",
              storage: ["256GB", "512GB", "1TB"],
              battery: "5000 mAh",
              batteryLife: {
                video: "30+ hours",
                audio: "95+ hours"
              },
              chargingSpeed: "45W wired, 15W wireless, 4.5W reverse",
              display: {
                size: "6.8 inch",
                resolution: "3120×1440",
                technology: "Dynamic AMOLED 2X",
                refresh: "1-120Hz adaptive"
              },
              optimizationTips: [
                "Use adaptive refresh rate for battery savings",
                "Enable RAM Plus for better multitasking",
                "Use S Pen efficiently to save battery"
              ]
            }
          },
          generalOptimization: {
            battery: {
              universal: [
                "Keep OS updated for latest optimizations",
                "Use dark mode on OLED displays",
                "Manage notification frequency",
                "Use Wi-Fi over cellular when possible"
              ],
              advanced: [
                "Monitor battery temperature",
                "Calibrate battery monthly",
                "Use original or certified chargers",
                "Avoid deep discharge cycles"
              ]
            },
            performance: {
              universal: [
                "Restart device weekly",
                "Keep 10-15% storage free",
                "Update apps regularly",
                "Close resource-intensive apps when not needed"
              ],
              advanced: [
                "Monitor CPU usage patterns",
                "Use performance profiling tools",
                "Optimize app launch sequences",
                "Manage thermal throttling"
              ]
            }
          }
        }),
        metadata: { 
          platform: 'general', 
          category: 'specifications', 
          type: 'database',
          data_type: 'structured' 
        },
        type: 'json'
      },
      {
        id: 'troubleshooting-flowchart',
        content: `Device Troubleshooting Decision Tree and Flowchart:

## Battery Issues Diagnosis
START: Is battery draining faster than normal?
├─ YES: Check battery usage statistics
│  ├─ High usage app identified?
│  │  ├─ YES: Disable background refresh for app → Monitor for 24 hours
│  │  └─ NO: Check for iOS/Android system issues
│  └─ NO background app issues: Check battery health
│     ├─ Health < 80%: Consider battery replacement
│     └─ Health > 80%: Check charging habits and temperature exposure

## Performance Issues Diagnosis  
START: Is device running slowly?
├─ Recent app installation? → Try in Safe Mode
├─ Storage nearly full? → Free up space (target 15% free)
├─ Many apps running? → Restart device
└─ Persistent issues? → Consider factory reset

## Connectivity Issues Diagnosis
START: Network connectivity problems?
├─ Wi-Fi specific?
│  ├─ Forget and reconnect to network
│  ├─ Reset network settings
│  └─ Check router/ISP issues
├─ Cellular specific?
│  ├─ Check carrier status
│  ├─ Update carrier settings
│  └─ Contact carrier support
└─ All connectivity?
   ├─ Hardware antenna issue
   └─ Professional diagnosis needed

## Decision Matrix for Common Issues
| Symptom | Likely Cause | First Action | If Unsuccessful |
|---------|--------------|--------------|-----------------|
| Fast battery drain | Background apps | Check battery usage | Reset device |
| Slow performance | Low storage | Clear space | Restart device |
| App crashes | Memory pressure | Close other apps | Update app |
| Overheating | High CPU usage | Check running apps | Professional check |
| Poor signal | Network issues | Reset network | Contact carrier |

## Advanced Diagnostic Commands
iOS: Settings > Privacy & Security > Analytics & Improvements > Analytics Data
Android: Developer Options > Bug reports, or ADB logcat
Windows: Event Viewer, Performance Monitor
macOS: Console app, Activity Monitor

## Escalation Criteria
Contact support when:
- Hardware symptoms (physical damage, overheating)
- Persistent issues after software troubleshooting
- Data recovery needs
- Warranty/repair consultation needed`,
        metadata: { 
          platform: 'general', 
          category: 'troubleshooting', 
          type: 'flowchart',
          complexity: 'intermediate' 
        },
        type: 'text'
      }
    ];

    const ingestionResult = await enhanced.ingestDocuments(knowledgeBase);
    
    if (ingestionResult.success) {
      console.log(`✅ Successfully ingested ${ingestionResult.successful} documents into vector store`);
      console.log(`   - Real vector embeddings generated for semantic search`);
      console.log(`   - Total chunks with embeddings: ${ingestionResult.totalChunks || 'N/A'}\n`);
    } else {
      console.log(`❌ Document ingestion failed: ${ingestionResult.error}\n`);
    }

    // 3. Demonstrate real LangChain chains
    console.log('3. Demonstrating real LangChain chains...');

    // Create a custom device analysis chain
    const customChainResult = await enhanced.createCustomChain('detailed-battery-analysis', {
      template: `You are an expert mobile device technician with deep knowledge of battery technology and optimization.

Device Information:
{deviceData}

Battery Specific Data:
- Current Level: {batteryLevel}%
- Battery Health: {batteryHealth}%
- Charging State: {chargingState}
- Platform: {platform}

User Context: {userContext}

Provide a detailed, technical analysis of the battery situation including:
1. Immediate assessment of battery status
2. Specific optimization recommendations 
3. Long-term battery health strategies
4. Warning signs to watch for
5. When to consider battery replacement

Be specific, actionable, and prioritize recommendations by impact.`,
      inputVariables: ['deviceData', 'batteryLevel', 'batteryHealth', 'chargingState', 'platform', 'userContext'],
      description: 'Detailed battery analysis with expert recommendations'
    });

    if (customChainResult.success) {
      console.log('✅ Created custom LangChain chain: detailed-battery-analysis');
    }

    // Execute the custom chain with real data
    const mockDeviceData = {
      platform: 'ios',
      model: 'iPhone 15 Pro',
      osVersion: '17.2',
      batteryLevel: 23,
      batteryHealth: 87,
      chargingState: 'unplugged',
      backgroundAppRefresh: true,
      lowPowerMode: false,
      screenTime: '8 hours today',
      topBatteryApps: ['Instagram', 'Maps', 'Camera']
    };

    const analysisResult = await enhanced.executeLangChain('detailed-battery-analysis', {
      deviceData: JSON.stringify(mockDeviceData, null, 2),
      batteryLevel: mockDeviceData.batteryLevel,
      batteryHealth: mockDeviceData.batteryHealth, 
      chargingState: mockDeviceData.chargingState,
      platform: mockDeviceData.platform,
      userContext: 'User reports rapid battery drain over the past week'
    });

    if (analysisResult.success) {
      console.log('✅ LangChain analysis completed:');
      console.log('📋 Expert Battery Analysis:');
      console.log(analysisResult.response);
      console.log();
    }

    // 4. Demonstrate RAG-enhanced queries
    console.log('4. Demonstrating RAG-enhanced conversational queries...');

    const ragQueries = [
      "My iPhone battery drains very quickly even though it's only 6 months old. What should I check?",
      "Android phone is getting very slow after the latest update. How can I optimize performance?",
      "What are the differences between iPhone 15 Pro and Samsung Galaxy S24 Ultra in terms of battery life?"
    ];

    for (const query of ragQueries) {
      console.log(`\n🔍 Query: "${query}"`);
      
      const response = await enhanced.processConversationalQuery(query, {
        useRAG: true,
        useLangChain: true
      });

      if (response.success) {
        console.log('💬 RAG-Enhanced Response:');
        console.log(response.response);
        
        if (response.ragSources) {
          console.log(`📚 Sources: ${response.ragSources.length} relevant documents found`);
        }
        if (response.vectorSearch) {
          console.log('🔬 Used: Real vector similarity search');
        }
      } else {
        console.log(`❌ Query failed: ${response.error}`);
      }
    }

    // 5. Demonstrate semantic search capabilities
    console.log('\n5. Demonstrating semantic search with real embeddings...');

    const searchQueries = [
      'battery replacement criteria',
      'thermal management android',
      'iPhone 15 Pro specifications'
    ];

    for (const searchQuery of searchQueries) {
      console.log(`\n🔍 Searching for: "${searchQuery}"`);
      
      const searchResults = await enhanced.searchDocuments(searchQuery, {
        k: 3,
        scoreThreshold: 0.2
      });

      if (searchResults.success) {
        console.log(`📊 Found ${searchResults.results.length} relevant chunks:`);
        searchResults.results.forEach((result, index) => {
          console.log(`   ${index + 1}. Score: ${result.score.toFixed(3)} - ${result.content.substring(0, 100)}...`);
        });
        
        if (searchResults.vectorSearch) {
          console.log('✅ Used real cosine similarity with OpenAI embeddings');
        } else {
          console.log('⚠️  Fallback to keyword similarity (no API key)');
        }
      }
    }

    // 6. Get comprehensive status
    console.log('\n6. System Status Summary:');
    const status = await enhanced.getAdvancedStatus();
    
    if (status.success) {
      console.log('📊 Advanced AI System Status:');
      console.log(`   - RAG Enabled: ${status.ragEnabled ? '✅' : '❌'}`);
      console.log(`   - Vector Embeddings: ${status.rag?.vectorEmbeddings ? '✅' : '❌'}`);
      console.log(`   - LangChain Enabled: ${status.langChainEnabled ? '✅' : '❌'}`);
      console.log(`   - Real LangChain: ${status.langChain?.realLangChain ? '✅' : '❌'}`);
      console.log(`   - Total Documents: ${status.rag?.totalDocuments || 0}`);
      console.log(`   - Vector Chunks: ${status.rag?.totalChunks || 0}`);
      console.log(`   - Available Chains: ${status.langChain?.totalChains || 0}`);
      
      if (status.langChain?.availableChains) {
        console.log(`   - Chain Names: ${status.langChain.availableChains.join(', ')}`);
      }
    }

    console.log('\n🎉 Real RAG and LangChain demonstration complete!');
    console.log('\n📋 Summary of Real Features Demonstrated:');
    console.log('   ✅ Real vector embeddings with OpenAI text-embedding-3-small');
    console.log('   ✅ Semantic similarity search using cosine similarity');
    console.log('   ✅ Real LangChain chains with ChatOpenAI');
    console.log('   ✅ Custom LangChain chain creation');
    console.log('   ✅ RAG-enhanced conversational AI');
    console.log('   ✅ Advanced device analysis workflows');
    console.log('   ✅ Comprehensive knowledge base ingestion');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Export for use as module
module.exports = {
  demonstrateRealRAGAndLangChain
};

// Run demonstration if executed directly
if (require.main === module) {
  demonstrateRealRAGAndLangChain().catch(console.error);
}