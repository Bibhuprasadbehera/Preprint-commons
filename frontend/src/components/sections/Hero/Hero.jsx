import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button/Button';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      {/* Floating background elements */}
      <div className={styles.floatingElements}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.floatingElement}></div>
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Preprint Commons -<br /> Tracking Global Impact of Preprints 
          </h1>
          <p className={styles.subtitle}>
            Explore trends, landscape, and citations across arXiv, bioRxiv & medRxiv preprint servers 
             through comprehensive data visualization.
          </p>
          
          <div className={styles.actions}>
            <Link to="/explore">
              <Button variant="secondary" size="xlarge">
                Explore Data
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="xlarge">
                Learn More
              </Button>
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>300,000+</span>
              <span className={styles.statLabel}>Preprints Indexed</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>150,000+</span>
              <span className={styles.statLabel}>Corresponding Authors</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10,000+</span>
              <span className={styles.statLabel}>Institutions Tracked</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>150+</span>
              <span className={styles.statLabel}>Countries Contributing</span>
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l-8 8h5v8h6v-8h5l-8-8z" transform="rotate(180 12 12)"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;