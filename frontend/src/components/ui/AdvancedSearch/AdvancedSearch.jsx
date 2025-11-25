import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Select from '../Select/Select';
import { API_BASE_URL } from '../../../utils/api';
import styles from './AdvancedSearch.module.css';

// Custom hook for fetching filter options with retry logic
const useFilterOptions = (endpoint, cacheKey) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const MAX_RETRIES = 3;

  const fetchOptions = async (currentAttempt = 0) => {
    const now = Date.now();
    
    // Check cache only on first attempt
    if (currentAttempt === 0 && options.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      console.log(`📋 Using cached ${cacheKey} data`);
      return;
    }

    // Reset state on first attempt
    if (currentAttempt === 0) {
      setError(null);
      setRetryCount(0);
    }
    
    setLoading(true);
    setRetryCount(currentAttempt);

    try {
      console.log(`🔍 Fetching ${cacheKey} (attempt ${currentAttempt + 1}/${MAX_RETRIES + 1})...`);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${cacheKey} data received:`, data);
      
      // Handle both array and {data: array} formats
      const dataArray = Array.isArray(data) ? data : (data.data || []);
      
      if (!Array.isArray(dataArray)) {
        throw new Error(`Invalid data format for ${cacheKey}`);
      }
      
      setOptions(dataArray);
      setLastFetchTime(now);
      setError(null);
      setRetryCount(0);
      setLoading(false);
    } catch (err) {
      console.error(`💥 ${cacheKey} fetch error (attempt ${currentAttempt + 1}/${MAX_RETRIES + 1}):`, err);
      
      // Check if we should retry
      if (currentAttempt < MAX_RETRIES) {
        const delay = Math.pow(2, currentAttempt) * 1000; // 1s, 2s, 4s
        console.log(`🔄 Retrying ${cacheKey} in ${delay}ms...`);
        
        setTimeout(() => {
          fetchOptions(currentAttempt + 1);
        }, delay);
      } else {
        // All retries exhausted
        console.log(`❌ All ${MAX_RETRIES + 1} attempts failed for ${cacheKey}`);
        setError(err.message);
        setOptions([]);
        setLastFetchTime(now);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOptions(0);
  }, []);

  const refreshOptions = () => {
    setLastFetchTime(0);
    setRetryCount(0);
    setError(null);
    fetchOptions(0);
  };

  return { options, loading, error, refreshOptions, retryCount };
};

const AdvancedSearch = ({ onSearch, loading = false }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    year_from: '',
    year_to: '',
    month: '',
    subject: '',
    server: '',
    authors: '',
    institution: '',
    license: '',
    citation_min: '',
    citation_max: ''
  });

  // Use custom hooks for each filter option
  // Note: subjects uses legacy endpoint /subjects (returns {data: []}), 
  // others use /api/papers/* endpoints (return plain arrays)
  const { 
    options: subjects, 
    loading: subjectsLoading, 
    error: subjectsError,
    refreshOptions: refreshSubjects,
    retryCount: subjectsRetryCount
  } = useFilterOptions('/subjects', 'subjects');
  
  const { 
    options: servers, 
    loading: serversLoading, 
    error: serversError,
    refreshOptions: refreshServers,
    retryCount: serversRetryCount
  } = useFilterOptions('/api/papers/servers', 'servers');
  
  const { 
    options: licenses, 
    loading: licensesLoading, 
    error: licensesError,
    refreshOptions: refreshLicenses,
    retryCount: licensesRetryCount
  } = useFilterOptions('/api/papers/licenses', 'licenses');

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Convert empty strings to null and numbers to numbers
    const criteria = {};
    Object.keys(searchCriteria).forEach(key => {
      const value = searchCriteria[key];
      if (value === '') {
        criteria[key] = null;
      } else if (['year_from', 'year_to', 'citation_min', 'citation_max'].includes(key)) {
        criteria[key] = value ? parseInt(value, 10) : null;
      } else {
        criteria[key] = value;
      }
    });

    onSearch(criteria);
  };

  const handleReset = () => {
    setSearchCriteria({
      year_from: '',
      year_to: '',
      month: '',
      subject: '',
      server: '',
      authors: '',
      institution: '',
      license: '',
      citation_min: '',
      citation_max: ''
    });
  };

  // Generate year options (2010 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2010 + 2 }, (_, i) => {
    const year = 2010 + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Transform options to Select format
  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    ...subjects.map(s => ({
      value: s,
      label: s.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }))
  ];

  const serverOptions = [
    { value: '', label: 'All Servers' },
    ...servers.map(s => ({ 
      value: s, 
      label: s.charAt(0).toUpperCase() + s.slice(1) 
    }))
  ];

  const licenseOptions = [
    { value: '', label: 'All Licenses' },
    ...licenses.map(l => ({ value: l, label: l }))
  ];

  return (
    <div className={styles.advancedSearch}>
      <div className={styles.searchGrid}>
        {/* Year Range */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Publication Year Range</label>
          <div className={styles.yearRange}>
            <Select
              options={[{ value: '', label: 'From' }, ...yearOptions]}
              value={searchCriteria.year_from}
              onChange={(value) => handleInputChange('year_from', value)}
              className={styles.yearSelect}
              placeholder="From year"
            />
            <span className={styles.rangeSeparator}>to</span>
            <Select
              options={[{ value: '', label: 'To' }, ...yearOptions]}
              value={searchCriteria.year_to}
              onChange={(value) => handleInputChange('year_to', value)}
              className={styles.yearSelect}
              placeholder="To year"
            />
          </div>
        </div>

        {/* Subject */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabelRow}>
            <label className={styles.fieldLabel}>Subject</label>
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
            value={searchCriteria.subject}
            onChange={(value) => handleInputChange('subject', value)}
            disabled={subjectsLoading}
            placeholder={subjectsLoading ? 
              (subjectsRetryCount > 0 ? `Retrying... (${subjectsRetryCount}/3)` : "Loading subjects...") : 
              "Select subject"
            }
          />
          {subjectsError && (
            <div className={styles.errorHint}>
              Failed to load subjects. Click 🔄 to retry.
            </div>
          )}
        </div>

        {/* Server */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabelRow}>
            <label className={styles.fieldLabel}>Preprint Server</label>
            {serversError && (
              <Button
                variant="ghost"
                size="small"
                onClick={refreshServers}
                disabled={serversLoading}
                className={styles.refreshButton}
                title="Refresh servers list"
              >
                🔄
              </Button>
            )}
          </div>
          <Select
            options={serverOptions}
            value={searchCriteria.server}
            onChange={(value) => handleInputChange('server', value)}
            disabled={serversLoading}
            placeholder={serversLoading ? 
              (serversRetryCount > 0 ? `Retrying... (${serversRetryCount}/3)` : "Loading servers...") : 
              "Select server"
            }
          />
          {serversError && (
            <div className={styles.errorHint}>
              Failed to load servers. Click 🔄 to retry.
            </div>
          )}
        </div>


        {/* Authors */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Authors</label>
          <input
            type="text"
            value={searchCriteria.authors}
            onChange={(e) => handleInputChange('authors', e.target.value)}
            placeholder="Search by author name"
            className={styles.textInput}
          />
        </div>

        {/* Institution */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Institution</label>
          <input
            type="text"
            value={searchCriteria.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            placeholder="Search by institution"
            className={styles.textInput}
          />
        </div>

        {/* License */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabelRow}>
            <label className={styles.fieldLabel}>License</label>
            {licensesError && (
              <Button
                variant="ghost"
                size="small"
                onClick={refreshLicenses}
                disabled={licensesLoading}
                className={styles.refreshButton}
                title="Refresh licenses list"
              >
                🔄
              </Button>
            )}
          </div>
          <Select
            options={licenseOptions}
            value={searchCriteria.license}
            onChange={(value) => handleInputChange('license', value)}
            disabled={licensesLoading}
            placeholder={licensesLoading ? 
              (licensesRetryCount > 0 ? `Retrying... (${licensesRetryCount}/3)` : "Loading licenses...") : 
              "Select license"
            }
          />
          {licensesError && (
            <div className={styles.errorHint}>
              Failed to load licenses. Click 🔄 to retry.
            </div>
          )}
        </div>

        {/* Citation Range */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Citation Count Range</label>
          <div className={styles.citationRange}>
            <input
              type="number"
              value={searchCriteria.citation_min}
              onChange={(e) => handleInputChange('citation_min', e.target.value)}
              placeholder="Min citations"
              className={styles.numberInput}
              min="0"
            />
            <span className={styles.rangeSeparator}>to</span>
            <input
              type="number"
              value={searchCriteria.citation_max}
              onChange={(e) => handleInputChange('citation_max', e.target.value)}
              placeholder="Max citations"
              className={styles.numberInput}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={loading}
        >
          Reset Filters
        </Button>
        <Button
          variant="primary"
          onClick={handleSearch}
          loading={loading}
        >
          {loading ? 'Searching...' : 'Search Papers'}
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSearch;