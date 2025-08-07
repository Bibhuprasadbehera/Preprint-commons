import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout/Layout';
import Button from '../components/ui/Button/Button';
import styles from '../components/layout/Layout/Layout.module.css';

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
      <div className={styles.pageContainerFullWidth}>
        <div className="container">
          <div className={styles.contentSection}>
            <h1 className="text-heading-1">Explore Preprint Data</h1>
            <p className="text-body-large mt-4 mb-6">
              Discover insights through interactive visualizations and comprehensive search capabilities.
            </p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="container">
          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === 'map' ? 'primary' : 'outline'}
              onClick={() => openTab('map')}
            >
              Interactive Map
            </Button>
            <Button
              variant={activeTab === 'search' ? 'primary' : 'outline'}
              onClick={() => openTab('search')}
            >
              Search Papers
            </Button>
          </div>
        </div>
        
        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="w-full">
            <div className="container mb-6">
              <h2 className="text-heading-3 mb-4">Global Preprint Distribution</h2>
              <p className="text-body mb-4">
                Explore the geographic distribution of preprints worldwide. Click on regions to see detailed statistics.
              </p>
            </div>
            <div className="w-full" style={{ height: '600px' }}>
              <iframe 
                id="map-iframe" 
                src="/map.html" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                  display: 'block'
                }}
                title="Global Preprint Distribution Map"
              />
            </div>
            <div className="container mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="card card-content text-center">
                  <div className="text-heading-2 text-primary mb-2">300,000+</div>
                  <div className="text-body">Preprints Indexed</div>
                </div>
                <div className="card card-content text-center">
                  <div className="text-heading-2 text-secondary mb-2">50+</div>
                  <div className="text-body">Countries Contributing</div>
                </div>
                <div className="card card-content text-center">
                  <div className="text-heading-2 text-accent mb-2">1,000+</div>
                  <div className="text-body">Institutions Tracked</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="container">
            <div className={styles.contentSection}>
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