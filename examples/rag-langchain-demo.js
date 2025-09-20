/**
 * Example: RAG and LangChain Integration with react-native-device-ai
 * 
 * This example demonstrates how to use the new RAG (Retrieval-Augmented Generation)
 * and LangChain functionality for enhanced device analysis.
 */

const { Enhanced } = require('../index');

async function ragAndLangChainExample() {
  console.log('🚀 Starting RAG and LangChain Demo...\n');

  try {
    // Step 1: Initialize Enhanced DeviceAI with RAG and LangChain
    console.log('📊 Initializing Enhanced DeviceAI with RAG and LangChain...');
    const initResult = await Enhanced.initializeMCP({
      enableRAG: true,
      enableLangChain: true,
      ragConfig: {
        apiKey: process.env.OPENAI_API_KEY || 'demo-key', // Use your actual API key
        chunkSize: 1000,
        maxDocuments: 100
      },
      langChainConfig: {
        apiKey: process.env.OPENAI_API_KEY || 'demo-key', // Use your actual API key
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      }
    });

    if (!initResult.success) {
      console.log('❌ Initialization failed:', initResult.error);
      return;
    }

    console.log('✅ Initialization successful!');
    console.log(`   - RAG enabled: ${initResult.ragEnabled}`);
    console.log(`   - LangChain enabled: ${initResult.langChainEnabled}`);
    console.log('');

    // Step 2: Ingest some device knowledge documents
    console.log('📚 Ingesting device knowledge documents...');
    
    const knowledgeDocs = [
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
          type: 'optimization-guide' 
        },
        type: 'text'
      },
      {
        id: 'android-performance-tips',
        content: `Android Performance Optimization Guide:
        
1. Clear app cache regularly to free up storage space
2. Uninstall or disable apps you don't use
3. Use lite versions of apps when available
4. Enable developer options and limit background processes
5. Turn off animations to improve responsiveness
6. Use static wallpapers instead of live wallpapers
7. Restart your device weekly to clear memory
8. Keep Android system updated
9. Use storage cleanup tools to remove junk files
10. Monitor and limit data usage for better performance`,
        metadata: { 
          platform: 'android', 
          category: 'performance', 
          type: 'optimization-guide' 
        },
        type: 'text'
      },
      {
        id: 'mobile-security-checklist',
        content: `Mobile Device Security Checklist:
        
1. Enable device lock screen with PIN, password, or biometric
2. Keep operating system and apps updated
3. Only download apps from official app stores
4. Review app permissions before installing
5. Enable two-factor authentication where possible
6. Use secure Wi-Fi networks and avoid public Wi-Fi for sensitive tasks
7. Enable remote wipe capability in case of theft
8. Regularly backup important data
9. Be cautious with email attachments and links
10. Consider using a VPN for additional privacy`,
        metadata: { 
          category: 'security', 
          type: 'checklist' 
        },
        type: 'text'
      }
    ];

    const ingestionResult = await Enhanced.ingestDocuments(knowledgeDocs);
    if (ingestionResult.success) {
      console.log(`✅ Successfully ingested ${ingestionResult.successful} documents`);
    } else {
      console.log('❌ Document ingestion failed:', ingestionResult.error);
    }
    console.log('');

    // Step 3: Simulate device data collection
    console.log('📱 Simulating device data collection...');
    const mockDeviceData = {
      platform: 'ios',
      version: '16.0',
      battery: {
        level: 18,
        state: 'unplugged',
        health: 78
      },
      memory: {
        usage: 85,
        available: 1024,
        total: 4096
      },
      storage: {
        used: 58000,
        total: 64000,
        available: 6000
      },
      apps: {
        total: 127,
        backgroundRefreshEnabled: 43
      }
    };

    // Step 4: Get enhanced device insights with RAG and LangChain
    console.log('🔍 Getting enhanced device insights...');
    const insights = await Enhanced.getDeviceInsights({
      useRAG: true,
      useLangChain: true,
      preferredProviders: ['langchain'],
      dataSources: ['system-monitor', 'battery-monitor']
    });

    if (insights.success) {
      console.log('✅ Device Analysis Complete!');
      console.log(`   Processing mode: ${insights.processing?.processingMode || 'standard'}`);
      console.log(`   RAG used: ${insights.advancedFeatures?.ragUsed || false}`);
      console.log(`   Provider: ${insights.processing?.provider || 'unknown'}`);
      console.log('   Insights:', insights.insights);
    } else {
      console.log('❌ Analysis failed:', insights.error);
    }
    console.log('');

    // Step 5: Ask conversational questions
    console.log('💬 Processing conversational queries...');
    
    const queries = [
      "My battery drains very quickly, what should I do?",
      "How can I improve my device's performance?",
      "What security measures should I take?"
    ];

    for (const query of queries) {
      console.log(`   Question: "${query}"`);
      
      try {
        const response = await Enhanced.processConversationalQuery(query, {
          useRAG: true,
          dataSources: ['system-monitor']
        });

        if (response.success) {
          console.log(`   Answer: ${response.result}`);
        } else {
          console.log(`   Error: ${response.error}`);
        }
      } catch (error) {
        console.log(`   Error: ${error.message}`);
      }
      console.log('');
    }

    // Step 6: Create custom analysis chain
    console.log('🔧 Creating custom analysis chain...');
    const customChainResult = await Enhanced.createCustomChain('device-health-check', {
      template: `Perform a comprehensive health check for this {platform} device:

Device Information:
{deviceData}

Health Check Analysis:
1. Battery Health Assessment
2. Storage Space Analysis  
3. Memory Usage Evaluation
4. Performance Optimization Recommendations
5. Security Status Review

Provide a detailed health report with actionable recommendations:`,
      inputVariables: ['platform', 'deviceData']
    });

    if (customChainResult.success) {
      console.log('✅ Custom chain created successfully!');
      
      // Execute the custom chain
      const healthCheck = await Enhanced.executeLangChain('device-health-check', {
        platform: mockDeviceData.platform,
        deviceData: JSON.stringify(mockDeviceData, null, 2)
      }, { useRAG: true });

      if (healthCheck.success) {
        console.log('📋 Device Health Report:');
        console.log(healthCheck.result);
      }
    } else {
      console.log('❌ Custom chain creation failed:', customChainResult.error);
    }
    console.log('');

    // Step 7: Search knowledge base
    console.log('🔍 Searching knowledge base...');
    const searchResult = await Enhanced.searchDocuments('battery optimization iOS', {
      k: 3,
      filter: { platform: 'ios' }
    });

    if (searchResult.success) {
      console.log(`✅ Found ${searchResult.results.length} relevant documents:`);
      searchResult.results.forEach((result, index) => {
        console.log(`   ${index + 1}. Score: ${result.score.toFixed(2)} - ${result.content.substring(0, 100)}...`);
      });
    } else {
      console.log('❌ Search failed:', searchResult.error);
    }
    console.log('');

    // Step 8: Get advanced status
    console.log('📊 Getting advanced system status...');
    const status = await Enhanced.getAdvancedStatus();
    
    if (status.success) {
      console.log('✅ Advanced Features Status:');
      console.log(`   RAG Documents: ${status.rag?.totalDocuments || 0}`);
      console.log(`   LangChain Chains: ${status.langChain?.chains?.length || 0}`);
      console.log(`   Available Chains: ${status.langChain?.chains?.join(', ') || 'none'}`);
    }

  } catch (error) {
    console.error('❌ Demo failed with error:', error.message);
  }

  console.log('\n🎉 RAG and LangChain Demo Complete!');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  ragAndLangChainExample().catch(console.error);
}

module.exports = { ragAndLangChainExample };