import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PublicationStatusChart = ({ data, type = 'subject' }) => {
  if (!data) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>No data available</div>;
  }

  // By subject
  if (type === 'subject' && data.bySubject) {
    const topSubjects = data.bySubject.slice(0, 10);
    const chartData = {
      labels: topSubjects.map(d => d.preprint_subject?.substring(0, 30) || 'Unknown'),
      datasets: [{
        label: 'Publication Rate (%)',
        data: topSubjects.map(d => d.publication_rate),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
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
          text: 'Publication Rate by Subject (Top 10)'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const item = topSubjects[context.dataIndex];
              return [
                `Publication Rate: ${context.parsed.x}%`,
                `Total Preprints: ${item.total_preprints}`,
                `Published: ${item.published_count}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Publication Rate (%)'
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

  // Trend over time
  if (type === 'trend' && data.trendOverTime) {
    const chartData = {
      labels: data.trendOverTime.map(d => d.year),
      datasets: [
        {
          label: 'Publication Rate (%)',
          data: data.trendOverTime.map(d => d.publication_rate),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Total Preprints',
          data: data.trendOverTime.map(d => d.total_preprints),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
          text: 'Publication Status Trend Over Time'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          max: 100,
          title: {
            display: true,
            text: 'Publication Rate (%)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Total Preprints'
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

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Chart type not supported</div>;
};

export default PublicationStatusChart;