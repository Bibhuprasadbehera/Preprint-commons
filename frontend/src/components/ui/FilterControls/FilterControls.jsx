import React from 'react';
import Select from '../Select/Select';
import Button from '../Button/Button';
import { useSubjects } from '../../../hooks/useSubjects';
import styles from './FilterControls.module.css';

const FilterControls = ({
  selectedTimeRange,
  selectedSubject,
  sortOption,
  onTimeRangeChange,
  onSubjectChange,
  onSortChange,
  onSearchClick,
  onExportData,
  onRefreshData,
  showExportButton = true,
  showRefreshButton = true,
  isSearching = false,
}) => {
  const { subjects: subjectOptions, loading: subjectsLoading, error: subjectsError } = useSubjects();
  
  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'last_5_years', label: 'Last 5 Years' },
    { value: 'last_10_years', label: 'Last 10 Years' },
  ];

  const sortOptions = [
    { value: 'citations_desc', label: 'Most Citations' },
    { value: 'citations_asc', label: 'Least Citations' },
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
  ];

  return (
    <div className={styles.filterControls}>
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Time Range</label>
          <Select
            options={timeRangeOptions}
            value={selectedTimeRange}
            onChange={onTimeRangeChange}
            className={styles.filterSelect}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Subject</label>
          <Select
            options={subjectOptions}
            value={selectedSubject || ''}
            onChange={(value) => onSubjectChange(value || null)}
            className={styles.filterSelect}
            disabled={subjectsLoading}
            placeholder={subjectsLoading ? "Loading subjects..." : "Select subject"}
          />
          {subjectsError && (
            <span className={styles.errorText}>
              Failed to load subjects: {subjectsError}
            </span>
          )}
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sort by</label>
          <Select
            options={sortOptions}
            value={sortOption}
            onChange={onSortChange}
            className={styles.filterSelect}
          />
        </div>
      </div>

      <div className={styles.actionsRow}>
        <Button
          variant="primary"
          size="large"
          onClick={onSearchClick}
          disabled={isSearching}
          className={styles.searchButton}
        >
          {isSearching ? 'Searching...' : 'Search & Analyze'}
        </Button>
        
        <div className={styles.secondaryActions}>
          {showRefreshButton && (
            <Button
              variant="outline"
              onClick={onRefreshData}
              className={styles.actionButton}
            >
              Refresh Data
            </Button>
          )}
          
          {showExportButton && (
            <Button
              variant="secondary"
              onClick={onExportData}
              className={styles.actionButton}
            >
              Export Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;