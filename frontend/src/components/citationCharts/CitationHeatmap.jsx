import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CitationHeatmap.module.css';

const CitationHeatmap = ({ data, loading = false }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading citation heatmap...</p>
      </div>
    );
  }

  // Show empty state if no data after loading
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No citation heatmap data available for the selected filters.</p>
        <p className={styles.emptyHint}>Try adjusting your search criteria.</p>
      </div>
    );
  }

  // Group data by year and month
  const groupedData = data.reduce((acc, item) => {
    const key = `${item.year}-${item.month}`;
    if (!acc[key]) {
      acc[key] = { year: item.year, month: item.month, totalCitations: 0, count: 0 };
    }
    acc[key].totalCitations += item.citations;
    acc[key].count += 1;
    return acc;
  }, {});

  const heatmapData = Object.values(groupedData);
  const maxCitations = Math.max(...heatmapData.map(d => d.totalCitations), 1);

  const getIntensity = (citations) => {
    return citations / maxCitations;
  };

  const getColorClass = (intensity) => {
    if (intensity === 0) return styles.intensity0;
    if (intensity <= 0.2) return styles.intensity1;
    if (intensity <= 0.4) return styles.intensity2;
    if (intensity <= 0.6) return styles.intensity3;
    if (intensity <= 0.8) return styles.intensity4;
    return styles.intensity5;
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get unique years and sort them
  const years = [...new Set(heatmapData.map(d => d.year))].sort();

  // Handle cell click navigation
  const handleCellClick = (year, month) => {
    if (year && month) {
      // Format month as YYYY-MM for consistency with PublicationTimelineChart
      const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
      navigate(`/explore?month=${formattedMonth}`);
    }
  };

  return (
    <div className={styles.heatmapContainer}>
      <div className={styles.heatmapGrid}>
        {years.map(year => (
          <div key={year} className={styles.yearRow}>
            <div className={styles.yearLabel}>{year}</div>
            <div className={styles.monthsRow}>
              {monthNames.map((month, monthIndex) => {
                const monthData = heatmapData.find(d => 
                  d.year === year && d.month === monthIndex + 1
                );
                const citations = monthData ? monthData.totalCitations : 0;
                const intensity = getIntensity(citations);
                
                return (
                  <div
                    key={`${year}-${monthIndex + 1}`}
                    className={`${styles.heatmapCell} ${getColorClass(intensity)} ${citations > 0 ? styles.clickable : ''}`}
                    title={`${month} ${year}: ${citations} citations${citations > 0 ? ' (Click to search papers)' : ''}`}
                    onClick={() => citations > 0 && handleCellClick(year, monthIndex + 1)}
                    style={{ cursor: citations > 0 ? 'pointer' : 'default' }}
                  >
                    <span className={styles.cellValue}>
                      {citations > 0 ? citations : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={styles.legendScale}>
          <div className={`${styles.legendCell} ${styles.intensity0}`}></div>
          <div className={`${styles.legendCell} ${styles.intensity1}`}></div>
          <div className={`${styles.legendCell} ${styles.intensity2}`}></div>
          <div className={`${styles.legendCell} ${styles.intensity3}`}></div>
          <div className={`${styles.legendCell} ${styles.intensity4}`}></div>
          <div className={`${styles.legendCell} ${styles.intensity5}`}></div>
        </div>
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
};

export default CitationHeatmap;