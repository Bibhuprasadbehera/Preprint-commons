import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatNumber } from '../analytics/AnalyticsDashboardMockData';
import styles from './SubjectDistributionChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const SubjectDistributionChart = ({ data, loading = false }) => {
  const chartRef = useRef();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading subject distribution...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No subject distribution data available.</p>
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
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(14, 165, 233, 0.8)',   // Light Blue
  ];

  const borderColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(14, 165, 233, 1)',
  ];

  const chartData = {
    labels: data.map(item => item.subject),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
          generateLabels: function(chart) {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);
            
            labels.forEach((label, index) => {
              const dataItem = data[index];
              label.text = `${label.text}: ${formatNumber(dataItem.count)} (${dataItem.percentage}%)`;
            });
            
            return labels;
          },
        },
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
              `Count: ${formatNumber(context.parsed)}`,
              `Percentage: ${dataItem.percentage}%`,
            ];
          },
        },
      },
    },
    elements: {
      arc: {
        borderJoinStyle: 'round',
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Pie ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default SubjectDistributionChart;