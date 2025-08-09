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

export const useCitationImpactData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async (timeRange = 'all', subject = null) => {
    setLoading(true);
    setError(null);
    setData([]); // Clear existing data immediately
    setRetryCount(0);
    
    const fetchFunction = async () => {
      const params = new URLSearchParams();
      if (timeRange) params.append('time_range', timeRange);
      if (subject) params.append('subject', subject);
      
      const url = `${API_BASE_URL}/citation-impact?${params}`;
      console.log('🚀 Fetching citation impact data from:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Citation impact data received:', result);
      
      debugLog('/citation-impact', params.toString(), result, null);
      return result;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      setData(result.data || []);
    } catch (err) {
      console.error('💥 Citation impact fetch error after retries:', err);
      debugLog('/citation-impact', '', null, err);
      setError(err.message);
      setData([]);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    setRetryCount(0);
  }, []);

  return { data, loading, error, fetchData, clearData, retryCount };
};

export const useCitationTrendsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async (timeRange = 'all', subject = null) => {
    setLoading(true);
    setError(null);
    setData([]); // Clear existing data immediately
    setRetryCount(0);
    
    const fetchFunction = async () => {
      const params = new URLSearchParams();
      if (timeRange) params.append('time_range', timeRange);
      if (subject) params.append('subject', subject);
      
      const url = `${API_BASE_URL}/citation-trends?${params}`;
      console.log('🚀 Fetching citation trends data from:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Citation trends data received:', result);
      
      debugLog('/citation-trends', params.toString(), result, null);
      return result;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      setData(result.data || []);
    } catch (err) {
      console.error('💥 Citation trends fetch error after retries:', err);
      debugLog('/citation-trends', '', null, err);
      setError(err.message);
      setData([]);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    setRetryCount(0);
  }, []);

  return { data, loading, error, fetchData, clearData, retryCount };
};

export const useCitationHeatmapData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async (timeRange = 'all') => {
    setLoading(true);
    setError(null);
    setData([]); // Clear existing data immediately
    setRetryCount(0);
    
    const fetchFunction = async () => {
      const params = new URLSearchParams();
      if (timeRange) params.append('time_range', timeRange);
      
      const url = `${API_BASE_URL}/citation-heatmap?${params}`;
      console.log('🚀 Fetching citation heatmap data from:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Citation heatmap data received:', result);
      
      debugLog('/citation-heatmap', params.toString(), result, null);
      return result;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      setData(result.data || []);
    } catch (err) {
      console.error('💥 Citation heatmap fetch error after retries:', err);
      debugLog('/citation-heatmap', '', null, err);
      setError(err.message);
      setData([]);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    setRetryCount(0);
  }, []);

  return { data, loading, error, fetchData, clearData, retryCount };
};

export const useTopCitedPapersData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async (limit = 10, sortBy = 'citations_desc', timeRange = 'all', subject = null) => {
    setLoading(true);
    setError(null);
    setData([]); // Clear existing data immediately
    setRetryCount(0);
    
    const fetchFunction = async () => {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('sort_by', sortBy);
      if (timeRange) params.append('time_range', timeRange);
      if (subject) params.append('subject', subject);
      
      const url = `${API_BASE_URL}/top-cited-papers?${params}`;
      console.log('🚀 Fetching top cited papers data from:', url);
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Top cited papers data received:', result);
      
      debugLog('/top-cited-papers', params.toString(), result, null);
      return result;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      setData(result.data || []);
    } catch (err) {
      console.error('💥 Top cited papers fetch error after retries:', err);
      debugLog('/top-cited-papers', '', null, err);
      setError(err.message);
      setData([]);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData([]);
    setError(null);
    setRetryCount(0);
  }, []);

  return { data, loading, error, fetchData, clearData, retryCount };
};