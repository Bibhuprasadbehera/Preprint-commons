import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatMonthYear } from '../AnalyticsDashboardMockData';
import styles from './PublicationTimelineChart.module.css';

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

const PublicationTimelineChart = ({ data, loading = false }) => {
  const chartRef = useRef();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading publication timeline...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No publication timeline data available.</p>
        <p className={styles.emptyHint}>Try refreshing the data.</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => formatMonthYear(item.month + '-01')),
    datasets: [
      {
        label: 'Submissions',
        data: data.map(item => item.submissions),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
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
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Submissions: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Period',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxTicksLimit: 8,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Submissions',
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
            return value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default PublicationTimelineChart;