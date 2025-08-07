import React from 'react';
import Button from '../Button/Button';
import styles from './Pagination.module.css';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  totalResults,
  resultsPerPage,
  className = ''
}) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className={`${styles.paginationContainer} ${className}`}>
      <div className={styles.paginationInfo}>
        <span className={styles.resultsText}>
          Showing {startResult}-{endResult} of {totalResults} results
        </span>
      </div>
      
      <div className={styles.paginationControls}>
        <Button
          variant="outline"
          size="medium"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={styles.paginationButton}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Previous
        </Button>
        
        <div className={styles.pageInfo}>
          <span className={styles.pageText}>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="medium"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={styles.paginationButton}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;