import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import Header from '../../ui/Header/Header';
import EnhancedFilterControls from '../EnhancedFilterControls/EnhancedFilterControls';
import CitationTrendsCard from '../CitationTrendsCard/CitationTrendsCard';
import AuthorNetworkCard from '../AuthorNetworkCard/AuthorNetworkCard';
import QualityMetricsCard from '../QualityMetricsCard/QualityMetricsCard';
import AdvancedCorrelationsCard from '../AdvancedCorrelationsCard/AdvancedCorrelationsCard';
import { useComprehensiveAnalytics } from '../../../hooks/useComprehensiveAnalytics';
import styles from './ComprehensiveAnalyticsDashboard.module.css';

const ComprehensiveAnalyticsDashboard = () => {
  // Filter state
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Active sections state
  const [activeSections, setActiveSections] = useState({
    citationTrends: true,
    authorNetworks: true,
    qualityMetrics: true,
    correlations: true
  });

  // Initialize comprehensive analytics hook
  const { 
    data, 
    loading, 
    error, 
    fetchComprehensiveAnalytics, 
    clearAllData,
    retryCount 
  } = useComprehensiveAnalytics();

  // Auto-fetch data on component mount
  useEffect(() => {
    handleSearchClick();
  }, []);

  const handleSearchClick = async () => {
    setIsSearching(true);
    
    console.log('🔄 Starting comprehensive analytics search');
    clearAllData();
    
    try {
      await fetchComprehensiveAnalytics(
        selectedTimeRange,
        selectedSubject,
        selectedCountry,
        selectedServer,
        'yearly',
        activeSections.citationTrends,
        activeSections.authorNetworks,
        true, // geographic insights
        true, // content analysis
        activeSections.qualityMetrics,
        true, // server analytics
        activeSections.correlations
      );
      console.log('🎉 Comprehensive analytics fetch completed');
    } catch (err) {
      console.error('Comprehensive analytics fetch failed:', err);
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
        server: selectedServer
      },
      activeSections,
      comprehensiveAnalytics: data,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `comprehensive-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRefreshData = () => {
    handleSearchClick();
  };

  const toggleSection = (sectionKey) => {
    setActiveSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Show error state if there's a critical error
  if (error.citationTrends && retryCount > 2) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Failed to Load Comprehensive Analytics</h3>
          <p className={styles.errorMessage}>
            Unable to load analytics data after multiple attempts. Please check your connection and try again.
          </p>
          <Button
            variant="primary"
            onClick={handleRefreshData}
            loading={isSearching}
            className={styles.retryButton}
          >
            Retry Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Dashboard Header */}
      <Header 
        title="Comprehensive Citation Analytics"
        subtitle="Advanced multi-dimensional analysis of research impact, collaboration patterns, quality metrics, and correlations across the global preprint landscape."
        variant="section"
        size="large"
        className={styles.dashboardHeader}
      />

      {/* Enhanced Filter Controls */}
      <EnhancedFilterControls
        selectedTimeRange={selectedTimeRange}
        selectedSubject={selectedSubject}
        selectedCountry={selectedCountry}
        sortOption="citations_desc"
        onTimeRangeChange={setSelectedTimeRange}
        onSubjectChange={setSelectedSubject}
        onCountryChange={setSelectedCountry}
        onSortChange={() => {}}
        onSearchClick={handleSearchClick}
        onExportData={handleExportData}
        onRefreshData={handleRefreshData}
        isSearching={isSearching}
      />

      {/* Section Toggle Controls */}
      <Card className={styles.sectionControls}>
        <Card.Header>
          <h3 className={styles.controlsTitle}>Analytics Sections</h3>
          <p className={styles.controlsSubtitle}>Toggle sections to customize your analysis</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.toggleGrid}>
            <label className={styles.toggleItem}>
              <input
                type="checkbox"
                checked={activeSections.citationTrends}
                onChange={() => toggleSection('citationTrends')}
                className={styles.toggleInput}
              />
              <span className={styles.toggleLabel}>Citation Trends</span>
            </label>
            <label className={styles.toggleItem}>
              <input
                type="checkbox"
                checked={activeSections.authorNetworks}
                onChange={() => toggleSection('authorNetworks')}
                className={styles.toggleInput}
              />
              <span className={styles.toggleLabel}>Author Networks</span>
            </label>
            <label className={styles.toggleItem}>
              <input
                type="checkbox"
                checked={activeSections.qualityMetrics}
                onChange={() => toggleSection('qualityMetrics')}
                className={styles.toggleInput}
              />
              <span className={styles.toggleLabel}>Quality Metrics</span>
            </label>
            <label className={styles.toggleItem}>
              <input
                type="checkbox"
                checked={activeSections.correlations}
                onChange={() => toggleSection('correlations')}
                className={styles.toggleInput}
              />
              <span className={styles.toggleLabel}>Correlations</span>
            </label>
          </div>
        </Card.Content>
      </Card>

      {/* Analytics Grid */}
      <div className={styles.analyticsGrid}>
        {/* Citation Trends Analysis */}
        {activeSections.citationTrends && (
          <div className={styles.fullWidthSection}>
            <CitationTrendsCard 
              data={data.citationTrends} 
              loading={loading.citationTrends}
            />
          </div>
        )}

        {/* Author Networks */}
        {activeSections.authorNetworks && (
          <AuthorNetworkCard 
            data={data.authorInstitutionAnalytics} 
            loading={loading.authorInstitutionAnalytics}
          />
        )}

        {/* Quality Metrics */}
        {activeSections.qualityMetrics && (
          <QualityMetricsCard 
            data={data.qualityImpactMetrics} 
            loading={loading.qualityImpactMetrics}
          />
        )}

        {/* Advanced Correlations */}
        {activeSections.correlations && (
          <div className={styles.fullWidthSection}>
            <AdvancedCorrelationsCard 
              data={data.advancedCorrelations} 
              loading={loading.advancedCorrelations}
            />
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <Card className={styles.summaryCard}>
        <Card.Header>
          <h3 className={styles.summaryTitle}>Analysis Summary</h3>
          <p className={styles.summarySubtitle}>Key insights from comprehensive analytics</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Active Sections</span>
              <span className={styles.summaryValue}>
                {Object.values(activeSections).filter(Boolean).length}/4
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Time Range</span>
              <span className={styles.summaryValue}>
                {selectedTimeRange.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Subject Filter</span>
              <span className={styles.summaryValue}>
                {selectedSubject || 'All Subjects'}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Country Filter</span>
              <span className={styles.summaryValue}>
                {selectedCountry || 'All Countries'}
              </span>
            </div>
          </div>
          
          {isSearching && (
            <div className={styles.searchingIndicator}>
              <div className={styles.searchingSpinner}></div>
              <span>Analyzing comprehensive data...</span>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default ComprehensiveAnalyticsDashboard;