import { useState, useCallback } from 'react';
import { API_BASE_URL, debugLog, retryWithBackoff } from '../utils/api';

export const useAnalyticsData = () => {
  const [data, setData] = useState({
    timelineData: [],
    subjectData: [],
    serverData: [],
    statisticsData: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    
    // Clear existing data immediately
    setData({
      timelineData: [],
      subjectData: [],
      serverData: [],
      statisticsData: null
    });

    const fetchFunction = async () => {
      const url = `${API_BASE_URL}/analytics-data`;
      console.log('🚀 Fetching analytics data from:', url);
      
      const response = await fetch(url);
      console.log('📊 Analytics response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Analytics data received:', result);
      
      debugLog('/analytics-data', '', result, null);
      return result;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      
      // Update data from API response
      setData({
        timelineData: result.timelineData || [],
        subjectData: result.subjectData || [],
        serverData: result.serverData || [],
        statisticsData: result.statisticsData || null
      });
      
      setError(null);
      console.log('🎉 Analytics data fetch completed successfully');
      console.log(`📊 Data counts: timeline=${result.timelineData?.length}, subjects=${result.subjectData?.length}, servers=${result.serverData?.length}`);
      
    } catch (err) {
      console.error('💥 Analytics data fetch error after retries:', err);
      debugLog('/analytics-data', '', null, err);
      
      setError(err.message);
      setData({
        timelineData: [],
        subjectData: [],
        serverData: [],
        statisticsData: null
      });
      
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData({
      timelineData: [],
      subjectData: [],
      serverData: [],
      statisticsData: null
    });
    setError(null);
    setRetryCount(0);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    fetchAnalyticsData, 
    clearData, 
    retryCount 
  };
};