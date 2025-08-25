import React from 'react';
import Header from '../../ui/Header/Header';
import SearchBar from '../../ui/SearchBar/SearchBar';
import Button from '../../ui/Button/Button';
import PapersList from '../../ui/PapersList/PapersList';
import Pagination from '../../ui/Pagination/Pagination';
import { usePaperSearch } from '../../../hooks/usePaperSearch';
import styles from '../../../pages/ExplorePage.module.css';
import layoutStyles from '../../layout/Layout/Layout.module.css';

const MAX_RESULTS = 200;

const SearchTab = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    currentPage,
    totalPages,
    totalResults,
    hasSearched,
    handleSearch,
    handlePageChange,
    resetSearch,
  } = usePaperSearch();

  return (
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
                  resultsPerPage={20}
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
  );
};

export default SearchTab;
