import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import SearchBar from '../components/ui/SearchBar/SearchBar';
import Pagination from '../components/ui/Pagination/Pagination';
import { PaperCard } from '../components/Paper';
import MapContainer from '../components/ui/MapContainer/MapContainer';
import Header from '../components/ui/Header/Header';
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
  
  const RESULTS_PER_PAGE = 10;
  const MAX_RESULTS = 100;

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

  return (
    <Layout>
      <div className={layoutStyles.pageContainerFullWidth}>
        <div className="container">
          <div className={layoutStyles.contentSection}>
            <Header 
              title="Explore Preprint Data"
              subtitle="Discover insights through interactive visualizations and comprehensive search capabilities."
              variant="page"
              size="large"
            />
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="container">
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
          </div>
        </div>
        
        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="container">
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
          </div>
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
                    <div className={styles.resultsGrid}>
                      {searchResults.map(item => (
                        <PaperCard 
                          key={item.PPC_Id} 
                          paper={item}
                          className={styles.resultCard}
                        />
                      ))}
                    </div>
                    
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
      </div>
    </Layout>
  );
};

export default Explore;