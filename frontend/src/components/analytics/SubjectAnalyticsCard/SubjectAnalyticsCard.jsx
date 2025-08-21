import React from 'react';
import Card from '../../ui/Card/Card';
import { formatNumber, formatGrowthRate } from '../EnhancedAnalyticsMockData';
import styles from './SubjectAnalyticsCard.module.css';

const SubjectAnalyticsCard = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card className={`${styles.subjectAnalyticsCard} ${styles.loading}`}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Subject Analytics</h3>
          <p className={styles.cardSubtitle}>Research Area Trends</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading subject analysis...</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={styles.subjectAnalyticsCard}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Subject Analytics</h3>
          <p className={styles.cardSubtitle}>Research Area Trends</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <p>No subject analysis data available for the selected filters.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={styles.subjectAnalyticsCard}>
      <Card.Header>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <div className={styles.subjectIcon}>📊</div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Subject Analytics</h3>
            <p className={styles.cardSubtitle}>Research Area Trends</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className={styles.subjectList}>
          {data.slice(0, 8).map((subject, index) => (
            <div key={subject.subject} className={styles.subjectItem}>
              <div className={styles.subjectHeader}>
                <div className={styles.subjectInfo}>
                  <div className={styles.subjectName}>
                    {subject.subject.charAt(0).toUpperCase() + subject.subject.slice(1)}
                  </div>
                  <div className={styles.subjectMetrics}>
                    <span className={styles.metric}>
                      {formatNumber(subject.paper_count)} papers
                    </span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.metric}>
                      {formatNumber(subject.total_citations)} citations
                    </span>
                  </div>
                </div>
                <div className={styles.growthBadge}>
                  <span className={`${styles.growthRate} ${subject.growth_rate >= 0 ? styles.positive : styles.negative}`}>
                    {formatGrowthRate(subject.growth_rate)}
                  </span>
                </div>
              </div>
              
              <div className={styles.subjectStats}>
                <div className={styles.statRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Avg Citations</span>
                    <span className={styles.statValue}>
                      {subject.avg_citations_per_paper.toFixed(1)}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Top Countries</span>
                    <span className={styles.statValue}>
                      {subject.top_countries.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              
              {subject.yearly_distribution && (
                <div className={styles.trendChart}>
                  <div className={styles.chartBars}>
                    {subject.yearly_distribution.map((year, idx) => {
                      const maxPapers = Math.max(...subject.yearly_distribution.map(y => y.papers));
                      const height = (year.papers / maxPapers) * 100;
                      return (
                        <div key={year.year} className={styles.chartBar}>
                          <div 
                            className={styles.bar}
                            style={{ height: `${height}%` }}
                            title={`${year.year}: ${year.papers} papers`}
                          ></div>
                          <span className={styles.barLabel}>{year.year.slice(-2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {data.length > 8 && (
          <div className={styles.showMoreContainer}>
            <button className={styles.showMoreButton}>
              Show {data.length - 8} more subjects
            </button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default SubjectAnalyticsCard;