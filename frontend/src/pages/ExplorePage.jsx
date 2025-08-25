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
import { API_BASE_URL } from '../utils/api';
import Chart from 'chart.js/auto';
import { Line, Bar } from 'react-chartjs-2';
import Select from '../components/ui/Select/Select';
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
  
  // Subject Analysis compare selector
  const [selectedSubject2, setSelectedSubject2] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([{ value: '', label: 'All Subjects' }]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState(null);

  // Local Subject Analysis data (fetched directly for flexibility)
  const [subjectAnalysis, setSubjectAnalysis] = useState({
    evolutionData: [],
    citationRanking: [],
    versionDistribution: [],
    versionDistributionBySubject: [],
    versionSummary: null,
    metadata: {}
  });
  const [subjectLoadingLocal, setSubjectLoadingLocal] = useState(false);
  const [subjectErrorLocal, setSubjectErrorLocal] = useState(null);
  
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

  useEffect(() => {
    // Load subjects when opening Subject Analysis tab
    if (activeTab === 'subjects' && subjectOptions.length <= 1 && !subjectsLoading) {
      setSubjectsLoading(true);
      ApiService.getSubjects()
        .then((res) => {
          const opts = [
            { value: '', label: 'All Subjects' },
            ...((res?.data || []).map((s) => ({ value: s, label: s.split(' ').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ') })))
          ];
          setSubjectOptions(opts);
        })
        .catch((e) => setSubjectsError(String(e)))
        .finally(() => setSubjectsLoading(false));
    }
  }, [activeTab]);

  const handleSubjectSearchClickLocal = async () => {
    setIsSearching(true);
    setSubjectErrorLocal(null);
    setSubjectLoadingLocal(true);
    try {
      const params = new URLSearchParams();
      if (selectedTimeRange) params.append('time_range', selectedTimeRange);
      const subjectsList = [selectedSubject, selectedSubject2].filter(Boolean);
      if (subjectsList.length > 0) {
        params.append('subjects', subjectsList.join(','));
      } else if (selectedSubject) {
        params.append('subject', selectedSubject);
      }
      params.append('top', '10');
      const res = await fetch(`${API_BASE_URL}/api/subjects/analysis?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSubjectAnalysis(json);
    } catch (e) {
      setSubjectErrorLocal(String(e));
      setSubjectAnalysis({ evolutionData: [], citationRanking: [], versionDistribution: [], versionDistributionBySubject: [], versionSummary: null, metadata: {} });
    } finally {
      setSubjectLoadingLocal(false);
      setIsSearching(false);
    }
  };

  const handleSearch = async (page = 1, attemptNumber = 1) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setCurrentPage(page);

    try {
      console.log(`Searching papers: "${searchQuery}" page ${page} (attempt ${attemptNumber})`);
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

        {/* Subject Analysis Tab */}
        {activeTab === 'subjects' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <Header 
                title="Subject Analysis"
                subtitle="Explore subject evolution, citation ranking by subject, and version distributions. Compare up to two subjects."
                variant="section"
                size="medium"
              />

              <FilterControls
                selectedTimeRange={selectedTimeRange}
                selectedSubject={selectedSubject}
                selectedCountry={null}
                sortOption={'citations_desc'}
                onTimeRangeChange={setSelectedTimeRange}
                onSubjectChange={setSelectedSubject}
                onCountryChange={() => {}}
                onSortChange={() => {}}
                onSearchClick={handleSubjectSearchClickLocal}
                onExportData={() => {
                  const exportData = {
                    filters: { timeRange: selectedTimeRange, subjects: [selectedSubject, selectedSubject2].filter(Boolean) },
                    subjectAnalysis
                  };
                  const dataStr = JSON.stringify(exportData, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = `subject-analysis-${new Date().toISOString().split('T')[0]}.json`;
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                onRefreshData={handleSubjectSearchClickLocal}
                isSearching={isSearching}
              />

              {/* Secondary subject selector for comparison */}
              <div className={styles.searchSection}>
                <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
                  <label style={{ display: 'block', marginBottom: 6, color: '#334155' }}>Compare With (optional)</label>
                  <Select
                    options={subjectOptions}
                    value={selectedSubject2 || ''}
                    onChange={(value) => setSelectedSubject2(value || null)}
                    className={styles.filterSelect}
                    disabled={subjectsLoading}
                    placeholder={subjectsLoading ? 'Loading subjects...' : 'Select subject'}
                  />
                  {subjectsError && (
                    <div className={styles.error}>Failed to load subjects: {subjectsError}</div>
                  )}
                </div>
              </div>

              <div className={styles.chartsGrid}>
                {/* Subject Evolution */}
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Subject Evolution</h3>
                    <p className={styles.chartSubtitle}>Yearly submission counts per subject</p>
                  </Card.Header>
                  <Card.Content>
                    {subjectLoadingLocal ? (
                      <div className={styles.loadingState}><div className={styles.loadingSpinner}></div><p>Loading subject evolution...</p></div>
                    ) : subjectErrorLocal ? (
                      <div className={styles.error}>Error: {subjectErrorLocal}</div>
                    ) : !subjectAnalysis.evolutionData || subjectAnalysis.evolutionData.length === 0 ? (
                      <div className={styles.emptyState}><div className={styles.emptyIcon}>📈</div><p>No evolution data available.</p></div>
                    ) : (() => {
                      const records = subjectAnalysis.evolutionData;
                      const years = Array.from(new Set(records.map(r => r.year))).sort();
                      const subjectsSet = Array.from(new Set(records.map(r => r.subject)));
                      const palette = ['#2563eb','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4'];
                      const datasets = subjectsSet.map((subj, i) => {
                        const byYear = new Map(records.filter(r => r.subject === subj).map(r => [r.year, r.count]));
                        return {
                          label: subj,
                          data: years.map(y => byYear.get(y) || 0),
                          borderColor: palette[i % palette.length],
                          backgroundColor: palette[i % palette.length] + '33',
                          borderWidth: 2,
                          fill: true,
                          tension: 0.3
                        };
                      });
                      const data = { labels: years, datasets };
                      const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };
                      return <div style={{ height: 360 }}><Line data={data} options={options} /></div>;
                    })()}
                  </Card.Content>
                </Card>

                {/* Subject Citation Ranking */}
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Subject Citation Ranking</h3>
                    <p className={styles.chartSubtitle}>Total and average citations per subject</p>
                  </Card.Header>
                  <Card.Content>
                    {subjectLoadingLocal ? (
                      <div className={styles.loadingState}><div className={styles.loadingSpinner}></div><p>Loading subject citation ranking...</p></div>
                    ) : subjectErrorLocal ? (
                      <div className={styles.error}>Error: {subjectErrorLocal}</div>
                    ) : !subjectAnalysis.citationRanking || subjectAnalysis.citationRanking.length === 0 ? (
                      <div className={styles.emptyState}><div className={styles.emptyIcon}>🏆</div><p>No citation ranking data available.</p></div>
                    ) : (() => {
                      const recs = subjectAnalysis.citationRanking;
                      const labels = recs.map(r => r.subject);
                      const totals = recs.map(r => r.total_citation);
                      const data = { labels, datasets: [{ label: 'Total Citations', data: totals, backgroundColor: '#2563eb' }] };
                      const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { afterBody: (items) => {
                        const idx = items[0].dataIndex; const r = recs[idx]; return `Avg per paper: ${r.avg_citation} (n=${r.paper_count})`;
                      } } } }, indexAxis: 'y', scales: { x: { beginAtZero: true } } };
                      return <div style={{ height: 360 }}><Bar data={data} options={options} /></div>;
                    })()}
                  </Card.Content>
                </Card>

                {/* Version Analysis */}
                <Card className={styles.chartCard}>
                  <Card.Header>
                    <h3 className={styles.chartTitle}>Version Analysis</h3>
                    <p className={styles.chartSubtitle}>Version distribution and summary</p>
                  </Card.Header>
                  <Card.Content>
                    {subjectLoadingLocal ? (
                      <div className={styles.loadingState}><div className={styles.loadingSpinner}></div><p>Loading version analysis...</p></div>
                    ) : subjectErrorLocal ? (
                      <div className={styles.error}>Error: {subjectErrorLocal}</div>
                    ) : !subjectAnalysis.versionDistribution || subjectAnalysis.versionDistribution.length === 0 ? (
                      <div className={styles.emptyState}><div className={styles.emptyIcon}>📊</div><p>No version data available.</p></div>
                    ) : (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Summary:</strong>
                          <div>Total Papers: {subjectAnalysis?.versionSummary?.totalPapers || 0}</div>
                          <div>Multi-version Papers: {subjectAnalysis?.versionSummary?.multiVersionPapers || 0}</div>
                          <div>% Multi-version: {subjectAnalysis?.versionSummary?.percentMultiVersion || 0}%</div>
                        </div>
                        {(() => {
                          const selected = subjectAnalysis?.metadata?.selectedSubjects || [];
                          const palette = ['#2563eb','#f59e0b','#10b981','#ef4444'];
                          if (selected.length > 1 && subjectAnalysis.versionDistributionBySubject && subjectAnalysis.versionDistributionBySubject.length > 0) {
                            // Grouped bar per subject
                            const recs = subjectAnalysis.versionDistributionBySubject;
                            const versions = Array.from(new Set(recs.map(r => r.versions))).sort((a,b)=>a-b);
                            const subjectsSet = Array.from(new Set(recs.map(r => r.subject)));
                            const datasets = subjectsSet.map((subj, i) => {
                              const byVer = new Map(recs.filter(r => r.subject === subj).map(r => [r.versions, r.count]));
                              return {
                                label: subj,
                                data: versions.map(v => byVer.get(v) || 0),
                                backgroundColor: palette[i % palette.length]
                              };
                            });
                            const data = { labels: versions, datasets };
                            const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { x: { title: { display: true, text: 'Versions' } }, y: { beginAtZero: true } } };
                            return <div style={{ height: 360 }}><Bar data={data} options={options} /></div>;
                          } else {
                            // Single series histogram
                            const recs = subjectAnalysis.versionDistribution;
                            const labels = recs.map(r => r.versions);
                            const counts = recs.map(r => r.count);
                            const data = { labels, datasets: [{ label: 'Papers', data: counts, backgroundColor: '#10b981' }] };
                            const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Versions' } }, y: { beginAtZero: true } } };
                            return <div style={{ height: 360 }}><Bar data={data} options={options} /></div>;
                          }
                        })()}
                      </>
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
