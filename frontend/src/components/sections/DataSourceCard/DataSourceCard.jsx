import React from 'react';
import Card from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import styles from './DataSourceCard.module.css';

const DataSourceCard = ({ 
  name, 
  description, 
  url, 
  coverage, 
  fields = [], 
  color = '#3498db' 
}) => {
  return (
    <Card className={styles.sourceCard}>
      <div className={styles.sourceHeader} style={{ borderTopColor: color }}>
        <div className={styles.sourceIcon} style={{ backgroundColor: color }}>
          <span className={styles.sourceInitial}>{name.charAt(0)}</span>
        </div>
        <div className={styles.sourceInfo}>
          <h3 className={styles.sourceName}>{name}</h3>
          <p className={styles.sourceDescription}>{description}</p>
        </div>
      </div>

      <div className={styles.sourceContent}>
        <div className={styles.coverageSection}>
          <div className={styles.coverageBadge}>
            <span className={styles.coverageNumber}>{coverage}</span>
            <span className={styles.coverageLabel}>papers indexed</span>
          </div>
        </div>

        <div className={styles.fieldsSection}>
          <h4 className={styles.fieldsTitle}>Research Fields</h4>
          <div className={styles.fieldsList}>
            {fields.map((field, index) => (
              <span key={index} className={styles.fieldTag}>
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.sourceActions}>
          <Button 
            variant="outline" 
            size="small"
            onClick={() => window.open(url, '_blank')}
          >
            Visit Repository
          </Button>
        </div>
      </div>

      <div className={styles.sourceStats}>
        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ color }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ color }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <span className={styles.statLabel}>Daily Updates</span>
        </div>
      </div>
    </Card>
  );
};

export default DataSourceCard;