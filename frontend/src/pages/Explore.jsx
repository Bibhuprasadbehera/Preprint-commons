import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import SearchBar from '../components/ui/SearchBar/SearchBar';
import Pagination from '../components/ui/Pagination/Pagination';
import MapContainer from '../components/ui/MapContainer/MapContainer';
import Header from '../components/ui/Header/Header';
import Card from '../components/ui/Card/Card';
import FilterControls from '../components/ui/FilterControls/FilterControls';
import CitationScatterChart from '../components/charts/CitationScatterChart';
import CitationTrendsChart from '../components/charts/CitationTrendsChart';
import CitationHeatmap from '../components/charts/CitationHeatmap';
import PapersList from '../components/ui/PapersList/PapersList';
import DynamicSectionTitle from '../components/ui/DynamicSectionTitle/DynamicSectionTitle';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard/AnalyticsDashboard';
import AuthorAnalyticsCard from '../components/analytics/AuthorAnalyticsCard/AuthorAnalyticsCard';
import SubjectAnalyticsCard from '../components/analytics/SubjectAnalyticsCard/SubjectAnalyticsCard';
import GeographicAnalyticsCard from '../components/analytics/GeographicAnalyticsCard/GeographicAnalyticsCard';
import EnhancedFilterControls from '../components/analytics/EnhancedFilterControls/EnhancedFilterControls';
import CitationTrendsCard from '../components/analytics/CitationTrendsCard/CitationTrendsCard';
import AuthorNetworkCard from '../components/analytics/AuthorNetworkCard/AuthorNetworkCard';
import QualityMetricsCard from '../components/analytics/QualityMetricsCard/QualityMetricsCard';
import AdvancedCorrelationsCard from '../components/analytics/AdvancedCorrelationsCard/AdvancedCorrelationsCard';
import { useUnifiedCitationData } from '../hooks/useUnifiedCitationData';
import { useEnhancedAnalytics } from '../hooks/useEnhancedAnalytics';
import { useComprehensiveAnalytics } from '../hooks/useComprehensiveAnalytics';
import layoutStyles from '../components/layout/Layout/Layout.module.css';
import styles from './Explore.module.css';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Citation Analysis state
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sortOption, setSortOption] = useState('citations_desc');
  const [isSearching, setIsSearching] = useState(false);
  
  // Analytics view mode state
  const [analyticsViewMode, setAnalyticsViewMode] = useState('enhanced'); // 'basic', 'enhanced', 'comprehensive'
  
  const RESULTS_PER_PAGE = 10;
  const MAX_RESULTS = 100;

  // Initialize unified citation data hook
  const { data, loading, error, fetchAllData, clearAllData } = useUnifiedCitationData();
  
  // Initialize enhanced analytics hook
  const { 
    data: enhancedData, 
    loading: enhancedLoading, 
    error: enhancedError, 
    fetchEnhancedAnalytics, 
    clearAllData: clearEnhancedData 
  } = useEnhancedAnalytics();
  
  // Initialize comprehensive analytics hook
  const { 
    data: comprehensiveData, 
    loading: comprehensiveLoading, 
    error: comprehensiveError, 
    fetchComprehensiveAnalytics, 
    clearAllData: clearComprehensiveData 
  } = useComprehensiveAnalytics();
  
  const { impactData, trendsData, heatmapData, topPapersData } = data;
  const { impactData: impactLoading, trendsData: trendsLoading, heatmapData: heatmapLoading, topPapersData: papersLoading } = loading;
  const { impactData: impactError, trendsData: trendsError, heatmapData: heatmapError, topPapersData: papersError } = error;

  const openTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSearch = (page = 1) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setCurrentPage(page);
    
    const offset = (page - 1) * RESULTS_PER_PAGE;
    const limit = Math.min(RESULTS_PER_PAGE, MAX_RESULTS - offset);
    
    fetch(`/search?query=${encodeURIComponent(searchQuery)}&limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const results = Array.isArray(data) ? data : data.results || [];
        const total = Math.min(data.total || results.length, MAX_RESULTS);
        
        setSearchResults(results);
        setTotalResults(total);
        setTotalPages(Math.ceil(total / RESULTS_PER_PAGE));
        setHasSearched(true);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setSearchResults([]);
        setTotalResults(0);
        setTotalPages(0);
        setHasSearched(true);
        setIsLoading(false);
      });
  };

  const handlePageChange = (page) => {
    handleSearch(page);
    // Scroll to top of results
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalResults(0);
    setHasSearched(false);
  };

  const handleSearchClick = async () => {
    setIsSearching(true);
    
    // Clear all existing data immediately to avoid showing stale results
    console.log('🔄 Starting new search - clearing existing data');
    clearAllData();
    clearEnhancedData();
    clearComprehensiveData();
    
    // Fetch all citation data using unified hook
    console.log('📊 Fetching all citation data with filters:', {
      timeRange: selectedTimeRange,
      subject: selectedSubject,
      country: selectedCountry,
      sortOption: sortOption,
      viewMode: analyticsViewMode
    });
    
    try {
      const fetchPromises = [
        fetchAllData(selectedTimeRange, selectedSubject, sortOption, 10)
      ];
      
      // Add enhanced analytics if in enhanced or comprehensive mode
      if (analyticsViewMode === 'enhanced' || analyticsViewMode === 'comprehensive') {
        fetchPromises.push(
          fetchEnhancedAnalytics(
            selectedTimeRange, 
            selectedSubject, 
            selectedCountry,
            true, // includeAuthorData
            true, // includeSubjectData
            true, // includeGeographicData
            false // includeVelocityData
          )
        );
      }
      
      // Add comprehensive analytics if in comprehensive mode
      if (analyticsViewMode === 'comprehensive') {
        fetchPromises.push(
          fetchComprehensiveAnalytics(
            selectedTimeRange,
            selectedSubject,
            selectedCountry,
            null, // server
            'yearly', // granularity
            true, // includeCitationTrends
            true, // includeAuthorAnalytics
            true, // includeGeographicInsights
            true, // includeContentAnalysis
            true, // includeQualityMetrics
            true, // includeServerAnalytics
            true  // includeCorrelations
          )
        );
      }
      
      await Promise.all(fetchPromises);
      console.log('🎉 All analytics data fetch completed');
    } catch (err) {
      console.error('Analytics data fetch failed:', err);
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
      citationData: {
        impactData,
        trendsData,
        heatmapData,
        topPapersData
      },
      enhancedAnalytics: enhancedData,
      comprehensiveAnalytics: comprehensiveData,
      analyticsViewMode: analyticsViewMode
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `enhanced-citation-analysis-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleRefreshData = () => {
    handleSearchClick();
  };

  const handlePaperClick = (paper) => {
    console.log('Paper clicked:', paper);
    // Navigation is handled by the PapersList component
  };

  return (
    <Layout>
      <div className="centered-page">
        <Header 
          title="Explore Preprint Data"
          subtitle="Discover insights through interactive visualizations and comprehensive search capabilities."
          variant="page"
          size="large"
        />
        
        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <Button
            variant={activeTab === 'map' ? 'primary' : 'outline'}
            onClick={() => openTab('map')}
            className={styles.tabButton}
          >
            Interactive Map
          </Button>
          <Button
            variant={activeTab === 'search' ? 'primary' : 'outline'}
            onClick={() => openTab('search')}
            className={styles.tabButton}
          >
            Search Papers
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'primary' : 'outline'}
            onClick={() => openTab('analytics')}
            className={styles.tabButton}
          >
            Citation Analytics
          </Button>
          <Button
            variant={activeTab === 'dashboard' ? 'primary' : 'outline'}
            onClick={() => openTab('dashboard')}
            className={styles.tabButton}
          >
            Analytics Dashboard
          </Button>
        </div>
        
        {/* Map Tab */}
        {activeTab === 'map' && (
          <>
            <Header 
              title="Global Preprint Distribution"
              subtitle="Explore the geographic distribution of preprints worldwide. Use zoom and pan to see detailed statistics."
              variant="section"
              size="medium"
            />
            
            <MapContainer 
              title="Global Preprint Distribution Map"
              showStats={true}
              statsData={[
                { number: "300,000+", label: "Preprints Indexed" },
                { number: "50+", label: "Countries Contributing" },
                { number: "1,000+", label: "Institutions Tracked" }
              ]}
              className={styles.exploreMapContainer}
            />
          </>
        )}
        
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <Header 
                title="Search Preprints"
                subtitle={
                  <>
                    Search through our comprehensive database of preprints by title, DOI, author, or keywords.
                    <span className={styles.searchLimit}> Limited to {MAX_RESULTS} results for optimal performance.</span>
                  </>
                }
                variant="section"
                size="medium"
                className={styles.searchHeader}
              />
              
              <div className={styles.searchSection}>
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={() => handleSearch(1)}
                  placeholder="Search by title, DOI, author, or keywords..."
                  isLoading={isLoading}
                  className={styles.searchBar}
                />
                
                {hasSearched && searchQuery && (
                  <div className={styles.searchActions}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={resetSearch}
                      className={styles.clearButton}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
              
              <div id="search-results" className={styles.resultsSection}>
                {isLoading && (
                  <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p className="text-body">Searching through preprints...</p>
                  </div>
                )}
                
                {!isLoading && hasSearched && searchResults.length === 0 && (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h3 className="text-heading-4 mb-2">No Results Found</h3>
                    <p className="text-body mb-4">
                      No preprints match your search query "{searchQuery}".
                    </p>
                    <p className="text-body-small text-neutral-600">
                      Try different keywords or check your spelling.
                    </p>
                  </div>
                )}
                
                {!isLoading && searchResults.length > 0 && (
                  <>
                    <PapersList 
                      papers={searchResults}
                      loading={false}
                      onPaperClick={(paper) => console.log('Paper clicked:', paper)}
                    />
                    
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        hasNextPage={currentPage < totalPages}
                        hasPrevPage={currentPage > 1}
                        totalResults={totalResults}
                        resultsPerPage={RESULTS_PER_PAGE}
                        className={styles.pagination}
                      />
                    )}
                  </>
                )}
                
                {!hasSearched && (
                  <div className={styles.welcomeState}>
                    <div className={styles.welcomeIcon}>📚</div>
                    <h3 className="text-heading-4 mb-2">Start Your Search</h3>
                    <p className="text-body mb-4">
                      Enter keywords, author names, DOIs, or paper titles to begin exploring our preprint database.
                    </p>
                    <div className={styles.searchTips}>
                      <h4 className="text-body-small font-medium mb-2">Search Tips:</h4>
                      <ul className={styles.tipsList}>
                        <li>Use specific keywords for better results</li>
                        <li>Try author surnames or institution names</li>
                        <li>Search by DOI for exact matches</li>
                        <li>Use quotation marks for exact phrases</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Analytics Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <AnalyticsDashboard />
            </div>
          </div>
        )}
        
        {/* Citation Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <Header 
                title="Citation Analytics Dashboard"
                subtitle="Set your filters and click 'Search & Analyze' to explore research impact and citation patterns through interactive visualizations."
                variant="section"
                size="medium"
              />

              {/* Analytics View Mode Selector */}
              <Card className={styles.viewModeSelector}>
                <Card.Content>
                  <div className={styles.viewModeHeader}>
                    <h4 className={styles.viewModeTitle}>Analytics View Mode</h4>
                    <p className={styles.viewModeSubtitle}>Choose your analysis depth</p>
                  </div>
                  <div className={styles.viewModeButtons}>
                    <Button
                      variant={analyticsViewMode === 'basic' ? 'primary' : 'outline'}
                      onClick={() => setAnalyticsViewMode('basic')}
                      className={styles.viewModeButton}
                    >
                      Basic Analytics
                    </Button>
                    <Button
                      variant={analyticsViewMode === 'enhanced' ? 'primary' : 'outline'}
                      onClick={() => setAnalyticsViewMode('enhanced')}
                      className={styles.viewModeButton}
                    >
                      Enhanced Analytics
                    </Button>
                    <Button
                      variant={analyticsViewMode === 'comprehensive' ? 'primary' : 'outline'}
                      onClick={() => setAnalyticsViewMode('comprehensive')}
                      className={styles.viewModeButton}
                    >
                      Comprehensive Analytics
                    </Button>
                  </div>
                </Card.Content>
              </Card>

              <EnhancedFilterControls
                selectedTimeRange={selectedTimeRange}
                selectedSubject={selectedSubject}
                selectedCountry={selectedCountry}
                sortOption={sortOption}
                onTimeRangeChange={setSelectedTimeRange}
                onSubjectChange={setSelectedSubject}
                onCountryChange={setSelectedCountry}
                onSortChange={setSortOption}
                onSearchClick={handleSearchClick}
                onExportData={handleExportData}
                onRefreshData={handleRefreshData}
                isSearching={isSearching}
              />

              {/* Enhanced Analytics Grid - Show in enhanced and comprehensive modes */}
              {(analyticsViewMode === 'enhanced' || analyticsViewMode === 'comprehensive') && (
                <div className={styles.enhancedAnalyticsGrid}>
                  <AuthorAnalyticsCard 
                    data={enhancedData.authorAnalytics} 
                    loading={enhancedLoading.authorAnalytics}
                  />
                  
                  <SubjectAnalyticsCard 
                    data={enhancedData.enhancedSubjectAnalysis} 
                    loading={enhancedLoading.enhancedSubjectAnalysis}
                  />
                  
                  <GeographicAnalyticsCard 
                    data={enhancedData.geographicAnalytics} 
                    loading={enhancedLoading.geographicAnalytics}
                  />
                </div>
              )}

              {/* Comprehensive Analytics Grid - Show only in comprehensive mode */}
              {analyticsViewMode === 'comprehensive' && (
                <div className={styles.comprehensiveAnalyticsGrid}>
                  <div className={styles.fullWidthSection}>
                    <CitationTrendsCard 
                      data={comprehensiveData.citationTrends} 
                      loading={comprehensiveLoading.citationTrends}
                    />
                  </div>
                  
                  <AuthorNetworkCard 
                    data={comprehensiveData.authorInstitutionAnalytics} 
                    loading={comprehensiveLoading.authorInstitutionAnalytics}
                  />
                  
                  <QualityMetricsCard 
                    data={comprehensiveData.qualityImpactMetrics} 
                    loading={comprehensiveLoading.qualityImpactMetrics}
                  />
                  
                  <div className={styles.fullWidthSection}>
                    <AdvancedCorrelationsCard 
                      data={comprehensiveData.advancedCorrelations} 
                      loading={comprehensiveLoading.advancedCorrelations}
                    />
                  </div>
                </div>
              )}

              {/* Basic Charts Grid - Always show */}
              <div className={styles.chartsGrid}>
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Citation Impact Visualization</h3>
                    <p className={styles.chartSubtitle}>Publication Date vs Citations</p>
                  </Card.Header>
                  <Card.Content>
                    <CitationScatterChart data={impactData} loading={impactLoading} />
                    {impactError && (
                      <div className={styles.error}>
                        Error: {impactError}
                        <span className={styles.retryInfo}> (Auto-retrying...)</span>
                      </div>
                    )}
                  </Card.Content>
                </Card>

                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Citation Trends Over Time</h3>
                    <p className={styles.chartSubtitle}>Citation Accumulation</p>
                  </Card.Header>
                  <Card.Content>
                    <CitationTrendsChart data={trendsData} loading={trendsLoading} />
                    {trendsError && (
                      <div className={styles.error}>
                        Error: {trendsError}
                        <span className={styles.retryInfo}> (Auto-retrying...)</span>
                      </div>
                    )}
                  </Card.Content>
                </Card>

                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Citation Heatmap</h3>
                    <p className={styles.chartSubtitle}>Citation Patterns by Year</p>
                  </Card.Header>
                  <Card.Content>
                    <CitationHeatmap data={heatmapData} loading={heatmapLoading} />
                    {heatmapError && (
                      <div className={styles.error}>
                        Error: {heatmapError}
                        <span className={styles.retryInfo}> (Auto-retrying...)</span>
                      </div>
                    )}
                  </Card.Content>
                </Card>

                <Card className={styles.chartCard}>
                  <Card.Header>
                    <DynamicSectionTitle sortOption={sortOption} />
                  </Card.Header>
                  <Card.Content>
                    <PapersList 
                      papers={topPapersData} 
                      loading={papersLoading}
                      onPaperClick={handlePaperClick}
                    />
                    {papersError && (
                      <div className={styles.error}>
                        Error: {papersError}
                        <span className={styles.retryInfo}> (Auto-retrying...)</span>
                      </div>
                    )}
                  </Card.Content>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;