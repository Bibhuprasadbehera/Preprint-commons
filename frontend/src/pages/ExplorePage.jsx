import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import SubjectAnalysis from '../components/analytics/SubjectAnalysis/SubjectAnalysis';
import AdvancedSearch from '../components/ui/AdvancedSearch/AdvancedSearch';
import { useUnifiedCitationData } from '../hooks/useUnifiedCitationData';
import ApiService from '../services/api';
import Chart from 'chart.js/auto';
import layoutStyles from '../components/layout/Layout/Layout.module.css';
import styles from './ExplorePage.module.css';

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('map');
  const [searchSubTab, setSearchSubTab] = useState('basic');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchCriteria, setLastSearchCriteria] = useState(null);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

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


  // Handle URL parameters for chart navigation
  useEffect(() => {
    const year = searchParams.get('year');
    const subject = searchParams.get('subject');
    const month = searchParams.get('month');
    const server = searchParams.get('server');
    const country = searchParams.get('country');

    if (year) {
      // Navigate to search tab and use advanced search for papers from that year
      setActiveTab('search');
      setSearchSubTab('advanced');
      const criteria = { year_from: parseInt(year), year_to: parseInt(year) };
      setTimeout(() => {
        handleAdvancedSearch(criteria, 1);
      }, 100);
    } else if (subject) {
      // Navigate to search tab and use advanced search for papers in that subject
      setActiveTab('search');
      setSearchSubTab('advanced');
      const criteria = { subject: subject };
      setTimeout(() => {
        handleAdvancedSearch(criteria, 1);
      }, 100);
    } else if (month) {
      // Navigate to search tab and use advanced search for papers from that month
      setActiveTab('search');
      setSearchSubTab('advanced');
      const criteria = { month: month };
      setTimeout(() => {
        handleAdvancedSearch(criteria, 1);
      }, 100);
    } else if (server) {
      // Navigate to search tab and use advanced search for papers from that server
      setActiveTab('search');
      setSearchSubTab('advanced');
      const criteria = { server: server };
      setTimeout(() => {
        handleAdvancedSearch(criteria, 1);
      }, 100);
    } else if (country) {
      // Navigate to search tab and use advanced search for papers from that country
      setActiveTab('search');
      setSearchSubTab('advanced');
      const criteria = { country: country };
      setTimeout(() => {
        handleAdvancedSearch(criteria, 1);
      }, 100);
    }
  }, [searchParams]);


  const handleSearch = async (page = 1, attemptNumber = 1) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setCurrentPage(page);
    setIsAdvancedSearch(false);
    setLastSearchCriteria(null);

    try {
      // Use larger page size for DOI search to increase chance of finding exact match
      const pageSize = searchType === 'doi' ? 100 : RESULTS_PER_PAGE;
      
      console.log(`Searching papers: "${searchQuery}" page ${page} type ${searchType} (attempt ${attemptNumber})`);
      const data = await ApiService.searchPapers(searchQuery, page, pageSize);
      console.log('Search results:', data);

      let results = data.papers || [];
      
      // Frontend filtering for exact DOI match
      if (searchType === 'doi') {
        const trimmedQuery = searchQuery.trim();
        results = results.filter(paper => paper.preprint_doi === trimmedQuery);
        console.log(`Filtered to ${results.length} exact DOI match(es)`);
      }
      
      const total = searchType === 'doi' ? results.length : Math.min(data.total || results.length, MAX_RESULTS);

      setSearchResults(results);
      setTotalResults(total);
      setTotalPages(searchType === 'doi' ? 1 : Math.ceil(total / RESULTS_PER_PAGE));
      setHasSearched(true);
      setIsLoading(false);
    } catch (error) {
      console.error(`Search error (attempt ${attemptNumber}):`, error);
      
      // Auto-retry up to 3 times with exponential backoff
      if (attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber - 1) * 1000; // 1s, 2s, 4s
        console.log(`Retrying search in ${delay}ms...`);
        
        setTimeout(() => {
          handleSearch(page, attemptNumber + 1);
        }, delay);
      } else {
        setSearchResults([]);
        setTotalResults(0);
        setTotalPages(0);
        setHasSearched(true);
        setIsLoading(false);
      }
    }
  };

  const handlePageChange = (page) => {
    if (isAdvancedSearch && lastSearchCriteria) {
      // Use advanced search for pagination
      handleAdvancedSearch(lastSearchCriteria, page);
    } else {
      // Use basic search for pagination
      handleSearch(page);
    }
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
    setIsAdvancedSearch(false);
    setLastSearchCriteria(null);
  };

  const handleSearchClick = async (forceRefresh = false) => {
    const currentFilters = {
      timeRange: selectedTimeRange,
      subject: selectedSubject,
      country: selectedCountry,
      sortOption: sortOption
    };

    setIsSearching(true);
    
    // Clear all existing data immediately to avoid showing stale results
    console.log('🔄 Starting new search - clearing existing data');
    clearAllData();
    
    // Fetch all citation data using unified hook
    console.log('📊 Fetching all citation data with filters:', currentFilters);
    
    try {
      await fetchAllData(selectedTimeRange, selectedSubject, sortOption, 10);
      console.log('✅ Analytics data cached');
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

  const handleExportSearchResults = (format = 'json') => {
    if (!searchResults || searchResults.length === 0) {
      alert('No search results to export');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const searchType = isAdvancedSearch ? 'advanced' : 'basic';
    
    if (format === 'json') {
      const exportData = {
        searchType,
        searchQuery: isAdvancedSearch ? lastSearchCriteria : searchQuery,
        totalResults,
        currentPage,
        resultsPerPage: RESULTS_PER_PAGE,
        exportedAt: new Date().toISOString(),
        papers: searchResults
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `search-results-${searchType}-${timestamp}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (format === 'csv') {
      // CSV export
      const headers = [
        'PPC_Id',
        'Title',
        'Authors',
        'DOI',
        'Server',
        'Subject',
        'Submission Date',
        'Country',
        'Institution',
        'Citations',
        'Published DOI',
        'Publication Date'
      ];
      
      const csvRows = [headers.join(',')];
      
      searchResults.forEach(paper => {
        const row = [
          paper.PPC_Id || '',
          `"${(paper.preprint_title || '').replace(/"/g, '""')}"`,
          `"${(paper.all_authors || '').replace(/"/g, '""')}"`,
          paper.preprint_doi || '',
          paper.preprint_server || '',
          paper.preprint_subject || '',
          paper.preprint_submission_date || '',
          paper.country_name || '',
          `"${(paper.corresponding_institution || '').replace(/"/g, '""')}"`,
          paper.total_citation || '0',
          paper.published_DOI || '',
          paper.publication_date || ''
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const exportFileDefaultName = `search-results-${searchType}-${timestamp}.csv`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleExportAuthorResults = (format = 'json') => {
    if (!authorResults || authorResults.length === 0) {
      alert('No author search results to export');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const exportData = {
        searchType: 'author',
        authorQuery,
        totalResults: authorTotalResults,
        currentPage: authorCurrentPage,
        resultsPerPage: RESULTS_PER_PAGE,
        exportedAt: new Date().toISOString(),
        papers: authorResults
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `author-search-results-${timestamp}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (format === 'csv') {
      // CSV export
      const headers = [
        'PPC_Id',
        'Title',
        'Authors',
        'DOI',
        'Server',
        'Subject',
        'Submission Date',
        'Country',
        'Institution',
        'Citations',
        'Published DOI',
        'Publication Date'
      ];
      
      const csvRows = [headers.join(',')];
      
      authorResults.forEach(paper => {
        const row = [
          paper.PPC_Id || '',
          `"${(paper.preprint_title || '').replace(/"/g, '""')}"`,
          `"${(paper.all_authors || '').replace(/"/g, '""')}"`,
          paper.preprint_doi || '',
          paper.preprint_server || '',
          paper.preprint_subject || '',
          paper.preprint_submission_date || '',
          paper.country_name || '',
          `"${(paper.corresponding_institution || '').replace(/"/g, '""')}"`,
          paper.total_citation || '0',
          paper.published_DOI || '',
          paper.publication_date || ''
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const exportFileDefaultName = `author-search-results-${timestamp}.csv`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleRefreshData = () => {
    handleSearchClick(true); // Force refresh
  };

  const handlePaperClick = (paper) => {
    console.log('Paper clicked:', paper);
    // Navigation is handled by the PapersList component
  };

  // Author search handlers
  const handleAuthorSearch = async (page = 1, attemptNumber = 1) => {
    if (!authorQuery.trim()) return;

    setIsAuthorLoading(true);
    setAuthorCurrentPage(page);

    try {
      console.log(`Searching authors: "${authorQuery}" page ${page} (attempt ${attemptNumber})`);
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
      console.error(`Author search error (attempt ${attemptNumber}):`, error);
      
      // Auto-retry up to 3 times with exponential backoff
      if (attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber - 1) * 1000; // 1s, 2s, 4s
        console.log(`Retrying author search in ${delay}ms...`);
        
        setTimeout(() => {
          handleAuthorSearch(page, attemptNumber + 1);
        }, delay);
      } else {
        setAuthorResults([]);
        setAuthorTotalResults(0);
        setAuthorTotalPages(0);
        setHasAuthorSearched(true);
        setIsAuthorLoading(false);
      }
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

  // Advanced search handler
  const handleAdvancedSearch = async (criteria, page = 1, attemptNumber = 1) => {
    setIsLoading(true);
    setCurrentPage(page);
    setIsAdvancedSearch(true);
    setLastSearchCriteria(criteria);

    try {
      console.log(`Advanced search (attempt ${attemptNumber}):`, criteria);
      const data = await ApiService.advancedSearchPapers(criteria, page, RESULTS_PER_PAGE);
      console.log('Advanced search results:', data);

      const results = data.papers || [];
      const total = Math.min(data.total || results.length, MAX_RESULTS);

      setSearchResults(results);
      setTotalResults(total);
      setTotalPages(Math.ceil(total / RESULTS_PER_PAGE));
      setHasSearched(true);
      setIsLoading(false);
    } catch (error) {
      console.error(`Advanced search error (attempt ${attemptNumber}):`, error);
      
      // Auto-retry up to 3 times with exponential backoff
      if (attemptNumber < 3) {
        const delay = Math.pow(2, attemptNumber - 1) * 1000; // 1s, 2s, 4s
        console.log(`Retrying advanced search in ${delay}ms...`);
        
        setTimeout(() => {
          handleAdvancedSearch(criteria, page, attemptNumber + 1);
        }, delay);
      } else {
        setSearchResults([]);
        setTotalResults(0);
        setTotalPages(0);
        setHasSearched(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="centered-page">
        <div className="animate-fadeInUp">
        <Header 
          title="Explore Preprint Data"
          subtitle="Discover insights through interactive visualizations and search capabilities."
          variant="page"
          size="large"
        />
        </div>
        
        {/* Tab Navigation */}
        <div className={`${styles.tabNavigation} animate-fadeInUp animate-delay-1`}>
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
            Search Preprints
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
          <Button
            variant={activeTab === 'subjects' ? 'primary' : 'outline'}
            onClick={() => openTab('subjects')}
            className={styles.tabButton}
          >
            Subject Analysis
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

              {/* Search Sub-tabs */}
              <div className={styles.subTabNavigation}>
                <Button
                  variant={searchSubTab === 'basic' ? 'primary' : 'outline'}
                  onClick={() => setSearchSubTab('basic')}
                  className={styles.subTabButton}
                  size="small"
                >
                  Basic Search
                </Button>
                <Button
                  variant={searchSubTab === 'advanced' ? 'primary' : 'outline'}
                  onClick={() => setSearchSubTab('advanced')}
                  className={styles.subTabButton}
                  size="small"
                >
                  Advanced Search
                </Button>
              </div>

              {/* Basic Search */}
              {searchSubTab === 'basic' && (
                <div className={styles.searchSection}>
                  <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={() => handleSearch(1)}
                    onSearchTypeChange={setSearchType}
                    placeholder="Search by title, DOI or keyword"
                    isLoading={isLoading}
                    className={styles.searchBar}
                  />

                  {hasSearched && (
                    <div className={styles.searchActions}>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={resetSearch}
                        className={styles.clearButton}
                      >
                        Clear Search
                      </Button>
                      {searchResults.length > 0 && (
                        <>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleExportSearchResults('json')}
                            className={styles.exportButton}
                          >
                            Export JSON
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleExportSearchResults('csv')}
                            className={styles.exportButton}
                          >
                            Export CSV
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Advanced Search */}
              {searchSubTab === 'advanced' && (
                <>
                  <AdvancedSearch
                    onSearch={(criteria) => handleAdvancedSearch(criteria)}
                    loading={isLoading}
                  />
                  {hasSearched && searchResults.length > 0 && (
                    <div className={styles.searchActions}>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleExportSearchResults('json')}
                        className={styles.exportButton}
                      >
                        Export JSON
                      </Button>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleExportSearchResults('csv')}
                        className={styles.exportButton}
                      >
                        Export CSV
                      </Button>
                    </div>
                  )}
                </>
              )}
              
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
                      currentPage={currentPage}
                      resultsPerPage={RESULTS_PER_PAGE}
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
                    <p className={styles.chartSubtitle}>Research Activity Patterns</p>
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
                    <h3 className={styles.chartTitle}>Top Papers</h3>
                    <p className={styles.chartSubtitle}>Most Cited Research</p>
                  </Card.Header>
                  <Card.Content>
                    <PapersList 
                      papers={topPapersData} 
                      loading={papersLoading}
                      onPaperClick={handlePaperClick}
                      variant="compact"
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

        {/* Authors Tab */}
        {activeTab === 'authors' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <Header
                title="Search Authors"
                subtitle={
                  <>
                    Find Preprints by specific authors or research consortia.
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
                  showSearchTypeDropdown={false}
                />

                {hasAuthorSearched && (
                  <div className={styles.searchActions}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={resetAuthorSearch}
                      className={styles.clearButton}
                    >
                      Clear Search
                    </Button>
                    {authorResults.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleExportAuthorResults('json')}
                          className={styles.exportButton}
                        >
                          Export JSON
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleExportAuthorResults('csv')}
                          className={styles.exportButton}
                        >
                          Export CSV
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <div id="author-search-results" className={styles.resultsSection}>
                {isAuthorLoading && (
                  <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p className="text-body">Searching for authors...</p>
                  </div>
                )}
                
                {!isAuthorLoading && hasAuthorSearched && authorResults.length === 0 && (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👤</div>
                    <h3 className="text-heading-4 mb-2">No Authors Found</h3>
                    <p className="text-body mb-4">
                      No papers found for author "{authorQuery}".
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
                      onPaperClick={(paper) => console.log('Paper clicked:', paper)}
                      currentPage={authorCurrentPage}
                      resultsPerPage={RESULTS_PER_PAGE}
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
                    <h3 className="text-heading-4 mb-2">Search for Authors</h3>
                    <p className="text-body mb-4">
                      Enter author names to find their published preprints and research contributions.
                    </p>
                    <div className={styles.searchTips}>
                      <h4 className="text-body-small font-medium mb-2">Search Tips:</h4>
                      <ul className={styles.tipsList}>
                        <li>Use full names or surnames</li>
                        <li>Try variations of author names</li>
                        <li>Search for research group leaders</li>
                        <li>Include middle initials if known</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subject Analysis Tab */}
        {activeTab === 'subjects' && (
          <SubjectAnalysis />
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
