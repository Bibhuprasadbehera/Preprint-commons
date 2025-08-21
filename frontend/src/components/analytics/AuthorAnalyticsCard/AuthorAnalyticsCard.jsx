import React from 'react';
import Card from '../../ui/Card/Card';
import { formatNumber } from '../EnhancedAnalyticsMockData';
import styles from './AuthorAnalyticsCard.module.css';

const AuthorAnalyticsCard = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card className={`${styles.authorAnalyticsCard} ${styles.loading}`}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Author Analytics</h3>
          <p className={styles.cardSubtitle}>Top Authors by Citations</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading author analytics...</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={styles.authorAnalyticsCard}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Author Analytics</h3>
          <p className={styles.cardSubtitle}>Top Authors by Citations</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👤</div>
            <p>No author data available for the selected filters.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={styles.authorAnalyticsCard}>
      <Card.Header>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <div className={styles.authorIcon}>👤</div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Author Analytics</h3>
            <p className={styles.cardSubtitle}>Top Authors by Citations</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className={styles.authorList}>
          {data.slice(0, 10).map((author, index) => (
            <div key={author.author_name} className={styles.authorItem}>
              <div className={styles.authorRank}>
                #{index + 1}
              </div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>
                  {author.author_name}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorMetric}>
                    {formatNumber(author.total_citations)} citations
                  </span>
                  <span className={styles.authorSeparator}>•</span>
                  <span className={styles.authorMetric}>
                    {author.paper_count} papers
                  </span>
                  <span className={styles.authorSeparator}>•</span>
                  <span className={styles.authorMetric}>
                    {author.collaboration_index} collaborators
                  </span>
                </div>
                <div className={styles.authorSubjects}>
                  {author.primary_subjects.slice(0, 2).map((subject, idx) => (
                    <span key={idx} className={styles.subjectTag}>
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.authorStats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    {author.avg_citations_per_paper.toFixed(1)}
                  </span>
                  <span className={styles.statLabel}>Avg Citations</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {data.length > 10 && (
          <div className={styles.showMoreContainer}>
            <button className={styles.showMoreButton}>
              Show {data.length - 10} more authors
            </button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AuthorAnalyticsCard;