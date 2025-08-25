import React from 'react';
import Header from '../../ui/Header/Header';
import MapContainer from '../../ui/MapContainer/MapContainer';
import styles from '../../../pages/ExplorePage.module.css';

const MapTab = () => {
  return (
    <>
      <Header 
        title="Global Preprint Distribution"
        subtitle="Explore the geographic distribution of preprints worldwide. Use zoom and pan to see detailed statistics."
        variant="section"
        size="medium"
      />
      
      <MapContainer 
        title="Global Preprint Distribution Map"
        showStats={true}
        statsData={[
          { number: "300,000+", label: "Preprints Indexed" },
          { number: "50+", label: "Countries Contributing" },
          { number: "1,000+", label: "Institutions Tracked" }
        ]}
        className={styles.exploreMapContainer}
      />
    </>
  );
};

export default MapTab;
