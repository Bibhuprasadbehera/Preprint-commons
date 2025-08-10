import React, { useState, useEffect } from 'react';
import Select from '../Select/Select';
import Button from '../Button/Button';
import { API_BASE_URL } from '../../../utils/api';
import styles from './FilterControls.module.css';

// useSubjects hook moved here since it's only used in this component
const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      
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
      } catch (err) {
        console.error('💥 Subjects fetch error:', err);
        setError(err.message);
        
        // Fallback to hardcoded subjects if API fails
        const fallbackSubjects = [
          { value: '', label: 'All Subjects' },
          { value: 'bioinformatics', label: 'Bioinformatics' },
          { value: 'molecular biology', label: 'Molecular Biology' },
          { value: 'neuroscience', label: 'Neuroscience' },
          { value: 'genomics', label: 'Genomics' },
          { value: 'immunology', label: 'Immunology' }
        ];
        setSubjects(fallbackSubjects);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { subjects, loading, error };
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