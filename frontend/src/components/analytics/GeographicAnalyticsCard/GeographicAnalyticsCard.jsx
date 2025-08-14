import React from 'react';
import Card from '../../ui/Card/Card';
import { formatNumber, formatGrowthRate } from '../EnhancedAnalyticsMockData';
import styles from './GeographicAnalyticsCard.module.css';

const GeographicAnalyticsCard = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card className={`${styles.geographicAnalyticsCard} ${styles.loading}`}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Geographic Analytics</h3>
          <p className={styles.cardSubtitle}>Research by Country</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading geographic data...</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={styles.geographicAnalyticsCard}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Geographic Analytics</h3>
          <p className={styles.cardSubtitle}>Research by Country</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🌍</div>
            <p>No geographic data available for the selected filters.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  const maxPapers = Math.max(...data.map(country => country.paper_count));

  return (
    <Card className={styles.geographicAnalyticsCard}>
      <Card.Header>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <div className={styles.geographicIcon}>🌍</div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Geographic Analytics</h3>
            <p className={styles.cardSubtitle}>Research by Country</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className={styles.countryList}>
          {data.slice(0, 10).map((country, index) => {
            const paperPercentage = (country.paper_count / maxPapers) * 100;
            
            return (
              <div key={country.country} className={styles.countryItem}>
                <div className={styles.countryHeader}>
                  <div className={styles.countryRank}>
                    #{index + 1}
                  </div>
                  <div className={styles.countryInfo}>
                    <div className={styles.countryName}>
                      {country.country}
                    </div>
                    <div className={styles.countryMetrics}>
                      <span className={styles.metric}>
                        {formatNumber(country.paper_count)} papers
                      </span>
                      <span className={styles.separator}>•</span>
                      <span className={styles.metric}>
                        {formatNumber(country.total_citations)} citations
                      </span>
                    </div>
                  </div>
                  <div className={styles.growthBadge}>
                    <span className={`${styles.growthRate} ${country.yearly_growth >= 0 ? styles.positive : styles.negative}`}>
                      {formatGrowthRate(country.yearly_growth)}
                    </span>
                  </div>
                </div>
                
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${paperPercentage}%` }}
                  ></div>
                </div>
                
                <div className={styles.countryStats}>
                  <div className={styles.statRow}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Avg Citations</span>
                      <span className={styles.statValue}>
                        {country.avg_citations_per_paper.toFixed(1)}
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Collaboration</span>
                      <span className={styles.statValue}>
                        {country.collaboration_percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.subjectTags}>
                    {country.top_subjects.slice(0, 3).map((subject, idx) => (
                      <span key={idx} className={styles.subjectTag}>
                        {subject}
                      </span>
                    ))}
                  </div>
                  
                  {country.top_institutions && (
                    <div className={styles.institutions}>
                      <span className={styles.institutionsLabel}>Top institutions:</span>
                      <span className={styles.institutionsList}>
                        {country.top_institutions.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {data.length > 10 && (
          <div className={styles.showMoreContainer}>
            <button className={styles.showMoreButton}>
              Show {data.length - 10} more countries
            </button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default GeographicAnalyticsCard;