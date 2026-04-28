export const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000';

// Debug function to log API calls
export const debugLog = (endpoint, params, response, error) => {
  console.group(`🔍 API Call: ${endpoint}`);
  console.log('📤 Request URL:', `${API_BASE_URL}${endpoint}?${params}`);
  console.log('📥 Response:', response);
  if (error) console.error('❌ Error:', error);
  console.groupEnd();
};

// Retry utility with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries + 1} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};