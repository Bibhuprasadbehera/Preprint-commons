import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './SearchBar.module.css';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  isLoading = false,
  className = '',
  onSearchTypeChange,
  showSearchTypeDropdown = true
}) => {
  const [searchType, setSearchType] = useState('all');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleSearchTypeChange = (e) => {
    const newType = e.target.value;
    setSearchType(newType);
    if (onSearchTypeChange) {
      onSearchTypeChange(newType);
    }
  };

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchRow}>
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
        {showSearchTypeDropdown && (
          <select 
            value={searchType} 
            onChange={handleSearchTypeChange}
            className={styles.searchTypeSelect}
            disabled={isLoading}
          >
            <option value="all">All Fields</option>
            <option value="doi">DOI Only</option>
          </select>
        )}
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
      {searchType === 'doi' && (
        <div className={styles.searchHint}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          DOI exact match - enter the complete DOI (e.g., 10.1101/2020.03.24.20042937)
        </div>
      )}
    </div>
  );
};

export default SearchBar;