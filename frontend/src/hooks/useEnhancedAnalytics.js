import { useState, useCallback } from 'react';
import { API_BASE_URL, debugLog, retryWithBackoff } from '../utils/api';

export const useEnhancedAnalytics = () => {
  const [data, setData] = useState({
    authorAnalytics: [],
    enhancedSubjectAnalysis: [],
    geographicAnalytics: [],
    citationVelocityAnalysis: []
  });
  
  const [loading, setLoading] = useState({
    authorAnalytics: false,
    enhancedSubjectAnalysis: false,
    geographicAnalytics: false,
    citationVelocityAnalysis: false
  });
  
  const [error, setError] = useState({
    authorAnalytics: null,
    enhancedSubjectAnalysis: null,
    geographicAnalytics: null,
    citationVelocityAnalysis: null
  });
  
  const [retryCount, setRetryCount] = useState(0);

  const fetchEnhancedAnalytics = useCallback(async (
    timeRange = 'all',
    subject = null,
    country = null,
    includeAuthorData = true,
    includeSubjectData = true,
    includeGeographicData = true,
    includeVelocityData = true
  ) => {
    // Set loading state for requested data types
    setLoading({
      authorAnalytics: includeAuthorData,
      enhancedSubjectAnalysis: includeSubjectData,
      geographicAnalytics: includeGeographicData,
      citationVelocityAnalysis: includeVelocityData
    });
    
    // Clear errors
    setError({
      authorAnalytics: null,
      enhancedSubjectAnalysis: null,
      geographicAnalytics: null,
      citationVelocityAnalysis: null
    });
    
    // Clear existing data immediately
    setData({
      authorAnalytics: [],
      enhancedSubjectAnalysis: [],
      geographicAnalytics: [],
      citationVelocityAnalysis: []
    });
    
    setRetryCount(0);

    // For now, we'll use mock data since the enhanced endpoints don't exist yet
    // In a real implementation, this would call the enhanced analytics API
    const fetchFunction = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Import mock data
      const { mockEnhancedAnalytics } = await import('../components/analytics/EnhancedAnalyticsMockData');
      
      console.log('🚀 Fetching enhanced analytics data with filters:', {
        timeRange, subject, country, includeAuthorData, includeSubjectData, includeGeographicData, includeVelocityData
      });
      
      // Apply basic filtering to mock data
      let result = { ...mockEnhancedAnalytics };
      
      // Filter by subject if specified
      if (subject) {
        result.authorAnalytics = result.authorAnalytics.filter(author => 
          author.primary_subjects.includes(subject)
        );
        result.enhancedSubjectAnalysis = result.enhancedSubjectAnalysis.filter(subj => 
          subj.subject === subject
        );
        result.citationVelocityAnalysis = result.citationVelocityAnalysis.filter(paper => 
          paper.subject === subject
        );
      }
      
      // Filter by country if specified
      if (country) {
        result.authorAnalytics = result.authorAnalytics.filter(author => 
          author.countries.includes(country)
        );
        result.geographicAnalytics = result.geographicAnalytics.filter(geo => 
          geo.country === country
        );
      }
      
      // Only return requested data types
      const filteredResult = {};
      if (includeAuthorData) filteredResult.authorAnalytics = result.authorAnalytics;
      if (includeSubjectData) filteredResult.enhancedSubjectAnalysis = result.enhancedSubjectAnalysis;
      if (includeGeographicData) filteredResult.geographicAnalytics = result.geographicAnalytics;
      if (includeVelocityData) filteredResult.citationVelocityAnalysis = result.citationVelocityAnalysis;
      
      console.log('✅ Enhanced analytics data received:', filteredResult);
      return filteredResult;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      
      // Update data from response
      setData({
        authorAnalytics: result.authorAnalytics || [],
        enhancedSubjectAnalysis: result.enhancedSubjectAnalysis || [],
        geographicAnalytics: result.geographicAnalytics || [],
        citationVelocityAnalysis: result.citationVelocityAnalysis || []
      });
      
      // Clear all errors since fetch was successful
      setError({
        authorAnalytics: null,
        enhancedSubjectAnalysis: null,
        geographicAnalytics: null,
        citationVelocityAnalysis: null
      });
      
      console.log('🎉 Enhanced analytics data fetch completed successfully');
      console.log(`📊 Data counts: authors=${result.authorAnalytics?.length}, subjects=${result.enhancedSubjectAnalysis?.length}, geographic=${result.geographicAnalytics?.length}, velocity=${result.citationVelocityAnalysis?.length}`);
      
    } catch (err) {
      console.error('💥 Enhanced analytics data fetch error after retries:', err);
      debugLog('/enhanced-analytics', '', null, err);
      
      // Set error for all data types
      const errorMessage = err.message;
      setError({
        authorAnalytics: errorMessage,
        enhancedSubjectAnalysis: errorMessage,
        geographicAnalytics: errorMessage,
        citationVelocityAnalysis: errorMessage
      });
      
      // Keep data empty
      setData({
        authorAnalytics: [],
        enhancedSubjectAnalysis: [],
        geographicAnalytics: [],
        citationVelocityAnalysis: []
      });
      
      setRetryCount(prev => prev + 1);
    } finally {
      // Clear loading state for all data types
      setLoading({
        authorAnalytics: false,
        enhancedSubjectAnalysis: false,
        geographicAnalytics: false,
        citationVelocityAnalysis: false
      });
    }
  }, []);

  const clearAllData = useCallback(() => {
    setData({
      authorAnalytics: [],
      enhancedSubjectAnalysis: [],
      geographicAnalytics: [],
      citationVelocityAnalysis: []
    });
    setError({
      authorAnalytics: null,
      enhancedSubjectAnalysis: null,
      geographicAnalytics: null,
      citationVelocityAnalysis: null
    });
    setRetryCount(0);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    fetchEnhancedAnalytics, 
    clearAllData, 
    retryCount 
  };
};