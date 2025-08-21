import React, { useState, useEffect } from 'react';
import Select from '../../ui/Select/Select';
import Button from '../../ui/Button/Button';
import { API_BASE_URL } from '../../../utils/api';
import styles from './EnhancedFilterControls.module.css';

// Enhanced useSubjects hook for subject filtering
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
          { value: 'evolutionary biology', label: 'Evolutionary Biology' },
          { value: 'molecular biology', label: 'Molecular Biology' },
          { value: 'bioinformatics', label: 'Bioinformatics' },
          { value: 'genomics', label: 'Genomics' },
          { value: 'neuroscience', label: 'Neuroscience' },
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

// Mock countries data (in a real app, this would come from an API)
const useCountries = () => {
  const countries = [
    { value: '', label: 'All Countries' },
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Germany', label: 'Germany' },
    { value: 'China', label: 'China' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'France', label: 'France' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Netherlands', label: 'Netherlands' }
  ];
  
  return { countries, loading: false, error: null };
};

const EnhancedFilterControls = ({
  selectedTimeRange,
  selectedSubject,
  selectedCountry,
  sortOption,
  onTimeRangeChange,
  onSubjectChange,
  onCountryChange,
  onSortChange,
  onSearchClick,
  onExportData,
  onRefreshData,
  showExportButton = true,
  showRefreshButton = true,
  isSearching = false,
}) => {
  const { subjects: subjectOptions, loading: subjectsLoading, error: subjectsError } = useSubjects();
  const { countries: countryOptions } = useCountries();
  
  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'last_5_years', label: 'Last 5 Years' },
    { value: 'last_10_years', label: 'Last 10 Years' },
  ];

  const sortOptions = [
    { value: 'citations_desc', label: 'Most Citations' },
    { value: 'citations_asc', label: 'Least Citations' },
    { value: 'papers_desc', label: 'Most Papers' },
    { value: 'collaboration_desc', label: 'Most Collaborative' },
    { value: 'growth_desc', label: 'Highest Growth' },
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'name_asc', label: 'Name A-Z' },
  ];

  return (
    <div className={styles.enhancedFilterControls}>
      <div className={styles.filtersSection}>
        <div className={styles.filtersGrid}>
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
            <label className={styles.filterLabel}>Country</label>
            <Select
              options={countryOptions}
              value={selectedCountry || ''}
              onChange={(value) => onCountryChange && onCountryChange(value || null)}
              className={styles.filterSelect}
              placeholder="Select country"
            />
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
      </div>

      <div className={styles.actionsSection}>
        <div className={styles.primaryActions}>
          <Button
            variant="primary"
            size="large"
            onClick={onSearchClick}
            disabled={isSearching}
            className={styles.searchButton}
          >
            {isSearching ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Analyzing...
              </>
            ) : (
              'Search & Analyze'
            )}
          </Button>
        </div>
        
        <div className={styles.secondaryActions}>
          {showRefreshButton && (
            <Button
              variant="outline"
              onClick={onRefreshData}
              className={styles.actionButton}
              disabled={isSearching}
            >
              Refresh Data
            </Button>
          )}
          
          {showExportButton && (
            <Button
              variant="secondary"
              onClick={onExportData}
              className={styles.actionButton}
              disabled={isSearching}
            >
              Export Enhanced Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFilterControls;