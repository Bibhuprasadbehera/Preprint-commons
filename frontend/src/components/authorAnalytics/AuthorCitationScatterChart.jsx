import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import styles from './AuthorCitationScatterChart.module.css';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const AuthorCitationScatterChart = ({ data, loading = false, error = null }) => {
  const chartRef = useRef();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading citation data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>📊</div>
        <p>No citation data available</p>
        <p className={styles.emptyHint}>Search for authors to see their citation metrics</p>
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        label: 'Authors',
        data: data.map(item => ({
          x: item.papers,
          y: item.citations,
          author: item.author
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderWidth: 3,
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
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            const dataPoint = context[0].raw;
            return dataPoint.author || 'Unknown Author';
          },
          label: function(context) {
            const dataPoint = context.raw;
            return [
              `Papers: ${dataPoint.x}`,
              `Max Citations: ${dataPoint.y}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Number of Papers',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: 'rgba(0, 0, 0, 0.8)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Maximum Citations',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: 'rgba(0, 0, 0, 0.8)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'point',
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Scatter ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default AuthorCitationScatterChart;