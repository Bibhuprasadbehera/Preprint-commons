import React from 'react';
import styles from './MapContainer.module.css';

const MapContainer = ({ 
  title = "Global Preprint Distribution Map",
  className = '',
  showStats = true,
  statsData = [
    { number: "300,000+", label: "Preprints Indexed" },
    { number: "50+", label: "Countries Contributing" },
    { number: "1,000+", label: "Institutions Tracked" }
  ]
}) => {
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