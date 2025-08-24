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
import CitationScatterChart from '../components/citationCharts/CitationScatterChart';
import CitationTrendsChart from '../components/citationCharts/CitationTrendsChart';
import CitationHeatmap from '../components/citationCharts/CitationHeatmap';
import PapersList from '../components/ui/PapersList/PapersList';
import DynamicSectionTitle from '../components/ui/DynamicSectionTitle/DynamicSectionTitle';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard/AnalyticsDashboard';
import { useUnifiedCitationData } from '../hooks/useUnifiedCitationData';
import ApiService from '../services/api';
import layoutStyles from '../components/layout/Layout/Layout.module.css';
import styles from './ExplorePage.module.css';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Author search state
  const [authorQuery, setAuthorQuery] = useState('');
  const [authorResults, setAuthorResults] = useState([]);
  const [isAuthorLoading, setIsAuthorLoading] = useState(false);
  const [authorCurrentPage, setAuthorCurrentPage] = useState(1);
  const [authorTotalPages, setAuthorTotalPages] = useState(0);
  const [authorTotalResults, setAuthorTotalResults] = useState(0);
  const [hasAuthorSearched, setHasAuthorSearched] = useState(false);
  
  // Citation Analysis state
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sortOption, setSortOption] = useState('citations_desc');
  const [isSearching, setIsSearching] = useState(false);
  
  const RESULTS_PER_PAGE = 20;
  const MAX_RESULTS = 200;

  // Initialize unified citation data hook
  const { data, loading, error, fetchAllData, clearAllData } = useUnifiedCitationData();
  
  const { impactData, trendsData, heatmapData, topPapersData } = data;
  const { impactData: impactLoading, trendsData: trendsLoading, heatmapData: heatmapLoading, topPapersData: papersLoading } = loading;
  const { impactData: impactError, trendsData: trendsError, heatmapData: heatmapError, topPapersData: papersError } = error;

  const openTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setCurrentPage(page);

    try {
      const data = await ApiService.searchPapers(searchQuery, page, RESULTS_PER_PAGE);
      console.log('Search results:', data);

      const results = data.papers || [];
      const total = Math.min(data.total || results.length, MAX_RESULTS);

      setSearchResults(results);
      setTotalResults(total);
      setTotalPages(Math.ceil(total / RESULTS_PER_PAGE));
      setHasSearched(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(0);
      setHasSearched(true);
      setIsLoading(false);
    }
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
    
    // Fetch all citation data using unified hook
    console.log('📊 Fetching all citation data with filters:', {
      timeRange: selectedTimeRange,
      subject: selectedSubject,
      country: selectedCountry,
      sortOption: sortOption
    });
    
    try {
      await fetchAllData(selectedTimeRange, selectedSubject, sortOption, 10);
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
      }
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
    handleSearchClick();
  };

  const handlePaperClick = (paper) => {
    console.log('Paper clicked:', paper);
    // Navigation is handled by the PapersList component
  };

  // Author search handlers
  const handleAuthorSearch = async (page = 1) => {
    if (!authorQuery.trim()) return;

    setIsAuthorLoading(true);
    setAuthorCurrentPage(page);

    try {
      const data = await ApiService.searchAuthors(authorQuery, page, RESULTS_PER_PAGE);
      console.log('Author search results:', data);

      const results = data.papers || [];
      const total = Math.min(data.total || results.length, MAX_RESULTS);

      setAuthorResults(results);
      setAuthorTotalResults(total);
      setAuthorTotalPages(Math.ceil(total / RESULTS_PER_PAGE));
      setHasAuthorSearched(true);
      setIsAuthorLoading(false);
    } catch (error) {
      console.error('Author search error:', error);
      setAuthorResults([]);
      setAuthorTotalResults(0);
      setAuthorTotalPages(0);
      setHasAuthorSearched(true);
      setIsAuthorLoading(false);
    }
  };

  const handleAuthorPageChange = (page) => {
    handleAuthorSearch(page);
    // Scroll to top of results
    document.getElementById('author-search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetAuthorSearch = () => {
    setAuthorQuery('');
    setAuthorResults([]);
    setAuthorCurrentPage(1);
    setAuthorTotalPages(0);
    setAuthorTotalResults(0);
    setHasAuthorSearched(false);
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
            variant={activeTab === 'authors' ? 'primary' : 'outline'}
            onClick={() => openTab('authors')}
            className={styles.tabButton}
          >
            Search Authors
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
                        variant="enhanced"
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

              <FilterControls
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

              {/* Basic Charts Grid */}
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

        {/* Authors Search Tab */}
        {activeTab === 'authors' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <Header
                title="Search Authors"
                subtitle={
                  <>
                    Search through our database of authors using the submission contact information.
                    <span className={styles.searchLimit}> Limited to {MAX_RESULTS} results for optimal performance.</span>
                  </>
                }
                variant="section"
                size="medium"
                className={styles.searchHeader}
              />

              <div className={styles.searchSection}>
                <SearchBar
                  value={authorQuery}
                  onChange={(e) => setAuthorQuery(e.target.value)}
                  onSearch={() => handleAuthorSearch(1)}
                  placeholder="Search by author name..."
                  isLoading={isAuthorLoading}
                  className={styles.searchBar}
                />

                {hasAuthorSearched && authorQuery && (
                  <div className={styles.searchActions}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={resetAuthorSearch}
                      className={styles.clearButton}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>

              <div id="author-search-results" className={styles.resultsSection}>
                {isAuthorLoading && (
                  <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p className="text-body">Searching through authors...</p>
                  </div>
                )}

                {!isAuthorLoading && hasAuthorSearched && authorResults.length === 0 && (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👤</div>
                    <h3 className="text-heading-4 mb-2">No Results Found</h3>
                    <p className="text-body mb-4">
                      No authors match your search query "{authorQuery}".
                    </p>
                    <p className="text-body-small text-neutral-600">
                      Try different author names or check your spelling.
                    </p>
                  </div>
                )}

                {!isAuthorLoading && authorResults.length > 0 && (
                  <>
                    <PapersList
                      papers={authorResults}
                      loading={false}
                      onPaperClick={(paper) => console.log('Author paper clicked:', paper)}
                    />

                    {authorTotalPages > 1 && (
                      <Pagination
                        currentPage={authorCurrentPage}
                        totalPages={authorTotalPages}
                        onPageChange={handleAuthorPageChange}
                        hasNextPage={authorCurrentPage < authorTotalPages}
                        hasPrevPage={authorCurrentPage > 1}
                        totalResults={authorTotalResults}
                        resultsPerPage={RESULTS_PER_PAGE}
                        variant="enhanced"
                        className={styles.pagination}
                      />
                    )}
                  </>
                )}

                {!hasAuthorSearched && (
                  <div className={styles.welcomeState}>
                    <div className={styles.welcomeIcon}>👥</div>
                    <h3 className="text-heading-4 mb-2">Search Authors</h3>
                    <p className="text-body mb-4">
                      Enter an author name to find all papers associated with that author in our preprint database.
                    </p>
                    <div className={styles.searchTips}>
                      <h4 className="text-body-small font-medium mb-2">Search Tips:</h4>
                      <ul className={styles.tipsList}>
                        <li>Search by full name or surname</li>
                        <li>Try common variations of names</li>
                        <li>Use exact matches for better results</li>
                        <li>Results are based on submission contact information</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;