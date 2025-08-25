import React, { useState, useEffect } from 'react';
import Select from '../Select/Select';
import Button from '../Button/Button';
import { API_BASE_URL } from '../../../utils/api';
import styles from './FilterControls.module.css';

// useSubjects hook with automatic retry and caching
const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  // Cache subjects for 5 minutes to avoid unnecessary refetches
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const MAX_RETRIES = 3;

  const fetchSubjects = async (isRetry = false) => {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (!isRetry && subjects.length > 1 && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('📋 Using cached subjects data');
      return;
    }

    setLoading(true);
    if (!isRetry) {
      setError(null);
      setRetryCount(0);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Subjects data received:', result);
      
      // Transform subjects into options format
      const subjectOptions = [
        { value: '', label: 'All Subjects' },
        ...result.data.map(subject => ({
          value: subject,
          label: subject.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        }))
      ];
      
      setSubjects(subjectOptions);
      setLastFetchTime(now);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('💥 Subjects fetch error:', err);
      setError(err.message);
      
      // Auto-retry with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`🔄 Retrying subjects fetch in ${delay}ms... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchSubjects(true);
        }, delay);
      } else {
        // Fallback to hardcoded subjects if all retries fail
        console.log('🔄 All retries failed, using fallback subjects');
        const fallbackSubjects = [
          { value: '', label: 'All Subjects' },
          { value: 'bioinformatics', label: 'Bioinformatics' },
          { value: 'molecular biology', label: 'Molecular Biology' },
          { value: 'neuroscience', label: 'Neuroscience' },
          { value: 'genomics', label: 'Genomics' },
          { value: 'immunology', label: 'Immunology' },
          { value: 'biochemistry', label: 'Biochemistry' },
          { value: 'genetics', label: 'Genetics' },
          { value: 'cell biology', label: 'Cell Biology' },
          { value: 'microbiology', label: 'Microbiology' }
        ];
        setSubjects(fallbackSubjects);
        setLastFetchTime(now);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Manual refresh function
  const refreshSubjects = () => {
    setLastFetchTime(0); // Force refresh by invalidating cache
    fetchSubjects();
  };

  return { subjects, loading, error, refreshSubjects, retryCount };
};

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
  const { subjects: subjectOptions, loading: subjectsLoading, error: subjectsError, refreshSubjects, retryCount } = useSubjects();
  
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
          <div className={styles.filterLabelRow}>
            <label className={styles.filterLabel}>Subject</label>
            {subjectsError && (
              <Button
                variant="ghost"
                size="small"
                onClick={refreshSubjects}
                disabled={subjectsLoading}
                className={styles.refreshButton}
                title="Refresh subjects list"
              >
                🔄
              </Button>
            )}
          </div>
          <Select
            options={subjectOptions}
            value={selectedSubject || ''}
            onChange={(value) => onSubjectChange(value || null)}
            className={styles.filterSelect}
            disabled={subjectsLoading}
            placeholder={subjectsLoading ? 
              (retryCount > 0 ? `Retrying... (${retryCount}/3)` : "Loading subjects...") : 
              "Select subject"
            }
          />
          {subjectsError && (
            <div className={styles.errorContainer}>
              <span className={styles.errorText}>
                Failed to load subjects
                {retryCount > 0 && ` (retried ${retryCount}/3 times)`}
              </span>
              <span className={styles.errorHint}>
                Using fallback subjects. Click 🔄 to retry.
              </span>
            </div>
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