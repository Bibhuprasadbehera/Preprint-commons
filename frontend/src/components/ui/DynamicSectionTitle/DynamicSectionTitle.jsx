import React from 'react';
import styles from './DynamicSectionTitle.module.css';

const DynamicSectionTitle = ({ sortOption, subtitle = "Based on current filters" }) => {
  const getTitleBySortOption = (sortOption) => {
    switch (sortOption) {
      case 'citations_desc':
        return 'High-Impact Papers';
      case 'citations_asc':
        return 'Least Cited Papers';
      case 'date_desc':
        return 'Recently Published Papers';
      case 'date_asc':
        return 'Earliest Published Papers';
      case 'title_asc':
        return 'Papers (A-Z)';
      default:
        return 'Research Preprints';
    }
  };

  const getSubtitleBySortOption = (sortOption) => {
    switch (sortOption) {
      case 'citations_desc':
        return 'Top cited papers in the dataset';
      case 'citations_asc':
        return 'Papers with fewer citations';
      case 'date_desc':
        return 'Most recently published papers';
      case 'date_asc':
        return 'Oldest papers in the dataset';
      case 'title_asc':
        return 'Papers sorted alphabetically';
      default:
        return subtitle;
    }
  };

  return (
    <div className={styles.titleContainer}>
      <h3 className={styles.title}>
        {getTitleBySortOption(sortOption)}
      </h3>
      <p className={styles.subtitle}>
        {getSubtitleBySortOption(sortOption)}
      </p>
    </div>
  );
};

export default DynamicSectionTitle;