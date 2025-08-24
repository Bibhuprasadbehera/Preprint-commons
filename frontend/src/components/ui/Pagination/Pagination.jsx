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
  className = '',
  variant = 'enhanced' // 'simple' or 'enhanced'
}) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  // Generate page numbers for enhanced pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 4) {
        // Show first 5 pages, then ellipsis, then last page
        for (let i = 1; i <= 5; i++) pages.push(i);
        if (totalPages > 6) pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page, ellipsis, then last 5 pages
        pages.push(1);
        if (totalPages > 6) pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const ChevronLeftIcon = () => (
    <svg className={styles.paginationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg className={styles.paginationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );

  if (variant === 'simple') {
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
            <ChevronLeftIcon />
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
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced pagination with page numbers
  return (
    <div className={`${styles.paginationContainer} ${className}`}>
      <div className={styles.paginationInfo}>
        <span className={styles.resultsText}>
          Showing {startResult}-{endResult} of {totalResults} results
        </span>
      </div>
      
      <div className={styles.enhancedPagination}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={`${styles.pageButton} ${styles.paginationButton}`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>
        
        {generatePageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`${styles.pageButton} ${styles.paginationButton}`}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Pagination;