const axios = require('axios');

/**
 * AzureOpenAI module for handling AI API requests
 */
class AzureOpenAI {
  constructor() {
    this.apiKey = null;
    this.endpoint = null;
    this.apiVersion = '2023-05-15';
  }

  /**
   * Configure Azure OpenAI credentials
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - Azure OpenAI API key
   * @param {string} config.endpoint - Azure OpenAI endpoint URL
   */
  setConfig(config) {
    if (!config) {
      this.apiKey = null;
      this.endpoint = null;
      return;
    }
    
    const { apiKey, endpoint } = config;
    if (!apiKey || !endpoint) {
      throw new Error('Both apiKey and endpoint are required for Azure OpenAI configuration');
    }
    this.apiKey = apiKey;
    this.endpoint = endpoint;
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
      console.error('Azure OpenAI API Error:', error.message);
      throw new Error(`Failed to generate AI insights: ${error.message}`);
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
   * Make API request to Azure OpenAI
   * @private
   */
  async _makeAPIRequest(prompt) {
    const url = `${this.endpoint}/openai/deployments/gpt-35-turbo/chat/completions?api-version=${this.apiVersion}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
    };

    const data = {
      messages: [
        {
          role: 'system',
          content: 'You are a helpful device optimization expert. Provide clear, actionable advice in a friendly tone. Keep responses concise but informative.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
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
      console.error('Error parsing Azure OpenAI response:', error);
      return 'Unable to generate insights at this time. Please try again later.';
    }
  }
}

// Export as singleton instance
const azureOpenAIInstance = new AzureOpenAI();
module.exports = azureOpenAIInstance;

module.exports = new AzureOpenAI();