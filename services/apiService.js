// src/services/apiService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic request method with better error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      
      // Log response status
      console.log(`📡 API Response: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      console.log(`✅ API Success:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      
      // Network error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Backend server not running. Please start the Flask server on port 5000.');
      }
      
      throw error;
    }
  }

  // Health check with detailed logging
  async healthCheck() {
    console.log('🔍 Checking backend health...');
    try {
      const result = await this.request('/health');
      console.log('💚 Backend is healthy:', result);
      return result;
    } catch (error) {
      console.error('❤️‍🩹 Backend health check failed:', error);
      throw error;
    }
  }

  // Train model
  async trainModel() {
    console.log('🤖 Starting model training...');
    try {
      const result = await this.request('/train', {
        method: 'POST',
      });
      console.log('🎉 Model training completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Model training failed:', error);
      throw error;
    }
  }

  // Test endpoint
  async testConnection() {
    console.log('🧪 Testing API connection...');
    try {
      const result = await this.request('/test');
      console.log('✅ API connection test passed:', result);
      return result;
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      throw error;
    }
  }

  // Upload file and run prediction
  async predict(file, selectedModels = ['random-forest']) {
    console.log('🔮 Starting prediction...');
    console.log('📁 File:', file.name, `(${file.size} bytes)`);
    console.log('🤖 Selected models:', selectedModels);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('models', JSON.stringify(selectedModels));

    try {
      const result = await this.request('/predict', {
        method: 'POST',
        body: formData,
      });
      console.log('🎉 Prediction completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Prediction failed:', error);
      throw error;
    }
  }

  // Batch prediction (future feature)
  async batchPredict(files, selectedModels = ['random-forest']) {
    console.log('📚 Starting batch prediction...');
    
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
    formData.append('models', JSON.stringify(selectedModels));

    try {
      const result = await this.request('/batch-predict', {
        method: 'POST',
        body: formData,
      });
      console.log('🎉 Batch prediction completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Batch prediction failed:', error);
      throw error;
    }
  }

  // Get model information
  async getModels() {
    console.log('📊 Fetching model information...');
    try {
      const result = await this.request('/models');
      console.log('📋 Models info:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to get models:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export the service
export default apiService;

// Export individual methods for easier importing
export const {
  healthCheck,
  trainModel,
  testConnection,
  predict,
  batchPredict,
  getModels,
} = apiService;

// Helper function to check if backend is running
export const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        isRunning: true,
        status: data.status,
        modelTrained: data.model_trained,
        accuracy: data.training_accuracy
      };
    } else {
      return {
        isRunning: false,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      isRunning: false,
      error: error.message
    };
  }
};

// Helper function to create notification
export const showNotification = (message, type = 'info') => {
  console.log(`🔔 ${type.toUpperCase()}: ${message}`);
  
  // You can replace this with your actual notification system
  const event = new CustomEvent('apiNotification', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
};