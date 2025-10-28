import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MapContainer.module.css';

const MapContainer = ({
  title = "Global Preprint Distribution Map",
  className = '',
  showStats = true,
  statsData = [
  ]
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for navigation messages from the iframe
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'navigate') {
        navigate(event.data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return (
    <div className={`${styles.mapSection} ${className}`}>
      <div className={styles.mapContainer}>
        <iframe
          id="map-iframe"
          src="/map.html"
          className={styles.mapIframe}
          title={title}
        />
      </div>

      {/* Data Availability Note */}
      <div className={styles.dataNote}>
        <p><strong>Note:</strong> Country-level data is only available for some papers. Some Papers are not included in this visualization due to missing geographic information.</p>
      </div>
      
      {showStats && (
        <div className={styles.mapStats}>
          {statsData.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapContainer;