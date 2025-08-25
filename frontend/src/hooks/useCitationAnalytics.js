import { useState } from 'react';
import { useUnifiedCitationData } from './useUnifiedCitationData';

export const useCitationAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sortOption, setSortOption] = useState('citations_desc');
  const [isSearching, setIsSearching] = useState(false);
  const [lastAnalyticsFilters, setLastAnalyticsFilters] = useState(null);
  const [analyticsDataCached, setAnalyticsDataCached] = useState(false);

  const { data, loading, error, fetchAllData, clearAllData } = useUnifiedCitationData();

  const handleSearchClick = async (forceRefresh = false) => {
    const currentFilters = {
      timeRange: selectedTimeRange,
      subject: selectedSubject,
      country: selectedCountry,
      sortOption: sortOption
    };

    if (!forceRefresh && !filtersChanged(currentFilters, lastAnalyticsFilters) && analyticsDataCached) {
      console.log('📋 Using cached analytics data');
      return;
    }

    setIsSearching(true);
    console.log('🔄 Starting new search - clearing existing data');
    clearAllData();
    console.log('📊 Fetching all citation data with filters:', currentFilters);
    
    try {
      await fetchAllData(selectedTimeRange, selectedSubject, sortOption, 10);
      setLastAnalyticsFilters(currentFilters);
      setAnalyticsDataCached(true);
      console.log('✅ Analytics data cached');
    } catch (err) {
      console.error('Analytics data fetch failed:', err);
      setAnalyticsDataCached(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      filters: {
        timeRange: selectedTimeRange,
        subject: selectedSubject,
        country: selectedCountry,
        sortOption: sortOption
      },
      citationData: data
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `citation-analysis-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRefreshData = () => {
    handleSearchClick(true);
  };

  const filtersChanged = (current, last) => {
    if (!last) return true;
    return JSON.stringify(current) !== JSON.stringify(last);
  };

  return {
    selectedTimeRange,
    setSelectedTimeRange,
    selectedSubject,
    setSelectedSubject,
    selectedCountry,
    setSelectedCountry,
    sortOption,
    setSortOption,
    isSearching,
    handleSearchClick,
    handleExportData,
    handleRefreshData,
    citationData: data,
    citationLoading: loading,
    citationError: error,
  };
};
