import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '../../ui/Card/Card';
import { formatNumber } from '../ComprehensiveAnalyticsMockData';
import styles from './CitationTrendsCard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CitationTrendsCard = ({ data, loading = false }) => {
  const chartRef = useRef();

  if (loading) {
    return (
      <Card className={`${styles.citationTrendsCard} ${styles.loading}`}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Citation Growth Analysis</h3>
          <p className={styles.cardSubtitle}>Citation accumulation over time</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading citation trends...</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (!data || !data.growthOverTime || data.growthOverTime.length === 0) {
    return (
      <Card className={styles.citationTrendsCard}>
        <Card.Header>
          <h3 className={styles.cardTitle}>Citation Growth Analysis</h3>
          <p className={styles.cardSubtitle}>Citation accumulation over time</p>
        </Card.Header>
        <Card.Content>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📈</div>
            <p>No citation trends data available for the selected filters.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  const chartData = {
    labels: data.growthOverTime.map(item => item.year),
    datasets: [
      {
        label: 'Total Citations',
        data: data.growthOverTime.map(item => item.total_citations),
        borderColor: 'var(--color-citation-trends, #3b82f6)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'var(--color-citation-trends, #3b82f6)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'Average Citations per Paper',
        data: data.growthOverTime.map(item => item.avg_per_paper * 1000), // Scale for visibility
        borderColor: 'var(--color-secondary, #f59e0b)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'var(--color-secondary, #f59e0b)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
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
        borderColor: 'var(--color-citation-trends, #3b82f6)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            
            if (datasetLabel === 'Total Citations') {
              return `${datasetLabel}: ${formatNumber(value)}`;
            } else {
              return `${datasetLabel}: ${(value / 1000).toFixed(1)}`;
            }
          },
          afterBody: function(tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const item = data.growthOverTime[index];
            return [
              `Papers: ${formatNumber(item.papers)}`,
              `Growth: ${index > 0 ? 
                ((item.total_citations - data.growthOverTime[index-1].total_citations) / data.growthOverTime[index-1].total_citations * 100).toFixed(1) + '%' : 
                'N/A'}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
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
          text: 'Total Citations',
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
            return (value / 1000).toFixed(1);
          },
          font: {
            size: 11,
            family: 'var(--font-family-primary)'
          }
        },
        title: {
          display: true,
          text: 'Avg Citations/Paper',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  // Calculate summary statistics
  const latestYear = data.growthOverTime[data.growthOverTime.length - 1];
  const firstYear = data.growthOverTime[0];
  const totalGrowth = ((latestYear.total_citations - firstYear.total_citations) / firstYear.total_citations * 100).toFixed(1);
  const avgGrowthRate = (Math.pow(latestYear.total_citations / firstYear.total_citations, 1 / (data.growthOverTime.length - 1)) - 1) * 100;

  return (
    <Card className={styles.citationTrendsCard}>
      <Card.Header>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <div className={styles.trendIcon}>📈</div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Citation Growth Analysis</h3>
            <p className={styles.cardSubtitle}>Citation accumulation over time</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className={styles.summaryStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatNumber(latestYear.total_citations)}</span>
            <span className={styles.statLabel}>Total Citations ({latestYear.year})</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{totalGrowth}%</span>
            <span className={styles.statLabel}>Total Growth</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{avgGrowthRate.toFixed(1)}%</span>
            <span className={styles.statLabel}>Avg Annual Growth</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{latestYear.avg_per_paper.toFixed(1)}</span>
            <span className={styles.statLabel}>Avg Citations/Paper</span>
          </div>
        </div>
        
        <div className={styles.chartContainer}>
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      </Card.Content>
    </Card>
  );
};

export default CitationTrendsCard;