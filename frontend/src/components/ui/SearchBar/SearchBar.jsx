import React from 'react';
import Button from '../Button/Button';
import styles from './SearchBar.module.css';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  isLoading = false,
  className = ''
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchInputWrapper}>
        <div className={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
          disabled={isLoading}
        />
      </div>
      <Button
        variant="primary"
        onClick={onSearch}
        disabled={isLoading || !value.trim()}
        loading={isLoading}
        className={styles.searchButton}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};

export default SearchBar;