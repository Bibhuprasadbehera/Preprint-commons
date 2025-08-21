import React from 'react';
import Card from '../../ui/Card/Card';
import { formatNumber } from '../AnalyticsDashboardMockData';
import styles from './StatisticsCard.module.css';

const StatisticsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  className = '',
  variant = 'default' 
}) => {
  return (
    <Card className={`${styles.statisticsCard} ${styles[variant]} ${className}`}>
      <Card.Content>
        <div className={styles.cardHeader}>
          {icon && (
            <div className={styles.iconContainer}>
              {icon}
            </div>
          )}
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        <div className={styles.valueContainer}>
          <span className={styles.value}>
            {typeof value === 'number' && !isNaN(value) ? formatNumber(value) : (value || 'N/A')}
          </span>
        </div>
      </Card.Content>
    </Card>
  );
};

export default StatisticsCard;