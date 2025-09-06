import { useState, useCallback } from 'react';
import { API_BASE_URL, debugLog, retryWithBackoff } from '../utils/api';

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
      
      const url = `${API_BASE_URL}/api/analytics/citations?${params}`;
      console.log('🚀 Fetching unified citation data from:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Unified citation data received:', result);
      
      debugLog('/api/analytics/citations', params.toString(), result, null);
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
      debugLog('/api/analytics/citations', '', null, err);
      
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
