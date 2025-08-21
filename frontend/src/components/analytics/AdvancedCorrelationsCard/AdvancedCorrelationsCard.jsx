import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import Card from '../../ui/Card/Card';
import { formatNumber } from '../ComprehensiveAnalyticsMockData';
import styles from './AdvancedCorrelationsCard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdvancedCorrelationsCard = ({ data, loading = false }) => {
  const titleLengthChartRef = useRef();
  const authorCountChartRef = useRef();
  const timingChartRef = useRef();

  if (loading) {
    return (
      <Card className={`${styles.correlationsCard} ${styles.loading}`}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Advanced Correlations</h3>
          <p className={styles.cardSubtitle}>Multi-dimensional correlation analysis</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading correlations...</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!data || (!data.titleLengthVsCitations && !data.authorCountVsImpact && !data.submissionTimingVsSuccess)) {
    return (
      <Card className={styles.correlationsCard}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Advanced Correlations</h3>
          <p className={styles.cardSubtitle}>Multi-dimensional correlation analysis</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <p>No correlation data available for the selected filters.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Title Length vs Citations Scatter Plot
  const titleLengthData = {
    datasets: [
      {
        label: 'Title Length vs Citations',
        data: data.titleLengthVsCitations ? data.titleLengthVsCitations.map(item => ({
          x: item.title_length,
          y: item.avg_citations,
          papers: item.papers,
          correlation: item.correlation
        })) : [],
        backgroundColor: 'var(--color-correlations, #f97316)',
        borderColor: 'var(--color-correlations, #f97316)',
        pointRadius: function(context) {
          const papers = context.raw.papers;
          return Math.max(4, Math.min(12, papers / 50));
        },
        pointHoverRadius: function(context) {
          const papers = context.raw.papers;
          return Math.max(6, Math.min(15, papers / 40));
        }
      }
    ]
  };

  const titleLengthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          title: function(context) {
            return `${context[0].parsed.x} words`;
          },
          label: function(context) {
            return [
              `Avg Citations: ${context.parsed.y.toFixed(1)}`,
              `Papers: ${formatNumber(context.raw.papers)}`,
              `Correlation: ${(context.raw.correlation || 0).toFixed(2)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Title Length (words)', font: { size: 12, weight: 'bold' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      y: {
        title: { display: true, text: 'Average Citations', font: { size: 12, weight: 'bold' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  };

  // Author Count vs Impact Bar Chart
  const authorCountData = {
    labels: data.authorCountVsImpact ? data.authorCountVsImpact.map(item => `${item.author_count} authors`) : [],
    datasets: [
      {
        label: 'Average Citations',
        data: data.authorCountVsImpact ? data.authorCountVsImpact.map(item => item.avg_citations) : [],
        backgroundColor: function(context) {
          const item = data.authorCountVsImpact[context.dataIndex];
          return item && item.optimal_range ? 'var(--color-correlations, #f97316)' : 'rgba(249, 115, 22, 0.5)';
        },
        borderColor: 'var(--color-correlations, #f97316)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const authorCountOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            const item = data.authorCountVsImpact[context.dataIndex];
            return [
              `Avg Citations: ${context.parsed.y.toFixed(1)}`,
              `Papers: ${formatNumber(item.papers)}`,
              `Optimal: ${item.optimal_range ? 'Yes' : 'No'}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Number of Authors', font: { size: 12, weight: 'bold' } },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Average Citations', font: { size: 12, weight: 'bold' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  };

  // Submission Timing vs Success Bar Chart
  const timingData = {
    labels: data.submissionTimingVsSuccess ? data.submissionTimingVsSuccess.map(item => item.day_of_week) : [],
    datasets: [
      {
        label: 'Average Citations',
        data: data.submissionTimingVsSuccess ? data.submissionTimingVsSuccess.map(item => item.avg_citations) : [],
        backgroundColor: function(context) {
          const item = data.submissionTimingVsSuccess[context.dataIndex];
          const score = item ? item.success_score : 0;
          if (score >= 0.8) return '#10b981';
          if (score >= 0.7) return 'var(--color-correlations, #f97316)';
          return 'rgba(249, 115, 22, 0.5)';
        },
        borderColor: 'var(--color-correlations, #f97316)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const timingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            const item = data.submissionTimingVsSuccess[context.dataIndex];
            return [
              `Avg Citations: ${context.parsed.y.toFixed(1)}`,
              `Submissions: ${formatNumber(item.submissions)}`,
              `Success Score: ${(item.success_score * 100).toFixed(0)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Day of Week', font: { size: 12, weight: 'bold' } },
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Average Citations', font: { size: 12, weight: 'bold' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  };

  return (
    <Card className={styles.correlationsCard}>
      <Card.Header>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <div className={styles.correlationIcon}>📊</div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Advanced Correlations</h3>
            <p className={styles.cardSubtitle}>Multi-dimensional correlation analysis</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className={styles.correlationsGrid}>
          {/* Title Length vs Citations */}
          {data.titleLengthVsCitations && (
            <div className={styles.correlationSection}>
              <h4 className={styles.sectionTitle}>Title Length vs Citations</h4>
              <div className={styles.chartContainer}>
                <Scatter ref={titleLengthChartRef} data={titleLengthData} options={titleLengthOptions} />
              </div>
              <div className={styles.insight}>
                <span className={styles.insightLabel}>Insight:</span>
                <span className={styles.insightText}>
                  Optimal title length appears to be 12-16 words for maximum citation impact
                </span>
              </div>
            </div>
          )}

          {/* Author Count vs Impact */}
          {data.authorCountVsImpact && (
            <div className={styles.correlationSection}>
              <h4 className={styles.sectionTitle}>Author Count vs Impact</h4>
              <div className={styles.chartContainer}>
                <Bar ref={authorCountChartRef} data={authorCountData} options={authorCountOptions} />
              </div>
              <div className={styles.insight}>
                <span className={styles.insightLabel}>Insight:</span>
                <span className={styles.insightText}>
                  3-8 authors show optimal collaboration size for citation impact
                </span>
              </div>
            </div>
          )}

          {/* Submission Timing vs Success */}
          {data.submissionTimingVsSuccess && (
            <div className={styles.correlationSection}>
              <h4 className={styles.sectionTitle}>Submission Timing vs Success</h4>
              <div className={styles.chartContainer}>
                <Bar ref={timingChartRef} data={timingData} options={timingOptions} />
              </div>
              <div className={styles.insight}>
                <span className={styles.insightLabel}>Insight:</span>
                <span className={styles.insightText}>
                  Mid-week submissions (Tue-Thu) show higher citation success rates
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Geographic Citation Bias */}
        {data.geographicCitationBias && (
          <div className={styles.biasSection}>
            <h4 className={styles.sectionTitle}>Geographic Citation Bias</h4>
            <div className={styles.biasList}>
              {data.geographicCitationBias.map((bias, index) => (
                <div key={bias.country} className={styles.biasItem}>
                  <div className={styles.countryName}>{bias.country}</div>
                  <div className={styles.biasMetrics}>
                    <div className={styles.advantageBar}>
                      <div 
                        className={`${styles.advantageFill} ${bias.citation_advantage >= 1 ? styles.positive : styles.negative}`}
                        style={{ width: `${Math.abs(bias.bias_score) * 200}%` }}
                      ></div>
                    </div>
                    <span className={styles.advantageValue}>
                      {bias.citation_advantage.toFixed(2)}x
                    </span>
                    <span className={styles.biasScore}>
                      ({bias.bias_score > 0 ? '+' : ''}{(bias.bias_score * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AdvancedCorrelationsCard;