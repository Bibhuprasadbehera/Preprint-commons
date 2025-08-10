import React, { useEffect, useRef, useState, useCallback } from 'react';
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
// Note: chartjs-plugin-zoom would need to be installed for full zoom functionality
// For now, we'll implement basic zoom controls manually
import { Scatter } from 'react-chartjs-2';
import ZoomControls from './ZoomControls/ZoomControls';
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
  const [zoomState, setZoomState] = useState({
    minYear: null,
    maxYear: null,
    originalMinYear: null,
    originalMaxYear: null
  });

  // Calculate year range from data
  useEffect(() => {
    if (data && data.length > 0) {
      const years = data.map(paper => new Date(paper.publication_date).getFullYear());
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      
      setZoomState(prev => ({
        ...prev,
        minYear: prev.originalMinYear || minYear,
        maxYear: prev.originalMaxYear || maxYear,
        originalMinYear: prev.originalMinYear || minYear,
        originalMaxYear: prev.originalMaxYear || maxYear
      }));
    }
  }, [data]);

  const handleZoomIn = useCallback(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const currentRange = zoomState.maxYear - zoomState.minYear;
      const zoomFactor = 0.7; // Zoom in by 30%
      const newRange = currentRange * zoomFactor;
      const center = (zoomState.minYear + zoomState.maxYear) / 2;
      
      const newMinYear = Math.max(zoomState.originalMinYear, Math.round(center - newRange / 2));
      const newMaxYear = Math.min(zoomState.originalMaxYear, Math.round(center + newRange / 2));
      
      // Manual zoom implementation - update chart options
      chart.options.scales.x.min = newMinYear;
      chart.options.scales.x.max = newMaxYear;
      chart.update('none');
      setZoomState(prev => ({ ...prev, minYear: newMinYear, maxYear: newMaxYear }));
    }
  }, [zoomState]);

  const handleZoomOut = useCallback(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const currentRange = zoomState.maxYear - zoomState.minYear;
      const zoomFactor = 1.3; // Zoom out by 30%
      const newRange = Math.min(
        currentRange * zoomFactor,
        zoomState.originalMaxYear - zoomState.originalMinYear
      );
      const center = (zoomState.minYear + zoomState.maxYear) / 2;
      
      const newMinYear = Math.max(zoomState.originalMinYear, Math.round(center - newRange / 2));
      const newMaxYear = Math.min(zoomState.originalMaxYear, Math.round(center + newRange / 2));
      
      // Manual zoom implementation - update chart options
      chart.options.scales.x.min = newMinYear;
      chart.options.scales.x.max = newMaxYear;
      chart.update('none');
      setZoomState(prev => ({ ...prev, minYear: newMinYear, maxYear: newMaxYear }));
    }
  }, [zoomState]);

  const handleReset = useCallback(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      // Manual reset implementation
      chart.options.scales.x.min = undefined;
      chart.options.scales.x.max = undefined;
      chart.update('none');
      setZoomState(prev => ({
        ...prev,
        minYear: prev.originalMinYear,
        maxYear: prev.originalMaxYear
      }));
    }
  }, []);

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
      // Zoom plugin configuration would go here when chartjs-plugin-zoom is installed
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
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Math.round(value);
          }
        }
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

  const isZoomedIn = zoomState.minYear !== zoomState.originalMinYear || 
                     zoomState.maxYear !== zoomState.originalMaxYear;

  return (
    <div className={styles.chartContainer}>
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        disabled={loading}
      />
      <Scatter ref={chartRef} data={chartData} options={options} />
      {isZoomedIn && (
        <div className={styles.zoomInfo}>
          Showing years {zoomState.minYear} - {zoomState.maxYear}
        </div>
      )}
    </div>
  );
};

export default CitationScatterChart;