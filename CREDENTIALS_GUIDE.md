# Azure OpenAI Credential Configuration Guide

## Overview
This guide explains where and how to securely add your Azure OpenAI credentials for the react-native-device-ai module.

## 🔐 Security First
**NEVER commit credentials to version control!** Always use secure methods to store and access your API keys.

## Configuration Options

### 1. Environment Variables (Recommended for Node.js/Testing)

#### Step 1: Create .env file
Copy the example configuration:
```bash
cp .env.example .env
```

#### Step 2: Add your credentials to .env
```bash
# .env
AZURE_OPENAI_API_KEY=your_actual_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
```

#### Step 3: Use in your code
```javascript
import DeviceAI from 'react-native-device-ai';

// For Node.js environments (standalone demo, testing)
if (process.env.AZURE_OPENAI_API_KEY) {
  DeviceAI.configure({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT
  });
}
```

### 2. React Native Secure Storage (Recommended for Apps)

#### Step 1: Install secure storage
```bash
npm install react-native-keychain
# or
npm install @react-native-async-storage/async-storage
```

#### Step 2: Store credentials securely
```javascript
import * as Keychain from 'react-native-keychain';
import DeviceAI from 'react-native-device-ai';

// Store credentials (one-time setup)
async function storeCredentials() {
  await Keychain.setInternetCredentials(
    'azure-openai',
    'api-key',
    'your_actual_api_key_here'
  );
  await AsyncStorage.setItem('azure_openai_endpoint', 'https://your-resource.openai.azure.com');
}

// Load and configure (in your app startup)
async function configureAI() {
  try {
    const credentials = await Keychain.getInternetCredentials('azure-openai');
    const endpoint = await AsyncStorage.getItem('azure_openai_endpoint');
    
    if (credentials && endpoint) {
      DeviceAI.configure({
        apiKey: credentials.password,
        endpoint: endpoint
      });
    }
  } catch (error) {
    console.log('Azure OpenAI not configured - using fallback mode');
  }
}
```

### 3. Configuration File (Development Only)

#### Step 1: Create config file (NOT committed to git)
```javascript
// config/azure-openai.js (add to .gitignore)
export const azureOpenAIConfig = {
  apiKey: 'your_actual_api_key_here',
  endpoint: 'https://your-resource.openai.azure.com'
};
```

#### Step 2: Use in your app
```javascript
import DeviceAI from 'react-native-device-ai';
import { azureOpenAIConfig } from './config/azure-openai';

DeviceAI.configure(azureOpenAIConfig);
```

### 4. Runtime Configuration (Production Apps)

```javascript
import DeviceAI from 'react-native-device-ai';

// Prompt user for credentials or load from secure backend
async function configureFromUserInput() {
  const apiKey = await getUserApiKey(); // Your secure input method
  const endpoint = await getUserEndpoint();
  
  DeviceAI.configure({ apiKey, endpoint });
}
```

## 🔑 Getting Azure OpenAI Credentials

### Step 1: Create Azure OpenAI Resource
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Azure OpenAI" resource
3. Wait for deployment to complete

### Step 2: Get Credentials
1. Navigate to your Azure OpenAI resource
2. Go to "Keys and Endpoint" section
3. Copy "Key 1" (this is your API key)
4. Copy "Endpoint" URL

### Step 3: Deploy a Model
1. Go to "Model deployments" in your resource
2. Create a deployment with GPT-3.5-turbo or GPT-4
3. Note the deployment name (usually "gpt-35-turbo")

## 🛡️ Security Best Practices

### DO:
✅ Use environment variables for development/testing
✅ Use secure storage (Keychain/AsyncStorage) for production apps  
✅ Add credential files to .gitignore
✅ Validate credentials before using them
✅ Use HTTPS endpoints only
✅ Rotate API keys regularly

### DON'T:
❌ Commit credentials to version control
❌ Hardcode credentials in source code
❌ Share credentials in plain text
❌ Use credentials in client-side code without secure storage
❌ Log credentials to console in production

## 📱 Platform-Specific Notes

### Node.js (Standalone Demo)
```bash
# Set environment variables
export AZURE_OPENAI_API_KEY="your_key"
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
node standalone-demo.js
```

### React Native iOS
Use Keychain Services via react-native-keychain for maximum security.

### React Native Android  
Use Android Keystore via react-native-keychain or secure SharedPreferences.

### React Native Windows
Use Windows Credential Manager or secure app settings.

## 🔍 Testing Your Configuration

```javascript
import DeviceAI from 'react-native-device-ai';

// Test if credentials are working
async function testConfiguration() {
  try {
    DeviceAI.configure({
      apiKey: 'your_test_key',
      endpoint: 'https://your-resource.openai.azure.com'
    });
    
    const result = await DeviceAI.getDeviceInsights();
    
    if (result.success && result.insights.includes('AI')) {
      console.log('✅ Azure OpenAI configured successfully!');
    } else {
      console.log('⚠️ Using fallback mode - check credentials');
    }
  } catch (error) {
    console.log('❌ Configuration error:', error.message);
  }
}
```

## 🚀 Quick Start Commands

```bash
# 1. Copy example configuration
cp .env.example .env

# 2. Edit .env with your credentials
nano .env

# 3. Test configuration
node standalone-demo.js

# 4. Run example app
cd example && npm run ios
```

## ❓ Troubleshooting

### "Azure OpenAI not configured" Warning
- Check that your .env file exists and has correct values
- Verify your API key and endpoint are correct
- Ensure you've called DeviceAI.configure()

### "API Error" or Network Issues
- Verify your Azure OpenAI resource is deployed
- Check that your model deployment is active
- Ensure your API key has not expired
- Verify network connectivity to Azure

### Module Works Without AI
The module gracefully falls back to built-in insights when Azure OpenAI is not configured. This is normal behavior.

## 📚 Additional Resources

- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [React Native Security Best Practices](https://reactnative.dev/docs/security)
- [React Native Keychain](https://github.com/oblador/react-native-keychain)