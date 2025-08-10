import React from 'react';
import styles from './ZoomControls.module.css';

const ZoomControls = ({ onZoomIn, onZoomOut, onReset, disabled = false }) => {
  return (
    <div className={styles.zoomControls}>
      <button
        className={styles.zoomButton}
        onClick={onZoomIn}
        disabled={disabled}
        title="Zoom In"
        aria-label="Zoom in on chart"
      >
        <span className={styles.zoomIcon}>🔍+</span>
      </button>
      <button
        className={styles.zoomButton}
        onClick={onZoomOut}
        disabled={disabled}
        title="Zoom Out"
        aria-label="Zoom out on chart"
      >
        <span className={styles.zoomIcon}>🔍-</span>
      </button>
      <button
        className={styles.resetButton}
        onClick={onReset}
        disabled={disabled}
        title="Reset Zoom"
        aria-label="Reset chart zoom to original view"
      >
        <span className={styles.resetIcon}>↻</span>
      </button>
    </div>
  );
};

export default ZoomControls;