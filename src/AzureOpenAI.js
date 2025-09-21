const axios = require('axios');

/**
 * AzureOpenAI module for handling AI API requests
 */
class AzureOpenAI {
  constructor() {
    this.apiKey = null;
    this.endpoint = null;
    this.apiVersion = '2023-05-15';
    this.deployment = 'gpt-35-turbo';
  }

  /**
   * Configure Azure OpenAI credentials
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - Azure OpenAI API key
   * @param {string} config.endpoint - Azure OpenAI endpoint URL
   * @param {string} config.apiVersion - Optional API version (defaults to 2023-05-15)
   * @param {string} config.deployment - Optional deployment name (defaults to gpt-35-turbo)
   */
  setConfig(config) {
    if (!config) {
      this.apiKey = null;
      this.endpoint = null;
      this.apiVersion = '2023-05-15';
      this.deployment = 'gpt-35-turbo';
      return;
    }
    
    const { apiKey, endpoint, apiVersion, deployment } = config;
    
    // Validate required fields
    if (!apiKey || !endpoint) {
      throw new Error('Both apiKey and endpoint are required for Azure OpenAI configuration');
    }
    
    // Validate API key format (basic check, allow shorter keys for testing)
    const minLength = process.env.NODE_ENV === 'test' ? 5 : 10;
    if (typeof apiKey !== 'string' || apiKey.length < minLength) {
      throw new Error('Invalid API key format');
    }
    
    // Validate endpoint format
    if (!endpoint.startsWith('https://')) {
      throw new Error('Endpoint must use HTTPS protocol');
    }
    
    this.apiKey = apiKey;
    this.endpoint = endpoint.replace(/\/$/, ''); // Remove trailing slash
    this.apiVersion = apiVersion || '2023-05-15';
    this.deployment = deployment || 'gpt-35-turbo';
    
    // Log successful configuration (without exposing credentials, unless in test mode)
    if (process.env.NODE_ENV !== 'test') {
      console.log('Azure OpenAI configured successfully:', {
        endpoint: this._maskEndpoint(endpoint),
        apiKeyLength: apiKey.length,
        apiVersion: this.apiVersion,
        deployment: this.deployment
      });
    }
  }

  /**
   * Check if the service is properly configured
   * @returns {boolean} True if configured, false otherwise
   */
  isConfigured() {
    return !!(this.apiKey && this.endpoint);
  }

  /**
   * Generate AI insights based on device data
   * @param {Object} deviceData - Device information object
   * @param {string} type - Type of insights ('general', 'battery', 'performance')
   * @returns {Promise<string>} AI-generated insights
   */
  async generateInsights(deviceData, type = 'general') {
    if (!this.isConfigured()) {
      throw new Error('Azure OpenAI not configured. Call setConfig() first.');
    }

    try {
      const prompt = this._buildPrompt(deviceData, type);
      const response = await this._makeAPIRequest(prompt);
      return this._parseResponse(response);
    } catch (error) {
      // Log error without exposing sensitive information
      console.error('Azure OpenAI API Error:', this._sanitizeError(error));
      throw new Error(`Failed to generate AI insights: ${error.message}`);
    }
  }

  /**
   * Generate a custom one-liner response based on user's prompt and device data
   * @param {string} userPrompt - User's question about their device
   * @param {Object} relevantData - Device data relevant to the prompt
   * @returns {Promise<string>} AI-generated one-liner response
   */
  async generateCustomResponse(userPrompt, relevantData) {
    if (!this.isConfigured()) {
      throw new Error('Azure OpenAI not configured. Call setConfig() first.');
    }

    try {
      const prompt = this._buildCustomPrompt(userPrompt, relevantData);
      const response = await this._makeAPIRequest(prompt, { maxTokens: 100 });
      return this._parseResponse(response);
    } catch (error) {
      // Log error without exposing sensitive information
      console.error('Azure OpenAI API Error:', this._sanitizeError(error));
      throw new Error(`Failed to generate custom response: ${error.message}`);
    }
  }

