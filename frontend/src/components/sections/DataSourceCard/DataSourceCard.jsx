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
            <span className={styles.coverageLabel}>preprints</span>
          </div>
        </div>

        <div className={styles.fieldsSection}>
          <h4 className={styles.fieldsTitle}>Primary Focus Areas</h4>
          <div className={styles.fieldsList}>
            {fields.map((field, index) => (
              <span key={index} className={styles.fieldTag} style={{ borderColor: color }}>
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
    </Card>
  );
};

export default DataSourceCard;