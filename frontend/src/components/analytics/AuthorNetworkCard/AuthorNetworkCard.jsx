import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '../../ui/Card/Card';
import { formatNumber, formatCollaborationStrength } from '../ComprehensiveAnalyticsMockData';
import styles from './AuthorNetworkCard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AuthorNetworkCard = ({ data, loading = false }) => {
  const chartRef = useRef();

  if (loading) {
    return (
      <Card className={`${styles.authorNetworkCard} ${styles.loading}`}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Author Collaboration Networks</h3>
          <p className={styles.cardSubtitle}>Institution collaboration patterns</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading author networks...</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!data || !data.prolificAuthors || data.prolificAuthors.length === 0) {
    return (
      <Card className={styles.authorNetworkCard}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Author Collaboration Networks</h3>
          <p className={styles.cardSubtitle}>Institution collaboration patterns</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🤝</div>
            <p>No author network data available for the selected filters.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Prepare chart data for top authors
  const chartData = {
    labels: data.prolificAuthors.slice(0, 8).map(author => author.author.split(',')[0]),
    datasets: [
      {
        label: 'Citations',
        data: data.prolificAuthors.slice(0, 8).map(author => author.citations),
        backgroundColor: 'var(--color-author-networks, #10b981)',
        borderColor: 'var(--color-author-networks, #10b981)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Papers',
        data: data.prolificAuthors.slice(0, 8).map(author => author.papers * 10), // Scale for visibility
        backgroundColor: 'var(--color-secondary, #f59e0b)',
        borderColor: 'var(--color-secondary, #f59e0b)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'var(--font-family-primary)'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'var(--color-author-networks, #10b981)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            const authorIndex = context.dataIndex;
            const author = data.prolificAuthors[authorIndex];
            
            if (datasetLabel === 'Citations') {
              return `${datasetLabel}: ${formatNumber(value)}`;
            } else {
              return `${datasetLabel}: ${Math.round(value / 10)}`;
            }
          },
          afterBody: function(tooltipItems) {
            const authorIndex = tooltipItems[0].dataIndex;
            const author = data.prolificAuthors[authorIndex];
            return [
              `H-Index: ${author.h_index}`,
              `Collaboration: ${formatCollaborationStrength(author.collaboration_score)}`,
              `Institutions: ${author.institutions.join(', ')}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 10,
            family: 'var(--font-family-primary)'
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          },
          font: {
            size: 11,
            family: 'var(--font-family-primary)'
          }
        },
        title: {
          display: true,
          text: 'Citations',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return Math.round(value / 10);
          },
          font: {
            size: 11,
            family: 'var(--font-family-primary)'
          }
        },
        title: {
          display: true,
          text: 'Papers',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <Card className={styles.authorNetworkCard}>
      <Card.Header>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <div className={styles.networkIcon}>🤝</div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Author Collaboration Networks</h3>
            <p className={styles.cardSubtitle}>Top productive authors and collaboration patterns</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className={styles.chartContainer}>
          <Bar ref={chartRef} data={chartData} options={options} />
        </div>
        
        {data.collaborationNetworks && (
          <div className={styles.collaborationMatrix}>
            <h4 className={styles.matrixTitle}>Institution Collaboration Strength</h4>
            <div className={styles.collaborationList}>
              {data.collaborationNetworks.slice(0, 5).map((collab, index) => (
                <div key={index} className={styles.collaborationItem}>
                  <div className={styles.collaborationPair}>
                    <span className={styles.institution}>{collab.source}</span>
                    <span className={styles.connector}>↔</span>
                    <span className={styles.institution}>{collab.target}</span>
                  </div>
                  <div className={styles.collaborationMetrics}>
                    <div className={styles.strengthBar}>
                      <div 
                        className={styles.strengthFill}
                        style={{ width: `${collab.strength * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles.strengthValue}>
                      {(collab.strength * 100).toFixed(0)}%
                    </span>
                    <span className={styles.paperCount}>
                      {collab.papers} papers
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

export default AuthorNetworkCard;