  /**
   * Build prompt based on device data and insight type
   * @private
   */
  _buildPrompt(deviceData, type) {
    const basePrompt = `Analyze the following device information and provide helpful insights:\n\n${JSON.stringify(deviceData, null, 2)}\n\n`;
    
    switch (type) {
      case 'battery':
        return basePrompt + 'Focus on battery optimization recommendations. Provide 3-5 actionable tips to improve battery life.';
      case 'performance':
        return basePrompt + 'Focus on performance optimization. Provide 3-5 actionable tips to improve device performance and speed.';
      default:
        return basePrompt + 'Provide a comprehensive analysis with general recommendations for device optimization, including battery, performance, and storage tips.';
    }
  }

  /**
   * Build custom prompt for user queries
   * @param {string} userPrompt - User's question
   * @param {Object} relevantData - Relevant device data
   * @returns {string} Formatted prompt for AI
   * @private
   */
  _buildCustomPrompt(userPrompt, relevantData) {
    return `User Question: "${userPrompt}"

Device Data:
${JSON.stringify(relevantData, null, 2)}

Instructions: Answer the user's question in ONE SHORT SENTENCE (maximum 20 words) using the provided device data. Be direct, factual, and conversational. Focus only on answering what was asked.`;
  }

  /**
   * Make API request to Azure OpenAI
   * @private
   */
  async _makeAPIRequest(prompt, options = {}) {
    const url = `${this.endpoint}/openai/deployments/${this.deployment}/chat/completions?api-version=${this.apiVersion}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    };

    const data = {
      messages: [
        {
          role: 'system',
          content: options.systemMessage || 'You are a helpful device optimization expert. Provide clear, actionable advice in a friendly tone. Keep responses concise but informative.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    };

    const response = await axios.post(url, data, { headers, timeout: 30000 });
    return response.data;
  }

  /**
   * Parse and validate API response
   * @private
   */
  _parseResponse(response) {
    try {
      if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content.trim();
      }
      throw new Error('Invalid response format from Azure OpenAI');
    } catch (error) {
      console.error('Error parsing Azure OpenAI response:', error.message);
      return 'Unable to generate insights at this time. Please try again later.';
    }
  }

  /**
   * Mask endpoint for logging (security)
   * @param {string} endpoint - Full endpoint URL
   * @returns {string} Masked endpoint for safe logging
   * @private
   */
  _maskEndpoint(endpoint) {
    try {
      const url = new URL(endpoint);
      const hostname = url.hostname;
      const parts = hostname.split('.');
      if (parts.length > 2) {
        // Mask the subdomain: myresource.openai.azure.com -> m****e.openai.azure.com
        const first = parts[0];
        if (first.length > 2) {
          parts[0] = first[0] + '*'.repeat(first.length - 2) + first[first.length - 1];
        }
      }
      return `${url.protocol}//${parts.join('.')}`;
    } catch (error) {
      return 'https://*****.openai.azure.com';
    }
  }

  /**
   * Sanitize error messages to prevent credential exposure
   * @param {Error} error - Original error
   * @returns {Object} Sanitized error info
   * @private
   */
  _sanitizeError(error) {
    const sanitized = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    };
    
    // Remove any potential credential information from error messages
    if (sanitized.message) {
      sanitized.message = sanitized.message
        .replace(/api-key[=:\s]+[^\s&]+/gi, 'api-key=***')
        .replace(/authorization[=:\s]+bearer\s+[^\s&]+/gi, 'authorization=Bearer ***')
        .replace(/[a-f0-9]{32,}/gi, '***'); // Replace long hex strings (potential keys)
    }
    
    return sanitized;
  }

  /**
   * Load configuration from environment variables
   * @returns {Object|null} Configuration object or null if not available
   * @static
   */
  static loadFromEnvironment() {
    // Check if running in Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      const apiKey = process.env.AZURE_OPENAI_API_KEY;
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
      
      if (apiKey && endpoint) {
        return {
          apiKey,
          endpoint,
          apiVersion,
          deployment
        };
      }
    }
    return null;
  }
}

// Export as singleton instance and expose the class
const azureOpenAIInstance = new AzureOpenAI();
azureOpenAIInstance.AzureOpenAI = AzureOpenAI; // Expose class for static methods
module.exports = azureOpenAIInstance;