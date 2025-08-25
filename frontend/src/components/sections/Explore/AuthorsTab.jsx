import React from 'react';
import Header from '../../ui/Header/Header';
import SearchBar from '../../ui/SearchBar/SearchBar';
import Button from '../../ui/Button/Button';
import PapersList from '../../ui/PapersList/PapersList';
import Pagination from '../../ui/Pagination/Pagination';
import { useAuthorSearch } from '../../../hooks/useAuthorSearch';
import styles from '../../../pages/ExplorePage.module.css';
import layoutStyles from '../../layout/Layout/Layout.module.css';

const MAX_RESULTS = 200;

const AuthorsTab = () => {
  const {
    authorQuery,
    setAuthorQuery,
    authorResults,
    isAuthorLoading,
    authorCurrentPage,
    authorTotalPages,
    authorTotalResults,
    hasAuthorSearched,
    handleAuthorSearch,
    handleAuthorPageChange,
    resetAuthorSearch,
  } = useAuthorSearch();

  return (
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
                  resultsPerPage={20}
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
  );
};

export default AuthorsTab;
