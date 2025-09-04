import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Select from '../Select/Select';
import styles from './AdvancedSearch.module.css';

const AdvancedSearch = ({ onSearch, loading = false }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    year_from: '',
    year_to: '',
    month: '',
    subject: '',
    server: '',
    country: '',
    authors: '',
    institution: '',
    license: '',
    citation_min: '',
    citation_max: ''
  });

  const [subjects, setSubjects] = useState([]);
  const [servers, setServers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [licenses, setLicenses] = useState([]);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        // Load subjects
        const subjectsRes = await fetch('/api/subjects');
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData || []);

        // Load servers
        const serversRes = await fetch('/api/servers');
        const serversData = await serversRes.json();
        setServers(serversData || []);

        // Load countries
        const countriesRes = await fetch('/api/countries');
        const countriesData = await countriesRes.json();
        setCountries(countriesData || []);

        // Load licenses
        const licensesRes = await fetch('/api/licenses');
        const licensesData = await licensesRes.json();
        setLicenses(licensesData || []);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

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
      country: '',
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
          <label className={styles.fieldLabel}>Subject</label>
          <Select
            options={[{ value: '', label: 'All Subjects' }, ...subjects.map(s => ({ value: s, label: s }))]}
            value={searchCriteria.subject}
            onChange={(value) => handleInputChange('subject', value)}
            placeholder="Select subject"
          />
        </div>

        {/* Server */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Preprint Server</label>
          <Select
            options={[{ value: '', label: 'All Servers' }, ...servers.map(s => ({ value: s, label: s }))]}
            value={searchCriteria.server}
            onChange={(value) => handleInputChange('server', value)}
            placeholder="Select server"
          />
        </div>

        {/* Country */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Country</label>
          <Select
            options={[{ value: '', label: 'All Countries' }, ...countries.map(c => ({ value: c, label: c }))]}
            value={searchCriteria.country}
            onChange={(value) => handleInputChange('country', value)}
            placeholder="Select country"
          />
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
          <label className={styles.fieldLabel}>License</label>
          <Select
            options={[{ value: '', label: 'All Licenses' }, ...licenses.map(l => ({ value: l, label: l }))]}
            value={searchCriteria.license}
            onChange={(value) => handleInputChange('license', value)}
            placeholder="Select license"
          />
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
