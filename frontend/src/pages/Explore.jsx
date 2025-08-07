import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import layoutStyles from '../components/layout/Layout/Layout.module.css';
import styles from './Explore.module.css';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const openTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSearch = () => {
    setIsLoading(true);
    fetch(`/search?query=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSearchResults(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <div className={layoutStyles.pageContainerFullWidth}>
        <div className="container">
          <div className={layoutStyles.contentSection}>
            <h1 className="text-heading-1">Explore Preprint Data</h1>
            <p className="text-body-large mt-4 mb-6">
              Discover insights through interactive visualizations and comprehensive search capabilities.
            </p>
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
          <div className={styles.mapSection}>
            <div className="container">
              <div className={styles.mapHeader}>
                <h2 className="text-heading-3">Global Preprint Distribution</h2>
                <p className="text-body">
                  Explore the geographic distribution of preprints worldwide. Use zoom and pan to see detailed statistics.
                </p>
              </div>
            </div>
            
            <div className={styles.mapContainer}>
              <iframe 
                id="explore-map-iframe" 
                src="/map.html" 
                className={styles.mapIframe}
                title="Global Preprint Distribution Map"
              />
            </div>
            
            <div className="container">
              <div className={styles.mapStats}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>300,000+</div>
                  <div className={styles.statLabel}>Preprints Indexed</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>50+</div>
                  <div className={styles.statLabel}>Countries Contributing</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>1,000+</div>
                  <div className={styles.statLabel}>Institutions Tracked</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="container">
            <div className={layoutStyles.contentSection}>
              <h2 className="text-heading-3 mb-4">Search Preprints</h2>
              <p className="text-body mb-6">
                Search through our comprehensive database of preprints by title, DOI, author, or keywords.
              </p>
              
              <div className="card card-content mb-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search by title, DOI, author, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSearch}
                    disabled={isLoading || !searchQuery.trim()}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {searchResults.length === 0 && !isLoading && searchQuery && (
                  <div className="card card-content text-center">
                    <p className="text-body">No results found for your search query.</p>
                  </div>
                )}
                
                {searchResults.map(item => (
                  <Link 
                    to={`/paper/${item.PPC_Id}`} 
                    key={item.PPC_Id} 
                    className="block card card-content hover:shadow-lg transition-all"
                  >
                    <h3 className="text-heading-4 mb-2 text-primary">
                      {item.preprint_title}
                    </h3>
                    <p className="text-body-small text-neutral-600 mb-2">
                      DOI: {item.preprint_doi}
                    </p>
                    <p className="text-body mb-2">
                      <strong>Authors:</strong> {item.all_authors}
                    </p>
                    <p className="text-body-small text-neutral-600">
                      <strong>Submitted:</strong> {new Date(item.preprint_submission_date).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
              
              {!searchQuery && (
                <div className="card card-content text-center">
                  <h3 className="text-heading-4 mb-2">Start Your Search</h3>
                  <p className="text-body">
                    Enter keywords, author names, DOIs, or paper titles to begin exploring our preprint database.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;