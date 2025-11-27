import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PublicationTimelineChart = ({ data, type = 'trend' }) => {
  if (!data) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>No data available</div>;
  }

  // Trend over time chart
  if (type === 'trend' && data.trendOverTime) {
    const chartData = {
      labels: data.trendOverTime.map(d => d.year),
      datasets: [
        {
          label: 'Average Days to Publish',
          data: data.trendOverTime.map(d => d.avg_days),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Number of Papers',
          data: data.trendOverTime.map(d => d.paper_count),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Publication Timeline Trend'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.dataset.yAxisID === 'y' 
                  ? `${context.parsed.y} days`
                  : `${context.parsed.y} papers`;
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Average Days'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Paper Count'
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      }
    };

    return (
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    );
  }

  // Distribution chart
  if (type === 'distribution' && data.distribution) {
    const chartData = {
      labels: data.distribution.map(d => d.time_bucket),
      datasets: [{
        label: 'Number of Papers',
        data: data.distribution.map(d => d.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Publication Time Distribution'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Papers'
          }
        }
      }
    };

    return (
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  // By subject chart (top 10)
  if (type === 'subject' && data.bySubject) {
    const topSubjects = data.bySubject.slice(0, 10);
    const chartData = {
      labels: topSubjects.map(d => d.preprint_subject?.substring(0, 30) || 'Unknown'),
      datasets: [{
        label: 'Average Days to Publish',
        data: topSubjects.map(d => d.avg_days),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Average Days to Publish by Subject (Top 10)'
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Days'
          }
        }
      }
    };

    return (
      <div style={{ height: '500px' }}>
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Chart type not supported</div>;
};

export default PublicationTimelineChart;