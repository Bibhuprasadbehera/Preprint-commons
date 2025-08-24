import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatNumber } from '../analytics/AnalyticsDashboardMockData';
import styles from './ServerDistributionChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ServerDistributionChart = ({ data, loading = false }) => {
  const chartRef = useRef();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading server distribution...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No server distribution data available.</p>
        <p className={styles.emptyHint}>Try refreshing the data.</p>
      </div>
    );
  }

  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(249, 115, 22, 0.8)',   // Orange
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(245, 158, 11, 0.8)',   // Yellow
  ];

  const borderColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(245, 158, 11, 1)',
  ];

  const chartData = {
    labels: data.map(item => item.server),
    datasets: [
      {
        label: 'Papers Count',
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const dataItem = data[context.dataIndex];
            return [
              `Count: ${formatNumber(context.parsed.y)}`,
              `Percentage: ${dataItem.percentage}%`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Preprint Servers',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Papers',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ServerDistributionChart;