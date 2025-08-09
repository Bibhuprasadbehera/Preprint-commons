import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import styles from './CitationScatterChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CitationScatterChart = ({ data, loading = false }) => {
  const chartRef = useRef();

  // Don't show chart if loading or no data
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading citation impact data...</p>
      </div>
    );
  }

  // Show empty state if no data after loading
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No citation impact data available for the selected filters.</p>
        <p className={styles.emptyHint}>Try adjusting your search criteria.</p>
      </div>
    );
  }

  const chartData = {
    datasets: [
      {
        label: 'Papers',
        data: data.map(paper => ({
          x: new Date(paper.publication_date).getFullYear(),
          y: paper.total_citation,
          title: paper.preprint_title,
          authors: paper.all_authors,
          id: paper.PPC_Id
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        callbacks: {
          title: function(context) {
            const point = context[0].raw;
            return point.title || 'Unknown Title';
          },
          label: function(context) {
            const point = context.raw;
            return [
              `Year: ${point.x}`,
              `Citations: ${point.y}`,
            ];
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Publication Year',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Citation Count',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
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

export default CitationScatterChart;