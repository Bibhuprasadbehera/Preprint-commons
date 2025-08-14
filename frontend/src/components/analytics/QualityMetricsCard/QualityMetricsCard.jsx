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
  Legend,
  ArcElement
} from 'chart.js';
import { Scatter, Doughnut } from 'react-chartjs-2';
import Card from '../../ui/Card/Card';
import { formatNumber, formatCitationVelocity, formatImpactPercentile } from '../ComprehensiveAnalyticsMockData';
import styles from './QualityMetricsCard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const QualityMetricsCard = ({ data, loading = false }) => {
  const velocityChartRef = useRef();
  const zeroCitationChartRef = useRef();

  if (loading) {
    return (
      <Card className={`${styles.qualityMetricsCard} ${styles.loading}`}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Quality & Impact Metrics</h3>
          <p className={styles.cardSubtitle}>Citation velocity and impact analysis</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading quality metrics...</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!data || (!data.citationVelocity && !data.zeroCitationAnalysis && !data.highImpactOutliers)) {
    return (
      <Card className={styles.qualityMetricsCard}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Quality & Impact Metrics</h3>
          <p className={styles.cardSubtitle}>Citation velocity and impact analysis</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⭐</div>
            <p>No quality metrics data available for the selected filters.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Citation Velocity Scatter Plot
  const velocityData = {
    datasets: [
      {
        label: 'Citation Velocity',
        data: data.citationVelocity ? data.citationVelocity.map(paper => ({
          x: paper.time_to_peak,
          y: paper.velocity,
          paper_id: paper.paper_id,
          category: paper.velocity_category
        })) : [],
        backgroundColor: function(context) {
          const category = context.parsed.category || context.raw.category;
          switch(category) {
            case 'very_high': return '#dc2626';
            case 'high': return '#f59e0b';
            case 'medium': return '#10b981';
            case 'low': return '#6b7280';
            default: return '#6b7280';
          }
        },
        borderColor: function(context) {
          const category = context.parsed.category || context.raw.category;
          switch(category) {
            case 'very_high': return '#dc2626';
            case 'high': return '#f59e0b';
            case 'medium': return '#10b981';
            case 'low': return '#6b7280';
            default: return '#6b7280';
          }
        },
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const velocityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          title: function(context) {
            return `Paper ${context[0].raw.paper_id}`;
          },
          label: function(context) {
            return [
              `Velocity: ${formatCitationVelocity(context.parsed.y)}`,
              `Time to Peak: ${context.parsed.x} days`,
              `Category: ${context.raw.category}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time to Peak Citations (days)',
          font: { size: 12, weight: 'bold' }
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      y: {
        title: {
          display: true,
          text: 'Citation Velocity',
          font: { size: 12, weight: 'bold' }
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  };

  // Zero Citation Analysis Doughnut Chart
  const zeroCitationData = {
    labels: ['Cited Papers', 'Zero Citations'],
    datasets: [
      {
        data: data.zeroCitationAnalysis ? [
          data.zeroCitationAnalysis.total_papers - data.zeroCitationAnalysis.zero_citation_papers,
          data.zeroCitationAnalysis.zero_citation_papers
        ] : [0, 0],
        backgroundColor: [
          'var(--color-quality-metrics, #06b6d4)',
          '#ef4444'
        ],
        borderColor: [
          'var(--color-quality-metrics, #06b6d4)',
          '#ef4444'
        ],
        borderWidth: 2
      }
    ]
  };

  const zeroCitationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            const total = data.zeroCitationAnalysis.total_papers;
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatNumber(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Card className={styles.qualityMetricsCard}>
      <Card.Header>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <div className={styles.qualityIcon}>⭐</div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Quality & Impact Metrics</h3>
            <p className={styles.cardSubtitle}>Citation velocity and impact analysis</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className={styles.metricsGrid}>
          {/* Citation Velocity Chart */}
          {data.citationVelocity && (
            <div className={styles.chartSection}>
              <h4 className={styles.sectionTitle}>Citation Velocity Analysis</h4>
              <div className={styles.chartContainer}>
                <Scatter ref={velocityChartRef} data={velocityData} options={velocityOptions} />
              </div>
            </div>
          )}

          {/* Zero Citation Analysis */}
          {data.zeroCitationAnalysis && (
            <div className={styles.chartSection}>
              <h4 className={styles.sectionTitle}>Zero Citation Analysis</h4>
              <div className={styles.zeroCitationContainer}>
                <div className={styles.zeroCitationChart}>
                  <Doughnut ref={zeroCitationChartRef} data={zeroCitationData} options={zeroCitationOptions} />
                </div>
                <div className={styles.zeroCitationStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{data.zeroCitationAnalysis.percentage.toFixed(1)}%</span>
                    <span className={styles.statLabel}>Zero Citations</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{formatNumber(data.zeroCitationAnalysis.zero_citation_papers)}</span>
                    <span className={styles.statLabel}>Uncited Papers</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* High Impact Outliers */}
        {data.highImpactOutliers && (
          <div className={styles.outliersSection}>
            <h4 className={styles.sectionTitle}>High Impact Outliers</h4>
            <div className={styles.outliersList}>
              {data.highImpactOutliers.slice(0, 5).map((outlier, index) => (
                <div key={outlier.paper_id} className={styles.outlierItem}>
                  <div className={styles.outlierRank}>#{index + 1}</div>
                  <div className={styles.outlierInfo}>
                    <div className={styles.paperId}>{outlier.paper_id}</div>
                    <div className={styles.outlierMetrics}>
                      <span className={styles.metric}>
                        {formatNumber(outlier.citations)} citations
                      </span>
                      <span className={styles.separator}>•</span>
                      <span className={styles.metric}>
                        {outlier.outlier_score.toFixed(1)}x expected
                      </span>
                    </div>
                  </div>
                  <div className={styles.outlierBadge}>
                    <span className={`${styles.categoryBadge} ${styles[outlier.category]}`}>
                      {outlier.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Field Normalized Scores */}
        {data.fieldNormalizedScores && (
          <div className={styles.normalizedSection}>
            <h4 className={styles.sectionTitle}>Field-Normalized Impact Scores</h4>
            <div className={styles.normalizedList}>
              {data.fieldNormalizedScores.slice(0, 5).map((score, index) => (
                <div key={score.paper_id} className={styles.normalizedItem}>
                  <div className={styles.scoreInfo}>
                    <span className={styles.paperId}>{score.paper_id}</span>
                    <span className={styles.percentile}>
                      {formatImpactPercentile(score.percentile)}
                    </span>
                  </div>
                  <div className={styles.scoreBar}>
                    <div 
                      className={styles.scoreFill}
                      style={{ width: `${Math.min(score.normalized_score * 10, 100)}%` }}
                    ></div>
                  </div>
                  <div className={styles.scoreValue}>
                    {score.normalized_score.toFixed(1)}x
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

export default QualityMetricsCard;