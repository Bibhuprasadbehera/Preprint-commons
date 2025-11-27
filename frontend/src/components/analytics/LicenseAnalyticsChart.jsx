import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LicenseAnalyticsChart = ({ data, type = 'distribution' }) => {
  if (!data) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>No data available</div>;
  }

  // License distribution
  if (type === 'distribution' && data.licenseDistribution) {
    const topLicenses = data.licenseDistribution.slice(0, 8);
    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(20, 184, 166, 0.8)',
      'rgba(251, 146, 60, 0.8)'
    ];

    const chartData = {
      labels: topLicenses.map(d => d.submission_license?.substring(0, 40) || 'Unknown'),
      datasets: [{
        label: 'Papers',
        data: topLicenses.map(d => d.paper_count),
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.8', '1')),
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'License Distribution (Top 8)'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const item = topLicenses[context.dataIndex];
              return [
                `${label}`,
                `Papers: ${value}`,
                `Avg Citations: ${item.avg_citations || 0}`
              ];
            }
          }
        }
      }
    };

    return (
      <div style={{ height: '400px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    );
  }

  // Open Access comparison
  if (type === 'openaccess' && data.openAccessComparison) {
    const chartData = {
      labels: data.openAccessComparison.map(d => d.license_category),
      datasets: [
        {
          label: 'Number of Papers',
          data: data.openAccessComparison.map(d => d.paper_count),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Average Citations',
          data: data.openAccessComparison.map(d => d.avg_citations),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
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
        },
        title: {
          display: true,
          text: 'Open Access vs Other Licenses'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Paper Count'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Average Citations'
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      }
    };

    return (
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Chart type not supported</div>;
};

export default LicenseAnalyticsChart;