import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

// Debug function to log API calls
const debugLog = (endpoint, params, response, error) => {
  console.group(`🔍 API Call: ${endpoint}`);
  console.log('📤 Request URL:', `${API_BASE_URL}${endpoint}?${params}`);
  console.log('📥 Response:', response);
  if (error) console.error('❌ Error:', error);
  console.groupEnd();
};

// Retry utility with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
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

export const useUnifiedCitationData = () => {
  const [data, setData] = useState({
    impactData: [],
    trendsData: [],
    heatmapData: [],
    topPapersData: []
  });
  const [loading, setLoading] = useState({
    impactData: false,
    trendsData: false,
    heatmapData: false,
    topPapersData: false
  });
  const [error, setError] = useState({
    impactData: null,
    trendsData: null,
    heatmapData: null,
    topPapersData: null
  });
  const [retryCount, setRetryCount] = useState(0);

  const fetchAllData = useCallback(async (timeRange = 'all', subject = null, sortBy = 'citations_desc', limit = 10) => {
    // Set loading state for all data types
    setLoading({
      impactData: true,
      trendsData: true,
      heatmapData: true,
      topPapersData: true
    });
    
    // Clear errors
    setError({
      impactData: null,
      trendsData: null,
      heatmapData: null,
      topPapersData: null
    });
    
    // Clear existing data immediately
    setData({
      impactData: [],
      trendsData: [],
      heatmapData: [],
      topPapersData: []
    });
    
    setRetryCount(0);

    // Use unified endpoint for consistent data
    const fetchFunction = async () => {
      const params = new URLSearchParams();
      if (timeRange) params.append('time_range', timeRange);
      if (subject) params.append('subject', subject);
      params.append('sort_by', sortBy);
      params.append('limit', limit.toString());
      
      const url = `${API_BASE_URL}/citation-data-unified?${params}`;
      console.log('🚀 Fetching unified citation data from:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Unified citation data received:', result);
      
      debugLog('/citation-data-unified', params.toString(), result, null);
      return result;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      
      // Update all data from unified response
      setData({
        impactData: result.impactData || [],
        trendsData: result.trendsData || [],
        heatmapData: result.heatmapData || [],
        topPapersData: result.topPapersData || []
      });
      
      // Clear all errors since unified fetch was successful
      setError({
        impactData: null,
        trendsData: null,
        heatmapData: null,
        topPapersData: null
      });
      
      console.log('🎉 Unified citation data fetch completed successfully');
      console.log(`📊 Data counts: impact=${result.impactData?.length}, trends=${result.trendsData?.length}, heatmap=${result.heatmapData?.length}, topPapers=${result.topPapersData?.length}`);
      
    } catch (err) {
      console.error('💥 Unified citation data fetch error after retries:', err);
      debugLog('/citation-data-unified', '', null, err);
      
      // Set error for all data types
      const errorMessage = err.message;
      setError({
        impactData: errorMessage,
        trendsData: errorMessage,
        heatmapData: errorMessage,
        topPapersData: errorMessage
      });
      
      // Keep data empty
      setData({
        impactData: [],
        trendsData: [],
        heatmapData: [],
        topPapersData: []
      });
      
      setRetryCount(prev => prev + 1);
    } finally {
      // Clear loading state for all data types
      setLoading({
        impactData: false,
        trendsData: false,
        heatmapData: false,
        topPapersData: false
      });
    }
  }, []);

  const clearAllData = useCallback(() => {
    setData({
      impactData: [],
      trendsData: [],
      heatmapData: [],
      topPapersData: []
    });
    setError({
      impactData: null,
      trendsData: null,
      heatmapData: null,
      topPapersData: null
    });
    setRetryCount(0);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    fetchAllData, 
    clearAllData, 
    retryCount 
  };
};