import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from './CitationChart.module.css';

const CitationChart = ({ paper }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (paper && paper.citation && chartRef.current) {
      try {
        const citations = JSON.parse(paper.citation);
        const ctx = document.createElement('canvas');
        chartRef.current.innerHTML = '';
        chartRef.current.appendChild(ctx);
        
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: citations.map(c => c.year),
            datasets: [{
              label: 'Citations per year',
              data: citations.map(c => c.value),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: { 
              legend: { display: false },
              title: {
                display: true,
                text: 'Citation History'
              }
            },
            scales: { 
              y: { 
                beginAtZero: true, 
                ticks: { precision: 0 } 
              } 
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }
  }, [paper]);

  return <div ref={chartRef} className={styles.chartContainer}></div>;
};

export default CitationChart;
