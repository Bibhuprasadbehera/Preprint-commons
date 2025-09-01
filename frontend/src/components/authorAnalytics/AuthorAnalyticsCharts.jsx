import React, { useState, useEffect } from 'react';
import Card from '../ui/Card/Card';
import Header from '../ui/Header/Header';
import AuthorCitationScatterChart from './AuthorCitationScatterChart';
import AuthorPublicationsTimelineChart from './AuthorPublicationsTimelineChart';
import AuthorSubjectDistributionChart from './AuthorSubjectDistributionChart';
import ApiService from '../../services/api';
import styles from './AuthorAnalyticsCharts.module.css';

const AuthorAnalyticsCharts = ({ 
  authorQuery = '', 
  authorResults = [], 
  showAnalytics = true,
  isLoading = false,
  error = null,
  onRefreshData = null,
  maxAuthors = 50 
}) => {
  const [analyticsData, setAnalyticsData] = useState({
    scatterData: [],
    timelineData: [],
    subjectData: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  // Process author results into chart data
  useEffect(() => {
    if (!showAnalytics || !authorResults || authorResults.length === 0) {
      setAnalyticsData({ scatterData: [], timelineData: [], subjectData: [] });
      return;
    }

    processAnalyticsData();
  }, [authorResults, showAnalytics, maxAuthors]);

  const processAnalyticsData = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);

    try {
      // Get top authors for detailed analysis
      const topAuthors = authorResults.slice(0, maxAuthors);
      
      // Process scatter data (papers vs citations)
      const scatterData = topAuthors.map(author => ({
        author: author.author_name || author.submission_contact,
        papers: author.paper_count || 0,
        citations: author.max_citations || 0,
        maxCitations: author.max_citations || 0
      }));

      // For timeline and subject data, we need to fetch detailed papers data
      // This is a simplified version - in a real app, you'd want to optimize this
      const timelineData = await processTimelineData(topAuthors.slice(0, 10));
      const subjectData = await processSubjectData(topAuthors.slice(0, 20));

      setAnalyticsData({
        scatterData,
        timelineData,
        subjectData
      });
    } catch (err) {
      console.error('Error processing analytics data:', err);
      setAnalyticsError('Failed to process analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const processTimelineData = async (authors) => {
    try {
      // Fetch papers for each author and aggregate by year
      const yearCounts = {};
      
      for (const author of authors) {
        try {
          const response = await ApiService.getAuthorPapers(
            author.author_name || author.submission_contact, 
            1, 
            100
          );
          
          if (response.papers) {
            response.papers.forEach(paper => {
              if (paper.preprint_submission_date) {
                const year = new Date(paper.preprint_submission_date).getFullYear();
                yearCounts[year] = (yearCounts[year] || 0) + 1;
              }
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch papers for ${author.author_name}:`, err);
        }
      }

      // Convert to array and sort by year
      return Object.entries(yearCounts)
        .map(([year, count]) => ({ year: parseInt(year), count }))
        .sort((a, b) => a.year - b.year);
    } catch (err) {
      console.error('Error processing timeline data:', err);
      return [];
    }
  };

  const processSubjectData = async (authors) => {
    try {
      const subjectCounts = {};
      
      for (const author of authors) {
        try {
          const response = await ApiService.getAuthorPapers(
            author.author_name || author.submission_contact, 
            1, 
            50
          );
          
          if (response.papers) {
            response.papers.forEach(paper => {
              if (paper.preprint_subject) {
                const subject = paper.preprint_subject.toLowerCase();
                subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
              }
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch papers for ${author.author_name}:`, err);
        }
      }

      // Convert to array, sort by count, and add colors
      const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
        '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
      ];

      return Object.entries(subjectCounts)
        .map(([subject, count], index) => ({
          subject: subject.charAt(0).toUpperCase() + subject.slice(1),
          count,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Top 8 subjects
    } catch (err) {
      console.error('Error processing subject data:', err);
      return [];
    }
  };

  if (!showAnalytics) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.analyticsContainer}>
        <Header 
          title="Author Analytics"
          subtitle="Loading author statistics and insights..."
          variant="section"
          size="medium"
        />
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Processing author data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.analyticsContainer}>
        <Header 
          title="Author Analytics"
          subtitle="Error loading author data"
          variant="section"
          size="medium"
        />
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>Failed to load author analytics: {error}</p>
          {onRefreshData && (
            <button onClick={onRefreshData} className={styles.retryButton}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!authorResults || authorResults.length === 0) {
    return (
      <div className={styles.analyticsContainer}>
        <Header 
          title="Author Analytics"
          subtitle="Search for authors to see analytics and insights"
          variant="section"
          size="medium"
        />
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p>No author data available for analysis.</p>
          <p className={styles.emptyHint}>
            Use the search above to find authors and view their research metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.analyticsContainer}>
      <Header 
        title="Author Analytics"
        subtitle={`Insights from ${authorResults.length} author${authorResults.length !== 1 ? 's' : ''}`}
        variant="section"
        size="medium"
      />
      
      <div className={styles.chartsGrid}>
        {/* Citation vs Publications Scatter Chart */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <h3 className={styles.chartTitle}>Citation vs Publications</h3>
            <p className={styles.chartSubtitle}>
              Relationship between research output and impact
            </p>
          </Card.Header>
          <Card.Content>
            <AuthorCitationScatterChart 
              data={analyticsData.scatterData}
              loading={analyticsLoading}
              error={analyticsError}
            />
          </Card.Content>
        </Card>

        {/* Publications Timeline Chart */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <h3 className={styles.chartTitle}>Publications Over Time</h3>
            <p className={styles.chartSubtitle}>
              Research activity trends by year
            </p>
          </Card.Header>
          <Card.Content>
            <AuthorPublicationsTimelineChart 
              data={analyticsData.timelineData}
              loading={analyticsLoading}
              error={analyticsError}
            />
          </Card.Content>
        </Card>

        {/* Subject Distribution Chart */}
        <Card className={styles.chartCard}>
          <Card.Header>
            <h3 className={styles.chartTitle}>Research Areas</h3>
            <p className={styles.chartSubtitle}>
              Distribution of papers by subject
            </p>
          </Card.Header>
          <Card.Content>
            <AuthorSubjectDistributionChart 
              data={analyticsData.subjectData}
              loading={analyticsLoading}
              error={analyticsError}
            />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default AuthorAnalyticsCharts;