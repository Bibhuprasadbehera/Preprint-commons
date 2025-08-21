import { useState, useCallback } from 'react';
import { API_BASE_URL, debugLog, retryWithBackoff } from '../utils/api';

export const useComprehensiveAnalytics = () => {
  const [data, setData] = useState({
    citationTrends: {},
    authorInstitutionAnalytics: {},
    geographicTemporalInsights: {},
    contentSubjectAnalysis: {},
    qualityImpactMetrics: {},
    serverPlatformAnalytics: {},
    advancedCorrelations: {}
  });
  
  const [loading, setLoading] = useState({
    citationTrends: false,
    authorInstitutionAnalytics: false,
    geographicTemporalInsights: false,
    contentSubjectAnalysis: false,
    qualityImpactMetrics: false,
    serverPlatformAnalytics: false,
    advancedCorrelations: false
  });
  
  const [error, setError] = useState({
    citationTrends: null,
    authorInstitutionAnalytics: null,
    geographicTemporalInsights: null,
    contentSubjectAnalysis: null,
    qualityImpactMetrics: null,
    serverPlatformAnalytics: null,
    advancedCorrelations: null
  });
  
  const [retryCount, setRetryCount] = useState(0);

  const fetchComprehensiveAnalytics = useCallback(async (
    timeRange = 'all',
    subject = null,
    country = null,
    server = null,
    granularity = 'yearly',
    includeCitationTrends = true,
    includeAuthorAnalytics = true,
    includeGeographicInsights = true,
    includeContentAnalysis = true,
    includeQualityMetrics = true,
    includeServerAnalytics = true,
    includeCorrelations = true
  ) => {
    // Set loading state for requested data types
    setLoading({
      citationTrends: includeCitationTrends,
      authorInstitutionAnalytics: includeAuthorAnalytics,
      geographicTemporalInsights: includeGeographicInsights,
      contentSubjectAnalysis: includeContentAnalysis,
      qualityImpactMetrics: includeQualityMetrics,
      serverPlatformAnalytics: includeServerAnalytics,
      advancedCorrelations: includeCorrelations
    });
    
    // Clear errors
    setError({
      citationTrends: null,
      authorInstitutionAnalytics: null,
      geographicTemporalInsights: null,
      contentSubjectAnalysis: null,
      qualityImpactMetrics: null,
      serverPlatformAnalytics: null,
      advancedCorrelations: null
    });
    
    // Clear existing data immediately
    setData({
      citationTrends: {},
      authorInstitutionAnalytics: {},
      geographicTemporalInsights: {},
      contentSubjectAnalysis: {},
      qualityImpactMetrics: {},
      serverPlatformAnalytics: {},
      advancedCorrelations: {}
    });
    
    setRetryCount(0);

    // For now, we'll use mock data since the comprehensive endpoints don't exist yet
    // In a real implementation, this would call the comprehensive analytics API
    const fetchFunction = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Import mock data
      const { mockComprehensiveAnalytics } = await import('../components/analytics/ComprehensiveAnalyticsMockData');
      
      console.log('🚀 Fetching comprehensive analytics data with filters:', {
        timeRange, subject, country, server, granularity,
        includeCitationTrends, includeAuthorAnalytics, includeGeographicInsights,
        includeContentAnalysis, includeQualityMetrics, includeServerAnalytics, includeCorrelations
      });
      
      // Apply basic filtering to mock data
      let result = { ...mockComprehensiveAnalytics };
      
      // Filter by subject if specified
      if (subject) {
        if (result.citationTrends.distributionBySubject) {
          result.citationTrends.distributionBySubject = result.citationTrends.distributionBySubject.filter(s => s.subject === subject);
        }
        if (result.citationTrends.topCitedTimeline) {
          result.citationTrends.topCitedTimeline = result.citationTrends.topCitedTimeline.filter(p => p.subject === subject);
        }
      }
      
      // Filter by country if specified
      if (country) {
        if (result.geographicTemporalInsights.researchHotspots) {
          result.geographicTemporalInsights.researchHotspots = result.geographicTemporalInsights.researchHotspots.filter(h => h.country === country);
        }
      }
      
      // Filter by server if specified
      if (server) {
        if (result.serverPlatformAnalytics.serverGrowthTrends) {
          result.serverPlatformAnalytics.serverGrowthTrends = result.serverPlatformAnalytics.serverGrowthTrends.filter(s => s.server === server);
        }
      }
      
      // Only return requested data types
      const filteredResult = {};
      if (includeCitationTrends) filteredResult.citationTrends = result.citationTrends;
      if (includeAuthorAnalytics) filteredResult.authorInstitutionAnalytics = result.authorInstitutionAnalytics;
      if (includeGeographicInsights) filteredResult.geographicTemporalInsights = result.geographicTemporalInsights;
      if (includeContentAnalysis) filteredResult.contentSubjectAnalysis = result.contentSubjectAnalysis;
      if (includeQualityMetrics) filteredResult.qualityImpactMetrics = result.qualityImpactMetrics;
      if (includeServerAnalytics) filteredResult.serverPlatformAnalytics = result.serverPlatformAnalytics;
      if (includeCorrelations) filteredResult.advancedCorrelations = result.advancedCorrelations;
      
      console.log('✅ Comprehensive analytics data received:', filteredResult);
      return filteredResult;
    };
    
    try {
      const result = await retryWithBackoff(fetchFunction, 3, 1000);
      
      // Update data from response
      setData({
        citationTrends: result.citationTrends || {},
        authorInstitutionAnalytics: result.authorInstitutionAnalytics || {},
        geographicTemporalInsights: result.geographicTemporalInsights || {},
        contentSubjectAnalysis: result.contentSubjectAnalysis || {},
        qualityImpactMetrics: result.qualityImpactMetrics || {},
        serverPlatformAnalytics: result.serverPlatformAnalytics || {},
        advancedCorrelations: result.advancedCorrelations || {}
      });
      
      // Clear all errors since fetch was successful
      setError({
        citationTrends: null,
        authorInstitutionAnalytics: null,
        geographicTemporalInsights: null,
        contentSubjectAnalysis: null,
        qualityImpactMetrics: null,
        serverPlatformAnalytics: null,
        advancedCorrelations: null
      });
      
      console.log('🎉 Comprehensive analytics data fetch completed successfully');
      
    } catch (err) {
      console.error('💥 Comprehensive analytics data fetch error after retries:', err);
      debugLog('/comprehensive-analytics', '', null, err);
      
      // Set error for all data types
      const errorMessage = err.message;
      setError({
        citationTrends: errorMessage,
        authorInstitutionAnalytics: errorMessage,
        geographicTemporalInsights: errorMessage,
        contentSubjectAnalysis: errorMessage,
        qualityImpactMetrics: errorMessage,
        serverPlatformAnalytics: errorMessage,
        advancedCorrelations: errorMessage
      });
      
      // Keep data empty
      setData({
        citationTrends: {},
        authorInstitutionAnalytics: {},
        geographicTemporalInsights: {},
        contentSubjectAnalysis: {},
        qualityImpactMetrics: {},
        serverPlatformAnalytics: {},
        advancedCorrelations: {}
      });
      
      setRetryCount(prev => prev + 1);
    } finally {
      // Clear loading state for all data types
      setLoading({
        citationTrends: false,
        authorInstitutionAnalytics: false,
        geographicTemporalInsights: false,
        contentSubjectAnalysis: false,
        qualityImpactMetrics: false,
        serverPlatformAnalytics: false,
        advancedCorrelations: false
      });
    }
  }, []);

  const clearAllData = useCallback(() => {
    setData({
      citationTrends: {},
      authorInstitutionAnalytics: {},
      geographicTemporalInsights: {},
      contentSubjectAnalysis: {},
      qualityImpactMetrics: {},
      serverPlatformAnalytics: {},
      advancedCorrelations: {}
    });
    setError({
      citationTrends: null,
      authorInstitutionAnalytics: null,
      geographicTemporalInsights: null,
      contentSubjectAnalysis: null,
      qualityImpactMetrics: null,
      serverPlatformAnalytics: null,
      advancedCorrelations: null
    });
    setRetryCount(0);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    fetchComprehensiveAnalytics, 
    clearAllData, 
    retryCount 
  };
};